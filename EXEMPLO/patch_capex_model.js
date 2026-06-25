const fs = require('fs');
const path = require('path');

const files = [
  '_next/static/chunks/6120-99ba76de6fd208f3.js',
  'OUT/_next/static/chunks/6120-99ba76de6fd208f3.js'
];

files.forEach(f => {
  if (!fs.existsSync(f)) {
    console.log('File does not exist:', f);
    return;
  }
  let code = fs.readFileSync(f, 'utf8');

  // 1. Inject State Variables
  const stateTarget = '[showEapModal,setShowEapModal]=(0,E.useState)(!1),';
  const stateReplacement = '[showEapModal,setShowEapModal]=(0,E.useState)(!1),[modeloContabil,setModeloContabil]=(0,E.useState)(r.modeloContabil||""),[tipoCapex,setTipoCapex]=(0,E.useState)(r.tipoCapex||""),[showCapexModal,setShowCapexModal]=(0,E.useState)(!1),';
  if (code.includes(stateTarget)) {
    if (!code.includes('modeloContabil,setModeloContabil')) {
      code = code.replace(stateTarget, stateReplacement);
      console.log('State variables injected successfully into', f);
    } else {
      console.log('State variables already exist in', f);
    }
  } else {
    console.log('Error: stateTarget not found in', f);
    return;
  }

  // 2. Inject useEffect reset logic
  const useEffectTarget = 'setShowEapModal(!1),setShowCronogramaModal(!1),';
  const useEffectReplacement = 'setShowEapModal(!1),setShowCronogramaModal(!1),setModeloContabil(r.modeloContabil||""),setTipoCapex(r.tipoCapex||""),setShowCapexModal(!1),';
  if (code.includes(useEffectTarget)) {
    if (!code.includes('setModeloContabil(r.modeloContabil')) {
      code = code.replace(useEffectTarget, useEffectReplacement);
      console.log('useEffect resets injected successfully into', f);
    } else {
      console.log('useEffect resets already exist in', f);
    }
  } else {
    console.log('Error: useEffectTarget not found in', f);
    return;
  }

  // 3. Inject Firestore saving logic inside eh()
  const saveTarget = 'priority:Number(G),';
  const saveReplacement = 'priority:Number(G),modeloContabil:modeloContabil,tipoCapex:tipoCapex,';
  if (code.includes(saveTarget)) {
    if (!code.includes('modeloContabil:modeloContabil')) {
      code = code.replace(saveTarget, saveReplacement);
      console.log('Firestore saving logic injected successfully into', f);
    } else {
      console.log('Firestore saving logic already exists in', f);
    }
  } else {
    console.log('Error: saveTarget not found in', f);
    return;
  }

  // 4. Inject Select Dropdown next to status badge
  const codeBlockTarget = '(0,t.jsxs)("div",{children:[(0,t.jsx)(g._,{className:"text-[9px] text-muted-foreground uppercase font-black tracking-tighter",children:"C\\xf3digo"}),(0,t.jsxs)("div",{className:"flex items-center gap-2 mt-0.5",children:[(0,t.jsxs)("p",{className:"font-black text-lg text-emerald-950 leading-none",children:["#",q.code]}),(0,t.jsx)(f.C,{className:"bg-emerald-600 hover:bg-emerald-700 uppercase text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full shadow-sm text-white",children:q.status})]})]})';
  const codeBlockReplacement = codeBlockTarget + ',(0,t.jsxs)("div",{className:"flex flex-col gap-1",children:[(0,t.jsx)(g._,{className:"text-[9px] text-muted-foreground uppercase font-black tracking-tighter",children:"MODELO CONT\\xc1BIL"}),(0,t.jsxs)("select",{value:modeloContabil,onChange:e=>{let val=e.target.value;setModeloContabil(val);if(val==="CAPEX"){setShowCapexModal(!0)}else{setTipoCapex("")}},className:"h-8 border border-slate-200 rounded-lg px-2 text-[11px] bg-white focus:border-emerald-500 outline-none mt-0.5 font-bold text-slate-800 shadow-sm transition-all",children:[(0,t.jsx)("option",{value:"",children:"Selecione..."}),(0,t.jsx)("option",{value:"CAPEX",children:"CAPEX"}),(0,t.jsx)("option",{value:"C.CUSTO",children:"C.CUSTO"})]}),modeloContabil==="CAPEX"&&tipoCapex&&(0,t.jsx)("span",{className:"text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded mt-1 cursor-pointer hover:bg-emerald-100/80 transition-all block text-center uppercase tracking-wider",onClick:()=>setShowCapexModal(!0),children:tipoCapex})]})';
  
  if (code.includes(codeBlockTarget)) {
    if (!code.includes('MODELO CONT\\xc1BIL')) {
      code = code.replace(codeBlockTarget, codeBlockReplacement);
      console.log('Select dropdown markup injected successfully into', f);
    } else {
      console.log('Select dropdown markup already exists in', f);
    }
  } else {
    console.log('Error: codeBlockTarget not found in', f);
    return;
  }

  // 5. Inject Dialog Modal
  const modalTarget = ',(0,t.jsx)(s.Vq,{open:showEapModal,';
  const modalReplacement = ',(0,t.jsx)(s.Vq,{open:showCapexModal,onOpenChange:setShowCapexModal,children:(0,t.jsxs)(s.cZ,{className:"max-w-md border-emerald-500 rounded-2xl shadow-2xl p-0 flex flex-col overflow-hidden",children:[(0,t.jsxs)(s.fK,{className:"p-4 pb-3 bg-emerald-50 border-b border-emerald-100 shrink-0",children:[(0,t.jsxs)(s.$N,{className:"flex items-center gap-2 text-emerald-800 text-base font-black uppercase tracking-wider",children:[(0,t.jsx)(v.Z,{className:"h-5 w-5 text-emerald-600"}),"Classifica\\xe7\\xe3o CAPEX"]}),(0,t.jsx)(s.Be,{className:"text-xs text-slate-500",children:"Selecione o tipo de modelo CAPEX para este projeto."})]}),(0,t.jsxs)("div",{className:"p-5 space-y-4",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(g._,{className:"text-[10px] font-black text-slate-500 uppercase tracking-wider",children:"Selecione uma op\\xe7\\xe3o"}),(0,t.jsxs)("select",{value:tipoCapex,onChange:e=>setTipoCapex(e.target.value),className:"w-full h-10 border border-slate-200 rounded-xl px-3 text-xs bg-white focus:border-emerald-500 outline-none font-bold text-slate-800 shadow-sm transition-all",children:[(0,t.jsx)("option",{value:"",children:"Selecione a classifica\\xe7\\xe3o..."}),(0,t.jsx)("option",{value:"NORMAL AT\\xc9 500 MIL DOLARES",children:"NORMAL AT\\xc9 500 MIL DOLARES"}),(0,t.jsx)("option",{value:"ESPECIAL ACIMA DE 500 MIL DOLARES",children:"ESPECIAL ACIMA DE 500 MIL DOLARES"}),(0,t.jsx)("option",{value:"ESPECIAL ACIMA DE 5 MILHOES DE DOLARES",children:"ESPECIAL ACIMA DE 5 MILHOES DE DOLARES"})]})]}),(0,t.jsxs)(s.cN,{className:"pt-2 flex justify-end gap-2",children:[(0,t.jsx)("button",{type:"button",onClick:()=>{setModeloContabil("");setTipoCapex("");setShowCapexModal(!1)},className:"rounded-xl font-black text-xs px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 bg-white transition-colors",children:"CANCELAR"}),(0,t.jsx)("button",{type:"button",onClick:()=>{if(!tipoCapex){alert("Selecione uma op\\xe7\\xe3o de CAPEX ou cancele.");return}setShowCapexModal(!1)},className:"bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 rounded-xl font-black text-xs px-4 py-2 shadow-sm transition-colors",children:"CONFIRMAR"})]})]})]})}),(0,t.jsx)(s.Vq,{open:showEapModal,';

  if (code.includes(modalTarget)) {
    if (!code.includes('open:showCapexModal')) {
      code = code.replace(modalTarget, modalReplacement);
      console.log('Capex modal markup injected successfully into', f);
    } else {
      console.log('Capex modal markup already exists in', f);
    }
  } else {
    console.log('Error: modalTarget not found in', f);
    return;
  }

  // Save changes
  fs.writeFileSync(f, code, 'utf8');
  console.log('File successfully updated:', f);
});
