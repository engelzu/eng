const fs = require('fs');
const { execSync } = require('child_process');

let text = fs.readFileSync('table_markup_fixed.txt', 'utf8');
// text ends with `})})]})]})]})})]})`
// We want to remove the last `]})` so that the main inner div's children array remains open.
text = text.substring(0, text.lastIndexOf(']})'));

let code = fs.readFileSync('original_modal.js', 'utf8');
const startKeyword = '(0,t.jsxs)("div",{className:"p-4 space-y-2.5 max-h-[70vh] overflow-y-auto",children:';
const startIdx = code.indexOf(startKeyword);
const footerKeyword = ',(0,t.jsxs)(s.cN,';
const footerIdx = code.indexOf(footerKeyword, startIdx);

const result = code.substring(0, startIdx) + text + code.substring(footerIdx);
fs.writeFileSync('test_patched_modal.js', result, 'utf8');

try {
  execSync('node -c test_patched_modal.js');
  console.log('SUCCESS! The patched modal compiles perfectly.');
} catch (err) {
  console.error('FAILED to compile patched modal:');
  console.error(err.message);
}
