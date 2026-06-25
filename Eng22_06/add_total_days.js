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

  const targetStr = '(0,t.jsxs)("p",{className:"text-[10px] font-bold text-slate-700",children:[(0,t.jsx)("span",{className:"text-muted-foreground uppercase text-[9px] mr-1",children:"Custo Total:"}),new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format((parseFloat(engCusto)||0)+(parseFloat(matCusto)||0)+(parseFloat(serCusto)||0)+(parseFloat(equCusto)||0))]})';
  
  const replacementStr = targetStr + ',(0,t.jsxs)("p",{className:"text-[10px] font-bold text-slate-700",children:[(0,t.jsx)("span",{className:"text-muted-foreground uppercase text-[9px] mr-1",children:"Total em Dias:"}),(()=>{let ds=[engInicio,engTermino,matInicio,matTermino,serInicio,serTermino,equInicio,equTermino].filter(Boolean).map(d=>new Date(d).getTime()).filter(t=>!isNaN(t));if(!ds.length)return"-";return Math.ceil((Math.max(...ds)-Math.min(...ds))/(1000*60*60*24))+" dias"})()]})';

  if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacementStr);
    console.log('Added total days to', f);
    fs.writeFileSync(f, code, 'utf8');
  } else {
    console.log('Target string not found in', f);
  }
});
