const fs = require('fs');
const file = 'c:/Users/user2/Downloads/Eng0906/Eng0206/Eng0206/_next/static/chunks/507-1cbb4e1ae80f89d3.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  const idx = content.indexOf('fieldName:"general"');
  if (idx !== -1) {
    console.log('Context of general attachment in pristine original file:');
    console.log(content.slice(idx - 100, idx + 200));
  } else {
    console.log('fieldName:"general" not found');
  }
}
