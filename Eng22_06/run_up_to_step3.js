const fs = require('fs');
const { execSync } = require('child_process');

fs.copyFileSync('c:/Users/user2/Downloads/Eng0906 - Copia/Eng0206/Eng0206/_next/static/chunks/507-1cbb4e1ae80f89d3.js', '_next/static/chunks/507-1cbb4e1ae80f89d3.js');
delete require.cache[require.resolve('./patch_507_fixed.js')];
require('./patch_507_fixed.js');

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
const capexSelectorMarkup = '(0,t.jsxs)("div",{className:"w-full md:w-[280px] space-y-2",children:[(0,t.jsx)(d.lX,{className:"text-xs font-bold text-green-700 uppercase",children:"MODELO CONT\\xc1BIL"}),(0,t.jsxs)("select",{value:modeloContabil,onChange:e=>{let val=e.target.value;setModeloContabil(val);if(val==="CAPEX"){setShowCapexModal(!0)}else{setTipoCapex("")}},className:"flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-medium text-slate-800",children:[(0,t.jsx)("option",{value:"",children:"Selecione..."}),(0,t.jsx)("option",{value:"CAPEX",children:"CAPEX"}),(0,t.jsx)("option",{value:"C.CUSTO",children:"C.CUSTO"})]}),modeloContabil==="CAPEX"&&tipoCapex&&(0,t.jsx)("span",{className:"text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded mt-1.5 cursor-pointer hover:bg-emerald-100/80 transition-all block text-center uppercase tracking-wider",onClick:()=>setShowCapexModal(!0),children:tipoCapex})]}),';

// Let's test different endings
const endings = {
  'ending_1_bracket_1_paren_comma': ']}),',
  'ending_1_bracket_2_parens_comma': ']})),',
  'ending_2_brackets_2_parens_comma': ']]})),',
};

for (const [name, ending] of Object.entries(endings)) {
  let testCode = code.replace(uiTarget, '(0,t.jsx)(d.zG,{})]})}})}), ' + capexSelectorMarkup + ending);
  fs.writeFileSync('temp_test.js', testCode);
  try {
    execSync('node -c temp_test.js', { stdio: 'pipe' });
    console.log(`- ${name}: OK`);
  } catch (e) {
    console.log(`- ${name}: FAIL -`, e.stderr.toString().split('\n').slice(-3).join('\n'));
  }
}
