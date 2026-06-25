const fs = require('fs');
const fileFast = '_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';
let code = fs.readFileSync(fileFast, 'utf8');

let idx = code.indexOf('K="admin"===q,W="gerente"===q,$=K||W||"user_fast"===q');
if (idx !== -1) {
    console.log(code.substring(idx - 50, idx + 400));
}
