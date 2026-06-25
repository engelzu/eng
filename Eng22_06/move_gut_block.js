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

  // The fields string
  const oldGrid = 'className:"grid grid-cols-2 md:grid-cols-6 gap-4 text-xs"';
  const newRowContainer = 'className:"flex flex-wrap items-start justify-between gap-4 text-xs w-full",children:[(0,t.jsxs)("div",{className:"flex flex-wrap items-center gap-8 md:gap-12"';
  
  const gutBlockStr = ',(0,t.jsxs)("div",{className:"flex items-center gap-6 bg-emerald-50/30 p-3 rounded-xl border border-emerald-100/50",children:[(0,t.jsxs)("div",{className:"flex items-center gap-4",children:[(0,t.jsxs)("div",{className:"text-center px-2",children:[(0,t.jsx)(g._,{className:"text-[9px] text-emerald-600 font-black",children:"G"}),(0,t.jsx)("p",{className:"font-black text-sm",children:q.gravity||1})]}),(0,t.jsxs)("div",{className:"text-center px-2 border-l border-emerald-200/50",children:[(0,t.jsx)(g._,{className:"text-[9px] text-emerald-600 font-black",children:"U"}),(0,t.jsx)("p",{className:"font-black text-sm",children:q.urgency||1})]}),(0,t.jsxs)("div",{className:"text-center px-2 border-l border-emerald-200/50",children:[(0,t.jsx)(g._,{className:"text-[9px] text-emerald-600 font-black",children:"T"}),(0,t.jsx)("p",{className:"font-black text-sm",children:q.time||1})]}),(0,t.jsxs)("div",{className:"text-center px-4 border-l-2 border-emerald-300",children:[(0,t.jsx)(g._,{className:"text-[9px] text-emerald-700 font-black",children:"GUT"}),(0,t.jsx)("p",{className:"font-black text-emerald-600 text-xl leading-none",children:q.gut||1})]})]})]})';

  const newGutBlockStr = ',(0,t.jsxs)("div",{className:"flex items-center gap-4 bg-emerald-50/30 px-4 py-1.5 rounded-xl border border-emerald-100/50 mt-1 md:mt-0",children:[(0,t.jsxs)("div",{className:"text-center px-2",children:[(0,t.jsx)(g._,{className:"text-[9px] text-emerald-600 font-black",children:"G"}),(0,t.jsx)("p",{className:"font-black text-sm",children:q.gravity||1})]}),(0,t.jsxs)("div",{className:"text-center px-2 border-l border-emerald-200/50",children:[(0,t.jsx)(g._,{className:"text-[9px] text-emerald-600 font-black",children:"U"}),(0,t.jsx)("p",{className:"font-black text-sm",children:q.urgency||1})]}),(0,t.jsxs)("div",{className:"text-center px-2 border-l border-emerald-200/50",children:[(0,t.jsx)(g._,{className:"text-[9px] text-emerald-600 font-black",children:"T"}),(0,t.jsx)("p",{className:"font-black text-sm",children:q.time||1})]}),(0,t.jsxs)("div",{className:"text-center px-4 border-l-2 border-emerald-300",children:[(0,t.jsx)(g._,{className:"text-[9px] text-emerald-700 font-black",children:"GUT"}),(0,t.jsx)("p",{className:"font-black text-emerald-600 text-xl leading-none",children:q.gut||1})]})]})]}),';

  const areaFieldEnd = '(0,t.jsx)("p",{className:"font-bold",children:q.managerArea||"-"})]})]})';

  if (code.includes(oldGrid) && code.includes(gutBlockStr) && code.includes(areaFieldEnd)) {
    // 1. Change the grid container to the new flex container
    code = code.replace(oldGrid, newRowContainer);

    // 2. Remove the GUT block from its original position
    code = code.replace(gutBlockStr, '');

    // 3. Insert the new GUT block at the end of the first row
    code = code.replace(areaFieldEnd, areaFieldEnd.slice(0, -2) + newGutBlockStr);

    console.log('Fixed top row in', f);
    fs.writeFileSync(f, code, 'utf8');
  } else {
    console.log('Target string not found in', f);
    if (!code.includes(oldGrid)) console.log('oldGrid not found');
    if (!code.includes(gutBlockStr)) console.log('gutBlockStr not found');
    if (!code.includes(areaFieldEnd)) console.log('areaFieldEnd not found');
  }
});
