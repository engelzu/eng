const fs = require('fs');
const file = 'c:/Users/user2/Downloads/Eng0906/Eng0206/Eng0206/_next/static/chunks/507-1cbb4e1ae80f89d3.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let idx = content.indexOf('null!=n?n:o');
  if (idx !== -1) {
    console.log('--- Occurrence 1 Context (500 chars before, 300 after) ---');
    console.log(content.slice(idx - 500, idx + 300));
  }
  let idx2 = content.indexOf('open:D,onOpenChange:O');
  if (idx2 !== -1) {
    console.log('--- Occurrence 2 Context (500 chars before, 300 after) ---');
    console.log(content.slice(idx2 - 500, idx2 + 300));
  }
} else {
  console.log('File not found');
}
