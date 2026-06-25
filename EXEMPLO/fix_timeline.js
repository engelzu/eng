const fs = require('fs');

const files = [
  'c:/Users/Admin/Downloads/Eng0206/Eng0206/_next/static/chunks/6120-99ba76de6fd208f3.js',
  'c:/Users/Admin/Downloads/Eng0206/Eng0206/OUT/_next/static/chunks/6120-99ba76de6fd208f3.js'
];

const target = 'return(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("div",{className:"flex text-[7px] font-bold text-slate-400 uppercase tracking-wider",children:segs.map(function(s,i){return(0,t.jsx)("div",{className:"flex-1 text-center border-r border-slate-200 last:border-r-0",children:s},i)})}),(0,t.jsx)("div",{className:"relative",children:its.map(function(it,i){var sd=new Date(it.s),ed=new Date(it.e),lp=Math.max(0,Math.round((sd-mn)/864e5/td*100)),wp=Math.max(2,Math.round((ed-sd)/864e5/td*100));return(0,t.jsxs)("div",{className:"relative h-7 mb-1",children:[(0,t.jsx)("span",{className:"absolute left-0 top-0 text-[8px] font-bold text-slate-600 leading-7 w-16 overflow-hidden truncate",children:it.n}),(0,t.jsxs)("div",{className:"absolute top-1 h-5 rounded-full flex items-center justify-center overflow-visible",style:{left:lp+"%",width:wp+"%",backgroundColor:it.c,minWidth:"14px"},children:[(0,t.jsx)("span",{className:"absolute -top-3 left-0 text-[6px] text-slate-400 font-bold whitespace-nowrap",children:it.s.split("-").reverse().slice(0,2).join("/")}),(0,t.jsx)("span",{className:"absolute -top-3 right-0 text-[6px] text-slate-400 font-bold whitespace-nowrap",children:it.e.split("-").reverse().slice(0,2).join("/")}),(0,t.jsx)("span",{className:"text-[7px] font-black text-white",children:Math.round((ed-sd)/864e5)+"d"})]})]})},i)})]})';
const replacement = 'return(0,t.jsxs)("div",{className:"space-y-3 mt-4 px-2",children:[(0,t.jsxs)("div",{className:"flex",children:[(0,t.jsx)("div",{className:"w-24 shrink-0"}),(0,t.jsx)("div",{className:"flex-1 flex text-[10px] font-bold text-slate-400 uppercase tracking-wider",children:segs.map(function(s,i){return(0,t.jsx)("div",{className:"flex-1 text-center border-r border-slate-200 last:border-r-0",children:s},i)})})]}),(0,t.jsx)("div",{className:"space-y-5",children:its.map(function(it,i){var sd=new Date(it.s),ed=new Date(it.e),lp=Math.max(0,Math.round((sd-mn)/864e5/td*100)),wp=Math.max(2,Math.round((ed-sd)/864e5/td*100));return(0,t.jsxs)("div",{className:"flex items-center group",children:[(0,t.jsx)("span",{className:"w-24 shrink-0 text-[10px] font-bold text-slate-600 truncate pr-2 leading-none",children:it.n}),(0,t.jsx)("div",{className:"flex-1 relative h-6 bg-slate-50/50 rounded-full border border-slate-100",children:(0,t.jsxs)("div",{className:"absolute top-0 h-[22px] rounded-full flex items-center justify-center overflow-visible shadow-sm transition-all group-hover:opacity-90",style:{left:lp+"%",width:wp+"%",backgroundColor:it.c,minWidth:"24px"},children:[(0,t.jsx)("span",{className:"absolute -top-4 left-0 text-[9px] text-slate-500 font-bold whitespace-nowrap",children:it.s.split("-").reverse().slice(0,2).join("/")}),(0,t.jsx)("span",{className:"absolute -top-4 right-0 text-[9px] text-slate-500 font-bold whitespace-nowrap",children:it.e.split("-").reverse().slice(0,2).join("/")}),(0,t.jsx)("span",{className:"text-[10px] font-black text-white px-1",children:Math.round((ed-sd)/864e5)+"d"})]})})]})},i)})]})';

files.forEach(f => {
  if (!fs.existsSync(f)) {
    console.log('File does not exist:', f);
    return;
  }
  let code = fs.readFileSync(f, 'utf8');

  if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(f, code, 'utf8');
    console.log('Fixed timeline in', f);
  } else {
    console.log('Target string not found in', f);
  }
});
