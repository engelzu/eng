const fs = require('fs');
const t = fs.readFileSync('original_modal.js', 'utf8');
const startKeyword = '(0,t.jsxs)("div",{className:"p-4 space-y-2.5 max-h-[70vh] overflow-y-auto",children:';
const startIdx = t.indexOf(startKeyword);
const footerKeyword = ',(0,t.jsxs)(s.cN,';
const footerIdx = t.indexOf(footerKeyword, startIdx);
const inner = t.substring(startIdx, footerIdx);
console.log('START:', inner.substring(0, 100));
console.log('END:', inner.substring(inner.length - 100));
