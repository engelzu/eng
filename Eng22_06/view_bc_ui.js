const fs = require('fs');
const file = '_next/static/chunks/507-1cbb4e1ae80f89d3.js';
const code = fs.readFileSync(file, 'utf8');

let idx = code.indexOf('BUSINESS CASE DIGITAL "');
if (idx !== -1) {
  let startIdx = Math.max(0, idx - 400);
  console.log(code.substring(startIdx, idx + 400));
}
