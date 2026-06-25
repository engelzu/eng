const fs = require('fs');
const { execSync } = require('child_process');

let code = fs.readFileSync('original_modal.js', 'utf8');

// Find the content body div part
const startKeyword = '(0,t.jsxs)("div",{className:"p-4 space-y-2.5 max-h-[70vh] overflow-y-auto",children:';
const startIdx = code.indexOf(startKeyword);
if (startIdx === -1) {
  console.log('Start keyword not found!');
  process.exit(1);
}

// Find the footer buttons part
const footerKeyword = ',(0,t.jsxs)(s.cN,';
const footerIdx = code.indexOf(footerKeyword, startIdx);
if (footerIdx === -1) {
  console.log('Footer keyword not found!');
  process.exit(1);
}

const tableMarkup = fs.readFileSync('table_markup.txt', 'utf8').trim();

const result = code.substring(0, startIdx) + tableMarkup + code.substring(footerIdx);
fs.writeFileSync('test_patched_modal.js', result, 'utf8');

try {
  execSync('node -c test_patched_modal.js');
  console.log('SUCCESS! The patched modal compiles perfectly.');
} catch (err) {
  console.error('FAILED to compile patched modal:');
  console.error(err.message);
}
// fs.unlinkSync('test_patched_modal.js');
