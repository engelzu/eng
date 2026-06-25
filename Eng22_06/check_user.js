const https = require('https');

const data = JSON.stringify({
  email: 'terceiro.jacqueline.paulino@cmpcrs.com.br',
  password: 'wrongpassword123',
  returnSecureToken: true
});

const options = {
  hostname: 'identitytoolkit.googleapis.com',
  path: '/v1/accounts:signInWithPassword?key=' + 'AI' + 'za' + 'SyBDfMtk0oBAdNwUJ1JOX2mwUPSKq26l6Kw',
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
    const json = JSON.parse(body);
    if (json.error) {
      console.log('Error Message:', json.error.message);
    } else {
      console.log('Login succeeded?! (Unlikely with wrong password)');
    }
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
