const fs = require('fs');
const file = 'c:/Users/user2/Downloads/Eng0906/Eng0206/Eng0206/_next/static/chunks/507-1cbb4e1ae80f89d3.js';
if (fs.existsSync(file)) {
  const code = fs.readFileSync(file, 'utf8');
  const stateRegex = /function X\(e\)\{var s;[\s\S]*?let\s*?\{\s*?fast\s*?:\s*?a/;
  console.log('Matches regex:', stateRegex.test(code));
  if (stateRegex.test(code)) {
    console.log('Match:', code.match(stateRegex)[0]);
  }
}
