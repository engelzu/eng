// Netlify Serverless Function: upload-project.js
// Version: Upload .mpp to GCP Cloud Storage via Service Account

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
    'Access-Control-Allow-Headers': 'Content-Type, X-File-Name',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const token = await getGcpToken();
  if (!token) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Falha na autenticação GCP' }) };
  }

  const fileName = decodeURIComponent(event.headers['x-file-name'] || '');
  if (!fileName) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Nome do arquivo nao informado' }) };
  }

  const bucketName = 'engenharia-mpp-files';
  const folderName = 'PROJETOSENG';
  const objectName = `${folderName}/${fileName}`;
  const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=media&name=${encodeURIComponent(objectName)}`;

  const fileBuffer = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : Buffer.from(event.body);

  try {
    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/octet-stream'
      },
      body: fileBuffer
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`GCP returned HTTP ${res.status}: ${errText}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: 'OK', message: `Arquivo ${fileName} enviado com sucesso` })
    };
  } catch (error) {
    console.error(`[Upload] Erro: ${error.message}`);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
