const fs = require('fs');
const code = fs.readFileSync('c:/Users/Admin/Downloads/Eng18_06/Eng15_06/_next/static/chunks/6120-99ba76de6fd208f3.js.bak', 'utf8');

const matches = [];
let idx = code.indexOf('showEapModal');
while (idx !== -1) {
  matches.push(code.substring(Math.max(0, idx - 40), Math.min(code.length, idx + 80)));
  idx = code.indexOf('showEapModal', idx + 1);
}
console.log('Matches:', matches);
