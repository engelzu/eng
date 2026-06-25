const fs = require('fs');

// We simulate the variables that should exist
const t = {
  jsx: () => {},
  jsxs: () => {}
};
const ModalLibrary_507 = {
  Vq: () => {},
  cZ: () => {},
  fK: () => {},
  $N: () => {},
  Be: () => {},
  cN: () => {}
};
const S = { Z: () => {} };
const d = { lX: () => {} };
const showCapexModal = false;
const setShowCapexModal = () => {};
const tipoCapex = '';
const setTipoCapex = () => {};
const setModeloContabil = () => {};
const showBcModal = false;

const subExprs = {
  header: `(0,t.jsxs)(ModalLibrary_507.fK,{className:"p-4 pb-3 bg-emerald-50 border-b border-emerald-100 shrink-0",children:[(0,t.jsxs)(ModalLibrary_507.$N,{className:"flex items-center gap-2 text-emerald-800 text-base font-black uppercase tracking-wider",children:[(0,t.jsx)(S.Z,{className:"h-5 w-5 text-emerald-600"}),"Classificação CAPEX"]}),(0,t.jsx)(ModalLibrary_507.Be,{className:"text-xs text-slate-500",children:"Selecione o tipo de modelo CAPEX para este projeto."})]})`,
  selectGroup: `(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(d.lX,{className:"text-[10px] font-black text-slate-500 uppercase tracking-wider",children:"Selecione uma opção"}),(0,t.jsxs)("select",{value:tipoCapex,onChange:e=>setTipoCapex(e.target.value),className:"w-full h-10 border border-slate-200 rounded-xl px-3 text-xs bg-white focus:border-emerald-500 outline-none font-bold text-slate-800 shadow-sm transition-all",children:[(0,t.jsx)("option",{value:"",children:"Selecione a classificação..."}),(0,t.jsx)("option",{value:"NORMAL ATÉ 500 MIL DOLARES",children:"NORMAL ATÉ 500 MIL DOLARES"}),(0,t.jsx)("option",{value:"ESPECIAL ACIMA DE 500 MIL DOLARES",children:"ESPECIAL ACIMA DE 500 MIL DOLARES"}),(0,t.jsx)("option",{value:"ESPECIAL ACIMA DE 5 MILHOES DE DOLARES",children:"ESPECIAL ACIMA DE 5 MILHOES DE DOLARES"})]})]})`,
  buttons: `(0,t.jsxs)(ModalLibrary_507.cN,{className:"pt-2 flex justify-end gap-2",children:[(0,t.jsx)("button",{type:"button",onClick:()=>{setModeloContabil("");setTipoCapex("");setShowCapexModal(!1)},className:"rounded-xl font-black text-xs px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 bg-white transition-colors",children:"CANCELAR"}),(0,t.jsx)("button",{type:"button",onClick:()=>{if(!tipoCapex){alert("Selecione uma opção de CAPEX ou cancele.");return}setShowCapexModal(!1)},className:"bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 rounded-xl font-black text-xs px-4 py-2 shadow-sm transition-colors",children:"CONFIRMAR"})]})`,
  body: `(0,t.jsxs)("div",{className:"p-5 space-y-4",children:[
    (0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(d.lX,{className:"text-[10px] font-black text-slate-500 uppercase tracking-wider",children:"Selecione uma opção"}),(0,t.jsxs)("select",{value:tipoCapex,onChange:e=>setTipoCapex(e.target.value),className:"w-full h-10 border border-slate-200 rounded-xl px-3 text-xs bg-white focus:border-emerald-500 outline-none font-bold text-slate-800 shadow-sm transition-all",children:[(0,t.jsx)("option",{value:"",children:"Selecione a classificação..."}),(0,t.jsx)("option",{value:"NORMAL ATÉ 500 MIL DOLARES",children:"NORMAL ATÉ 500 MIL DOLARES"}),(0,t.jsx)("option",{value:"ESPECIAL ACIMA DE 500 MIL DOLARES",children:"ESPECIAL ACIMA DE 500 MIL DOLARES"}),(0,t.jsx)("option",{value:"ESPECIAL ACIMA DE 5 MILHOES DE DOLARES",children:"ESPECIAL ACIMA DE 5 MILHOES DE DOLARES"})]})]}),
    (0,t.jsxs)(ModalLibrary_507.cN,{className:"pt-2 flex justify-end gap-2",children:[(0,t.jsx)("button",{type:"button",onClick:()=>{setModeloContabil("");setTipoCapex("");setShowCapexModal(!1)},className:"rounded-xl font-black text-xs px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 bg-white transition-colors",children:"CANCELAR"}),(0,t.jsx)("button",{type:"button",onClick:()=>{if(!tipoCapex){alert("Selecione uma opção de CAPEX ou cancele.");return}setShowCapexModal(!1)},className:"bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 rounded-xl font-black text-xs px-4 py-2 shadow-sm transition-colors",children:"CONFIRMAR"})]})
  ]})`,
  fullModal: `(0,t.jsxs)(ModalLibrary_507.cZ,{className:"max-w-md border-emerald-500 rounded-2xl shadow-2xl p-0 flex flex-col overflow-hidden",children:[
    (0,t.jsxs)(ModalLibrary_507.fK,{className:"p-4 pb-3 bg-emerald-50 border-b border-emerald-100 shrink-0",children:[(0,t.jsxs)(ModalLibrary_507.$N,{className:"flex items-center gap-2 text-emerald-800 text-base font-black uppercase tracking-wider",children:[(0,t.jsx)(S.Z,{className:"h-5 w-5 text-emerald-600"}),"Classificação CAPEX"]}),(0,t.jsx)(ModalLibrary_507.Be,{className:"text-xs text-slate-500",children:"Selecione o tipo de modelo CAPEX para este projeto."})]}),
    (0,t.jsxs)("div",{className:"p-5 space-y-4",children:[
      (0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(d.lX,{className:"text-[10px] font-black text-slate-500 uppercase tracking-wider",children:"Selecione uma opção"}),(0,t.jsxs)("select",{value:tipoCapex,onChange:e=>setTipoCapex(e.target.value),className:"w-full h-10 border border-slate-200 rounded-xl px-3 text-xs bg-white focus:border-emerald-500 outline-none font-bold text-slate-800 shadow-sm transition-all",children:[(0,t.jsx)("option",{value:"",children:"Selecione a classificação..."}),(0,t.jsx)("option",{value:"NORMAL ATÉ 500 MIL DOLARES",children:"NORMAL ATÉ 500 MIL DOLARES"}),(0,t.jsx)("option",{value:"ESPECIAL ACIMA DE 500 MIL DOLARES",children:"ESPECIAL ACIMA DE 500 MIL DOLARES"}),(0,t.jsx)("option",{value:"ESPECIAL ACIMA DE 5 MILHOES DE DOLARES",children:"ESPECIAL ACIMA DE 5 MILHOES DE DOLARES"})]})]}),
      (0,t.jsxs)(ModalLibrary_507.cN,{className:"pt-2 flex justify-end gap-2",children:[(0,t.jsx)("button",{type:"button",onClick:()=>{setModeloContabil("");setTipoCapex("");setShowCapexModal(!1)},className:"rounded-xl font-black text-xs px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 bg-white transition-colors",children:"CANCELAR"}),(0,t.jsx)("button",{type:"button",onClick:()=>{if(!tipoCapex){alert("Selecione uma opção de CAPEX ou cancele.");return}setShowCapexModal(!1)},className:"bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 rounded-xl font-black text-xs px-4 py-2 shadow-sm transition-colors",children:"CONFIRMAR"})]})
    ]})
  ]})`
};

for (const [name, expr] of Object.entries(subExprs)) {
  try {
    eval(`(function() { return (${expr}); })`);
    console.log(`- ${name}: Success`);
  } catch (e) {
    console.log(`- ${name}: Failed -`, e.message);
  }
}

