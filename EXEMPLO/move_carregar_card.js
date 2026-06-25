const fs = require('fs');

const files = [
  'c:/Users/Admin/Downloads/Eng0206/Eng0206/_next/static/chunks/6120-99ba76de6fd208f3.js',
  'c:/Users/Admin/Downloads/Eng0206/Eng0206/OUT/_next/static/chunks/6120-99ba76de6fd208f3.js'
];

files.forEach(f => {
  if (!fs.existsSync(f)) {
    return;
  }
  let code = fs.readFileSync(f, 'utf8');

  // Exact card string
  const cardCode = '(0,t.jsxs)("div",{className:"flex flex-col gap-2 border-2 border-emerald-100 bg-emerald-50/5 rounded-xl px-4 py-3 min-h-[70px] transition-all shadow-sm",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("span",{className:"text-[10px] font-bold text-emerald-800 uppercase mb-1.5 flex items-center gap-2 tracking-wider",children:[(0,t.jsx)(N.Z,{className:"h-3.5 w-3.5 text-emerald-600"}),"CARREGAR BUSINESS CASE"]}),(0,t.jsxs)(u.z,{size:"sm",variant:"ghost",className:"h-7 px-2 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-black text-[9px] flex items-center gap-1 border border-emerald-100 rounded-full",onClick:()=>{var e;ea("attachments"),null===(e=em.current)||void 0===e||e.click()},disabled:Q,children:[Q&&"attachments"===er?(0,t.jsx)(y.Z,{className:"h-3 w-3 animate-spin"}):(0,t.jsx)(k,{className:"h-3 w-3"}),"ANEXAR"]})]}),(0,t.jsx)("div",{className:"space-y-1.5",children:q.attachments&&0!==q.attachments.filter(e=>e.checklistItem==="general"||e.checklistItem==="PROJECT_DOCUMENT").length?q.attachments.filter(e=>e.checklistItem==="general"||e.checklistItem==="PROJECT_DOCUMENT").map(e=>(0,t.jsxs)("div",{className:"flex items-center gap-1.5 bg-white p-2 rounded-lg border border-emerald-100 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all group",children:[(0,t.jsxs)("a",{href:e.url,target:"_blank",rel:"noopener noreferrer",title:"Visualizar em nova aba",className:"flex-1 flex items-center gap-2.5 truncate",children:[(0,t.jsx)("div",{className:"h-8 w-8 bg-white rounded-lg flex items-center justify-center border border-emerald-100 text-emerald-600 shadow-sm",children:(0,t.jsx)(N.Z,{className:"h-4 w-4"})}),(0,t.jsx)("span",{className:"flex-1 truncate font-bold text-xs text-emerald-950",children:e.name}),(0,t.jsx)(C.Z,{className:"h-3.5 w-3.5 text-emerald-500 shrink-0"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-1",children:[(0,t.jsx)("a",{href:e.url,download:e.name,className:"h-8 w-8 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors",title:"Fazer download",children:(0,t.jsx)(A.Z,{className:"h-4 w-4"})}),(0,t.jsx)(u.z,{size:"icon",variant:"ghost",className:"h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors",onClick:()=>ep(e.id,"attachments"),title:"Remover",children:(0,t.jsx)(S.Z,{className:"h-4 w-4"})})]})]},e.id)):(0,t.jsx)("div",{className:"h-10 flex items-center justify-center border border-dashed border-emerald-200 rounded-xl bg-emerald-50/20",children:(0,t.jsx)("p",{className:"text-[9px] text-emerald-600/50 font-bold uppercase tracking-widest",children:"Nenhum anexo"})})})]})';

  const containerToRemove = `,(0,t.jsxs)("div",{className:"grid grid-cols-1 gap-4",children:[${cardCode}]})`;
  
  const targetGrid = 'className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",children:[';
  const newGrid = `className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",children:[${cardCode},`;

  if (code.includes(containerToRemove) && code.includes(targetGrid)) {
    code = code.replace(containerToRemove, '');
    code = code.replace(targetGrid, newGrid);
    console.log('Moved CARREGAR BUSINESS CASE card in', f);
    fs.writeFileSync(f, code, 'utf8');
  } else {
    console.log('Could not find target strings in', f);
    if (!code.includes(containerToRemove)) console.log('Could not find containerToRemove');
    if (!code.includes(targetGrid)) console.log('Could not find targetGrid');
  }
});
