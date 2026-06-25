const fs = require('fs');

const files = [
  'c:/Users/Admin/Downloads/Eng0206/Eng0206/_next/static/chunks/6120-99ba76de6fd208f3.js',
  'c:/Users/Admin/Downloads/Eng0206/Eng0206/OUT/_next/static/chunks/6120-99ba76de6fd208f3.js'
];

files.forEach(f => {
  if (!fs.existsSync(f)) {
    console.log('File does not exist:', f);
    return;
  }
  let code = fs.readFileSync(f, 'utf8');

  const targetTimeline = 'return(0,t.jsxs)("div",{className:"space-y-3 mt-4 px-2",children:[(0,t.jsxs)("div",{className:"flex",children:[(0,t.jsx)("div",{className:"w-28 shrink-0"}),(0,t.jsx)("div",{className:"flex-1 flex text-[10px] font-bold text-slate-400 uppercase tracking-wider",children:segs.map(function(s,i){return(0,t.jsx)("div",{className:"flex-1 text-center border-r border-slate-200 last:border-r-0",children:s},i)})})]}),(0,t.jsx)("div",{className:"space-y-6",children:its.map(function(it,i){var sd=new Date(it.s),ed=new Date(it.e),lp=Math.max(0,Math.round((sd-mn)/864e5/td*100)),wp=Math.max(2,Math.round((ed-sd)/864e5/td*100));return(0,t.jsxs)("div",{className:"flex items-center group",children:[(0,t.jsx)("span",{className:"w-28 shrink-0 text-xs font-bold text-slate-700 truncate pr-2 leading-none",children:it.n}),(0,t.jsx)("div",{className:"flex-1 relative h-7 bg-slate-50/50 rounded-full border border-slate-100",children:(0,t.jsxs)("div",{className:"absolute top-0 h-[26px] rounded-full flex items-center justify-center overflow-visible shadow-sm transition-all group-hover:opacity-90",style:{left:lp+"%",width:wp+"%",backgroundColor:it.c,minWidth:"28px"},children:[(0,t.jsx)("span",{className:"absolute top-1/2 -translate-y-1/2 right-full mr-1.5 text-[10px] text-slate-600 font-bold whitespace-nowrap",children:it.s.split("-").reverse().slice(0,2).join("/")}),(0,t.jsx)("span",{className:"absolute top-1/2 -translate-y-1/2 left-full ml-1.5 text-[10px] text-slate-600 font-bold whitespace-nowrap",children:it.e.split("-").reverse().slice(0,2).join("/")}),(0,t.jsx)("span",{className:"text-[11px] font-black text-white px-1 drop-shadow-md",children:Math.round((ed-sd)/864e5)+"d"})]})})]})},i)})]})';
  
  const replacementTimeline = 'return(0,t.jsxs)("div",{className:"space-y-3 mt-4 px-2",children:[(0,t.jsxs)("div",{className:"flex",children:[(0,t.jsx)("div",{className:"w-28 shrink-0"}),(0,t.jsx)("div",{className:"flex-1 flex text-[10px] font-bold text-slate-400 uppercase tracking-wider",children:segs.map(function(s,i){return(0,t.jsx)("div",{className:"flex-1 text-center border-r border-slate-200 last:border-r-0",children:s},i)})})]}),(0,t.jsx)("div",{className:"space-y-8",children:its.map(function(it,i){var sd=new Date(it.s),ed=new Date(it.e),lp=Math.max(0,Math.round((sd-mn)/864e5/td*100)),wp=Math.max(2,Math.round((ed-sd)/864e5/td*100));return(0,t.jsxs)("div",{className:"flex items-center group",children:[(0,t.jsx)("span",{className:"w-28 shrink-0 text-xs font-bold text-slate-700 truncate pr-2 leading-none",children:it.n}),(0,t.jsx)("div",{className:"flex-1 relative h-7 bg-slate-50/50 rounded-full border border-slate-100",children:(0,t.jsxs)("div",{className:"absolute top-0 h-[26px] rounded-full flex items-center justify-center overflow-visible shadow-sm transition-all group-hover:opacity-90",style:{left:lp+"%",width:wp+"%",backgroundColor:it.c,minWidth:"28px"},children:[(0,t.jsx)("span",{className:"absolute text-[10px] text-slate-600 font-bold whitespace-nowrap",style:{top:"-18px",left:"0px"},children:it.s.split("-").reverse().slice(0,2).join("/")}),(0,t.jsx)("span",{className:"absolute text-[10px] text-slate-600 font-bold whitespace-nowrap",style:{top:"-18px",right:"0px"},children:it.e.split("-").reverse().slice(0,2).join("/")}),(0,t.jsx)("span",{className:"text-[11px] font-black text-white px-1 drop-shadow-md",children:Math.round((ed-sd)/864e5)+"d"})]})})]})},i)})]})';

  if (code.includes(targetTimeline)) {
    code = code.replace(targetTimeline, replacementTimeline);
    console.log('Fixed timeline dates positioning in', f);
  } else {
    console.log('Target timeline string not found in', f);
  }

  fs.writeFileSync(f, code, 'utf8');
});
