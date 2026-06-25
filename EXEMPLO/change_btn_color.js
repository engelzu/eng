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

  const oldCode = '(0,t.jsx)(u.z,{size:"sm",variant:"ghost",className:"h-8 px-3 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-black text-[10px] flex items-center gap-1.5 border border-emerald-100 rounded-full",onClick:()=>setShowEapModal(!0),children:"DEFINIR EAP"})';
  
  const newCode = '(0,t.jsx)(u.z,{size:"sm",variant:"ghost",className:"h-8 px-3 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-black text-[10px] flex items-center gap-1.5 border border-blue-200 rounded-full shadow-sm",onClick:()=>setShowEapModal(!0),children:"DEFINIR EAP"})';

  if (code.includes(oldCode)) {
    code = code.replace(oldCode, newCode);
    console.log('Changed DEFINIR EAP color to blue in', f);
    fs.writeFileSync(f, code, 'utf8');
  } else {
    console.log('Target string not found in', f);
  }
});
