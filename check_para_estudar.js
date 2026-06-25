const fs = require('fs');
const code = fs.readFileSync('c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'utf8');
const searchStr = 'PARA ESTUDAR';
let idx = code.indexOf(searchStr);
while (idx !== -1) {
  console.log('Context:', code.substring(Math.max(0, idx - 150), Math.min(code.length, idx + 150)));
  idx = code.indexOf(searchStr, idx + 1);
}
