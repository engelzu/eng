const fs = require('fs');
const files = ['_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js'];
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let code = fs.readFileSync(f, 'utf8');
  code = code.replace(');{fast:a', ');let {fast:a');
  fs.writeFileSync(f, code);
  console.log('Fixed ' + f);
}
