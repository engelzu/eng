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

  const cardCode = ',(0,t.jsxs)("div",{className:"bg-white border border-emerald-100 rounded-xl p-3.5 space-y-1.5 shadow-sm",children:[(0,t.jsxs)(g._,{className:"text-[9px] text-emerald-600 uppercase font-black tracking-widest flex items-center gap-2",children:[(0,t.jsx)(b.Z,{className:"h-3 w-3"})," Desenvolvimento Engenharia"]}),(0,t.jsx)("p",{className:"font-black text-xs text-slate-800",children:q.empresaOrcamento||"-"})]})';
  
  const newCardCode = ',(0,t.jsxs)("div",{className:"bg-white border border-emerald-100 rounded-xl p-3.5 space-y-1.5 shadow-sm w-full md:w-[280px]",children:[(0,t.jsxs)(g._,{className:"text-[9px] text-emerald-600 uppercase font-black tracking-widest flex items-center gap-2",children:[(0,t.jsx)(b.Z,{className:"h-3 w-3"})," Desenvolvimento Engenharia"]}),(0,t.jsx)("p",{className:"font-black text-xs text-slate-800",children:q.empresaOrcamento||"-"})]})';

  // Find where to insert it (after Check List FEL)
  const checklistCode = 'q.checkListFel?"CONCLU\\xcdDO":"N\\xc3O CONCLU\\xcdDO"})]}),(0,t.jsx)("div",{className:(0,O.cn)("h-8 w-8 rounded-full flex items-center justify-center transition-colors",q.checkListFel?"bg-emerald-100 text-emerald-600":"bg-slate-100 text-slate-400"),children:(0,t.jsx)(j.Z,{className:"h-5 w-5"})})]})';

  if (code.includes(cardCode) && code.includes(checklistCode)) {
    // 1. Remove the card from its original location
    code = code.replace(cardCode, '');

    // 2. Insert the modified card after Checklist FEL
    code = code.replace(checklistCode, checklistCode + newCardCode);

    // 3. Remove md:grid-cols-2 from the grid that used to contain it
    code = code.replace('className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{className:"flex flex-col gap-2 border-2 border-emerald-100 bg-emerald-50/5 rounded-xl', 'className:"grid grid-cols-1 gap-4",children:[(0,t.jsxs)("div",{className:"flex flex-col gap-2 border-2 border-emerald-100 bg-emerald-50/5 rounded-xl');

    console.log('Moved Desenvolvimento Engenharia card in', f);
    fs.writeFileSync(f, code, 'utf8');
  } else {
    console.log('Could not find target strings in', f);
  }
});
