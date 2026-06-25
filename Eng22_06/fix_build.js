const fs = require('fs');
let code = fs.readFileSync('build_bc_patch.js', 'utf8');

code = code.replace(/const modalTarget = '.*';/g, "const modalTarget = ',(0,t.jsx)(s.Vq,{open:showEapModal,';");
code = code.replace("code = code.replace(modalTarget, '${modalMarkup},' + modalTarget);", "code = code.replace(modalTarget, '${modalMarkup}' + modalTarget);");

fs.writeFileSync('build_bc_patch.js', code);
console.log('Updated build script safely');
