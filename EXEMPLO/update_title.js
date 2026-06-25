const fs = require('fs');
let code = fs.readFileSync('generate_markup.js', 'utf8');

code = code.replace('"CRONOGRAMA E VALORES EAP"', '"CRONOGRAMA E VALORES EAP " + (r.id ? " - ID #" + r.id : "") + (r.nomeDaIniciativa ? " - " + r.nomeDaIniciativa : r.title ? " - " + r.title : r.name ? " - " + r.name : "")');

fs.writeFileSync('generate_markup.js', code);
console.log('Replaced title in generate_markup.js');
