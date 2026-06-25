const fs = require('fs');
let code = fs.readFileSync('generate_markup.js', 'utf8');

const target = '(0,t.jsxs)("div",{className:"space-y-1.5",children:[(0,t.jsx)(g._,{className:"text-xs font-black text-slate-700 uppercase tracking-wide",children:"Estrutura EAP"}),(0,t.jsxs)("select",{value:eap,onChange:e=>setEap(e.target.value),className:"w-full max-w-sm h-8 border border-slate-200 rounded-md px-2 text-[11px] bg-white focus:border-emerald-500 outline-none",children:[(0,t.jsx)("option",{value:"",children:"Selecione..."}),null==T?void 0:T.map(e=>(0,t.jsx)("option",{value:e.name,children:e.name},e.id))]})]}),';

code = code.replace(target, '');
fs.writeFileSync('generate_markup.js', code);
console.log('Removed dropdown from generate_markup.js');
