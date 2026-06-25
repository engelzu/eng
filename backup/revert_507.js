const fs = require('fs');

const files = [
  '_next/static/chunks/507-1cbb4e1ae80f89d3.js',
  '_next/static/chunks/507-1cbb4e1ae80f89d3.js.bak',
  'OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js',
  'OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js.bak'
];

function findBalancingParenthesis(str, startIdx) {
  let depth = 0;
  for (let i = startIdx; i < str.length; i++) {
    if (str[i] === '(') depth++;
    else if (str[i] === ')') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

for (const f of files) {
  if (!fs.existsSync(f)) {
    console.log(`File not found: ${f}`);
    continue;
  }
  let code = fs.readFileSync(f, 'utf8');
  let originalLen = code.length;

  // 1. Revert state injection
  const stateRegex = /function X\(e\)\{var s;[\s\S]*?let\s*?\{\s*?fast\s*?:\s*?a/;
  if (stateRegex.test(code)) {
    code = code.replace(stateRegex, 'function X(e){var s;let{fast:a');
  }

  // 2. Revert React_507 alias insertion
  const aliasRegex = /;var React_507=[a-zA-Z0-9_]+;/;
  if (aliasRegex.test(code)) {
    code = code.replace(aliasRegex, ';');
  }

  // 3. Revert submit logic
  const submitTarget = 'eV=async e=>{Object.assign(e, bcDataRef.current);';
  if (code.includes(submitTarget)) {
    code = code.replace(submitTarget, 'eV=async e=>{');
  }

  // 4. Revert button injection using bracket balancing
  const btnStartKey = ',(0,t.jsxs)("button",{type:"button",onClick:()=>setShowBcModal(!0)';
  const btnStartIdx = code.indexOf(btnStartKey);
  if (btnStartIdx !== -1) {
    const firstParenIdx = code.indexOf('(', btnStartIdx + 1);
    if (firstParenIdx !== -1) {
      const endIdx = findBalancingParenthesis(code, firstParenIdx);
      if (endIdx !== -1) {
        const fullBtnBlock = code.slice(btnStartIdx, endIdx + 1);
        console.log(`Reverted button in ${f}`);
        code = code.replace(fullBtnBlock, '');
      }
    }
  }

  // 5. Revert modal markup using bracket balancing
  const startKeyM = ',(0,t.jsx)(ModalLibrary_507.Vq,{open:showBcModal';
  const startKeyS = ',(0,t.jsx)(s.Vq,{open:showBcModal';
  const startKeyL = ',(0,t.jsx)(l.Vq,{open:showBcModal';
  const startKeyR = ',(0,t.jsx)(r.Vq,{open:showBcModal';
  const startKey = code.includes(startKeyM) ? startKeyM : (code.includes(startKeyS) ? startKeyS : (code.includes(startKeyL) ? startKeyL : (code.includes(startKeyR) ? startKeyR : null)));

  if (startKey) {
    const startIdx = code.indexOf(startKey);
    let firstParenIdx = code.indexOf('(', startIdx + 1);
    if (firstParenIdx !== -1) {
      firstParenIdx = code.indexOf('(', firstParenIdx + 1);
      if (firstParenIdx !== -1) {
        const endIdx = findBalancingParenthesis(code, firstParenIdx);
        if (endIdx !== -1) {
          const fullInjectedBlock = code.slice(startIdx, endIdx + 1);
          console.log(`Reverted modal in ${f}`);
          code = code.replace(fullInjectedBlock, '');
        }
      }
    }
  }

  fs.writeFileSync(f, code);
  console.log(`Reverted ${f}. Length: ${originalLen} -> ${code.length}`);
}
