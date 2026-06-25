const fs = require('fs');
const content = fs.readFileSync('_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'utf8');

const target = 'name:"status"';
const idx = content.indexOf(target);
if (idx !== -1) {
  console.log('Context (before 600 chars):');
  console.log(content.substring(idx - 600, idx + 100));
}
