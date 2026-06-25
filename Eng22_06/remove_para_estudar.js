const fs = require('fs');
const files = [
  '_next/static/chunks/507-1cbb4e1ae80f89d3.js',
  'OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js'
];

const targetStr = `,(0,t.jsx)(j.Ql,{value:"PARA ESTUDAR",children:"PARA ESTUDAR"})`;

for (const f of files) {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    if (code.includes(targetStr)) {
      code = code.replace(targetStr, '');
      fs.writeFileSync(f, code, 'utf8');
      console.log('Removed PARA ESTUDAR from ' + f);
    }
  }
}
