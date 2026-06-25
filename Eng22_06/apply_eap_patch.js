const fs = require('fs');

const files = [
  '_next/static/chunks/6120-99ba76de6fd208f3.js'
];

files.forEach(f => {
  if (!fs.existsSync(f)) {
    console.log('File does not exist:', f);
    return;
  }
  let code = fs.readFileSync(f, 'utf8');

  // 1. Inject state variables
  const stateTarget = '[eo,ec]=(0,E.useState)(null),';
  const stateReplacement = '[eo,ec]=(0,E.useState)(null),[eap,setEap]=(0,E.useState)(r.eap||""),[engCusto,setEngCusto]=(0,E.useState)(r.engCusto||""),[engInicio,setEngInicio]=(0,E.useState)(r.engInicio||""),[engTermino,setEngTermino]=(0,E.useState)(r.engTermino||""),[matCusto,setMatCusto]=(0,E.useState)(r.matCusto||""),[matInicio,setMatInicio]=(0,E.useState)(r.matInicio||""),[matTermino,setMatTermino]=(0,E.useState)(r.matTermino||""),[serCusto,setSerCusto]=(0,E.useState)(r.serCusto||""),[serInicio,setSerInicio]=(0,E.useState)(r.serInicio||""),[serTermino,setSerTermino]=(0,E.useState)(r.serTermino||""),[equCusto,setEquCusto]=(0,E.useState)(r.equCusto||""),[equInicio,setEquInicio]=(0,E.useState)(r.equInicio||""),[equTermino,setEquTermino]=(0,E.useState)(r.equTermino||""),[showEapModal,setShowEapModal]=(0,E.useState)(!1),';
  if (code.includes(stateTarget)) {
    code = code.replace(stateTarget, stateReplacement);
    console.log('Injected state variables into', f);
  } else {
    console.log('State target not found in', f);
    return;
  }

  // 2. Inject useEffect reset logic
  const useEffectTarget = '$(r.anoCapex||\"\"},[r]);';
  const useEffectReplacement = '$(r.anoCapex||\"\"),setEap(r.eap||\"\"),setEngCusto(r.engCusto||\"\"),setEngInicio(r.engInicio||\"\"),setEngTermino(r.engTermino||\"\"),setMatCusto(r.matCusto||\"\"),setMatInicio(r.matInicio||\"\"),setMatTermino(r.matTermino||\"\"),setSerCusto(r.serCusto||\"\"),setSerInicio(r.serInicio||\"\"),setSerTermino(r.serTermino||\"\"),setEquCusto(r.equCusto||\"\"),setEquInicio(r.equInicio||\"\"),setEquTermino(r.equTermino||\"\"),setShowEapModal(!1)},[r]);';
  if (code.includes(useEffectTarget)) {
    code = code.replace(useEffectTarget, useEffectReplacement);
    console.log('Injected useEffect reset into', f);
  } else {
    console.log('useEffect target not found in', f);
    return;
  }

  // 3. Inject database saving logic
  const saveTarget = 'priority:Number(G),projectType:W,anoCapex:J,updatedAt:';
  const saveReplacement = 'priority:Number(G),projectType:W,anoCapex:J,eap:eap,engCusto:engCusto,engInicio:engInicio,engTermino:engTermino,matCusto:matCusto,matInicio:matInicio,matTermino:matTermino,serCusto:serCusto,serInicio:serInicio,serTermino:serTermino,equCusto:equCusto,equInicio:equInicio,equTermino:equTermino,updatedAt:';
  if (code.includes(saveTarget)) {
    code = code.replace(saveTarget, saveReplacement);
    console.log('Injected database save logic into', f);
  } else {
    console.log('Save target not found in', f);
    return;
  }

  // 4. Replace CRONOGRAMA card
  const cardStartKeyword = '(0,t.jsxs)("div",{className:"space-y-3 p-4 bg-white border border-emerald-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("h3",{className:"text-[10px] font-black text-emerald-800 uppercase flex items-center gap-2 tracking-widest",children:[(0,t.jsx)(v.Z,{className:"h-4 w-4 text-emerald-500"})," CRONOGRAMA"]})]})]})';
  const startIdx = code.indexOf(cardStartKeyword);
  if (startIdx === -1) {
    console.log('Card start keyword not found in', f);
    return;
  }

  const cardEndKeyword = 'Nenhum anexo"})})})]}),';
  const endIdx = code.indexOf(cardEndKeyword, startIdx);
  if (endIdx === -1) {
    console.log('Card end keyword not found in', f);
    return;
  }
  const endLimitIdx = endIdx + cardEndKeyword.length;

  const newCardMarkup = '(0,t.jsxs)("div",{className:"space-y-3 p-4 bg-white border border-emerald-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("h3",{className:"text-[10px] font-black text-emerald-800 uppercase flex items-center gap-2 tracking-widest",children:[(0,t.jsx)(v.Z,{className:"h-4 w-4 text-emerald-500"})," CRONOGRAMA E VALORES EAP"}),(0,t.jsx)(u.z,{size:"sm",variant:"ghost",className:"h-8 px-3 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-black text-[10px] flex items-center gap-1.5 border border-emerald-100 rounded-full",onClick:()=>setShowEapModal(!0),children:"DEFINIR EAP"})]}),(0,t.jsx)("div",{className:"space-y-2",children:eap?(0,t.jsxs)("div",{className:"bg-emerald-50/30 p-2 rounded-xl border border-emerald-100/50 space-y-1",children:[(0,t.jsxs)("p",{className:"text-[10px] font-bold text-slate-700",children:[(0,t.jsx)("span",{className:"text-muted-foreground uppercase text-[9px] mr-1",children:"EAP:"}),eap]}),(0,t.jsxs)("p",{className:"text-[10px] font-bold text-slate-700",children:[(0,t.jsx)("span",{className:"text-muted-foreground uppercase text-[9px] mr-1",children:"Custo Total:"}),new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format((parseFloat(engCusto)||0)+(parseFloat(matCusto)||0)+(parseFloat(serCusto)||0)+(parseFloat(equCusto)||0))]}),(0,t.jsxs)("p",{className:"text-[9px] text-muted-foreground italic",children:["Salvar classificação para registrar no banco."]})]): (0,t.jsx)("div",{className:"h-12 flex items-center justify-center border border-dashed border-emerald-200 rounded-xl bg-emerald-50/20",children:(0,t.jsx)("p",{className:"text-[10px] text-emerald-600/50 font-bold uppercase tracking-widest",children:"Nenhum cronograma definido"})})]})})';

  code = code.slice(0, startIdx) + newCardMarkup + code.slice(endLimitIdx);
  console.log('Replaced CRONOGRAMA card in', f);

  // 5. Append showEapModal Dialog
  const confirmModalStr = ',(0,t.jsx)(M.B,{open:et,onOpenChange:es,onConfirm:eg,title:"Excluir Anexo",description:"Esta ação removerá permanentemente o arquivo deste estudo."})';
  const modalIdx = code.indexOf(confirmModalStr);
  if (modalIdx === -1) {
    console.log('Confirm modal string not found in', f);
    return;
  }
  // Load external EAP modal markup
  const eapModalMarkup = require('./eap_modal_markup.js');

  code = code.slice(0, modalIdx + confirmModalStr.length) + eapModalMarkup + code.slice(modalIdx + confirmModalStr.length);
  console.log('Appended EAP modal component to', f);

  fs.writeFileSync(f, code, 'utf8');
  console.log('Successfully written patches to', f);
});
