const fs = require('fs');
const t = fs.readFileSync('original_modal.js', 'utf8');

// Strip out strings to avoid confusion
let clean = '';
let inStr = false;
let strChar = '';
for(let i=0; i<t.length; i++) {
  if (!inStr) {
    if (t[i] === '"' || t[i] === "'") {
      inStr = true;
      strChar = t[i];
    } else {
      clean += t[i];
    }
  } else {
    if (t[i] === strChar && t[i-1] !== '\\') {
      inStr = false;
    }
  }
}

let open = 0;
for(let i=0; i<clean.length; i++) {
  if (clean[i] === '[') open++;
  if (clean[i] === ']') open--;
}
console.log('Unclosed [ in original_modal.js:', open);

const startKeyword = '(0,t.jsxs)("div",{className:,children:';
const footerKeyword = ',(0,t.jsxs)(s.cN,';

const startIdx = clean.indexOf(startKeyword);
const footerIdx = clean.indexOf(footerKeyword);

if (startIdx !== -1 && footerIdx !== -1) {
  const innerClean = clean.substring(startIdx, footerIdx);
  let o = 0;
  for(let i=0; i<innerClean.length; i++) {
    if (innerClean[i] === '[') o++;
    if (innerClean[i] === ']') o--;
  }
  console.log('Unclosed [ in inner:', o);
} else {
  console.log('Keywords not found in clean string');
}
