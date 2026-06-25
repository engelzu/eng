const fs = require('fs');
const filePath = '_next/static/chunks/507-1cbb4e1ae80f89d3.js';
let code = fs.readFileSync(filePath, 'utf8');

const strToRemove = ',(0,t.jsxs)("button",{type:"button",onClick:e=>{e.preventDefault(),eE("general"),setTimeout(()=>{var e;return null===(e=eD.current)||void 0===e?void 0:e.click()},0)},className:"flex items-center gap-1 px-2 py-0.5 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded text-blue-700 hover:text-blue-800 transition-colors",title:"Clique para adicionar anexo",disabled:Y||eC.formState.isSubmitting,children:[(0,t.jsx)(S.Z,{className:"h-3.5 w-3.5"}),(0,t.jsx)("span",{className:"text-xs font-semibold",children:"CARREGAR BUSINESS CASE"})]})';

if (code.includes(strToRemove)) {
    code = code.replace(strToRemove, '');
    fs.writeFileSync(filePath, code);
    console.log("Successfully removed the 'CARREGAR BUSINESS CASE' button from chunk 507.");
} else {
    console.log("String to remove was NOT found in the chunk!");
}
