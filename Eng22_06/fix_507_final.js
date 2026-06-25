const fs = require('fs');

function fixFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  console.log('\n=== ' + filePath + ' ===');
  console.log('Length:', code.length);
  
  // Check for the corrupted pattern (missing ,(0,t.jsx)( prefix)
  const corruptedPattern = '})(ModalLibrary_507.Vq,{open:showBcModal';
  const fullPattern = ',(0,t.jsx)(ModalLibrary_507.Vq,{open:showBcModal';
  
  if (code.includes(fullPattern)) {
    console.log('Found full modal pattern');
    // Remove the entire modal using the proven bracket-matching approach
    const startIdx = code.indexOf(fullPattern);
    const firstClose = code.indexOf(')', startIdx + 2);
    const argStart = firstClose + 1;
    
    let depth = 0, endIdx = argStart;
    let inStr = false, strChar = null;
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
    
    const modal = code.substring(startIdx, endIdx);
    console.log('Modal length:', modal.length);
    console.log('Ends:', modal.substring(Math.max(0, modal.length-30)));
    
    if (modal.includes('SALVAR BUSINESS CASE')) {
      code = code.substring(0, startIdx) + code.substring(endIdx);
      console.log('Removed modal, new length:', code.length);
    } else {
      console.log('WARNING: modal validation failed');
    }
  } else if (code.includes(corruptedPattern)) {
    console.log('Found corrupted pattern (missing prefix)');
    // Restore the prefix first
    const corruptIdx = code.indexOf(corruptedPattern);
    code = code.substring(0, corruptIdx) + ',(0,t.jsx)(' + code.substring(corruptIdx + 1);
    console.log('Restored prefix, length:', code.length);
    
    // Now find and remove the full modal
    const startIdx = code.indexOf(fullPattern);
    if (startIdx >= 0) {
      const firstClose = code.indexOf(')', startIdx + 2);
      const argStart = firstClose + 1;
      let depth = 0, endIdx = argStart;
      let inStr = false, strChar = null;
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
      const modal = code.substring(startIdx, endIdx);
      console.log('Modal length:', modal.length);
      if (modal.includes('SALVAR BUSINESS CASE')) {
        code = code.substring(0, startIdx) + code.substring(endIdx);
        console.log('Removed modal, new length:', code.length);
      } else {
        console.log('WARNING: modal validation failed');
        return;
      }
    }
  } else {
    console.log('No BC modal pattern found in this file');
  }
  
  // Clean up any remaining references
  const beforePatterns = ['window.beforeBcSave&&window.beforeBcSave()', 'window.beforeBcSave&&window.beforeBcSave(),'];
  for (const pat of beforePatterns) {
    while (code.includes(pat)) {
      const idx = code.indexOf(pat);
      const after = code.substring(idx + pat.length);
      let removeLen = pat.length;
      if (after[0] === ';' || after[0] === ',') removeLen++;
      code = code.substring(0, idx) + code.substring(idx + removeLen);
      console.log('Removed beforeBcSave call');
    }
  }
  
  // Remove __bcValues
  const bcVal = '...window.__bcValues||{}';
  while (code.includes(bcVal)) {
    const idx = code.indexOf(bcVal);
    const before = code[idx - 1];
    if (before === ',') {
      code = code.substring(0, idx - 1) + code.substring(idx + bcVal.length);
    } else {
      code = code.substring(0, idx) + code.substring(idx + bcVal.length);
    }
    console.log('Removed __bcValues reference');
  }
  
  // Remove showBcModal state declaration
  const statePat = /let \[showBcModal,setShowBcModal\]=\d+,[a-z]\.useState\)\(!1\),/;
  const stateMatch = code.match(statePat);
  if (stateMatch) {
    code = code.replace(statePat, '');
    console.log('Removed showBcModal state declaration');
  }
  
  // Also try the actual pattern used in the code: (0,g.useState)(!1)
  const statePat2 = /let \[showBcModal,setShowBcModal\]=\d+,[a-z]+\.\w+\)\(!1\),/;
  const stateMatch2 = code.match(statePat2);
  if (stateMatch2) {
    code = code.replace(statePat2, '');
    console.log('Removed showBcModal state declaration (alt)');
  }
  
  // Check for remaining issues
  console.log('Final check:');
  console.log('  showBcModal:', (code.match(/showBcModal/g) || []).length);
  console.log('  beforeBcSave:', code.includes('beforeBcSave'));
  console.log('  __bcValues:', code.includes('__bcValues'));
  console.log('  FAZER:', code.includes('FAZER'));
  
  // Check for showBcModal in JSX context (should be gone)
  const modalRefs = code.match(/open:showBcModal/g);
  console.log('  open:showBcModal refs:', modalRefs ? modalRefs.length : 0);
  
  fs.writeFileSync(filePath, code);
  console.log('Saved:', code.length, 'chars');
}

fixFile('_next/static/chunks/507-1cbb4e1ae80f89d3.js');
fixFile('OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js');
