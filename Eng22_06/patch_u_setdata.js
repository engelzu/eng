const fs = require('fs');

const fileFast = '_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';
const fileFastOut = 'OUT/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';

for (let f of [fileFast, fileFastOut]) {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    
    const targetU = 'U=(e,s)=>{k(s),e.dataTransfer.effectAllowed="move"}';
    const newU = 'U=(e,s)=>{k(s),e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",s.id||"")}';
    
    if (code.includes(targetU)) {
      code = code.replace(targetU, newU);
      fs.writeFileSync(f, code, 'utf8');
      console.log('Patched U to include setData in:', f);
    }
  }
}
