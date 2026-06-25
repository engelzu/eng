const fs = require('fs');
const { execSync } = require('child_process');

function restore() {
  fs.copyFileSync('c:/Users/user2/Downloads/Eng0906 - Copia/Eng0206/Eng0206/_next/static/chunks/507-1cbb4e1ae80f89d3.js', '_next/static/chunks/507-1cbb4e1ae80f89d3.js');
  delete require.cache[require.resolve('./patch_507_fixed.js')];
  require('./patch_507_fixed.js');
}

function checkSyntax() {
  try {
    execSync('node -c _next/static/chunks/507-1cbb4e1ae80f89d3.js', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

restore();
console.log('Base syntax check:', checkSyntax() ? 'OK' : 'FAIL');

let code = fs.readFileSync('_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'utf8');

// Step 1: State
const stateTarget = 'let [showBcModal,setShowBcModal]=(0,g.useState)(!1),';
const stateReplacement = 'let [showBcModal,setShowBcModal]=(0,g.useState)(!1),[modeloContabil,setModeloContabil]=(0,g.useState)((e.fast&&e.fast.modeloContabil)||""),[tipoCapex,setTipoCapex]=(0,g.useState)((e.fast&&e.fast.tipoCapex)||""),[showCapexModal,setShowCapexModal]=(0,g.useState)(!1),';
code = code.replace(stateTarget, stateReplacement);

// Step 2: Submit
const submitTarget = 'eV=async e=>{Object.assign(e, bcDataRef.current);';
const submitReplacement = 'eV=async e=>{e.modeloContabil=modeloContabil;e.tipoCapex=tipoCapex;Object.assign(e, bcDataRef.current);';
code = code.replace(submitTarget, submitReplacement);

// Step 3: Select Dropdown UI wrapped in a side-by-side flex container
const startTarget = 'children:[(0,t.jsx)("div",{className:"w-full md:w-[280px]",children:a&&K&&(0,t.jsx)(d.Wi,{';
const startReplacement = 'children:[(0,t.jsxs)("div",{className:"flex flex-col md:flex-row items-end gap-4 w-full md:w-auto",children:[(0,t.jsx)("div",{className:"w-full md:w-[280px]",children:a&&K&&(0,t.jsx)(d.Wi,{';
code = code.replace(startTarget, startReplacement);

const uiTarget = '(0,t.jsx)(d.zG,{})]})}})}),';
const capexSelectorMarkup = '(0,t.jsxs)("div",{className:"flex flex-col space-y-2",children:[(0,t.jsx)(d.lX,{className:"text-xs font-bold text-green-700 uppercase",children:"MODELO CONT\\xc1BIL"}),(0,t.jsxs)("div",{className:"flex flex-row items-center gap-2",children:[(0,t.jsxs)("select",{value:modeloContabil,onChange:e=>{let val=e.target.value;setModeloContabil(val);if(val==="CAPEX"){setShowCapexModal(!0)}else{setTipoCapex("")}},className:"flex h-10 w-[140px] rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none font-medium text-slate-800",children:[(0,t.jsx)("option",{value:"",children:"Selecione..."}),(0,t.jsx)("option",{value:"CAPEX",children:"CAPEX"}),(0,t.jsx)("option",{value:"C.CUSTO",children:"C.CUSTO"})]}),modeloContabil==="CAPEX"&&tipoCapex&&(0,t.jsx)("span",{className:"text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-2.5 rounded cursor-pointer hover:bg-emerald-100/80 transition-all uppercase tracking-wider whitespace-nowrap",onClick:()=>setShowCapexModal(!0),children:tipoCapex})]})]}),';

code = code.replace(uiTarget, '(0,t.jsx)(d.zG,{})]})}})}), ' + capexSelectorMarkup + ']}),');

fs.writeFileSync('_next/static/chunks/507-1cbb4e1ae80f89d3.js', code);
console.log('Step 3 (UI) syntax check:', checkSyntax() ? 'OK' : 'FAIL');

// Step 4: Dialog Modal
const modalTarget = '(0,t.jsx)(ModalLibrary_507.Vq,{open:showBcModal,';
const modalReplacement = '(0,t.jsx)(ModalLibrary_507.Vq,{open:showCapexModal,onOpenChange:setShowCapexModal,children:(0,t.jsxs)(ModalLibrary_507.cZ,{className:"max-w-md border-emerald-500 rounded-2xl shadow-2xl p-0 flex flex-col overflow-hidden",children:[(0,t.jsxs)(ModalLibrary_507.fK,{className:"p-4 pb-3 bg-emerald-50 border-b border-emerald-100 shrink-0",children:[(0,t.jsxs)(ModalLibrary_507.$N,{className:"flex items-center gap-2 text-emerald-800 text-base font-black uppercase tracking-wider",children:[(0,t.jsx)(S.Z,{className:"h-5 w-5 text-emerald-600"}),"Classifica\\xe7\\xe3o CAPEX"]}),(0,t.jsx)(ModalLibrary_507.Be,{className:"text-xs text-slate-500",children:"Selecione o tipo de modelo CAPEX para este projeto."})]}),(0,t.jsxs)("div",{className:"p-5 space-y-4",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(d.lX,{className:"text-[10px] font-black text-slate-500 uppercase tracking-wider",children:"Selecione uma op\\xe7\\xe3o"}),(0,t.jsxs)("select",{value:tipoCapex,onChange:e=>setTipoCapex(e.target.value),className:"w-full h-10 border border-slate-200 rounded-xl px-3 text-xs bg-white focus:border-emerald-500 outline-none font-bold text-slate-800 shadow-sm transition-all",children:[(0,t.jsx)("option",{value:"",children:"Selecione a classifica\xe7\xe3o..."}),(0,t.jsx)("option",{value:"NORMAL AT\\xc9 500 MIL DOLARES",children:"NORMAL AT\\xc9 500 MIL DOLARES"}),(0,t.jsx)("option",{value:"ESPECIAL ACIMA DE 500 MIL DOLARES",children:"ESPECIAL ACIMA DE 500 MIL DOLARES"}),(0,t.jsx)("option",{value:"ESPECIAL ACIMA DE 5 MILHOES DE DOLARES",children:"ESPECIAL ACIMA DE 5 MILHOES DE DOLARES"})]})]}),(0,t.jsxs)(ModalLibrary_507.cN,{className:"pt-2 flex justify-end gap-2",children:[(0,t.jsx)("button",{type:"button",onClick:()=>{setModeloContabil("");setTipoCapex("");setShowCapexModal(!1)},className:"rounded-xl font-black text-xs px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 bg-white transition-colors",children:"CANCELAR"}),(0,t.jsx)("button",{type:"button",onClick:()=>{if(!tipoCapex){alert("Selecione uma op\\xe7\\xe3o de CAPEX ou cancele.");return}setShowCapexModal(!1)},className:"bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 rounded-xl font-black text-xs px-4 py-2 shadow-sm transition-colors",children:"CONFIRMAR"})]})]})]})}),(0,t.jsx)(ModalLibrary_507.Vq,{open:showBcModal,';
code = code.replace(modalTarget, modalReplacement);
fs.writeFileSync('_next/static/chunks/507-1cbb4e1ae80f89d3.js', code);
console.log('Step 4 (Modal) syntax check:', checkSyntax() ? 'OK' : 'FAIL');
