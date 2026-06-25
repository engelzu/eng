const fs = require('fs');

console.log('Restoring 6120 copies...');
fs.copyFileSync('c:/Users/user2/Downloads/Eng0906 - Copia/Eng0206/Eng0206/_next/static/chunks/6120-99ba76de6fd208f3.js', '_next/static/chunks/6120-99ba76de6fd208f3.js');
fs.copyFileSync('c:/Users/user2/Downloads/Eng0906 - Copia/Eng0206/Eng0206/_next/static/chunks/6120-99ba76de6fd208f3.js', 'OUT/_next/static/chunks/6120-99ba76de6fd208f3.js');
console.log('Restored both copies');

console.log('Running patch_bc.js...');
require('./patch_bc.js');
console.log('Done');
