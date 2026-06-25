const fs = require('fs');

const modalReplacement = '(0,t.jsx)(ModalLibrary_507.Vq,{open:showCapexModal,onOpenChange:setShowCapexModal,children:(0,t.jsxs)(ModalLibrary_507.cZ,{className:"max-w-md border-emerald-500 rounded-2xl shadow-2xl p-0 flex flex-col overflow-hidden",children:[(0,t.jsxs)(ModalLibrary_507.fK,{className:"p-4 pb-3 bg-emerald-50 border-b border-emerald-100 shrink-0",children:[(0,t.jsxs)(ModalLibrary_507.$N,{className:"flex items-center gap-2 text-emerald-800 text-base font-black uppercase tracking-wider",children:[(0,t.jsx)(S.Z,{className:"h-5 w-5 text-emerald-600"}),"Classifica\\xe7\\xe3o CAPEX"]}),(0,t.jsx)(ModalLibrary_507.Be,{className:"text-xs text-slate-500",children:"Selecione o tipo de modelo CAPEX para este projeto."})]}),(0,t.jsxs)("div",{className:"p-5 space-y-4",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(d.lX,{className:"text-[10px] font-black text-slate-500 uppercase tracking-wider",children:"Selecione uma op\\xe7\\xe3o"}),(0,t.jsxs)("select",{value:tipoCapex,onChange:e=>setTipoCapex(e.target.value),className:"w-full h-10 border border-slate-200 rounded-xl px-3 text-xs bg-white focus:border-emerald-500 outline-none font-bold text-slate-800 shadow-sm transition-all",children:[(0,t.jsx)("option",{value:"",children:"Selecione a classifica\xe7\xe3o..."}),(0,t.jsx)("option",{value:"NORMAL AT\\xc9 500 MIL DOLARES",children:"NORMAL AT\\xc9 500 MIL DOLARES"}),(0,t.jsx)("option",{value:"ESPECIAL ACIMA DE 500 MIL DOLARES",children:"ESPECIAL ACIMA DE 500 MIL DOLARES"}),(0,t.jsx)("option",{value:"ESPECIAL ACIMA DE 5 MILHOES DE DOLARES",children:"ESPECIAL ACIMA DE 5 MILHOES DE DOLARES"})]})]}),(0,t.jsxs)(ModalLibrary_507.cN,{className:"pt-2 flex justify-end gap-2",children:[(0,t.jsx)("button",{type:"button",onClick:()=>{setModeloContabil("");setTipoCapex("");setShowCapexModal(!1)},className:"rounded-xl font-black text-xs px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 bg-white transition-colors",children:"CANCELAR"}),(0,t.jsx)("button",{type:"button",onClick:()=>{if(!tipoCapex){alert("Selecione uma op\\xe7\\xe3o de CAPEX ou cancele.");return}setShowCapexModal(!1)},className:"bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 rounded-xl font-black text-xs px-4 py-2 shadow-sm transition-colors",children:"CONFIRMAR"})]})]})]})}),(0,t.jsx)(ModalLibrary_507.Vq,{open:showBcModal,';

let stack = [];
for (let i = 0; i < modalReplacement.length; i++) {
  const c = modalReplacement[i];
  if (c === '(' || c === '{' || c === '[') {
    stack.push({ c, idx: i });
  } else if (c === ')' || c === '}' || c === ']') {
    if (stack.length === 0) {
      console.log(`Unmatched closing ${c} at index ${i}`);
    } else {
      const top = stack.pop();
      const expected = { ')': '(', '}': '{', ']': '[' }[c];
      if (top.c !== expected) {
        console.log(`Mismatch at index ${i}: closing ${c} but expected matching for ${top.c} opened at index ${top.idx}`);
      }
    }
  }
}

if (stack.length > 0) {
  console.log('Unclosed brackets remaining:');
  stack.forEach(item => {
    console.log(`- ${item.c} opened at index ${item.idx}`);
  });
} else {
  console.log('All brackets in modalReplacement are perfectly balanced!');
}
