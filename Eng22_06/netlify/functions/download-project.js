// Netlify Serverless Function: download-project.js
// Version: GCP Cloud Storage download via Service Account

const crypto = require('crypto');

async function getGcpToken() {
  try {
    const sa = JSON.parse(process.env.GCP_SERVICE_ACCOUNT);
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
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  const fileName = event.queryStringParameters.file;
  if (!fileName) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Parametro 'file' e obrigatorio" }) };
  }

  const token = await getGcpToken();
  if (!token) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Falha na autenticação GCP' }) };
  }

  const bucketName = 'engenharia-mpp-files';
  const folderName = 'PROJETOSENG';
  const objectName = `${folderName}/${fileName}`;
  const downloadUrl = `https://storage.googleapis.com/storage/v1/b/${bucketName}/o/${encodeURIComponent(objectName)}?alt=media`;

  console.log(`[Download] Buscando: ${downloadUrl}`);

  try {
    const res = await fetch(downloadUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
      return {
        statusCode: res.status,
        headers,
        body: JSON.stringify({ error: `GCP returned HTTP ${res.status}` })
      };
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log(`[Download] Sucesso! ${buffer.length} bytes`);

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error(`[Download] Erro: ${error.message}`);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
