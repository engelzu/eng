const fs = require('fs');
const path = require('path');
const f = path.join(__dirname, '_next/static/chunks/6120-99ba76de6fd208f3.js.eap_patch.bak');
const code = fs.readFileSync(f, 'utf8');

const target = 'eap:eap';
const idx = code.indexOf(target);
if (idx === -1) {
  console.log('eap:eap not found!');
} else {
  console.log('Context of save target:');
  console.log(code.substring(idx - 300, idx + 400));
}
