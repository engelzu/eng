const fs = require('fs');
const code507 = fs.readFileSync('c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'utf8');
const codeFast = fs.readFileSync('c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js', 'utf8');

// 1. Find the 507 dropdown
let idx1 = code507.indexOf('AGUARDANDO APROVAÇÃO');
if (idx1 !== -1) {
  console.log('--- 507 Dropdown Context ---');
  console.log(code507.substring(Math.max(0, idx1 - 200), Math.min(code507.length, idx1 + 400)));
}

// 2. Find Kanban Columns (Y array)
let idx2 = codeFast.indexOf('headerColor:"bg-emerald-500"},{title:"CONCLU');
if (idx2 !== -1) {
  console.log('--- Kanban Columns ---');
  console.log(codeFast.substring(Math.max(0, idx2 - 300), Math.min(codeFast.length, idx2 + 200)));
}

// 3. Find Kanban Filters
let idx3 = codeFast.indexOf('children:"AGUARDANDO APROVAÇÃO"}),(0,a.jsx)(ew.Ql,{value:"PRIORIZADOS"');
if (idx3 !== -1) {
  console.log('--- Kanban Filters ---');
  console.log(codeFast.substring(Math.max(0, idx3 - 100), Math.min(codeFast.length, idx3 + 200)));
}

// 4. Find Switch Statement
let idx4 = codeFast.indexOf('case"AGUARDANDO APROVAÇÃO":');
if (idx4 !== -1) {
  console.log('--- Switch Statement ---');
  console.log(codeFast.substring(Math.max(0, idx4 - 100), Math.min(codeFast.length, idx4 + 200)));
}

// 5. Find Includes List
let idx5 = codeFast.indexOf('AGUARDANDO APROVAÇÃO"].includes(t)');
if (idx5 !== -1) {
  console.log('--- Includes List ---');
  console.log(codeFast.substring(Math.max(0, idx5 - 200), Math.min(codeFast.length, idx5 + 100)));
}
