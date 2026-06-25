const fs = require('fs');
const file = 'fast.html';
const code = fs.readFileSync(file, 'utf8');

let idx = code.indexOf('id="bc-img-size-modal"');
if (idx !== -1) {
  console.log(code.substring(idx, idx + 800));
}
