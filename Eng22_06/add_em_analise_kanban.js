const fs = require('fs');

const fileFast = '_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';
const fileFastOut = 'OUT/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

for (let f of [fileFast, fileFastOut]) {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    
    // 1. Add Column
    const colTarget = `{title:"EM ANDAMENTO",statuses:["EM ANDAMENTO"]`;
    const newCol = `{title:"EM AN\\xc1LISE",statuses:["EM AN\\xc1LISE"],icon:N.Z,color:"bg-indigo-100 text-indigo-700 border-indigo-200",headerColor:"bg-indigo-500"},` + colTarget;
    if (code.includes(colTarget) && !code.includes('title:"EM AN\\xc1LISE"')) {
      code = code.replace(colTarget, newCol);
    }
    
    // 2. Remove from status mapping
    const mapTarget = `"EM AN\\xc1LISE"===t?"CAIXA DE ENTRADA":`;
    if (code.includes(mapTarget)) {
      code = code.replace(new RegExp(escapeRegExp(mapTarget), 'g'), '');
    }
    
    // 3. Add to Filters
    const filterTarget = `(0,a.jsx)(ew.Ql,{value:"EM ANDAMENTO",children:"EM ANDAMENTO"})`;
    const newFilter = `(0,a.jsx)(ew.Ql,{value:"EM AN\\xc1LISE",children:"EM AN\\xc1LISE"}),` + filterTarget;
    if (code.includes(filterTarget) && !code.includes('value:"EM AN\\xc1LISE"')) {
      code = code.replace(new RegExp(escapeRegExp(filterTarget), 'g'), newFilter);
    }
    
    // 4. Add to Switch
    const switchTarget = `case"EM ANDAMENTO":a={status:t="EM ANDAMENTO"`;
    const newSwitch = `case"EM AN\\xc1LISE":a={status:t="EM AN\\xc1LISE",sendToStudy:!1};break;` + switchTarget;
    if (code.includes(switchTarget) && !code.includes('case"EM AN\\xc1LISE":')) {
      code = code.replace(switchTarget, newSwitch);
    }
    
    // 5. Add to Includes List (!["CONCLUÍDO"...].includes(t)) -> make sure it doesn't default to EM ANÁLISE or PARA ESTUDAR
    // EM ANÁLISE is not "sendToStudy", so it shouldn't trigger the study logic anyway.
    const includesTarget = `"AGUARDANDO APROVAÇÃO","REVISÃO FINAL"].includes(t)`;
    const newIncludes = `"EM AN\\xc1LISE","AGUARDANDO APROVAÇÃO","REVISÃO FINAL"].includes(t)`;
    if (code.includes(includesTarget) && !code.includes('"EM AN\\xc1LISE","AGUARDANDO')) {
      code = code.replace(new RegExp(escapeRegExp(includesTarget), 'g'), newIncludes);
    }

    fs.writeFileSync(f, code, 'utf8');
    console.log('Added EM ANÁLISE kanban column in:', f);
  }
}
