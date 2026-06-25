const fs = require('fs');
const path = require('path');
const f = path.join(__dirname, '_next/static/chunks/6120-99ba76de6fd208f3.js.eap_patch.bak');
const code = fs.readFileSync(f, 'utf8');

// Find all occurrences of "eh" as a standalone token or function call
// e.g. "eh()" or ",eh" or "eh," or "onClick:eh"
const regex = /[^a-zA-Z0-9]eh[^a-zA-Z0-9]/g;
let match;
while ((match = regex.exec(code)) !== null) {
  console.log(`Match at index ${match.index}:`);
  console.log(code.substring(match.index - 50, match.index + 50));
}
