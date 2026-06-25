const fs = require('fs');
const content = fs.readFileSync('_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'utf8');
const idx = content.indexOf('SAIR SEM SALVAR');
if (idx !== -1) {
  console.log('Found SAIR SEM SALVAR context:');
  console.log(content.substring(idx - 300, idx + 200));
} else {
  console.log('SAIR SEM SALVAR not found!');
}
