const fs = require('fs');
const acorn = require('acorn');

const code = fs.readFileSync('_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'utf8');
try {
  acorn.parse(code, { ecmaVersion: 2020 });
  console.log('Syntax is valid!');
} catch (err) {
  console.error('Syntax error at position:', err.pos);
  console.error(code.substring(err.pos - 100, err.pos + 100));
}
