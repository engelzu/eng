// Netlify Serverless Function: delete-project.js
// Deletes a .mpp file from GCP Cloud Storage via Service Account

const crypto = require('crypto');

async function getGcpToken() {
  try {
    const sa = JSON.parse(process.env.GCP_SERVICE_ACCOUNT);
    const now = Math.floor(Date.now() / 1000);

    const header = { alg: 'RS256', typ: 'JWT' };
    const payload = {
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/devstorage.read_write',
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
    'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  let fileName = event.queryStringParameters.file || '';
  if (!fileName || !fileName.toLowerCase().endsWith('.mpp')) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Nome de arquivo inválido' }) };
  }

  let decodedName = fileName;
  while (decodedName.includes('%')) {
    try {
      let next = decodeURIComponent(decodedName);
      if (next === decodedName) break;
      decodedName = next;
    } catch (e) { break; }
  }

  const token = await getGcpToken();
  if (!token) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Falha na autenticação GCP' }) };
  }

  const bucketName = 'engenharia-mpp-files';

  // Tenta deletar primeiro a versão decodificada (com espaços reais)
  let objectName = `PROJETOSENG/${decodedName}`;
  let deleteUrl = `https://storage.googleapis.com/storage/v1/b/${bucketName}/o/${encodeURIComponent(objectName)}`;

  try {
    let res = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.status === 204 || res.ok) {
      return { statusCode: 200, headers, body: JSON.stringify({ status: 'OK' }) };
    }

    // Se deu 404 e o nome decodificado é diferente do original, tenta o original (pode conter %20 no GCP)
    if (res.status === 404 && fileName !== decodedName) {
      objectName = `PROJETOSENG/${fileName}`;
      deleteUrl = `https://storage.googleapis.com/storage/v1/b/${bucketName}/o/${encodeURIComponent(objectName)}`;
      res = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 204 || res.ok) {
        return { statusCode: 200, headers, body: JSON.stringify({ status: 'OK' }) };
      }
    }

    const errBody = await res.text();
    return { statusCode: res.status, headers, body: JSON.stringify({ error: `GCP returned HTTP ${res.status}: ${errBody}` }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ status: 'ERROR', error: error.message }) };
  }
};
