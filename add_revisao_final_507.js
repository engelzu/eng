const fs = require('fs');

const file507 = 'c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/507-1cbb4e1ae80f89d3.js';
const file507Out = 'c:/Users/user2/Downloads/Eng22_06/Eng22_06/OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

for (let f of [file507, file507Out]) {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    
    // Add to dropdown (if not already there)
    const targetDropdown = `(0,t.jsx)(j.Ql,{value:"AGUARDANDO APROVAÇÃO",children:"AGUARDANDO APROVAÇÃO"})`;
    const newDropdown = `(0,t.jsx)(j.Ql,{value:"REVISÃO FINAL",children:"REVISÃO FINAL"}),` + targetDropdown;
    if (code.includes(targetDropdown) && !code.includes('value:"REVISÃO FINAL"')) {
      code = code.replace(new RegExp(escapeRegExp(targetDropdown), 'g'), newDropdown);
    }

    fs.writeFileSync(f, code, 'utf8');
    console.log('Patched 507 dropdown:', f);
  }
}
