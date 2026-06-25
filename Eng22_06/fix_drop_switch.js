const fs = require('fs');

const fileFast = '_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';
const fileFastOut = 'OUT/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';

for (let f of [fileFast, fileFastOut]) {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    
    // Add to Switch
    const switchTarget = `case"EM ANDAMENTO":a={status:t="EM ANDAMENTO"};break;`;
    const newSwitch = `case"EM AN\\xc1LISE":a={status:t="EM AN\\xc1LISE"};break;` + switchTarget;
    
    if (code.includes(switchTarget) && !code.includes('case"EM AN\\xc1LISE":')) {
      code = code.replace(switchTarget, newSwitch);
      console.log('Fixed drop handler in:', f);
      fs.writeFileSync(f, code, 'utf8');
    } else {
      console.log('Drop handler fix failed or already present in:', f);
    }
  }
}
