const fs = require('fs');

const scriptCode = `const fs = require('fs');
const files = [
  '_next/static/chunks/app/fast/page-5d0c28c966a6b026.js',
  'OUT/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js'
];

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let code = fs.readFileSync(f, 'utf8');

  // 1. Create dedicated column for AGUARDANDO APROVAÇÃO
  const colTarget = '{title:"EM ANDAMENTO",statuses:["EM ANDAMENTO"],icon:g.Z,color:"bg-blue-100 text-blue-700 border-blue-200",headerColor:"bg-blue-500"},';
  if (code.includes(colTarget) && !code.includes('title:"AGUARDANDO APROVAÇÃO"')) {
    code = code.replace(colTarget, colTarget + '{title:"AGUARDANDO APROVAÇÃO",statuses:["AGUARDANDO APROVAÇÃO"],icon:j.Z,color:"bg-emerald-100 text-emerald-700 border-emerald-200",headerColor:"bg-emerald-500"},');
    console.log('Injected status column mapping');
  }

  // 1b. Update drop switch statement
  const dropSwitchTarget = 'switch(s){case"CAIXA DE ENTRADA":a={status:t="CAIXA DE ENTRADA",sendToStudy:!1};break;';
  if (code.includes(dropSwitchTarget) && !code.includes('case"AGUARDANDO APROVAÇÃO":')) {
    code = code.replace(dropSwitchTarget, dropSwitchTarget + 'case"AGUARDANDO APROVAÇÃO":a={status:t="AGUARDANDO APROVAÇÃO",sendToStudy:!1};break;');
    console.log('Injected drop switch case');
  }

  // 1c. Add AGUARDANDO APROVAÇÃO to the Kanban filter exclude list
  // The file contains literal 4-char backslash sequence: \\ x c d
  // Build the target string at runtime to avoid template literal escape issues
  const BS = String.fromCharCode(92); // single backslash char
  const excOld = '["CONCLU' + BS + 'xcdDO","CANCELADO","PRIORIZADOS","APROVADO","EM ANDAMENTO"]';
  const excNew = '["CONCLU' + BS + 'xcdDO","CANCELADO","PRIORIZADOS","APROVADO","EM ANDAMENTO","AGUARDANDO APROVAÇÃO"]';
  if (code.includes(excOld)) {
    code = code.split(excOld).join(excNew);
    console.log('Added AGUARDANDO APROVAÇÃO to exclude study list (all occurrences)');
  } else {
    console.log('WARNING: excOld not found in file');
  }

  // 2. Map badge colors (emerald matches column header)
  const colorTarget = 'case"EM ANDAMENTO":return{icon:g.Z,className:"bg-blue-100 text-blue-700 border-blue-200"};';
  if (code.includes(colorTarget) && !code.includes('case"AGUARDANDO APROVAÇÃO":return')) {
    code = code.replace(colorTarget, 'case"EM ANDAMENTO":return{icon:g.Z,className:"bg-blue-100 text-blue-700 border-blue-200"};case"AGUARDANDO APROVAÇÃO":return{icon:j.Z,className:"bg-emerald-100 text-emerald-700 border-emerald-200"};');
    console.log('Injected status badge styling');
  }

  // 3. Dropdown filter options
  const filterTarget = '(0,a.jsx)(ew.Ql,{value:"PRIORIZADOS",children:"PRIORIZADOS"})';
  if (code.includes(filterTarget) && !code.includes('value:"AGUARDANDO APROVAÇÃO"')) {
    code = code.replace(filterTarget, '(0,a.jsx)(ew.Ql,{value:"AGUARDANDO APROVAÇÃO",children:"AGUARDANDO APROVAÇÃO"}),(0,a.jsx)(ew.Ql,{value:"PRIORIZADOS",children:"PRIORIZADOS"})');
    console.log('Injected dropdown filter option');
  }

  fs.writeFileSync(f, code);
  console.log('Patched ' + f);
}
`;

fs.writeFileSync('patch_page.js', scriptCode);
console.log('patch_page.js built');
