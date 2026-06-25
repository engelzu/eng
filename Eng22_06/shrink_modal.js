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

  // 1. Shrink modal width
  code = code.replace('className:"max-w-2xl border-emerald-500"', 'className:"max-w-xl border-emerald-500"');

  // 2. Shrink inputs
  const oldInputClass = 'className:"flex h-9 w-full rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs outline-none focus:border-emerald-500 transition-all shadow-sm"';
  const newInputClass = 'className:"flex h-7 w-full rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] outline-none focus:border-emerald-500 transition-all shadow-sm"';
  code = code.split(oldInputClass).join(newInputClass); // replace all

  // 3. Shrink select
  const oldSelectClass = 'className:"w-full h-10 border border-slate-200 rounded-xl px-3 text-xs bg-white focus:border-emerald-500 outline-none"';
  const newSelectClass = 'className:"w-full h-8 border border-slate-200 rounded-md px-2 text-[11px] bg-white focus:border-emerald-500 outline-none"';
  code = code.replace(oldSelectClass, newSelectClass);

  // 4. Shrink section boxes
  const oldSectionBox = 'className:"border border-slate-100 rounded-xl p-3.5 bg-slate-50/50 space-y-3"';
  const newSectionBox = 'className:"border border-slate-100 rounded-lg p-2 bg-slate-50/50 space-y-1.5"';
  code = code.split(oldSectionBox).join(newSectionBox); // replace all

  // 5. Shrink grid gaps
  const oldGrid = 'className:"grid grid-cols-3 gap-3"';
  const newGrid = 'className:"grid grid-cols-3 gap-2"';
  code = code.split(oldGrid).join(newGrid);

  // 6. Shrink body padding
  code = code.replace('className:"p-6 space-y-4 max-h-[70vh] overflow-y-auto"', 'className:"p-4 space-y-2.5 max-h-[70vh] overflow-y-auto"');

  // 7. Shrink gap between sections
  code = code.replace('className:"space-y-3",children:[(0,t.jsxs)("div",{className:"border border-slate-100 rounded-lg p-2 bg-slate-50/50 space-y-1.5"', 'className:"space-y-1.5",children:[(0,t.jsxs)("div",{className:"border border-slate-100 rounded-lg p-2 bg-slate-50/50 space-y-1.5"');

  console.log('Adjusted modal styling in', f);
  fs.writeFileSync(f, code, 'utf8');
});
