const fs = require('fs');
const filePath = 'OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js';
let code = fs.readFileSync(filePath, 'utf8');

const modalStart = ',(0,t.jsx)(ModalLibrary_507.Vq,{open:showBcModal';
const startIdx = code.indexOf(modalStart);

if (startIdx < 0) {
  console.log('OUT: modal not found by main pattern');
  // Try alternative patterns
  const alt1 = ',(0,t.jsx)(s.Vq,{open:showBcModal';
  const idx1 = code.indexOf(alt1);
  if (idx1 >= 0) {
    console.log('OUT: found alt pattern at', idx1);
    // Handle the removal similarly
  } else {
    console.log('OUT: no modal found at all');
  }
  process.exit(0);
}

console.log('OUT: found at', startIdx);
const firstClose = code.indexOf(')', startIdx + 2);
const argStart = firstClose + 1;

let depth = 0, endIdx = argStart, inStr = false, strChar = null;
for (let i = argStart; i < code.length; i++) {
  const ch = code[i];
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

const modalCode = code.substring(startIdx, endIdx);
console.log('OUT: modal length:', modalCode.length);
console.log('OUT: ends:', modalCode.substring(Math.max(0, modalCode.length-30)));

if (!modalCode.includes('SALVAR BUSINESS CASE')) {
  console.log('OUT: WARNING - modal does not contain SALVAR');
  process.exit(0);
}

const newCode = code.substring(0, startIdx) + code.substring(endIdx);
fs.writeFileSync(filePath, newCode);
console.log('OUT: saved, length:', newCode.length);

// Clean up
let c2 = fs.readFileSync(filePath, 'utf8');
c2 = c2.replace(/let \[showBcModal,setShowBcModal\]=\d+,[a-z]\.useState\)\(!1\),/g, '');
c2 = c2.replace(/window\.beforeBcSave\&\&window\.beforeBcSave\(\)[,;]?\s*/g, '');
c2 = c2.replace(/,?\.\.\.window\.__bcValues\|\|{}\s*/g, '');
fs.writeFileSync(filePath, c2);
console.log('OUT: cleaned, length:', c2.length);
