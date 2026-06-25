const fs = require('fs');

const fileFast = '_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';
const fileFastOut = 'OUT/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';

for (let f of [fileFast, fileFastOut]) {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    
    // Instead of string replacement with weird escapes, use literal string matching
    let target = 'case"EM ANDAMENTO":a={status:t="EM ANDAMENTO"};break;';
    
    if (code.includes(target)) {
      if (!code.includes('case"EM AN\\xc1LISE"')) {
        let newSwitch = 'case"EM AN\\xc1LISE":a={status:t="EM AN\\xc1LISE",sendToStudy:!1};break;' + target;
        code = code.replace(target, newSwitch);
        fs.writeFileSync(f, code, 'utf8');
        console.log('Successfully patched switch in:', f);
      } else {
        console.log('Already contains EM AN\\xc1LISE in:', f);
      }
    } else {
      console.log('Target string not found in:', f);
    }
  }
}
