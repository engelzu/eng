// Netlify Serverless Function: sync-projects.js
// Version: GCP Cloud Storage listing via Service Account

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

async function getGcpToken() {
  try {
    let sa;
if (process.env.GCP_SERVICE_ACCOUNT) {
  sa = JSON.parse(process.env.GCP_SERVICE_ACCOUNT);
} else {
  try {
    const filePath = path.resolve(__dirname, 'gcp_service_account.json');
    sa = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.error('[Auth] Erro ao carregar credenciais GCP:', e.message);
    return null;
  }
}
    const now = Math.floor(Date.now() / 1000);
    
    const header = { alg: 'RS256', typ: 'JWT' };
    const payload = {
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/devstorage.read_only',
      aud: sa.token_uri,
      iat: now,
      exp: now + 3600
    };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signatureInput);
    const signature = sign.sign(sa.private_key, 'base64url');
    
    const jwt = `${signatureInput}.${signature}`;

    const res = await fetch(sa.token_uri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    });
    
    const data = await res.json();
    return data.access_token;
  } catch (e) {
    console.error('[Auth] Erro ao obter token GCP:', e.message);
    return null;
  }
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  const token = await getGcpToken();
  if (!token) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Falha na autenticação GCP' }) };
  }

  const bucketName = 'engenharia-mpp-files';
  const folderPrefix = 'PROJETOSENG/';
  const listUrl = `https://storage.googleapis.com/storage/v1/b/${bucketName}/o?prefix=${encodeURIComponent(folderPrefix)}&fields=items(name,size,updated)`;

  try {
    const res = await fetch(listUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
      return { statusCode: res.status, headers, body: JSON.stringify({ error: `GCP API returned HTTP ${res.status}` }) };
    }

    const data = await res.json();
    const items = data.items || [];

    const projects = items
      .filter(item => item.name.toLowerCase().endsWith('.mpp'))
      .map(item => ({
        name: item.name.replace(folderPrefix, ''),
        size: item.size,
        updated: item.updated
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return { statusCode: 200, headers, body: JSON.stringify({ status: 'OK', projects: projects }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ status: 'ERROR', error: error.message }) };
  }
};
