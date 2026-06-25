const fs = require('fs');

console.log('Restoring page copies...');
fs.copyFileSync('c:/Users/user2/Downloads/Eng0906 - Copia/Eng0206/Eng0206/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js', '_next/static/chunks/app/fast/page-5d0c28c966a6b026.js');
fs.copyFileSync('c:/Users/user2/Downloads/Eng0906 - Copia/Eng0206/Eng0206/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js', 'OUT/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js');
console.log('Restored both copies of page');

console.log('Running patch_page.js...');
require('./patch_page.js');
console.log('Done');
