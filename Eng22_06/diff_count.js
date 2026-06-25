const fs = require('fs');
const t = fs.readFileSync('original_modal.js', 'utf8');
const startKeyword = '(0,t.jsxs)("div",{className:"p-4 space-y-2.5 max-h-[70vh] overflow-y-auto",children:';
const startIdx = t.indexOf(startKeyword);
const footerKeyword = ',(0,t.jsxs)(s.cN,';
const footerIdx = t.indexOf(footerKeyword, startIdx);

const before = t.substring(0, startIdx);
const inner = t.substring(startIdx, footerIdx);
const after = t.substring(footerIdx);

const getDiff = (str, open, close) => {
  let o=0, c=0;
  for(let i=0; i<str.length; i++) {
    if(str[i]===open) o++;
    if(str[i]===close) c++;
  }
  return o - c;
};

console.log('before:', getDiff(before, '[', ']'));
console.log('inner:', getDiff(inner, '[', ']'));
console.log('after:', getDiff(after, '[', ']'));
