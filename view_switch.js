const fs = require('fs');
const fileFast = 'c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';
let code = fs.readFileSync(fileFast, 'utf8');

let idxDrop = code.indexOf('case"EM ANDAMENTO":a={status:t="EM ANDAMENTO"};');
if (idxDrop !== -1) {
  let endIdx = idxDrop + 200;
  console.log(code.substring(idxDrop, endIdx));
} else {
  console.log('case EM ANDAMENTO not found!');
}
