const fs = require('fs');
const path = require('path');
const f = path.join(__dirname, '_next/static/chunks/6120-99ba76de6fd208f3.js.eap_patch.bak');
const code = fs.readFileSync(f, 'utf8');
const modalStartKeyword = ',(0,t.jsx)(s.Vq,{open:showEapModal,onOpenChange:setShowEapModal,children:(0,t.jsxs)(s.cZ,{className:"max-w-3xl border-emerald-500",children:';
const startIdx = code.indexOf(modalStartKeyword);
const modalEndKeyword = ',(0,t.jsxs)(s.Vq,{open:showCronogramaModal,';
const endIdx = code.indexOf(modalEndKeyword, startIdx);
const section = code.substring(startIdx, endIdx);

// Search for onClick handlers in the section
console.log('--- Buttons in the section ---');
const btnMatches = [...section.matchAll(/onClick:[^,}]*/g)];
btnMatches.forEach(m => console.log(m[0]));
