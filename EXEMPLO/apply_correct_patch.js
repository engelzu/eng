const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '_next/static/chunks/6120-99ba76de6fd208f3.js'),
  path.join(__dirname, 'OUT/_next/static/chunks/6120-99ba76de6fd208f3.js')
];

let text = fs.readFileSync('table_markup_fixed.txt', 'utf8');
// Remove the final `]})` to leave the main inner div's children array open
text = text.substring(0, text.lastIndexOf(']})'));

files.forEach(f => {
  if (!fs.existsSync(f)) {
    console.log('File does not exist:', f);
    return;
  }
  console.log('Patching file:', f);
  
  const backup = f + '.eap_patch.bak';
  if (fs.existsSync(backup)) {
    console.log('  Restoring from backup first to ensure clean state...');
    fs.copyFileSync(backup, f);
  } else {
    fs.copyFileSync(f, backup);
    console.log('  Created backup at:', backup);
  }

  let code = fs.readFileSync(f, 'utf8');

  // 1. Inject state variables
  const stateTarget = '[showCronogramaModal,setShowCronogramaModal]=(0,E.useState)(!1),';
  const stateReplacement = '[showCronogramaModal,setShowCronogramaModal]=(0,E.useState)(!1),[gerCusto,setGerCusto]=(0,E.useState)(r.gerCusto||""),[constCivCusto,setConstCivCusto]=(0,E.useState)(r.constCivCusto||""),[fabCusto,setFabCusto]=(0,E.useState)(r.fabCusto||""),[monCusto,setMonCusto]=(0,E.useState)(r.monCusto||""),[comCusto,setComCusto]=(0,E.useState)(r.comCusto||""),[conCusto,setConCusto]=(0,E.useState)(r.conCusto||""),[eapInicio,setEapInicio]=(0,E.useState)(r.eapInicio||""),[eapTermino,setEapTermino]=(0,E.useState)(r.eapTermino||""),[gerInicio,setGerInicio]=(0,E.useState)(r.gerInicio||""),[gerTermino,setGerTermino]=(0,E.useState)(r.gerTermino||""),[supInicio,setSupInicio]=(0,E.useState)(r.supInicio||""),[supTermino,setSupTermino]=(0,E.useState)(r.supTermino||""),[constCivInicio,setConstCivInicio]=(0,E.useState)(r.constCivInicio||""),[constCivTermino,setConstCivTermino]=(0,E.useState)(r.constCivTermino||""),[montEleInicio,setMontEleInicio]=(0,E.useState)(r.montEleInicio||""),[montEleTermino,setMontEleTermino]=(0,E.useState)(r.montEleTermino||""),[fabInicio,setFabInicio]=(0,E.useState)(r.fabInicio||""),[fabTermino,setFabTermino]=(0,E.useState)(r.fabTermino||""),[monInicio,setMonInicio]=(0,E.useState)(r.monInicio||""),[monTermino,setMonTermino]=(0,E.useState)(r.monTermino||""),[comInicio,setComInicio]=(0,E.useState)(r.comInicio||""),[comTermino,setComTermino]=(0,E.useState)(r.comTermino||""),[conInicio,setConInicio]=(0,E.useState)(r.conInicio||""),[conTermino,setConTermino]=(0,E.useState)(r.conTermino||""),';
  if (code.includes(stateTarget)) {
    code = code.replace(stateTarget, stateReplacement);
    console.log('  1. Injected state variables.');
  }

  // 2. Inject useEffect reset logic
  const useEffectTarget = 'setShowCronogramaModal(!1)},[r]);';
  const useEffectReplacement = 'setShowCronogramaModal(!1),setGerCusto(r.gerCusto||""),setConstCivCusto(r.constCivCusto||""),setFabCusto(r.fabCusto||""),setMonCusto(r.monCusto||""),setComCusto(r.comCusto||""),setConCusto(r.conCusto||""),setEapInicio(r.eapInicio||""),setEapTermino(r.eapTermino||""),setGerInicio(r.gerInicio||""),setGerTermino(r.gerTermino||""),setSupInicio(r.supInicio||""),setSupTermino(r.supTermino||""),setConstCivInicio(r.constCivInicio||""),setConstCivTermino(r.constCivTermino||""),setMontEleInicio(r.montEleInicio||""),setMontEleTermino(r.montEleTermino||""),setFabInicio(r.fabInicio||""),setFabTermino(r.fabTermino||""),setMonInicio(r.monInicio||""),setMonTermino(r.monTermino||""),setComInicio(r.comInicio||""),setComTermino(r.comTermino||""),setConInicio(r.conInicio||""),setConTermino(r.conTermino||"")},[r]);';
  if (code.includes(useEffectTarget)) {
    code = code.replace(useEffectTarget, useEffectReplacement);
    console.log('  2. Injected useEffect reset logic.');
  }

  // 3. Inject computed variable declarations
  const useRefTarget = 'em=(0,E.useRef)(null);';
  const useRefReplacement = 'em=(0,E.useRef)(null);let calculatedSuprimentosCusto=(parseFloat(matCusto)||0)+(parseFloat(equCusto)||0),calculatedMontagemCusto=(parseFloat(fabCusto)||0)+(parseFloat(monCusto)||0),calculatedImplantaCusto=(parseFloat(constCivCusto)||0)+calculatedMontagemCusto+(parseFloat(comCusto)||0),calculatedEapCusto=(parseFloat(engCusto)||0)+(parseFloat(gerCusto)||0)+calculatedSuprimentosCusto+calculatedImplantaCusto+(parseFloat(conCusto)||0),formatUSD=e=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(e);';
  if (code.includes(useRefTarget)) {
    code = code.replace(useRefTarget, useRefReplacement);
    console.log('  3. Injected computed variables.');
  }

  // 4. Inject database saving logic
  const saveTarget = 'eap:eap,engCusto:engCusto,engInicio:engInicio,engTermino:engTermino,matCusto:matCusto,matInicio:matInicio,matTermino:matTermino,serCusto:serCusto,serInicio:serInicio,serTermino:serTermino,equCusto:equCusto,equInicio:equInicio,equTermino:equTermino,updatedAt:';
  const saveReplacement = 'eap:eap,engCusto:engCusto,engInicio:engInicio,engTermino:engTermino,matCusto:matCusto,matInicio:matInicio,matTermino:matTermino,serCusto:String((parseFloat(gerCusto)||0)+(parseFloat(constCivCusto)||0)+(parseFloat(fabCusto)||0)+(parseFloat(monCusto)||0)+(parseFloat(comCusto)||0)+(parseFloat(conCusto)||0)),serInicio:serInicio,serTermino:serTermino,equCusto:equCusto,equInicio:equInicio,equTermino:equTermino,gerCusto:gerCusto,constCivCusto:constCivCusto,fabCusto:fabCusto,monCusto:monCusto,comCusto:comCusto,conCusto:conCusto,eapInicio:eapInicio,eapTermino:eapTermino,gerInicio:gerInicio,gerTermino:gerTermino,supInicio:supInicio,supTermino:supTermino,constCivInicio:constCivInicio,constCivTermino:constCivTermino,montEleInicio:montEleInicio,montEleTermino:montEleTermino,fabInicio:fabInicio,fabTermino:fabTermino,monInicio:monInicio,monTermino:monTermino,comInicio:comInicio,comTermino:comTermino,conInicio:conInicio,conTermino:conTermino,updatedAt:';
  if (code.includes(saveTarget)) {
    code = code.replace(saveTarget, saveReplacement);
    console.log('  4. Injected database saving logic.');
  }

  // 5. Replace EAP modal inner div layout with the table layout
  const startKeyword = '(0,t.jsxs)("div",{className:"p-4 space-y-2.5 max-h-[70vh] overflow-y-auto",children:';
  const startIdx = code.indexOf(startKeyword);
  if (startIdx === -1) {
    console.log('  5. Start keyword not found!');
    return;
  }
  const footerKeyword = ',(0,t.jsxs)(s.cN,';
  const footerIdx = code.indexOf(footerKeyword, startIdx);
  if (footerIdx === -1) {
    console.log('  5. Footer keyword not found!');
    return;
  }

  code = code.substring(0, startIdx) + text + code.substring(footerIdx);
  console.log('  5. Spliced table layout.');

  // Validate syntax
  try {
    const { execSync } = require('child_process');
    fs.writeFileSync(f, code, 'utf8');
    execSync('node -c ' + f);
    console.log('Successfully saved and validated patched file.');
  } catch (err) {
    console.error('Syntax validation failed:', err.message);
  }
});
