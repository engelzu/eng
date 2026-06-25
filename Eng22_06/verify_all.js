const fs = require('fs');
const code = fs.readFileSync('_next/static/chunks/6120-99ba76de6fd208f3.js', 'utf8');
console.log('Button:', code.includes('FAZER O BUSINESS CASE DIGITAL'));
console.log('State:', code.includes('bcAvaliacaoMesAno'));
console.log('Modal:', code.includes('BUSINESS CASE DIGITAL " + (r.code'));
