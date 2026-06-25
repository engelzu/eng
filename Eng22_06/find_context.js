const fs = require('fs');
const content = fs.readFileSync('_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'utf8');

const target1 = 'MODELO CONT';
const idx1 = content.indexOf(target1);
if (idx1 !== -1) {
  console.log('Found MODELO CONT at index', idx1);
  console.log('Context:', content.substring(idx1 - 100, idx1 + 1000));
} else {
  console.log('MODELO CONT not found');
}

const target2 = 'open:showCapexModal';
const idx2 = content.indexOf(target2);
if (idx2 !== -1) {
  console.log('Found open:showCapexModal at index', idx2);
  console.log('Context:', content.substring(idx2 - 100, idx2 + 1000));
} else {
  console.log('open:showCapexModal not found');
}
