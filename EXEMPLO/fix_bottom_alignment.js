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

  const oldCode = 'className:"p-4 bg-emerald-50/50 border-t border-emerald-100 shrink-0 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_-4px_20px_-5px_rgba(16,185,129,0.1)]"';
  const newCode = 'className:"px-6 py-4 bg-emerald-50/50 border-t border-emerald-100 shrink-0 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_-4px_20px_-5px_rgba(16,185,129,0.1)]"';

  if (code.includes(oldCode)) {
    code = code.replace(oldCode, newCode);
    console.log('Fixed alignment in', f);
    fs.writeFileSync(f, code, 'utf8');
  } else {
    console.log('Target string not found in', f);
  }
});
