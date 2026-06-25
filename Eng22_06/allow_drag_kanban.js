const fs = require('fs');

const fileFast = '_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';
const fileFastOut = 'OUT/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';

for (let f of [fileFast, fileFastOut]) {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    
    // Replace draggable restriction
    const draggableRegex = /draggable:\(null==n\?void 0:n\.role\)==="admin"\|\|\(null==n\?void 0:n\.role\)==="gerente"/g;
    if (draggableRegex.test(code)) {
      code = code.replace(draggableRegex, 'draggable:!0');
      console.log('Removed draggable restriction in:', f);
    }
    
    // Replace U function block restriction
    const uRegex = /if\(\(null==n\?void 0:n\.role\)!=="admin"&&\(null==n\?void 0:n\.role\)!=="gerente"\)\{e\.preventDefault\(\);return\}/g;
    if (uRegex.test(code)) {
      code = code.replace(uRegex, '');
      console.log('Removed U function role restriction in:', f);
    }

    // Replace CSS cursor/hover restriction (there was a conditional hover class for admin/gerente)
    const hoverRegex = /\(null==n\?void 0:n\.role\)==="admin"\|\|\(null==n\?void 0:n\.role\)==="gerente"\?"hover:border-primary\/50":""/g;
    if (hoverRegex.test(code)) {
      code = code.replace(hoverRegex, '"hover:border-primary/50"');
      console.log('Removed hover restriction in:', f);
    }

    fs.writeFileSync(f, code, 'utf8');
  }
}
