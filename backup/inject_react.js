const fs = require('fs');
const files = ['_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js'];
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let code = fs.readFileSync(f, 'utf8');
  if (!code.includes('var React_507=r;')) {
    code = code.replace('return isNaN(s.getTime())?null:s};function X(e){', 'return isNaN(s.getTime())?null:s};var React_507=r;function X(e){');
    fs.writeFileSync(f, code);
    console.log('Fixed React_507 injection in ' + f);
  }
}
