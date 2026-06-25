const fs = require('fs');
const files = [
  '_next/static/chunks/507-1cbb4e1ae80f89d3.js',
  'OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js'
];
const bcFields = [
  'bc1Objetivo','bc2Contextualizacao','bc3Beneficios','bc4AvaliacaoAlinhamento',
  'bc5Capex','bc6CronogramaPreliminar','bc15EstrategiaImplantacao','bc16Requisitos',
  'bc17PremissasRestricoes','bc18Exclusoes','bc19FatoresCriticos','bc20RiscosIncertezas',
  'bc21AvaliacaoEconomica','bc22Conclusao'
];

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let code = fs.readFileSync(f, 'utf8');
  let changed = false;

  // 1. Remove showBcModal state declaration
  const stateTarget = 'let [showBcModal,setShowBcModal]=(0,g.useState)(!1),';
  if (code.includes(stateTarget)) {
    code = code.replace(stateTarget, '');
    console.log(f + ': removed showBcModal state');
    changed = true;
  }

  // 2. Remove the BC modal JSX - find matching brackets
  const modalStart = ',(0,t.jsx)(ModalLibrary_507.Vq,{open:showBcModal,onOpenChange:setShowBcModal';
  if (code.includes(modalStart)) {
    const startIdx = code.indexOf(modalStart);
    let depth = 0;
    let endIdx = startIdx;
    let inString = false;
    let stringChar = null;
    for (let i = startIdx; i < code.length; i++) {
      const ch = code[i];
      if (inString) {
        if (ch === '\\') { i++; continue; }
        if (ch === stringChar) inString = false;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === '`') {
        inString = true;
        stringChar = ch;
        continue;
      }
      if (ch === '(' || ch === '[' || ch === '{') depth++;
      if (ch === ')' || ch === ']' || ch === '}') depth--;
      if (depth === 0 && i > startIdx) {
        endIdx = i + 1;
        break;
      }
    }
    const removed = code.substring(startIdx, endIdx);
    // Check it ends with a valid pattern
    if (removed.includes('showBcModal') && removed.length > 50) {
      code = code.substring(0, startIdx) + code.substring(endIdx);
      console.log(f + ': removed BC modal JSX (' + removed.length + ' chars)');
      changed = true;
    } else {
      console.log(f + ': WARNING - modal removal suspicious, length=' + removed.length + ' ends=' + removed.substring(Math.max(0,removed.length-30)));
    }
  }

  // 3. Remove any beforeBcSave calls
  const bcCall = 'window.beforeBcSave&&window.beforeBcSave()';
  while (code.includes(bcCall)) {
    const idx = code.indexOf(bcCall);
    // Remove the call plus any trailing comma or semicolon
    const after = code.substring(idx + bcCall.length);
    let removeLen = bcCall.length;
    if (after[0] === ';' || after[0] === ',') removeLen++;
    code = code.substring(0, idx) + code.substring(idx + removeLen);
    console.log(f + ': removed beforeBcSave call');
    changed = true;
  }

  // 4. Remove __bcValues references
  const bcVal = '...window.__bcValues||{}';
  while (code.includes(bcVal)) {
    const idx = code.indexOf(bcVal);
    // Remove the spread plus any leading comma
    const before = code[idx - 1];
    let removeLen = bcVal.length;
    if (before === ',') { removeLen++; code = code.substring(0, idx - 1) + code.substring(idx + bcVal.length); }
    else { code = code.substring(0, idx) + code.substring(idx + bcVal.length); }
    console.log(f + ': removed __bcValues reference');
    changed = true;
  }

  // 5. Remove useEffect BC additions
  const effectPat = /setBcEnviarAprovacao\(r\.bcEnviarAprovacao\|\|!1\),setBcStatusAnterior\([^)]+\)/;
  const effectMatch = code.match(effectPat);
  if (effectMatch) {
    code = code.replace(effectPat, '');
    console.log(f + ': removed useEffect BC additions');
    changed = true;
  }

  // 6. Remove id: from BC textareas
  for (const fld of bcFields) {
    const oldPat = 'id:"' + fld + '",value:' + fld;
    const newPat = 'value:' + fld;
    if (code.includes(oldPat)) {
      code = code.replace(oldPat, newPat);
      console.log(f + ': removed id from ' + fld);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(f, code);
    console.log(f + ': saved (' + code.length + ' chars)');
  } else {
    console.log(f + ': no changes needed');
  }
}
