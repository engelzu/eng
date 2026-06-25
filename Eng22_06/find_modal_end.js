const fs = require('fs');
const code = fs.readFileSync('_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'utf8');

const needle = ',(0,t.jsx)(ModalLibrary_507.Vq,{open:showBcModal';
const startIdx = code.indexOf(needle);
if (startIdx < 0) { console.log('Modal not found'); process.exit(0); }

console.log('Start index:', startIdx);

// The expression is: ,(0,t.jsx)(ModalLibrary_507.Vq,{...})
// The pattern is always ,(0,someVar.someMethod)(arg1, arg2, ...)
// The first (0,someVar.someMethod) is a function reference
// The second (...) is the function call
// We need to find the matching ) for the second (
// So we skip the first (0, ...) group

// Find the first ) after (0
const firstCloseParen = code.indexOf(')', startIdx + 2);
console.log('First close paren after start:', firstCloseParen, 'char:', code[firstCloseParen]);

// The second ( should be right after the first )
const secondOpenParen = firstCloseParen + 1;
console.log('Second open paren at:', secondOpenParen, 'char:', code[secondOpenParen]);

// Now count brackets from the second (
let depth = 0;
let pos = secondOpenParen;
let inStr = false;
let strChar = null;

for (let i = secondOpenParen; i < code.length; i++) {
  const ch = code[i];
  
  if (inStr) {
    if (ch === '\\') { i++; continue; }
    if (ch === strChar) inStr = false;
    continue;
  }
  
  if (ch === '"' || ch === "'" || ch === '`') {
    inStr = true;
    strChar = ch;
    continue;
  }
  
  if (ch === '(' || ch === '[' || ch === '{') depth++;
  if (ch === ')' || ch === ']' || ch === '}') depth--;
  
  if (depth === 0 && i > secondOpenParen) {
    pos = i + 1;
    break;
  }
}

const modalCode = code.substring(startIdx, pos);
console.log('Modal length:', modalCode.length);
console.log('Last 40 chars:', modalCode.substring(Math.max(0,modalCode.length-40)));
console.log('After modal:', code.substring(pos, Math.min(pos+30, code.length)));

// Verify the modal ends with ) (the closing of the call)
if (!modalCode.endsWith(')')) {
  console.log('WARNING: Modal does not end with ) - might be incorrect');
}

// Remove it and save
let newCode = code.substring(0, startIdx) + code.substring(pos);
fs.writeFileSync('_next/static/chunks/507-1cbb4e1ae80f89d3.js', newCode);
console.log('File saved, new length:', newCode.length);

// Also patch OUT copy
const outCode = fs.readFileSync('OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'utf8');
const outStartIdx = outCode.indexOf(needle);
if (outStartIdx >= 0) {
  const outFirstClose = outCode.indexOf(')', outStartIdx + 2);
  const outSecondOpen = outFirstClose + 1;
  let depth2 = 0;
  let pos2 = outSecondOpen;
  let inStr2 = false;
  let strChar2 = null;
  for (let i = outSecondOpen; i < outCode.length; i++) {
    const ch = outCode[i];
    if (inStr2) {
      if (ch === '\\') { i++; continue; }
      if (ch === strChar2) inStr2 = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inStr2 = true;
      strChar2 = ch;
      continue;
    }
    if (ch === '(' || ch === '[' || ch === '{') depth2++;
    if (ch === ')' || ch === ']' || ch === '}') depth2--;
    if (depth2 === 0 && i > outSecondOpen) { pos2 = i + 1; break; }
  }
  let newOutCode = outCode.substring(0, outStartIdx) + outCode.substring(pos2);
  fs.writeFileSync('OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js', newOutCode);
  console.log('OUT file saved, new length:', newOutCode.length);
}

// Check for remaining showBcModal references
for (const f of ['_next/static/chunks/507-1cbb4e1ae80f89d3.js']) {
  const c = fs.readFileSync(f, 'utf8');
  console.log(f + ' showBcModal count:', (c.match(/showBcModal/g) || []).length);
}
