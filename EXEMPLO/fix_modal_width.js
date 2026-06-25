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

  // Fix modal width
  code = code.replace('className:"max-w-xl border-emerald-500"', 'className:"max-w-3xl border-emerald-500"');
  
  // If we want to make the inputs even smaller (e.g., max-width on inputs) we can add an outer class, but 3xl should limit them nicely!
  // Right now they are flex w-full.

  fs.writeFileSync(f, code, 'utf8');
});
