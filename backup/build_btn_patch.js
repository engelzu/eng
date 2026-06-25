const fs = require('fs');

const triggerBcBtn = "(0,t.jsxs)(u.z,{onClick:()=>setShowBcModal(!0),variant:\\\"outline\\\",size:\\\"sm\\\",className:\\\"h-7 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[9px] flex items-center gap-1 border border-indigo-700 shadow-sm uppercase tracking-wider rounded-full\\\",children:[(0,t.jsx)(N.Z,{className:\\\"h-3.5 w-3.5 text-white\\\"}),\\\"FAZER O BUSINESS CASE DIGITAL\\\"]})";

const scriptCode = `
const fs = require('fs');
const files = [
  '_next/static/chunks/6120-99ba76de6fd208f3.js',
  'OUT/_next/static/chunks/6120-99ba76de6fd208f3.js'
];

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let code = fs.readFileSync(f, 'utf8');

  // Inject Button
  const searchFor = 'CARREGAR BUSINESS CASE"]}),(0,t.jsxs)(u.z,{size:"sm",variant:"ghost",className:"h-7 px-2 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-black text-[9px] flex items-center gap-1 border border-emerald-100 rounded-full",onClick:()';
  
  if (code.includes(searchFor) && !code.includes('FAZER O BUSINESS CASE DIGITAL')) {
    const replacement = 'CARREGAR BUSINESS CASE"]}),(0,t.jsxs)("div",{className:"flex gap-2 items-center",children:[${triggerBcBtn},(0,t.jsxs)(u.z,{size:"sm",variant:"ghost",className:"h-7 px-2 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-black text-[9px] flex items-center gap-1 border border-emerald-100 rounded-full",onClick:()';
    code = code.replace(searchFor, replacement);
    // Wait, the new div needs to be closed. The original button is closed by \`...])\` somewhere.
    // Actually, (0,t.jsxs)("div",{className:"...",children:[ BUTTON1, BUTTON2 ]})
    // BUTTON2 is (0,t.jsxs)(u.z, {...
    // Instead of parsing perfectly, I can just replace the ANEXAR text to inject the closing tag.
    code = code.replace('"ANEXAR"]})', '"ANEXAR"]})]})');
    console.log('Injected Button');
  }

  fs.writeFileSync(f, code);
}
`;

fs.writeFileSync('patch_btn.js', scriptCode);
console.log('Built patch_btn.js');
