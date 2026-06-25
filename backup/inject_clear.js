const fs = require('fs');

let code = fs.readFileSync('generate_markup.js', 'utf8');

let clearLogic = 'setDist({});';
const rows = [
  { id: 'eap', custoInput: false },
  { id: 'eng', custoInput: true },
  { id: 'ger', custoInput: true },
  { id: 'sup', custoInput: false },
  { id: 'mat', custoInput: true },
  { id: 'equ', custoInput: true },
  { id: 'ser', custoInput: false },
  { id: 'constCiv', custoInput: true },
  { id: 'montEle', custoInput: false },
  { id: 'fab', custoInput: true },
  { id: 'mon', custoInput: true },
  { id: 'com', custoInput: true },
  { id: 'con', custoInput: true }
];

for (const row of rows) {
  const setVar = 'set' + row.id.charAt(0).toUpperCase() + row.id.slice(1);
  clearLogic += setVar + 'Active(!1);' + setVar + 'Inicio("");' + setVar + 'Termino("");';
  if (row.custoInput) {
    clearLogic += setVar + 'Custo("");';
  }
}

const clearBtn = `(0,t.jsx)(u.z,{variant:"outline",onClick:()=>window.confirm("Deseja realmente limpar todos os valores?") && (()=>{${clearLogic}})(),className:"rounded-xl font-black text-xs px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 mr-auto",children:"LIMPAR VALORES"}),`;

const searchStr = '(0,t.jsx)(u.z,{variant:"outline",onClick:()=>setShowEapModal(!1),className:"rounded-xl font-black text-xs px-4 py-2",children:"FECHAR"})';
const replacementStr = clearBtn + searchStr;

code = code.replace(searchStr, replacementStr);

fs.writeFileSync('generate_markup.js', code);
console.log('Injected clear button');
