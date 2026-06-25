const fs = require('fs');
const c = fs.readFileSync('_next/static/chunks/6120-99ba76de6fd208f3.js', 'utf8');
console.log('beforeBcSave:', c.includes('beforeBcSave'));
console.log('__bcValues:', c.includes('__bcValues'));
console.log('showBcModal:', c.includes('showBcModal'));
console.log('id:"bc1Objetivo":', c.includes('id:"bc1Objetivo"'));
console.log('FAZER O BUSINESS CASE:', c.includes('FAZER O BUSINESS CASE'));
console.log('Length:', c.length);
