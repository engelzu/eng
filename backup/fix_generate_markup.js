const fs = require('fs');

let code = fs.readFileSync('generate_markup.js', 'utf8');

// I will just replace the line that appends the footer and closes everything.
// The old line was:
// markup += `]})]})]}),(0,t.jsxs)(s.cN,{children:[(0,t.jsx)(u.z,{variant:"outline",onClick:()=>setShowEapModal(!1),className:"rounded-xl font-black text-xs tracking-widest",children:"FECHAR"}),(0,t.jsx)(u.z,{onClick:()=>setShowEapModal(!1),className:"bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs tracking-widest",children:"APLICAR"})]})]})})`;

const correctEnd = 'markup += `]})]})})]}),(0,t.jsxs)(s.cN,{children:[(0,t.jsx)(u.z,{variant:"outline",onClick:()=>setShowEapModal(!1),className:"rounded-xl font-black text-xs tracking-widest",children:"FECHAR"}),(0,t.jsx)(u.z,{onClick:()=>setShowEapModal(!1),className:"bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs tracking-widest",children:"APLICAR"})]})]})})`;';

code = code.replace(/markup \+\= \`\]\}\)\]\}\)\]\}\)\,.*?\]\}\)\]\}\)\}\)\`\;/s, correctEnd);

fs.writeFileSync('generate_markup.js', code);
console.log('Fixed generate_markup.js');
