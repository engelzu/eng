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

  const oldGutBadge = ',(0,t.jsx)("div",{className:"ml-auto",children:(0,t.jsx)(f.C,{className:"bg-emerald-600 hover:bg-emerald-700 uppercase text-[10px] font-black tracking-widest px-4 py-1 rounded-full shadow-sm",children:q.status})})';
  
  const oldCodigo = '(0,t.jsxs)("div",{children:[(0,t.jsx)(g._,{className:"text-[9px] text-muted-foreground uppercase font-black tracking-tighter",children:"C\\xf3digo"}),(0,t.jsxs)("p",{className:"font-black text-lg text-emerald-950",children:["#",q.code]})]})';
  
  const newCodigo = '(0,t.jsxs)("div",{children:[(0,t.jsx)(g._,{className:"text-[9px] text-muted-foreground uppercase font-black tracking-tighter",children:"C\\xf3digo"}),(0,t.jsxs)("div",{className:"flex items-center gap-2 mt-0.5",children:[(0,t.jsxs)("p",{className:"font-black text-lg text-emerald-950 leading-none",children:["#",q.code]}),(0,t.jsx)(f.C,{className:"bg-emerald-600 hover:bg-emerald-700 uppercase text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full shadow-sm text-white",children:q.status})]})]})';

  if (code.includes(oldGutBadge) && code.includes(oldCodigo)) {
    code = code.replace(oldGutBadge, '');
    code = code.replace(oldCodigo, newCodigo);
    console.log('Moved status badge in', f);
    fs.writeFileSync(f, code, 'utf8');
  } else {
    console.log('Target strings not found in', f);
    if (!code.includes(oldGutBadge)) console.log('Could not find oldGutBadge');
    if (!code.includes(oldCodigo)) console.log('Could not find oldCodigo');
  }
});
