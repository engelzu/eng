const fs = require('fs');
let c = fs.readFileSync('patch_eap_tree.js', 'utf8');
c = c.replace('shadow-sm\"})})]})]})]})})]})})', 'shadow-sm\"})})]})]})]})})]})');
fs.writeFileSync('patch_eap_tree.js', c);
console.log('Fixed patch_eap_tree.js successfully.');
