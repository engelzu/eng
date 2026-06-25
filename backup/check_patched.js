const fs = require('fs');
const file = 'c:/Users/user2/Downloads/Eng0906/Eng0206/Eng0206/_next/static/chunks/507-1cbb4e1ae80f89d3.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let idx = content.indexOf('.Vq');
  while (idx !== -1) {
    console.log('--- Occurrence of .Vq ---');
    console.log(content.slice(idx - 50, idx + 100));
    idx = content.indexOf('.Vq', idx + 1);
  }
} else {
  console.log('File not found');
}
