const fs = require('fs');

const fileFast = 'c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';
const fileFastOut = 'c:/Users/user2/Downloads/Eng22_06/Eng22_06/OUT/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

for (let f of [fileFast, fileFastOut]) {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    
    const oldH = 'H=e=>$.filter(s=>{let t=s.status.toUpperCase(),a="PARA ESTUDAR"===t||"EM ESTUDO"===t,l=s.sendToStudy&&!["CONCLU\\xcdDO","CANCELADO","PRIORIZADOS","APROVADO","EM ANDAMENTO","EM AN\\xc1LISE","AGUARDANDO APROVAÇÃO","REVISÃO FINAL"].includes(t),r=a||l?"PARA ESTUDAR":"APROVADO"===t?"PRIORIZADOS":t;return e.statuses.includes(r)})';
    const newH = 'H=e=>$.filter(s=>{let t=s.status.toUpperCase(),r=("PARA ESTUDAR"===t||"EM ESTUDO"===t)?"CAIXA DE ENTRADA":"APROVADO"===t?"PRIORIZADOS":t;return e.statuses.includes(r)})';

    if (code.includes(oldH)) {
      code = code.replace(oldH, newH);
      fs.writeFileSync(f, code, 'utf8');
      console.log('Fixed H function to allow moving anywhere without disappearing in:', f);
    } else {
      console.log('Could not find old H function exactly in:', f);
      // Let's do a fallback regex replacement if the includes list got slightly modified
      const hRegex = /H=e=>\$\.filter\(s=>\{let t=s\.status\.toUpperCase\(\),a="PARA ESTUDAR"===t\|\|"EM ESTUDO"===t,l=s\.sendToStudy&&!\[[^\]]+\]\.includes\(t\),r=a\|\|l\?"PARA ESTUDAR":"APROVADO"===t\?"PRIORIZADOS":t;return e\.statuses\.includes\(r\)\}\)/;
      if (hRegex.test(code)) {
         code = code.replace(hRegex, newH);
         fs.writeFileSync(f, code, 'utf8');
         console.log('Fixed H function using regex in:', f);
      }
    }
  }
}
