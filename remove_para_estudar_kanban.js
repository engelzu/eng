const fs = require('fs');

const fileFast = 'c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';
const fileFastOut = 'c:/Users/user2/Downloads/Eng22_06/Eng22_06/OUT/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';

for (let f of [fileFast, fileFastOut]) {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    
    // Remove the Kanban Column for PARA ESTUDAR
    // It looks like: {title:"PARA ESTUDAR",statuses:["PARA ESTUDAR"],icon:b.Z,color:"bg-blue-100 text-blue-700 border-blue-200",headerColor:"bg-blue-500"},
    // We can use a regex to match the object.
    const kanbanColumnRegex = /\{title:"PARA ESTUDAR",statuses:\["PARA ESTUDAR"\],[^}]+\},/g;
    
    if (kanbanColumnRegex.test(code)) {
      code = code.replace(kanbanColumnRegex, '');
      fs.writeFileSync(f, code, 'utf8');
      console.log('Removed PARA ESTUDAR column from:', f);
    } else {
      console.log('PARA ESTUDAR column not found in:', f);
    }
  }
}
