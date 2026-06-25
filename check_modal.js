const fs = require('fs');
const code507 = fs.readFileSync('c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'utf8');
const code6120 = fs.readFileSync('c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/6120-99ba76de6fd208f3.js', 'utf8');
console.log('507 has BUSINESS CASE DIGITAL modal:', code507.includes('BUSINESS CASE DIGITAL "'));
console.log('6120 has BUSINESS CASE DIGITAL modal:', code6120.includes('BUSINESS CASE DIGITAL "'));

console.log('507 button:', code507.substring(code507.indexOf('FAZER O BUSINESS CASE DIGITAL') - 300, code507.indexOf('FAZER O BUSINESS CASE DIGITAL') + 100));
console.log('6120 button:', code6120.substring(code6120.indexOf('FAZER O BUSINESS CASE DIGITAL') - 300, code6120.indexOf('FAZER O BUSINESS CASE DIGITAL') + 100));
