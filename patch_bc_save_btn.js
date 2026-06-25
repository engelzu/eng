const fs = require('fs');

const fileFast = 'c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/507-1cbb4e1ae80f89d3.js';
const fileFastOut = 'c:/Users/user2/Downloads/Eng22_06/Eng22_06/OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js';

for (let f of [fileFast, fileFastOut]) {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    
    let target = '};setShowBcModal(!1);},className:"bg-emerald-600';
    let newLogic = '};setShowBcModal(!1);setTimeout(()=>eC.handleSubmit(eV)(),100);},className:"bg-emerald-600';
    
    if (code.includes(target) && !code.includes('setTimeout(()=>eC.handleSubmit')) {
      code = code.replace(target, newLogic);
      fs.writeFileSync(f, code, 'utf8');
      console.log('Successfully patched SALVAR BUSINESS CASE button in:', f);
    } else {
      console.log('Target not found or already patched in:', f);
    }
  }
}
