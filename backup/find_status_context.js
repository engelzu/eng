const fs = require('fs');
const content = fs.readFileSync('_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'utf8');

const target = 'name:"status"';
const idx = content.indexOf(target);
if (idx !== -1) {
  console.log('Found name:"status" at index', idx);
  console.log('Context:', content.substring(idx - 100, idx + 500));
} else {
  console.log('name:"status" not found');
}
