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

  const target = 'variant:"ghost",className:"h-8 px-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-[10px] flex items-center gap-1.5 border border-amber-400 rounded-full shadow-sm"';
  const replacement = 'variant:"ghost",className:"h-8 px-3 text-amber-600 hover:bg-amber-50 hover:text-amber-700 font-black text-[10px] flex items-center gap-1.5 border border-amber-200 rounded-full shadow-sm"';

  if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(f, code, 'utf8');
    console.log('Fixed button color in', f);
  } else {
    console.log('Target string not found in', f);
  }
});
