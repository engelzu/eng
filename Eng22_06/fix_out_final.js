const fs = require('fs');
const filePath = 'OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js';
let code = fs.readFileSync(filePath, 'utf8');
console.log('Length:', code.length);

// The current pattern is: ,(0,t.jsx)()(ModalLibrary_507.Vq,{open:showBcModal
// We need to find the matching ) that closes this call

// Find showBcModal reference in JSX
const modalPattern = '(ModalLibrary_507.Vq,{open:showBcModal';
const startIdx = code.indexOf(modalPattern);
if (startIdx < 0) {
  console.log('Pattern not found');
  process.exit(0);
}

// Go backwards to find the ,(0,t.jsx) part
const before = code.substring(Math.max(0, startIdx-50), startIdx);
console.log('Before:', before.substring(before.length-30));

// Find the actual start by looking for ,(0,t.jsx) before the ModalLibrary pattern
// The structure should be ,(0,t.jsx)(ModalLibrary_507.Vq,{open:showBcModal...})
// Or corrupted: ,(0,t.jsx)()(ModalLibrary_507.Vq,{open:showBcModal...})

// Find the very first '(' that starts the (0, pattern or the call
let callStart = startIdx;
// Go back looking for ,(0,t to find start of expression
const commaIdx = code.lastIndexOf(',(0,t', startIdx);
if (commaIdx >= 0) {
  callStart = commaIdx;
  console.log('Found call start at', commaIdx, ':', code.substring(commaIdx, commaIdx+20));
} else {
  // Try alternative - maybe the pattern has extra parens
  const commaIdx2 = code.lastIndexOf(',', startIdx);
  callStart = commaIdx2;
  console.log('No (0,t pattern found, using comma at', commaIdx2);
}

// Now find the matching close. The structure is ,(0,t.jsx)(...args...) for the close
// or ,(0,t.jsx)()(...args...) for corrupted version
// Either way, find the ( that starts the argument list

// Find the opening paren of the argument call
let argStart = callStart;
// Skip past ,(0,t.jsx) - find the ( that's the first call opening
// Pattern: ,(0,t.jsx)___(
// The last '(' before startIdx that has matching ')' after it

// Simple approach: start from startIdx and go backward to find the matching '('
// Actually easier: the structure is: ,(0,t.jsx)(... or ,(0,t.jsx)()(...
// The argument list starts at the LAST '(' before the ModalLibrary pattern
// that is NOT inside a string

let parenDepth = 0;
let found = false;
let searchStart = startIdx;
while (searchStart > 0) {
  const ch = code[searchStart];
  if (ch === ')') parenDepth++;
  else if (ch === '(') {
    if (parenDepth === 0) {
      argStart = searchStart + 1; // the arg list starts after this '('
      console.log('Found arg list start at', argStart, 'char:', code[argStart]);
      // Verify it's the right one - check if ModalLibrary follows
      if (code.substring(argStart).startsWith('ModalLibrary_507.Vq,')) {
        found = true;
        break;
      }
    }
    parenDepth--;
  }
  searchStart--;
}

if (!found) {
  console.log('Could not find proper arg start');
  process.exit(0);
}

// Now count brackets from argStart to find the matching close
let depth = 0;
let endIdx = argStart;
let inStr = false;
let strChar = null;

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

const modal = code.substring(callStart, endIdx);
console.log('Modal length:', modal.length);
console.log('Starts:', modal.substring(0, 30));
console.log('Ends:', modal.substring(Math.max(0, modal.length-30)));

if (!modal.includes('SALVAR BUSINESS CASE')) {
  console.log('WARNING: SALVAR not found in modal');
  // Try again with a slightly different start
  process.exit(0);
}

code = code.substring(0, callStart) + code.substring(endIdx);
console.log('Removed modal. New length:', code.length);

// Clean up remaining references
code = code.replace(/let \[showBcModal,setShowBcModal\]=\d+,[a-z]+\.\w+\)\(!1\),/g, '');
code = code.replace(/window\.beforeBcSave\&\&window\.beforeBcSave\(\)[,;]?\s*/g, '');
code = code.replace(/,?\.\.\.window\.__bcValues\|\|{}\s*/g, '');

console.log('Final check:');
console.log('  showBcModal:', (code.match(/showBcModal/g) || []).length);
console.log('  open:showBcModal:', (code.match(/open:showBcModal/g) || []).length);

fs.writeFileSync(filePath, code);
console.log('Saved:', code.length);
