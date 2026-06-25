const fs = require('fs');
const code = fs.readFileSync('C:/Users/Admin/Downloads/Eng0206/Eng0206/_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'utf8');
const idx = code.indexOf('fieldName:"general"');
if (idx >= 0) {
  console.log('Found index:', idx);
  console.log(code.substring(idx - 150, idx + 150));
} else {
  console.log('Not found');
}
