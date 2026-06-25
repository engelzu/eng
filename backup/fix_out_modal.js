const fs = require('fs');
const c = fs.readFileSync('OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'utf8');

const pat = ',(0,t.jsx)()(ModalLibrary_507.Vq,{open:showBcModal';
const start = c.indexOf(pat);
console.log('Pattern at:', start);

// Pattern: ,(0,t.jsx)()(ModalLibrary_507.Vq,{open:showBcModal
// pos 0: ,  1-9: (0,t.jsx)  10: (  11: )  12: (  13+: ModalLibrary...
const argStart = start + 12; // position of ( before ModalLibrary
console.log('Arg start at:', argStart, 'char:', c[argStart]);

let depth = 0, endIdx = argStart;
let inStr = false, strChar = null;
for (let i = argStart; i < c.length; i++) {
  const ch = c[i];
  if (inStr) {
    if (ch === '\\') { i++; continue; }
    if (ch === strChar) inStr = false;
    continue;
  }
  if (ch === '"' || ch === "'" || ch === '`') { inStr = true; strChar = ch; continue; }
  if (ch === '(' || ch === '[' || ch === '{') depth++;
  if (ch === ')' || ch === ']' || ch === '}') depth--;
  if (depth === 0 && i > argStart) { endIdx = i + 1; break; }
}

const modal = c.substring(start, endIdx);
console.log('Modal length:', modal.length);
console.log('Ends:', modal.substring(Math.max(0, modal.length-30)));
console.log('Has SALVAR:', modal.includes('SALVAR BUSINESS CASE'));
console.log('After:', c.substring(endIdx, Math.min(endIdx+30, c.length)));

if (modal.includes('SALVAR BUSINESS CASE')) {
  let newCode = c.substring(0, start) + c.substring(endIdx);
  fs.writeFileSync('OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js', newCode);
  console.log('Saved, new length:', newCode.length);
  console.log('showBcModal refs:', (newCode.match(/showBcModal/g) || []).length);
}
