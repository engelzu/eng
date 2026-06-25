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

  // Fix 1: Close the inner div correctly before opening the GUT block
  const brokenSyntax1 = 'children:q.managerArea||"-"})]})],(0,t.jsxs)("div",{className:"flex items-center gap-4 bg-emerald-50/30 px-4 py-1.5 rounded-xl border border-emerald-100/50 mt-1 md:mt-0"';
  const fixedSyntax1 = 'children:q.managerArea||"-"})]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-4 bg-emerald-50/30 px-4 py-1.5 rounded-xl border border-emerald-100/50 mt-1 md:mt-0"';
  
  if (code.includes(brokenSyntax1)) {
    code = code.replace(brokenSyntax1, fixedSyntax1);
    console.log('Fixed brokenSyntax1 in', f);
  }

  // Fix 2: Close the GUT block and outer div correctly without double commas
  const brokenSyntax2 = 'children:q.gut||1})]})]})]}),,(0,t.jsxs)("div",{children:[(0,t.jsx)(g._,{className:"text-[9px] text-muted-foreground uppercase font-black"';
  const fixedSyntax2 = 'children:q.gut||1})]})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)(g._,{className:"text-[9px] text-muted-foreground uppercase font-black"';

  if (code.includes(brokenSyntax2)) {
    code = code.replace(brokenSyntax2, fixedSyntax2);
    console.log('Fixed brokenSyntax2 in', f);
  }
  
  const brokenSyntax3 = 'children:q.gut||1})]})]})]}),,(0,t.jsxs)("div",{children:[(0,t.jsx)(g._,{className:"text-[9"';
  const fixedSyntax3 = 'children:q.gut||1})]})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)(g._,{className:"text-[9"';

  if (code.includes(brokenSyntax3)) {
    code = code.replace(brokenSyntax3, fixedSyntax3);
    console.log('Fixed brokenSyntax3 in', f);
  }

  fs.writeFileSync(f, code, 'utf8');
});
