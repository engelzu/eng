const fs = require('fs');
const file = 'fast.html';
const code = fs.readFileSync(file, 'utf8');

let idx = code.indexOf('id="bc-img-size-modal"');
if (idx !== -1) {
  let modalStr = code.substring(idx, idx + 400);
  console.log('Modal style:', modalStr.split('>')[0]);
}
