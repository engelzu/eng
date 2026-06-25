const fs = require('fs');
const file = 'c:/Users/user2/Downloads/Eng0906/Eng0206/Eng0206/_next/static/chunks/507-1cbb4e1ae80f89d3.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  const startIdx = content.indexOf('name:"title"');
  const endIdx = content.indexOf('name:"managerArea"');
  if (startIdx !== -1 && endIdx !== -1) {
    const slice = content.slice(startIdx, endIdx);
    console.log('--- START OF SLICE (first 300 chars) ---');
    console.log(slice.slice(0, 300));
    console.log('--- END OF SLICE (last 300 chars) ---');
    console.log(slice.slice(-300));
  }
}
