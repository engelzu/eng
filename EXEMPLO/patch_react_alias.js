const fs = require('fs');
const files = ['_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js'];
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let code = fs.readFileSync(f, 'utf8');
  // Insert alias for React at start of module definition
  code = code.replace(/var t=a\(57437\),r=a\(2265\),/, 'var t=a(57437),r=a(2265),React_507=r,');
  // Replace all r.useRef and r.useState with React_507
  code = code.replace(/\(0,r\.useRef\)/g, '(0,React_507.useRef)');
  code = code.replace(/\(0,r\.useState\)/g, '(0,React_507.useState)');
  // Also replace plain r. if any remains in destructuring
  code = code.replace(/r\./g, 'React_507.');
  fs.writeFileSync(f, code);
  console.log('Patched React alias in ' + f);
}
