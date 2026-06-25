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

  // Fix 2: Close the GUT block and outer div correctly without double commas
  const brokenSyntax2 = ']}),,(0,t.jsxs)("div",{children:[(0,t.jsx)(g._,{className:"text-[9px] text-muted-foreground uppercase f';
  const fixedSyntax2 = ']}),(0,t.jsxs)("div",{children:[(0,t.jsx)(g._,{className:"text-[9px] text-muted-foreground uppercase f';

  if (code.includes(brokenSyntax2)) {
    code = code.replace(brokenSyntax2, fixedSyntax2);
    console.log('Fixed brokenSyntax2 in', f);
  } else {
    console.log('Not found in', f);
  }

  fs.writeFileSync(f, code, 'utf8');
});
