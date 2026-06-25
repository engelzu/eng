const fs = require('fs');
let code = fs.readFileSync('generate_markup.js', 'utf8');

const oldStr = '"CRONOGRAMA E VALORES EAP " + (r.id ? " - ID #" + r.id : "") + (r.nomeDaIniciativa ? " - " + r.nomeDaIniciativa : r.title ? " - " + r.title : r.name ? " - " + r.name : "")';
const newStr = '"CRONOGRAMA E VALORES EAP " + (r.code ? " - Código #" + r.code : "") + (r.nomeDaIniciativa ? " - " + r.nomeDaIniciativa : r.title ? " - " + r.title : r.name ? " - " + r.name : "")';

code = code.replace(oldStr, newStr);

fs.writeFileSync('generate_markup.js', code);
console.log('Replaced title in generate_markup.js to use r.code');
