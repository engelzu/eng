const fs = require('fs');

function cleanFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  console.log('\n=== ' + filePath + ' ===');
  console.log('Length:', code.length);

  // Find showBcModal in JSX context
  const modalRef = 'showBcModal,onOpenChange:setShowBcModal';
  const refIdx = code.indexOf(modalRef);
  
  if (refIdx < 0) {
    console.log('No BC modal reference found');
    return;
  }
  
  // Go backwards to find the start of the call expression
  // The pattern is: ,(0,t.jsx)(...args...) or corrupted
  // The ModalLibrary_507.Vq reference is an argument to a call
  // The call is: ,(0,t.jsx)(ModalLibrary_507.Vq,{...})
  // We need to find the opening (that starts the argument list
  
  // Find the LAST ( before refIdx that is the opening of the function call
  // This is after ,(0,t.jsx) or similar pattern
  
  // Strategy: find ,(0,t and work forward
  let callStart = -1;
  let argStart = -1;
  
  // Search backwards from refIdx for ',(0,t'
  const commaIdx = code.lastIndexOf(',(0,t', refIdx);
  if (commaIdx >= 0) {
    // From here, find the ( after (0,t.jsx) <- this opens the arg list
    // The pattern is: ,(0,t.jsx)(arg1, arg2, ...)
    // Find the first ( after commaIdx+1
    const firstParen = code.indexOf('(', commaIdx + 1);
    // The second ( after firstParen's close is the arg list open
    // Actually, (0,t.jsx) has: (0,t.jsx) - first ( and matching )
    // After that, the next ( opens the arg list
    
    // Skip (0,...) and find the (
    let parenDepth = 0;
    for (let i = firstParen; i < code.length; i++) {
      if (code[i] === '(') parenDepth++;
      if (code[i] === ')') parenDepth--;
      if (parenDepth === 0 && i > firstParen) {
        argStart = i + 1;
        break;
      }
    }
    
    // Check if argStart points to ModalLibrary
    if (argStart > 0 && code.substring(argStart, argStart + 10) === 'ModalLibra') {
      callStart = commaIdx;
      console.log('Found clean call pattern at', callStart);
      console.log('Arg start at', argStart, ':', code.substring(argStart, argStart+20));
    } else {
      console.log('Clean pattern did not match, argStart points to:', code.substring(argStart, argStart+20));
      // Fall through to corrupted pattern handling
    }
  }
  
  if (callStart < 0) {
    // Try corrupted pattern: ,(0,t.jsx)()(ModalLibrary_507.Vq,...)
    // Or just (ModalLibrary_507.Vq,...)
    // Find the ( that opens the argument list by looking for the last ( before modalRef
    // that has ModalLibrary right after it
    let searchPos = refIdx;
    while (searchPos > 0) {
      const ch = code[searchPos];
      if (ch === '(') {
        const after = code.substring(searchPos + 1, searchPos + 20);
        if (after.startsWith('ModalLibrary_507.Vq,')) {
          argStart = searchPos + 1;
          console.log('Found corrupted arg start at', searchPos);
          
          // Now find the call start - go back to the last ,(0,t
          const lastComma = code.lastIndexOf(',(0,t', searchPos);
          if (lastComma >= 0) {
            callStart = lastComma;
          } else {
            // No (0,t pattern - go back to the last ,
            const lastSep = code.lastIndexOf(',', searchPos - 1);
            // But we need to make sure it's a top-level separator
            // Check if there's a }}]) pattern before it
            callStart = lastSep;
          }
          break;
        }
      }
      searchPos--;
    }
  }
  
  if (callStart < 0 || argStart < 0) {
    console.log('Could not find modal boundaries');
    console.log('callStart:', callStart, 'argStart:', argStart);
    return;
  }
  
  console.log('callStart:', callStart, 'code:', code.substring(callStart, callStart+25));
  console.log('argStart:', argStart, 'code:', code.substring(argStart-5, argStart+15));
  
  // Now find the matching close for the arg list
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
    console.log('WARNING: modal validation failed (no SALVAR)');
    // Try finding SALVAR BUSINESS CASE to debug
    const salvarIdx = code.indexOf('SALVAR BUSINESS CASE');
    if (salvarIdx >= 0) {
      console.log('SALVAR is at', salvarIdx, 'in file');
      console.log('Modal covers', callStart, 'to', endIdx);
      console.log('Is SALVAR inside modal?', salvarIdx >= callStart && salvarIdx < endIdx);
    }
    // Try using SALVAR as the reference instead
    const altStart = code.lastIndexOf(',', code.lastIndexOf('SALVAR BUSINESS CASE', refIdx));
    // ... fall through
    return;
  }
  
  // Remove the modal
  code = code.substring(0, callStart) + code.substring(endIdx);
  console.log('Removed modal. New length:', code.length);
  
  // Remove showBcModal state if present
  code = code.replace(/let \[showBcModal,setShowBcModal\]=\d+,[a-z]+\.\w+\)\(!1\),?/g, '');
  
  // Check results
  console.log('Final: showBcModal=', (code.match(/showBcModal/g) || []).length);
  console.log('Final: beforeBcSave=', code.includes('beforeBcSave'));
  console.log('Final: __bcValues=', code.includes('__bcValues'));
  
  fs.writeFileSync(filePath, code);
  console.log('Saved:', code.length);
}

cleanFile('_next/static/chunks/507-1cbb4e1ae80f89d3.js');
cleanFile('OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js');
