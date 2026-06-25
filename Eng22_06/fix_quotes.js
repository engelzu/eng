const fs = require('fs');
let code = fs.readFileSync('generate_markup.js', 'utf8');
code = code.replace(/dist\['\$\{row\.id\}'\]/g, 'dist[\\\"${row.id}\\\"]');
code = code.replace(/\{\.\.\.dist,\['\$\{row\.id\}'\]/g, '{...dist,[\\\"${row.id}\\\"]');
fs.writeFileSync('generate_markup.js', code);
console.log('Fixed quotes in generate_markup.js');
