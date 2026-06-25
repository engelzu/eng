const fs = require('fs');

const fileFast = '_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';
const fileFastOut = 'OUT/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

for (let f of [fileFast, fileFastOut]) {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    
    // A) Add to Kanban Columns (before CONCLUÍDO)
    const targetCols = `{title:"CONCLU\\xcdDO",statuses:["CONCLU\\xcdDO"]`;
    const newCols = `{title:"REVISÃO FINAL",statuses:["REVISÃO FINAL"],icon:j.Z,color:"bg-cyan-100 text-cyan-700 border-cyan-200",headerColor:"bg-cyan-500"},` + targetCols;
    if (code.includes(targetCols) && !code.includes('title:"REVISÃO FINAL"')) {
      code = code.replace(targetCols, newCols);
    }
    
    // B) Add to Filters list
    const targetFilter = `(0,a.jsx)(ew.Ql,{value:"AGUARDANDO APROVAÇÃO",children:"AGUARDANDO APROVAÇÃO"})`;
    const newFilter = `(0,a.jsx)(ew.Ql,{value:"REVISÃO FINAL",children:"REVISÃO FINAL"}),` + targetFilter;
    if (code.includes(targetFilter) && !code.includes('value:"REVISÃO FINAL"')) {
      code = code.replace(new RegExp(escapeRegExp(targetFilter), 'g'), newFilter);
    }
    
    // C) Add to Switch statement
    const targetSwitch = `case"AGUARDANDO APROVAÇÃO":a={status:t="AGUARDANDO APROVAÇÃO",sendToStudy:!1};break;`;
    const newSwitch = `case"REVISÃO FINAL":a={status:t="REVISÃO FINAL",sendToStudy:!1};break;` + targetSwitch;
    if (code.includes(targetSwitch) && !code.includes('case"REVISÃO FINAL":')) {
      code = code.replace(targetSwitch, newSwitch);
    }
    
    // D) Add to Includes List
    const targetIncludes = `"EM ANDAMENTO","AGUARDANDO APROVAÇÃO"].includes(`;
    const newIncludes = `"EM ANDAMENTO","AGUARDANDO APROVAÇÃO","REVISÃO FINAL"].includes(`;
    if (code.includes(targetIncludes) && !code.includes('"REVISÃO FINAL"].includes(')) {
      code = code.replace(new RegExp(escapeRegExp(targetIncludes), 'g'), newIncludes);
    }
    
    // E) Restrict Kanban Circle rendering
    const circleTarget = `(()=>{let isStudy=("PARA ESTUDAR"===e.title||"PARA ESTUDAR"===s.status||"Em Estudo"===s.status),bcFields=`;
    const circleNew = `(["EM ANDAMENTO","AGUARDANDO APROVAÇÃO","REVISÃO FINAL","CONCLU\\xcdDO","CONCLUIDO"].includes((s.status||"").toUpperCase()))&&(()=>{let isStudy=("PARA ESTUDAR"===e.title||"PARA ESTUDAR"===s.status||"Em Estudo"===s.status),bcFields=`;
    if (code.includes(circleTarget) && !code.includes('["EM ANDAMENTO","AGUARDANDO APROVAÇÃO","REVISÃO FINAL","CONCLU\\xcdDO"')) {
      code = code.replace(circleTarget, circleNew);
    }

    fs.writeFileSync(f, code, 'utf8');
    console.log('Patched Fast:', f);
  }
}

// Update patch_bc.js
let patchBcCode = fs.readFileSync('c:/Users/user2/Downloads/Eng22_06/patch_bc.js', 'utf8');
const oldCirclePatchStr = `const circleReplacementStr = \`(()=>{let isStudy=("PARA ESTUDAR"`;
const newCirclePatchStr = `const circleReplacementStr = \`(["EM ANDAMENTO","AGUARDANDO APROVAÇÃO","REVISÃO FINAL","CONCLU\\\\xcdDO","CONCLUIDO"].includes((s.status||"").toUpperCase()))&&(()=>{let isStudy=("PARA ESTUDAR"`;
if (patchBcCode.includes(oldCirclePatchStr) && !patchBcCode.includes('["EM ANDAMENTO","AGUARDANDO APROVAÇÃO"')) {
  patchBcCode = patchBcCode.replace(oldCirclePatchStr, newCirclePatchStr);
  fs.writeFileSync('c:/Users/user2/Downloads/Eng22_06/patch_bc.js', patchBcCode, 'utf8');
}
