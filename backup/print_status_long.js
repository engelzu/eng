const fs = require('fs');
const content = fs.readFileSync('_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'utf8');

const target = 'name:"status"';
const idx = content.indexOf(target);
if (idx !== -1) {
  console.log('Context (2000 chars):');
  console.log(content.substring(idx - 100, idx + 2000));
}
