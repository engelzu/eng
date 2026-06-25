const fs = require('fs');
let code = fs.readFileSync('generate_markup.js', 'utf8');

// Header
code = code.replace('className:"p-4 pb-2 bg-emerald-50/50', 'className:"p-2 bg-emerald-50/50');
code = code.replace('className:"flex items-center gap-2 text-emerald-800"', 'className:"flex items-center gap-2 text-emerald-800 text-sm"');
code = code.replace('className:"h-5 w-5"', 'className:"h-4 w-4"');
code = code.replace('(0,t.jsx)(s.Be,{children:"Preencha os prazos', '(0,t.jsx)(s.Be,{className:"text-[10px]",children:"Preencha os prazos');

// Body Container
code = code.replace('className:"p-4 space-y-4 flex-1 overflow-y-auto"', 'className:"p-2 space-y-2 flex-1 overflow-y-auto"');
code = code.replace('className:"bg-slate-50 border-b border-slate-200"', 'className:"bg-slate-50 border-b border-slate-200"');

// Headers
code = code.replace('className:"py-2.5 px-3 w-[40px]"', 'className:"py-1 px-1.5 w-[30px]"');
code = code.replace('className:"py-2.5 px-3 whitespace-nowrap"', 'className:"py-1 px-1.5 whitespace-nowrap"');
code = code.replace('className:"py-2.5 px-2 w-[120px]"', 'className:"py-1 px-1.5 w-[100px]"');
code = code.replace('className:"py-2.5 px-3 w-[140px] text-right"', 'className:"py-1 px-1.5 w-[110px] text-right"');
code = code.replace('className:"py-2.5 px-4"', 'className:"py-1 px-1.5"');

// Inputs
code = code.replace(/"w-full h-7 rounded border/g, '"w-full h-5 rounded border');
code = code.replace(/"w-28 h-7 rounded border/g, '"w-24 h-5 rounded border');
code = code.replace(/text-\[11px\]/g, 'text-[10px]');
code = code.replace(/"py-2 px-3 pl-/g, '"py-1 px-2 pl-');
code = code.replace(/"py-2 px-3 whitespace-nowrap/g, '"py-1 px-2 whitespace-nowrap');
code = code.replace(/"py-2 px-3 text-right/g, '"py-1 px-2 text-right');
code = code.replace(/h-4 w-4 rounded/g, 'h-3 w-3 rounded');

// Months Boxes
code = code.replace('w-24 border border-emerald-100/50 rounded-lg p-2 bg-white shadow-sm flex flex-col gap-1.5', 'w-[72px] border border-emerald-100/50 rounded p-1 bg-white shadow-sm flex flex-col gap-0.5');
code = code.replace(/text-\[9px\]/g, 'text-[8px]');
code = code.replace('w-full h-5 text-[10px]', 'w-full h-[18px] text-[8px]');
code = code.replace('py-0.5 border', 'py-[1px] border');
code = code.replace('py-1 px-3', 'py-0.5 px-1.5');
code = code.replace('gap-2 p-1', 'gap-1 p-0.5');

// Footer Buttons
code = code.replace('className:"rounded-xl font-black text-xs tracking-widest"', 'className:"rounded-md font-bold text-[10px] px-3 py-1.5 h-auto tracking-widest"');
code = code.replace('className:"bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs tracking-widest"', 'className:"bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold text-[10px] px-3 py-1.5 h-auto tracking-widest"');

fs.writeFileSync('generate_markup.js', code);
console.log('UI Shrunk in generate_markup.js');
