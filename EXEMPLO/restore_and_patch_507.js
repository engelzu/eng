const fs = require('fs');

console.log('Restoring 507 copies...');
fs.copyFileSync('c:/Users/user2/Downloads/Eng0906 - Copia/Eng0206/Eng0206/_next/static/chunks/507-1cbb4e1ae80f89d3.js', '_next/static/chunks/507-1cbb4e1ae80f89d3.js');
fs.copyFileSync('c:/Users/user2/Downloads/Eng0906 - Copia/Eng0206/Eng0206/_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js');
console.log('Restored both copies of 507');

console.log('Running patch_507_fixed.js...');
require('./patch_507_fixed.js');
console.log('Done');
