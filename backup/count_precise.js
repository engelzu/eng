const fs = require('fs');

const t = fs.readFileSync('original_modal.js', 'utf8');
const startKeyword = '(0,t.jsxs)("div",{className:"p-4 space-y-2.5 max-h-[70vh] overflow-y-auto",children:';
const startIdx = t.indexOf(startKeyword);
const footerKeyword = ',(0,t.jsxs)(s.cN,';
const footerIdx = t.indexOf(footerKeyword, startIdx);

const inner = t.substring(startIdx, footerIdx);

let o = 0, c = 0;
for(let i=0; i<inner.length; i++) {
  if(inner[i]==='[') o++;
  if(inner[i]===']') c++;
}
console.log('[', o, c);

let openArrayCount = 0;
for(let i=0; i<inner.length; i++) {
  if(inner[i]==='[') openArrayCount++;
  if(inner[i]===']') openArrayCount--;
}
console.log('Unclosed [ at end of inner:', openArrayCount);

if (openArrayCount !== 0) {
  console.log("Inner ends with:", inner.substring(inner.length - 20));
}
