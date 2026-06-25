const fs = require('fs');
let code = fs.readFileSync('generate_markup.js', 'utf8');
code = code.replace('confirmModal + ",(0,t.jsxs)(s.cN,', 'confirmModal + "(0,t.jsxs)(s.cN,');
code = code.replace('}))},";', '))),";');
fs.writeFileSync('generate_markup.js', code);
console.log('Fixed double commas');
