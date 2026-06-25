const fs = require('fs');

function removeModalFromFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // The modal expression pattern: ,(0,t.jsx)(ModalLibrary_507.Vq,{open:showBcModal,...})
  // We need to find it and remove it entirely (including the leading comma)
  const modalStart = ',(0,t.jsx)(ModalLibrary_507.Vq,{open:showBcModal';
  const startIdx = code.indexOf(modalStart);
  
  if (startIdx < 0) {
    console.log(filePath + ': modal start not found');
    return false;
  }
  
  // The structure is: ,(0,t.jsx)(ModalLibrary_507.Vq, {...})
  // Where the ) after {...} closes the outer call
  // We need to skip the first (0,t.jsx) and find the matching ) for the second (
  
  // Find the first ) that closes (0,t.jsx)
  const firstClose = code.indexOf(')', startIdx + 2);
  // The second ( opens the argument list
  const argStart = firstClose + 1;
  
  // Now find the matching ) for the argument list
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
    
    if (ch === '"' || ch === "'" || ch === '`') {
      inStr = true;
      strChar = ch;
      continue;
    }
    
    if (ch === '(' || ch === '[' || ch === '{') depth++;
    if (ch === ')' || ch === ']' || ch === '}') depth--;
    
    if (depth === 0 && i > argStart) {
      endIdx = i + 1;
      break;
    }
  }
  
  const modalCode = code.substring(startIdx, endIdx);
  console.log(filePath + ': modal length=' + modalCode.length);
  console.log(filePath + ': modal ends with: ' + modalCode.substring(Math.max(0,modalCode.length-30)));
  console.log(filePath + ': after modal: ' + code.substring(endIdx, Math.min(endIdx+30, code.length)));
  
  // Verify the modal ends with )
  if (!modalCode.endsWith(')')) {
    console.log(filePath + ': WARNING - modal does not end with )');
    return false;
  }
  
  // Also verify it contains SALVAR BUSINESS CASE
  if (!modalCode.includes('SALVAR BUSINESS CASE')) {
    console.log(filePath + ': WARNING - modal does not contain SALVAR');
    return false;
  }
  
  // Remove the modal including the leading comma
  code = code.substring(0, startIdx) + code.substring(endIdx);
  fs.writeFileSync(filePath, code);
  console.log(filePath + ': saved, length=' + code.length);
  return true;
}

// Remove from both files
for (const f of ['_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js']) {
  removeModalFromFile(f);
}

// Also clean up any remaining BC-related state variables that were injected
// These are between showCapexModal state and the original next state
function cleanBCStates(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  // The injected BC states are between showCapexModal and the next original state
  // Look for: [showCapexModal,...=[...state...],[bcAvaliacaoMesAno,... (injected), ... ,[originalNextState...]
  // But we can't easily distinguish injected from original BC states
  
  // Remove remaining beforeBcSave calls (if any)
  code = code.replace(/window\.beforeBcSave\&\&window\.beforeBcSave\(\)[,;]?\s*/g, '');
  
  // Remove remaining __bcValues references  
  code = code.replace(/,?\.\.\.window\.__bcValues\|\|{}\s*/g, '');
  
  // Remove showBcModal state declaration
  code = code.replace(/let \[showBcModal,setShowBcModal\]=\d+,[a-z]\.useState\)\(!1\),/g, '');
  
  fs.writeFileSync(filePath, code);
  console.log(filePath + ': cleaned up, length=' + code.length);
}

for (const f of ['_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js']) {
  cleanBCStates(f);
}

// Verify
for (const f of ['_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js']) {
  const c = fs.readFileSync(f, 'utf8');
  console.log('\n' + f + ':');
  console.log('  length:', c.length);
  console.log('  showBcModal:', (c.match(/showBcModal/g)||[]).length);
  console.log('  ModalLibrary_507.Vq:', c.includes('ModalLibrary_507.Vq'));
  console.log('  beforeBcSave:', c.includes('beforeBcSave'));
  console.log('  __bcValues:', c.includes('__bcValues'));
}
