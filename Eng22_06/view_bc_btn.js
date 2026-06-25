const fs = require('fs');
const file = '_next/static/chunks/507-1cbb4e1ae80f89d3.js';
const code = fs.readFileSync(file, 'utf8');

let idx = code.indexOf('children:"SALVAR BUSINESS CASE"');
if (idx !== -1) {
  let startIdx = code.lastIndexOf('onClick:', idx);
  console.log(code.substring(Math.max(0, startIdx - 50), idx + 50));
}
