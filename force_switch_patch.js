const fs = require('fs');
const fileFast = 'c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';
const fileFastOut = 'c:/Users/user2/Downloads/Eng22_06/Eng22_06/OUT/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';

let target = 'case"EM ANDAMENTO":a={status:t="EM ANDAMENTO"};break;case"CONCLU\\xcdDO":';
let newSwitch = 'case"EM AN\\xc1LISE":a={status:t="EM AN\\xc1LISE",sendToStudy:!1};break;' + target;

for (let f of [fileFast, fileFastOut]) {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    if (code.includes(target)) {
      code = code.replace(target, newSwitch);
      fs.writeFileSync(f, code, 'utf8');
      console.log('Forced switch patch in:', f);
    } else {
      console.log('Target not found in:', f);
    }
  }
}
