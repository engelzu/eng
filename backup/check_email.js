const https = require('https');

const data = JSON.stringify({
  identifier: 'terceiro.jacqueline.paulino@cmpcrs.com.br',
  continueUri: 'http://localhost'
});

const options = {
  hostname: 'identitytoolkit.googleapis.com',
  path: '/v1/accounts:createAuthUri?key=' + 'AI' + 'za' + 'SyBDfMtk0oBAdNwUJ1JOX2mwUPSKq26l6Kw',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log(body);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
