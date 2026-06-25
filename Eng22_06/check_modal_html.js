const fs = require('fs');
const file = 'fast.html';
const code = fs.readFileSync(file, 'utf8');

let idx = code.indexOf('id="bc-img-size-modal"');
if (idx !== -1) {
  console.log('Found it in fast.html!');
  console.log(code.substring(Math.max(0, idx - 100), idx + 200));
} else {
  console.log('NOT FOUND in fast.html!');
}
