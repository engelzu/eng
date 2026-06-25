const fs = require('fs');
const path = require('path');

const files = [
  'c:/Users/user2/Downloads/Eng24_06/Eng22_06/_next/static/chunks/6120-99ba76de6fd208f3.js',
  'c:/Users/user2/Downloads/Eng24_06/Eng22_06/OUT/_next/static/chunks/6120-99ba76de6fd208f3.js'
];

files.forEach(f => {
  if (!fs.existsSync(f)) {
    console.log('File does not exist:', f);
    return;
  }
  // Backup and restore to keep it clean and idempotent
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
  const stateTarget = '[showEapModal,setShowEapModal]=(0,E.useState)(!1),';
  const stateReplacement = '[showEapModal,setShowEapModal]=(0,E.useState)(!1),[showCronogramaModal,setShowCronogramaModal]=(0,E.useState)(!1),[showClearConfirm,setShowClearConfirm]=(0,E.useState)(!1),[dist,setDist]=(0,E.useState)(r.distribuicaoMensal||{}),[gerCusto,setGerCusto]=(0,E.useState)(r.gerCusto||""),[constCivCusto,setConstCivCusto]=(0,E.useState)(r.constCivCusto||""),[fabCusto,setFabCusto]=(0,E.useState)(r.fabCusto||""),[monCusto,setMonCusto]=(0,E.useState)(r.monCusto||""),[comCusto,setComCusto]=(0,E.useState)(r.comCusto||""),[conCusto,setConCusto]=(0,E.useState)(r.conCusto||""),[eapInicio,setEapInicio]=(0,E.useState)(r.eapInicio||""),[eapTermino,setEapTermino]=(0,E.useState)(r.eapTermino||""),[gerInicio,setGerInicio]=(0,E.useState)(r.gerInicio||""),[gerTermino,setGerTermino]=(0,E.useState)(r.gerTermino||""),[supInicio,setSupInicio]=(0,E.useState)(r.supInicio||""),[supTermino,setSupTermino]=(0,E.useState)(r.supTermino||""),[constCivInicio,setConstCivInicio]=(0,E.useState)(r.constCivInicio||""),[constCivTermino,setConstCivTermino]=(0,E.useState)(r.constCivTermino||""),[montEleInicio,setMontEleInicio]=(0,E.useState)(r.montEleInicio||""),[montEleTermino,setMontEleTermino]=(0,E.useState)(r.montEleTermino||""),[fabInicio,setFabInicio]=(0,E.useState)(r.fabInicio||""),[fabTermino,setFabTermino]=(0,E.useState)(r.fabTermino||""),[monInicio,setMonInicio]=(0,E.useState)(r.monInicio||""),[monTermino,setMonTermino]=(0,E.useState)(r.monTermino||""),[comInicio,setComInicio]=(0,E.useState)(r.comInicio||""),[comTermino,setComTermino]=(0,E.useState)(r.comTermino||""),[conInicio,setConInicio]=(0,E.useState)(r.conInicio||""),[conTermino,setConTermino]=(0,E.useState)(r.conTermino||""),[eapActive,setEapActive]=(0,E.useState)(r.eapActive||!!(r.eapInicio||r.eapTermino)),[engActive,setEngActive]=(0,E.useState)(r.engActive||!!(r.engInicio||r.engTermino||r.engCusto)),[gerActive,setGerActive]=(0,E.useState)(r.gerActive||!!(r.gerInicio||r.gerTermino||r.gerCusto)),[supActive,setSupActive]=(0,E.useState)(r.supActive||!!(r.supInicio||r.supTermino)),[matActive,setMatActive]=(0,E.useState)(r.matActive||!!(r.matInicio||r.matTermino||r.matCusto)),[equActive,setEquActive]=(0,E.useState)(r.equActive||!!(r.equInicio||r.equTermino||r.equCusto)),[serActive,setSerActive]=(0,E.useState)(r.serActive||!!(r.serInicio||r.serTermino)),[constCivActive,setConstCivActive]=(0,E.useState)(r.constCivActive||!!(r.constCivInicio||r.constCivTermino||r.constCivCusto)),[montEleActive,setMontEleActive]=(0,E.useState)(r.montEleActive||!!(r.montEleInicio||r.montEleTermino)),[fabActive,setFabActive]=(0,E.useState)(r.fabActive||!!(r.fabInicio||r.fabTermino||r.fabCusto)),[monActive,setMonActive]=(0,E.useState)(r.monActive||!!(r.monInicio||r.monTermino||r.monCusto)),[comActive,setComActive]=(0,E.useState)(r.comActive||!!(r.comInicio||r.comTermino||r.comCusto)),[conActive,setConActive]=(0,E.useState)(r.conActive||!!(r.conInicio||r.conTermino||r.conCusto)),';
  if (code.includes(stateTarget)) {
    code = code.replace(stateTarget, stateReplacement);
    console.log('  1. Injected state variables.');
  } else {
    console.log('  1. State target not found!');
    return;
  }

  // 2. Inject useEffect reset logic
  const useEffectTarget = 'setShowEapModal(!1)},[r]);';
  const useEffectReplacement = 'setShowEapModal(!1),setShowCronogramaModal(!1),setShowClearConfirm(!1),setDist(r.distribuicaoMensal||{}),setGerCusto(r.gerCusto||\"\"),setConstCivCusto(r.constCivCusto||\"\"),setFabCusto(r.fabCusto||\"\"),setMonCusto(r.monCusto||\"\"),setComCusto(r.comCusto||\"\"),setConCusto(r.conCusto||\"\"),setEapInicio(r.eapInicio||\"\"),setEapTermino(r.eapTermino||\"\"),setGerInicio(r.gerInicio||\"\"),setGerTermino(r.gerTermino||\"\"),setSupInicio(r.supInicio||\"\"),setSupTermino(r.supTermino||\"\"),setConstCivInicio(r.constCivInicio||\"\"),setConstCivTermino(r.constCivTermino||\"\"),setMontEleInicio(r.montEleInicio||\"\"),setMontEleTermino(r.montEleTermino||\"\"),setFabInicio(r.fabInicio||\"\"),setFabTermino(r.fabTermino||\"\"),setMonInicio(r.monInicio||\"\"),setMonTermino(r.monTermino||\"\"),setComInicio(r.comInicio||\"\"),setComTermino(r.comTermino||\"\"),setConInicio(r.conInicio||\"\"),setConTermino(r.conTermino||\"\"),setEapActive(r.eapActive||!!(r.eapInicio||r.eapTermino)),setEngActive(r.engActive||!!(r.engInicio||r.engTermino||r.engCusto)),setGerActive(r.gerActive||!!(r.gerInicio||r.gerTermino||r.gerCusto)),setSupActive(r.supActive||!!(r.supInicio||r.supTermino)),setMatActive(r.matActive||!!(r.matInicio||r.matTermino||r.matCusto)),setEquActive(r.equActive||!!(r.equInicio||r.equTermino||r.equCusto)),setSerActive(r.serActive||!!(r.serInicio||r.serTermino)),setConstCivActive(r.constCivActive||!!(r.constCivInicio||r.constCivTermino||r.constCivCusto)),setMontEleActive(r.montEleActive||!!(r.montEleInicio||r.montEleTermino)),setFabActive(r.fabActive||!!(r.fabInicio||r.fabTermino||r.fabCusto)),setMonActive(r.monActive||!!(r.monInicio||r.monTermino||r.monCusto)),setComActive(r.comActive||!!(r.comInicio||r.comTermino||r.comCusto)),setConActive(r.conActive||!!(r.conInicio||r.conTermino||r.conCusto))},[r]);';
  if (code.includes(useEffectTarget)) {
    code = code.replace(useEffectTarget, useEffectReplacement);
    console.log('  2. Injected useEffect reset logic.');
  } else {
    console.log('  2. useEffect target not found!');
    return;
  }

  // 3. Inject computed variables right after em=(0,E.useRef)(null);
  const useRefTarget = 'em=(0,E.useRef)(null);';
  const useRefReplacement = 'em=(0,E.useRef)(null);let getMonths=(e,t)=>{if(!e||!t)return[];let n=new Date(e+"T00:00:00"),r=new Date(t+"T00:00:00");if(n>r)return[];let a=[],o=new Date(n.getFullYear(),n.getMonth(),1);for(;o<=r||o.getFullYear()===r.getFullYear()&&o.getMonth()===r.getMonth();)a.push({key:o.getFullYear()+"-"+o.getMonth(),label:o.toLocaleDateString("pt-BR",{month:"short",year:"2-digit"})}),o.setMonth(o.getMonth()+1);return a},calculatedSuprimentosCusto=(matActive?(parseFloat(matCusto)||0):0)+(equActive?(parseFloat(equCusto)||0):0),calculatedMontagemCusto=(fabActive?(parseFloat(fabCusto)||0):0)+(monActive?(parseFloat(monCusto)||0):0),calculatedImplantaCusto=(constCivActive?(parseFloat(constCivCusto)||0):0)+calculatedMontagemCusto+(comActive?(parseFloat(comCusto)||0):0),calculatedEapCusto=(engActive?(parseFloat(engCusto)||0):0)+(gerActive?(parseFloat(gerCusto)||0):0)+calculatedSuprimentosCusto+calculatedImplantaCusto+(conActive?(parseFloat(conCusto)||0):0),formatUSD=e=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(e);';
  if (code.includes(useRefTarget)) {
    code = code.replace(useRefTarget, useRefReplacement);
    console.log('  3. Injected computed variables.');
  } else {
    console.log('  3. useRef target not found!');
    return;
  }

  // 4. Inject database saving logic
  const saveTarget = 'eap:eap,engCusto:engCusto,engInicio:engInicio,engTermino:engTermino,matCusto:matCusto,matInicio:matInicio,matTermino:matTermino,serCusto:serCusto,serInicio:serInicio,serTermino:serTermino,equCusto:equCusto,equInicio:equInicio,equTermino:equTermino,';
  const saveReplacement = 'eap:eap,engCusto:engActive?engCusto:"",engInicio:engActive?engInicio:"",engTermino:engActive?engTermino:"",matCusto:matActive?matCusto:"",matInicio:matActive?matInicio:"",matTermino:matActive?matTermino:"",serCusto:String((gerActive?(parseFloat(gerCusto)||0):0)+(constCivActive?(parseFloat(constCivCusto)||0):0)+(fabActive?(parseFloat(fabCusto)||0):0)+(monActive?(parseFloat(monCusto)||0):0)+(comActive?(parseFloat(comCusto)||0):0)+(conActive?(parseFloat(conCusto)||0):0)),serInicio:serActive?serInicio:"",serTermino:serActive?serTermino:"",equCusto:equActive?equCusto:"",equInicio:equActive?equInicio:"",equTermino:equActive?equTermino:"",gerCusto:gerActive?gerCusto:"",constCivCusto:constCivActive?constCivCusto:"",fabCusto:fabActive?fabCusto:"",monCusto:monActive?monCusto:"",comCusto:comActive?comCusto:"",conCusto:conActive?conCusto:"",eapInicio:eapActive?eapInicio:"",eapTermino:eapActive?eapTermino:"",gerInicio:gerActive?gerInicio:"",gerTermino:gerActive?gerTermino:"",supInicio:supActive?supInicio:"",supTermino:supActive?supTermino:"",constCivInicio:constCivActive?constCivInicio:"",constCivTermino:constCivActive?constCivTermino:"",montEleInicio:montEleActive?montEleInicio:"",montEleTermino:montEleActive?montEleTermino:"",fabInicio:fabActive?fabInicio:"",fabTermino:fabActive?fabTermino:"",monInicio:monActive?monInicio:"",monTermino:monActive?monTermino:"",comInicio:comActive?comInicio:"",comTermino:comActive?comTermino:"",conInicio:conActive?conInicio:"",conTermino:conActive?conTermino:"",eapActive:eapActive,engActive:engActive,gerActive:gerActive,supActive:supActive,matActive:matActive,equActive:equActive,serActive:serActive,constCivActive:constCivActive,montEleActive:montEleActive,fabActive:fabActive,monActive:monActive,comActive:comActive,conActive:conActive,distribuicaoMensal:dist,';
  if (code.includes(saveTarget)) {
    code = code.replace(saveTarget, saveReplacement);
    console.log('  4. Injected database saving logic.');
  } else {
    console.log('  4. Save target not found!');
    return;
  }

  // 5. Replace the card "DEFINIR EAP" button with blue + add amber "CRONOGRAMA" button
  const btnTarget = 'className:"h-8 px-3 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-black text-[10px] flex items-center gap-1.5 border border-emerald-100 rounded-full",onClick:()=>setShowEapModal(!0),children:"DEFINIR EAP"';
  const btnReplacement = 'className:"h-8 px-3 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-black text-[10px] flex items-center gap-1.5 border border-blue-200 rounded-full shadow-sm",onClick:()=>setShowEapModal(!0),children:"DEFINIR EAP"}),(0,t.jsx)(u.z,{size:"sm",variant:"ghost",className:"h-8 px-3 text-amber-600 hover:bg-amber-50 hover:text-amber-700 font-black text-[10px] flex items-center gap-1.5 border border-amber-200 rounded-full shadow-sm",onClick:function(){return setShowCronogramaModal(!0)},children:"CRONOGRAMA"';
  if (code.includes(btnTarget)) {
    code = code.replace(btnTarget, btnReplacement);
    console.log('  5. Replaced DEFINIR EAP button + added CRONOGRAMA button.');
  } else {
    console.log('  5. DEFINIR EAP button target not found!');
    return;
  }

  // 6. Replace EAP modal JSX dialog layout with the table layout
  const modalStartKeyword = ',(0,t.jsx)(s.Vq,{open:showEapModal,onOpenChange:setShowEapModal,children:(0,t.jsxs)(s.cZ,{className:"max-w-2xl border-emerald-500",children:';
  const startIdx = code.indexOf(modalStartKeyword);
  if (startIdx === -1) {
    console.log('  6. EAP modal start keyword not found!');
    return;
  }

  const modalEndKeyword = '}},69174:';
  const endIdx = code.indexOf(modalEndKeyword, startIdx);
  if (endIdx === -1) {
    console.log('  6. EAP modal end keyword not found!');
    return;
  }

  // Load external EAP modal markup and Cronograma modal markup
  const eapModalMarkup = require('./eap_modal_markup.js');
  const cronogramaModalMarkup = require('./cronograma_modal_markup.js');

  code = code.substring(0, startIdx) + ',' + eapModalMarkup + cronogramaModalMarkup + code.substring(endIdx);
  console.log('  6. Replaced EAP modal markup and appended Cronograma modal.');

  // Validate syntax
  try {
    fs.writeFileSync(f, code, 'utf8');
    const { execSync } = require('child_process');
    execSync('node -c ' + f);
    console.log('Successfully saved and validated patched file:', f);
  } catch (err) {
    console.error('Syntax validation failed:', err.message);
  }
});
