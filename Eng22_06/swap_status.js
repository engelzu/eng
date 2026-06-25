const fs = require('fs');

const file507 = '_next/static/chunks/507-1cbb4e1ae80f89d3.js';
const file507Out = 'OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js';
const fileFast = '_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';
const fileFastOut = 'OUT/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 1. Swap Dropdown in 507
const oldDropdownSlice = '(0,t.jsx)(j.Ql,{value:"EM AN\\xc1LISE",children:"4 - EM AN\\xc1LISE"}),(0,t.jsx)(j.Ql,{value:"EM ANDAMENTO",children:"5 - EM ANDAMENTO"})';
const newDropdownSlice = '(0,t.jsx)(j.Ql,{value:"EM ANDAMENTO",children:"4 - EM ANDAMENTO"}),(0,t.jsx)(j.Ql,{value:"EM AN\\xc1LISE",children:"5 - EM AN\\xc1LISE"})';

for (let f of [file507, file507Out]) {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    if (code.includes(oldDropdownSlice)) {
      code = code.replace(oldDropdownSlice, newDropdownSlice);
      fs.writeFileSync(f, code, 'utf8');
      console.log('Swapped 4 and 5 in dropdown:', f);
    }
  }
}

// 2. Swap Columns in Kanban
const oldColumnsSlice = '{title:"EM AN\\xc1LISE",statuses:["EM AN\\xc1LISE"],icon:N.Z,color:"bg-indigo-100 text-indigo-700 border-indigo-200",headerColor:"bg-indigo-500"},{title:"EM ANDAMENTO",statuses:["EM ANDAMENTO"],icon:g.Z,color:"bg-blue-100 text-blue-700 border-blue-200",headerColor:"bg-blue-500"}';
const newColumnsSlice = '{title:"EM ANDAMENTO",statuses:["EM ANDAMENTO"],icon:g.Z,color:"bg-blue-100 text-blue-700 border-blue-200",headerColor:"bg-blue-500"},{title:"EM AN\\xc1LISE",statuses:["EM AN\\xc1LISE"],icon:N.Z,color:"bg-indigo-100 text-indigo-700 border-indigo-200",headerColor:"bg-indigo-500"}';

for (let f of [fileFast, fileFastOut]) {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    if (code.includes(oldColumnsSlice)) {
      code = code.replace(oldColumnsSlice, newColumnsSlice);
      fs.writeFileSync(f, code, 'utf8');
      console.log('Swapped EM ANDAMENTO and EM ANÁLISE columns in kanban:', f);
    }
  }
}
