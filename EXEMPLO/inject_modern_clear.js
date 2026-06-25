const fs = require('fs');

let code = fs.readFileSync('generate_markup.js', 'utf8');

// The rows definition for our loops
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

let clearLogic = 'setDist({});';
for (const row of rows) {
  if (row.custoInput) {
    const setVar = 'set' + row.id.charAt(0).toUpperCase() + row.id.slice(1);
    clearLogic += setVar + 'Custo("");';
  }
}

// Modern Custom Modal JSX
const confirmModal = `{showClearConfirm && (
  (0,t.jsx)("div",{className:"fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm",children:
    (0,t.jsxs)("div",{className:"bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-slate-100 mx-4",children:[
      (0,t.jsx)("div",{className:"w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4",children:
        (0,t.jsx)("svg",{className:"w-6 h-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:2,children:
          (0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})
        })
      }),
      (0,t.jsx)("h3",{className:"text-lg font-black text-slate-800 mb-2",children:"Limpar Valores Financeiros?"}),
      (0,t.jsx)("p",{className:"text-sm text-slate-500 mb-6 font-medium",children:"Você está prestes a apagar todos os custos inseridos e a distribuição mensal. As datas e estruturas selecionadas serão mantidas."}),
      (0,t.jsxs)("div",{className:"flex items-center justify-end gap-3",children:[
        (0,t.jsx)("button",{onClick:()=>setShowClearConfirm(!1),className:"px-4 py-2 text-xs font-black text-slate-600 hover:bg-slate-100 rounded-xl transition-colors tracking-widest",children:"CANCELAR"}),
        (0,t.jsx)("button",{onClick:()=>{ ${clearLogic} setShowClearConfirm(!1); },className:"px-4 py-2 text-xs font-black text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-md shadow-red-500/30 tracking-widest",children:"SIM, LIMPAR"})
      ]})
    ]})
  })
)},`;

// We replace the old footer injection entirely.
// Let's find the substring from `markup += `]})]})})]}),` to the end.
const oldFooterStart = 'markup += `]})]})})]}),';
const startIdx = code.indexOf(oldFooterStart);

if (startIdx !== -1) {
  const triggerBtn = `(0,t.jsx)(u.z,{variant:"outline",onClick:()=>setShowClearConfirm(!0),className:"rounded-xl font-black text-xs px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 mr-auto",children:"LIMPAR VALORES"}),`;
  
  const newFooterStr = `markup += \\\`]})]})})]}),\${confirmModal}(0,t.jsxs)(s.cN,{className:"shrink-0 p-3",children:[${triggerBtn}(0,t.jsx)(u.z,{variant:"outline",onClick:()=>setShowEapModal(!1),className:"rounded-xl font-black text-xs px-4 py-2",children:"FECHAR"}),(0,t.jsx)(u.z,{onClick:()=>setShowEapModal(!1),className:"bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs px-4 py-2",children:"APLICAR"})]})]})})\\\`;`;
  
  code = code.substring(0, startIdx) + newFooterStr + '\n' + code.substring(code.indexOf('let code = fs.readFileSync('));
  
  fs.writeFileSync('generate_markup.js', code);
  console.log('Replaced footer logic with modern custom modal');
} else {
  console.log('Could not find footer injection');
}

