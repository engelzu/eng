const fs = require('fs');

// Patterns for step 8e - defined here to avoid escaping issues in template literal
const OLD_IMG_HANDLER = '{var u=prompt("URL da imagem:");if(u)document.execCommand("insertImage",false,u)}';
const NEW_IMG_HANDLER = 'window.bcPickImage()';
const OLD_LNK_HANDLER = '{var u=prompt("URL:");if(u)document.execCommand("createLink",false,u)}';
const NEW_LNK_HANDLER = 'window.bcCreateLink()';
const OLD_TBL_EXEC = 'document.execCommand("insertHTML",false,\'<table border="1" cellpadding="4" cellspacing="0" style="width:100%;border-collapse:collapse"><tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr></table>\')';
const OLD_TBL_CLICK = 'onClick:()=>window.bcInsertTable()';
const NEW_TBL_CLICK = 'onClick:e=>window.bcShowTablePicker(e.currentTarget)';

const icon = {
  bold: `(0,t.jsx)("svg",{className:"w-3.5 h-3.5 stroke-[2.5]",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 12h8a4 4 0 000-8H6v8zm0 8h9a4 4 0 000-8H6v8z"})})`,
  italic: `(0,t.jsx)("svg",{className:"w-3.5 h-3.5 stroke-[2.5]",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M19 4h-9M14 20H5M15 4L9 20"})})`,
  underline: `(0,t.jsx)("svg",{className:"w-3.5 h-3.5 stroke-[2.5]",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 3v7a6 6 0 006 6 6 6 0 006-6V3M4 21h16"})})`,
  strike: `(0,t.jsx)("svg",{className:"w-3.5 h-3.5 stroke-[2.5]",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M3 12h18"})})`,
  left: `(0,t.jsx)("svg",{className:"w-3.5 h-3.5 stroke-[2.5]",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M4 6h16M4 12h10M4 18h16"})})`,
  center: `(0,t.jsx)("svg",{className:"w-3.5 h-3.5 stroke-[2.5]",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M4 6h16M7 12h10M4 18h16"})})`,
  right: `(0,t.jsx)("svg",{className:"w-3.5 h-3.5 stroke-[2.5]",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M4 6h16M10 12h10M4 18h16"})})`,
  justify: `(0,t.jsx)("svg",{className:"w-3.5 h-3.5 stroke-[2.5]",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M4 6h16M4 12h16M4 18h16"})})`,
  bullet: `(0,t.jsx)("svg",{className:"w-3.5 h-3.5 stroke-[2.5]",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9 6h11M9 12h11M9 18h11M5 6v.01M5 12v.01M5 18v.01"})})`,
  number: `(0,t.jsx)("svg",{className:"w-3.5 h-3.5 stroke-[2.5]",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9 6h11M9 12h11M9 18h11M4 6h1v4M4 10h2M4 16h2.5A1.5 1.5 0 008 14.5v-1a1.5 1.5 0 00-3 0v1h3"})})`,
  outdent: `(0,t.jsx)("svg",{className:"w-3.5 h-3.5 stroke-[2.5]",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M4 6h16M4 12h16M4 18h16M8 9l-3 3 3 3"})})`,
  indent: `(0,t.jsx)("svg",{className:"w-3.5 h-3.5 stroke-[2.5]",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M4 6h16M8 12h12M4 18h16M4 9l3 3-3 3"})})`,
  link: `(0,t.jsx)("svg",{className:"w-3.5 h-3.5 stroke-[2.5]",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"})})`,
  unlink: `(0,t.jsx)("svg",{className:"w-3.5 h-3.5 stroke-[2.5]",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"})})`,
  image: `(0,t.jsx)("svg",{className:"w-3.5 h-3.5 stroke-[2.5]",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"})})`,
  table: `(0,t.jsx)("svg",{className:"w-3.5 h-3.5 stroke-[2.5]",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M3 10h18M3 14h18m-9-4v8m-3-8v8m6-8v8M4 6h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"})})`,
  eraser: `(0,t.jsx)("svg",{className:"w-3.5 h-3.5 stroke-[2.5]",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})})`
};

function makeToolbarJsx() {
  const fmt = (v, label) => `(0,t.jsx)("option",{value:"${v}",children:"${label}"})`;
  const sep = '(0,t.jsx)("div",{className:"w-px bg-slate-200 self-stretch my-1 mx-0.5"})';
  const btn = (iconSvg, cmdName, tooltip, click) => `(0,t.jsx)("button",{type:"button","data-cmd":"${cmdName}",onMouseDown:e=>{e.preventDefault()},onClick:()=>${click},className:"p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-all active:scale-95 flex items-center justify-center",title:"${tooltip}",children:${iconSvg}})`;
  const items = [
    `(0,t.jsx)("select",{onChange:e=>{document.execCommand("formatBlock",false,e.target.value);e.target.value=""},className:"px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-all",children:[${fmt("", "Texto")},${fmt("h1", "Título 1")},${fmt("h2", "Título 2")},${fmt("h3", "Título 3")},${fmt("pre", "Código")}]})`,
    sep,
    btn(icon.bold, 'bold', 'Negrito', 'document.execCommand("bold")'),
    btn(icon.italic, 'italic', 'Itálico', 'document.execCommand("italic")'),
    btn(icon.underline, 'underline', 'Sublinhado', 'document.execCommand("underline")'),
    btn(icon.strike, 'strikeThrough', 'Tachado', 'document.execCommand("strikeThrough")'),
    sep,
    btn(icon.left, 'justifyLeft', 'Alinhar à Esquerda', 'document.execCommand("justifyLeft")'),
    btn(icon.center, 'justifyCenter', 'Centralizar', 'document.execCommand("justifyCenter")'),
    btn(icon.right, 'justifyRight', 'Alinhar à Direita', 'document.execCommand("justifyRight")'),
    btn(icon.justify, 'justifyFull', 'Justificar', 'document.execCommand("justifyFull")'),
    sep,
    btn(icon.bullet, 'insertUnorderedList', 'Marcadores', 'document.execCommand("insertUnorderedList")'),
    btn(icon.number, 'insertOrderedList', 'Lista Numerada', 'document.execCommand("insertOrderedList")'),
    sep,
    btn(icon.outdent, 'outdent', 'Diminuir Recuo', 'document.execCommand("outdent")'),
    btn(icon.indent, 'indent', 'Aumentar Recuo', 'document.execCommand("indent")'),
    sep,
    btn(icon.link, '', 'Inserir Link', 'window.bcCreateLink()'),
    btn(icon.unlink, '', 'Remover Link', 'document.execCommand("unlink")'),
    sep,
    btn(icon.image, '', 'Inserir Imagem', 'window.bcPickImage()'),
    `(0,t.jsx)("button",{type:"button","data-cmd":"",onMouseDown:e=>{e.preventDefault()},onClick:e=>window.bcShowTablePicker(e.currentTarget),className:"p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-all active:scale-95 flex items-center justify-center",title:"Inserir Tabela",children:${icon.table}})`,
    sep,
    btn(icon.eraser, '', 'Limpar Formatação', 'document.execCommand("removeFormat")'),
  ];
  return '(0,t.jsxs)("div",{className:"flex gap-0.5 items-center p-1.5 bg-slate-50 border border-slate-200 rounded-t-xl bc-editor-toolbar",children:[' + items.join(',') + ']})';
}

const toolbarJsx = makeToolbarJsx();

const fields = [
  'bcAvaliacaoMesAno', 'bcGerenciaEstudos', 'bcGerenciaEngenharia', 'bcAutores', 'bcCodigoDoc', 'bcCodigoFast', 'bcTituloProjeto', 'bcEtapa', 'bcUnidadeNegocio', 'bcCategoria', 'bcPilarEstrategico', 'bcPrograma', 'bcArea', 'bcTema', 'bc1Objetivo', 'bc2Contextualizacao', 'bc3Beneficios', 'bc4AvaliacaoAlinhamento', 'bc5Capex', 'bc6CronogramaPreliminar', 'bc15EstrategiaImplantacao', 'bc16Requisitos', 'bc17PremissasRestricoes', 'bc18Exclusoes', 'bc19FatoresCriticos', 'bc20RiscosIncertezas', 'bc21AvaliacaoEconomica', 'bc22Conclusao', 'bcEnviarAprovacao'
];

let stateReplacement = '[showBcModal,setShowBcModal]=(0,E.useState)(!1),';
// Add bcStatusAnterior state to track the original status before toggling
stateReplacement += '[bcStatusAnterior,setBcStatusAnterior]=(0,E.useState)(r.status&&r.status!=="AGUARDANDO APROVAÇÃO"?r.status:r.bcStatusAnterior||""),';

for (const field of fields) {
  let defaultVal = 'r.' + field + '||""';
  if (field === 'bcCodigoFast') defaultVal = `r.${field}||r.code||""`;
  if (field === 'bcTituloProjeto') defaultVal = `r.${field}||r.nomeDaIniciativa||r.title||r.name||""`;
  if (field === 'bcCategoria') defaultVal = `r.${field}||r.category||""`;
  if (field === 'bcArea') defaultVal = `r.${field}||r.managerArea||""`;
  if (field === 'bcAvaliacaoMesAno') defaultVal = `r.${field}||((d=new Date())=>String(d.getMonth()+1).padStart(2,0)+String.fromCharCode(47)+d.getFullYear())()`;
  if (field === 'bcEnviarAprovacao') defaultVal = `r.${field}||!1`;
  stateReplacement += `[${field},set${field.charAt(0).toUpperCase() + field.slice(1)}]=(0,E.useState)(${defaultVal}),`;
}

let saveVars = '';
for (const field of fields) {
  saveVars += `${field}:${field},`;
}
// Also save bcStatusAnterior to track the original status
saveVars += 'bcStatusAnterior:bcStatusAnterior,';
// When ON: save AGUARDANDO APROVAÇÃO; when OFF: restore previous status (or keep empty to not override)
saveVars += '...(bcEnviarAprovacao?{status:"AGUARDANDO APROVAÇÃO"}:(bcStatusAnterior?{status:bcStatusAnterior}:{})),...window.__bcValues||{},';

let applyLogic = "window.beforeBcSave&&window.beforeBcSave();eh();setShowBcModal(!1);";
let switchToggle = "(0,t.jsxs)(\"div\",{onClick:()=>setBcEnviarAprovacao(!bcEnviarAprovacao),className:\"flex items-center gap-2 cursor-pointer select-none\",children:[(0,t.jsx)(\"div\",{className:\"w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out \"+(bcEnviarAprovacao?\"bg-emerald-500\":\"bg-slate-300\"),children:(0,t.jsx)(\"div\",{className:\"w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out\",style:{transform:bcEnviarAprovacao?\"translateX(16px)\":\"translateX(0)\"}})}),(0,t.jsx)(\"span\",{className:\"text-xs font-black text-slate-700 uppercase tracking-wide\",children:\"ENVIAR PARA APROVAÇÃO\"})]})";

let modalMarkup = ",(0,t.jsx)(s.Vq,{open:showBcModal,onOpenChange:setShowBcModal,children:(0,t.jsxs)(s.cZ,{className:\"w-[98vw] max-w-[1200px] max-h-[95vh] flex flex-col overflow-hidden border-indigo-500 shadow-2xl rounded-2xl\",children:[(0,t.jsxs)(s.fK,{className:\"p-4 pb-3 bg-indigo-50/50 border-b border-indigo-100 shrink-0\",children:[(0,t.jsxs)(s.$N,{className:\"flex items-center gap-2 text-indigo-800 text-lg font-black\",children:[(0,t.jsx)(v.Z,{className:\"h-6 w-6\"}),\"BUSINESS CASE DIGITAL \" + (r.code ? \" - Código #\" + r.code : \"\")]}),(0,t.jsx)(s.Be,{className:\"text-sm text-indigo-600/80\",children:\"Preencha os dados abaixo para compor o documento de Business Case.\"})]}),(0,t.jsxs)(\"div\",{className:\"p-4 space-y-4 flex-1 overflow-y-auto bg-slate-50/30\",children:[";

// We define inputs and textareas below, and then append the final footer to modalMarkup:

const inputs = [
  { id: 'bcAvaliacaoMesAno', label: 'Avaliação Econômico-Financeira (MÊS/ANO)' },
  { id: 'bcGerenciaEstudos', label: 'Gerência de Estudos' },
  { id: 'bcGerenciaEngenharia', label: 'Gerência de Engenharia' },
  { id: 'bcAutores', label: 'Autores' },
  { id: 'bcCodigoDoc', label: 'Código do Documento' },
  { id: 'bcCodigoFast', label: 'Código FAST' },
  { id: 'bcTituloProjeto', label: 'Título do Projeto' },
  { id: 'bcEtapa', label: 'Etapa do Projeto' },
  { id: 'bcUnidadeNegocio', label: 'Unidade de Negócio' },
  { id: 'bcCategoria', label: 'Categoria' },
  { id: 'bcPilarEstrategico', label: 'Pilar Estratégico' },
  { id: 'bcPrograma', label: 'Programa' },
  { id: 'bcArea', label: 'Área' },
  { id: 'bcTema', label: 'Tema' }
];

modalMarkup += "(0,t.jsx)(\"div\",{className:\"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 gap-2 p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm\",children:[";
let firstInput = true;
for (const input of inputs) {
  if (!firstInput) modalMarkup += ",";
  firstInput = false;
  modalMarkup += "(0,t.jsxs)(\"div\",{className:\"flex flex-col gap-1\",children:[(0,t.jsx)(\"label\",{className:\"text-[10px] font-black tracking-wider text-slate-500 uppercase\",children:\"" + input.label + "\"}),(0,t.jsx)(\"input\",{type:\"text\",value:" + input.id + ",onChange:e=>set" + input.id.charAt(0).toUpperCase() + input.id.slice(1) + "(e.target.value),className:\"w-full h-8 px-2 text-xs border border-slate-200 rounded outline-none focus:border-indigo-500 transition-all\"})]})";
}
modalMarkup += "]}),";

const textareas = [
  { id: 'bc1Objetivo', label: '1. Objetivo' },
  { id: 'bc2Contextualizacao', label: '2. Contextualização' },
  { id: 'bc3Beneficios', label: '3. Benefícios' },
  { id: 'bc4AvaliacaoAlinhamento', label: '4. Avaliação de alinhamento estratégico' },
  { id: 'bc5Capex', label: '5. CAPEX' },
  { id: 'bc6CronogramaPreliminar', label: '6. Cronograma Preliminar (CRONOGRAMA) Fel 2 e 3' },
  { id: 'bc15EstrategiaImplantacao', label: '7. Estratégia de Implantação' },
  { id: 'bc16Requisitos', label: '8. Requisitos' },
  { id: 'bc17PremissasRestricoes', label: '9. Premissas e Restrições' },
  { id: 'bc18Exclusoes', label: '10. Exclusões' },
  { id: 'bc19FatoresCriticos', label: '11. Fatores críticos de sucesso' },
  { id: 'bc20RiscosIncertezas', label: '12. Riscos e Incertezas' },
  { id: 'bc21AvaliacaoEconomica', label: '13. Avaliação econômica' },
  { id: 'bc22Conclusao', label: '14. Conclusão' }
];
modalMarkup += "(0,t.jsx)(\"div\",{className:\"flex flex-col gap-4 w-full max-w-[850px] mx-auto\",children:[";
let firstTa = true;
for (const ta of textareas) {
  if (!firstTa) modalMarkup += ",";
  firstTa = false;
  modalMarkup += `(0,t.jsxs)("div",{className:"flex flex-col gap-1.5 p-3 bg-white border border-slate-200 rounded-xl shadow-sm",children:[(0,t.jsx)("h3",{className:"text-xs font-bold text-slate-800 uppercase tracking-wide",children:"${ta.label}"}),${toolbarJsx},(0,t.jsx)("div",{contentEditable:!0,ref:function(el){window.bcInitEditor(el,${ta.id},set${ta.id.charAt(0).toUpperCase() + ta.id.slice(1)});},onInput:e=>set${ta.id.charAt(0).toUpperCase() + ta.id.slice(1)}(e.currentTarget.innerHTML),className:"w-full p-2 text-sm border border-slate-200 rounded-none rounded-b-xl border-t-0 outline-none focus:border-indigo-500 transition-all min-h-[120px] bg-white",suppressContentEditableWarning:!0})]})`;
}
modalMarkup += "]})]})"; // close body
modalMarkup += ",(0,t.jsxs)(s.cN,{className:\"shrink-0 p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center gap-2\",children:[" + switchToggle + ",(0,t.jsxs)(\"div\",{className:\"flex gap-2\",children:[(0,t.jsx)(\"button\",{type:\"button\",onClick:()=>setShowBcModal(!1),className:\"rounded-xl font-black text-xs px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 bg-white\",children:\"FECHAR\"}),(0,t.jsx)(\"button\",{type:\"button\",onClick:()=>{" + applyLogic + "},className:\"bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 rounded-xl font-black text-xs px-4 py-2 shadow-sm\",children:\"SALVAR BUSINESS CASE\"})]})]})]})})";

// We define triggerBcBtn with standard HTML button for robust styling and contrast (solid Indigo with White text)
let triggerBcBtn = "(typeof window !== \\'undefined\\' && !/fast|carga|admin/i.test(window.location.href)) ? (0,t.jsxs)(\\\"button\\\",{type:\\\"button\\\",onClick:()=>setShowBcModal(!0),className:\\\"bc-btn-trigger h-7 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] flex items-center gap-1 border border-emerald-700 shadow-sm uppercase tracking-wider rounded-full\\\",children:[(0,t.jsx)(N.Z,{className:\\\"h-3.5 w-3.5 text-white\\\"}),(0,t.jsx)(\\\"span\\\",{children:\\\"FAZER O BUSINESS CASE DIGITAL\\\"})]}) : null";

const scriptCode = `
const fs = require('fs');
const files = [
  '_next/static/chunks/6120-99ba76de6fd208f3.js',
  'OUT/_next/static/chunks/6120-99ba76de6fd208f3.js'
];

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let code = fs.readFileSync(f, 'utf8');
  
  // 1. Inject state
  const stateTarget = '[showEapModal,setShowEapModal]=(0,E.useState)(!1),';
  if (code.includes(stateTarget) && !code.includes('bc1Objetivo')) {
    code = code.replace(stateTarget, stateTarget + '${stateReplacement}');
    console.log('Injected state');
  }
  
  // 2. Inject DB saving logic
  const saveTarget = 'updatedAt:';
  if (code.includes(saveTarget) && !code.includes('bcAvaliacaoMesAno:bcAvaliacaoMesAno,')) {
    code = code.replace(saveTarget, '${saveVars}' + saveTarget);
    console.log('Injected DB save logic');
  }
  
  // 3. Inject Button
  const btnTarget = 'CARREGAR BUSINESS CASE\"]}),(0,t.jsxs)(u.z,{size:\"sm\",variant:\"ghost\",className:\"h-7 px-2 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-black text-[9px] flex items-center gap-1 border border-emerald-100 rounded-full\",onClick:()';
  
  if (code.includes(btnTarget) && !code.includes('open:showBcModal')) {
    const newBtnHtml = 'CARREGAR BUSINESS CASE\"]}),(0,t.jsxs)(\"div\",{className:\"flex gap-2 items-center\",children:[${triggerBcBtn},(0,t.jsxs)(u.z,{size:\"sm\",variant:\"ghost\",className:\"h-7 px-2 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-black text-[9px] flex items-center gap-1 border border-emerald-100 rounded-full\",onClick:()';
    code = code.replace(btnTarget, newBtnHtml);
    code = code.replace('"ANEXAR"]})', '"ANEXAR"]})]})');
    console.log('Injected Button');
  }
  
  // 4. Inject Modal Markup
  const modalTarget = ',(0,t.jsx)(s.Vq,{open:showEapModal,';
  if (code.includes(modalTarget) && !code.includes('open:showBcModal')) {
    code = code.replace(modalTarget, ${JSON.stringify(modalMarkup)} + modalTarget);
    console.log('Injected Modal Markup');
  }

  // 5. Fix useEffect to reset bcEnviarAprovacao and bcStatusAnterior when record changes
  const effectEnd = 'setConActive(r.conActive||!!(r.conInicio||r.conTermino||r.conCusto))},[r])';
  if (code.includes(effectEnd) && !code.includes('setBcEnviarAprovacao(r.bcEnviarAprovacao||!1)')) {
    code = code.replace(effectEnd, 'setConActive(r.conActive||!!(r.conInicio||r.conTermino||r.conCusto)),setBcEnviarAprovacao(r.bcEnviarAprovacao||!1),setBcStatusAnterior(r.status&&r.status!=="AGUARDANDO APROVAÇÃO"?r.status:r.bcStatusAnterior||"")},[r])');
    console.log('Fixed useEffect to reset bcEnviarAprovacao');
  }

  // 6. Remove any debug logs that may have been injected
  if (code.includes('[BC-DEBUG]')) {
    code = code.replace(/console.log\\(\"\\\[BC-DEBUG\\\][^\\\"]*\"[^;]*\\);/g, '');
    console.log('Removed BC debug log');
  }

  // 7. Ensure save button onClick is clean (no TinyMCE hooks)
  const saveBtnClean1 = 'onClick:()=>{setTimeout(()=>{eh();setShowBcModal(!1);});}';
  const saveBtnClean2 = 'onClick:()=>{eh();setShowBcModal(!1);}';
  // If already clean, do nothing
  if (code.includes(saveBtnClean1) || code.includes(saveBtnClean2)) {
    console.log('Save button onClick already clean');
  } else {
    // Try to find the save button and force-clean it
    const saveBtnAny = /onClick:\\(\\)=>\\{[^}]+eh\\(\\).*?setShowBcModal/;
    const match = code.match(saveBtnAny);
    if (match) {
      const idx = code.indexOf('onClick:()=>{');
      const start = code.indexOf('onClick:()=>{', idx);
      const end = code.indexOf('}', start) + 1;
      if (start >= 0) {
        // Find the full onClick pattern
        const oldOnClick = code.substring(start, end);
        if (oldOnClick.includes('})')) {
          code = code.replace(oldOnClick, 'onClick:()=>{eh();setShowBcModal(!1);}');
          console.log('Force-cleaned save button onClick');
        }
      }
    }
  }

  // 8. Replace textarea elements with contentEditable div + toolbar for each BC field
  const textareaFields = ['bc1Objetivo','bc2Contextualizacao','bc3Beneficios','bc4AvaliacaoAlinhamento','bc5Capex','bc6CronogramaPreliminar','bc15EstrategiaImplantacao','bc16Requisitos','bc17PremissasRestricoes','bc18Exclusoes','bc19FatoresCriticos','bc20RiscosIncertezas','bc21AvaliacaoEconomica','bc22Conclusao'];
  for (const f of textareaFields) {
    const cap = f.charAt(0).toUpperCase() + f.slice(1);
    const oldPattern = '(0,t.jsx)(\"textarea\",{id:\"' + f + '\",value:' + f + ',onChange:e=>set' + cap + '(e.target.value),rows:4,className:\"bc-tinymce w-full p-2 text-sm border border-slate-200 rounded outline-none focus:border-indigo-500 transition-all resize-y min-h-[80px]\"})';
    const oldPatternNoId = '(0,t.jsx)(\"textarea\",{value:' + f + ',onChange:e=>set' + cap + '(e.target.value),rows:4,className:\"bc-tinymce w-full p-2 text-sm border border-slate-200 rounded outline-none focus:border-indigo-500 transition-all resize-y min-h-[80px]\"})';
    // New contentEditable div with inline toolbar (concatenated to avoid quote issues)
    const newPattern = '(0,t.jsxs)(\"div\",{className:\"flex flex-col gap-1\",children:[' + ${JSON.stringify(toolbarJsx)} + ',(0,t.jsx)(\"div\",{contentEditable:!0,ref:function(el){window.bcInitEditor(el,' + f + ',set' + cap + ');},onInput:function(e){set' + cap + '(e.currentTarget.innerHTML);},className:\"w-full p-2 text-sm border border-slate-200 rounded-none rounded-b-xl border-t-0 outline-none focus:border-indigo-500 transition-all min-h-[120px] bg-white\",suppressContentEditableWarning:!0})]})';
    if (code.includes(oldPattern)) {
      code = code.replace(oldPattern, newPattern);
      console.log('Replaced textarea ' + f + ' with contentEditable div');
    } else if (code.includes(oldPatternNoId)) {
      code = code.replace(oldPatternNoId, newPattern);
      console.log('Replaced textarea (no ID) ' + f + ' with contentEditable div');
    }
  }

  // 8b. Replace textarea elements WITHOUT id for bcEscopoResumido and bcDescricaoEscopo
  const extraNoIdFields = ['bcEscopoResumido','bcDescricaoEscopo'];
  for (const f of extraNoIdFields) {
    const cap = f.charAt(0).toUpperCase() + f.slice(1);
    const oldPattern = '(0,t.jsx)(\"textarea\",{value:' + f + ',onChange:e=>set' + cap + '(e.target.value),rows:4,className:\"bc-tinymce w-full p-2 text-sm border border-slate-200 rounded outline-none focus:border-indigo-500 transition-all resize-y min-h-[80px]\"})';
    const newPattern = '(0,t.jsxs)(\"div\",{className:\"flex flex-col gap-1\",children:[' + ${JSON.stringify(toolbarJsx)} + ',(0,t.jsx)(\"div\",{contentEditable:!0,ref:function(el){window.bcInitEditor(el,' + f + ',set' + cap + ');},onInput:function(e){set' + cap + '(e.currentTarget.innerHTML);},className:\"w-full p-2 text-sm border border-slate-200 rounded-none rounded-b-xl border-t-0 outline-none focus:border-indigo-500 transition-all min-h-[120px] bg-white\",suppressContentEditableWarning:!0})]})';
    if (code.includes(oldPattern)) {
      code = code.replace(oldPattern, newPattern);
      console.log('Replaced textarea ' + f + ' with contentEditable div');
    }
  }

  // 8c. Replace old basic toolbar (B,I,U,UL,OL) with expanded WordPad-like toolbar in already-patched fields
  const oldToolbar = '(0,t.jsxs)(\"div\",{className:\"flex gap-1 flex-wrap bc-editor-toolbar\",children:[(0,t.jsx)(\"button\",{type:\"button\",onClick:()=>document.execCommand(\"bold\"),className:\"px-2 py-0.5 text-xs font-bold border border-slate-300 rounded hover:bg-slate-100 bg-white\",children:\"B\"}),(0,t.jsx)(\"button\",{type:\"button\",onClick:()=>document.execCommand(\"italic\"),className:\"px-2 py-0.5 text-xs italic border border-slate-300 rounded hover:bg-slate-100 bg-white\",children:\"I\"}),(0,t.jsx)(\"button\",{type:\"button\",onClick:()=>document.execCommand(\"underline\"),className:\"px-2 py-0.5 text-xs underline border border-slate-300 rounded hover:bg-slate-100 bg-white\",children:\"U\"}),(0,t.jsx)(\"button\",{type:\"button\",onClick:()=>document.execCommand(\"insertUnorderedList\"),className:\"px-2 py-0.5 text-xs border border-slate-300 rounded hover:bg-slate-100 bg-white\",children:\"\\\\u2022\"}),(0,t.jsx)(\"button\",{type:\"button\",onClick:()=>document.execCommand(\"insertOrderedList\"),className:\"px-2 py-0.5 text-xs border border-slate-300 rounded hover:bg-slate-100 bg-white\",children:\"1.\"})]})';
  const oldToolbarCnt = code.split(oldToolbar).length - 1;
  if (oldToolbarCnt > 0) {
    code = code.split(oldToolbar).join(${JSON.stringify(toolbarJsx)});
    console.log('Replaced ' + oldToolbarCnt + ' old toolbars with expanded WordPad toolbar');
  }

  // 8d. Add onMouseDown to toolbar buttons (prevent focus loss on click).
  // First, strip any existing duplicates so we don't cascade.
  code = code.replace(/(onMouseDown:e=>\\{e\\.preventDefault\\(\\)\\},)+(onClick:(?:\\(\\)|e)=>)/g, '$2');
  // Now add exactly one onMouseDown to each button that lacks it.
  const mdPrefix = 'onMouseDown:e=>{e.preventDefault()},onClick:()=>';
  const oldStd = 'onClick:()=>document.execCommand';
  const newStd = mdPrefix + 'document.execCommand';
  const stdCount = code.split(oldStd).length - 1;
  if (stdCount > 0) {
    code = code.split(oldStd).join(newStd);
    console.log('Added onMouseDown to ' + stdCount + ' standard toolbar buttons');
  }
  // Also add onMouseDown to onClick:e=>window.bcShowTablePicker
  const oldTbl = 'onClick:e=>window.bcShowTablePicker';
  const newTbl = 'onMouseDown:e=>{e.preventDefault()},onClick:e=>window.bcShowTablePicker';
  const tblCount = code.split(oldTbl).length - 1;
  if (tblCount > 0) {
    code = code.split(oldTbl).join(newTbl);
    console.log('Added onMouseDown to ' + tblCount + ' table-picker buttons');
  }
  // Also add onMouseDown to buttons that call window.bc* helpers (already have onMouseDown from previous steps, but ensure they have exactly one)
  const oldWin = 'onClick:()=>window.bc';
  const newWin = 'onMouseDown:e=>{e.preventDefault()},onClick:()=>window.bc';
  const winCount = code.split(oldWin).length - 1;
  if (winCount > 0) {
    code = code.split(oldWin).join(newWin);
    console.log('Added onMouseDown to ' + winCount + ' window.bc* buttons');
  }

  // 8e. Replace old inline table/image/link handlers with window.bc* helpers
  const oldImg = ${JSON.stringify(OLD_IMG_HANDLER)};
  const newImg = ${JSON.stringify(NEW_IMG_HANDLER)};
  if (code.includes(oldImg)) {
    code = code.split(oldImg).join(newImg);
    console.log('Replaced old image handler with window.bcPickImage');
  }
  const oldLnk = ${JSON.stringify(OLD_LNK_HANDLER)};
  const newLnk = ${JSON.stringify(NEW_LNK_HANDLER)};
  if (code.includes(oldLnk)) {
    code = code.split(oldLnk).join(newLnk);
    console.log('Replaced old link handler with window.bcCreateLink');
  }
  const oldTblExec = ${JSON.stringify(OLD_TBL_EXEC)};
  const newTblExec = ${JSON.stringify('window.bcInsertTable()')};
  if (code.includes(oldTblExec)) {
    code = code.split(oldTblExec).join(newTblExec);
    console.log('Replaced old table handler with window.bcInsertTable');
  }
  const oldTblClick = ${JSON.stringify(OLD_TBL_CLICK)};
  const newTblClick = ${JSON.stringify(NEW_TBL_CLICK)};
  if (code.includes(oldTblClick)) {
    code = code.split(oldTblClick).join(newTblClick);
    console.log('Updated table button to use grid picker');
  }

  // 8f. Replace dangerouslySetInnerHTML with ref-based uncontrolled contentEditable
  // to prevent cursor jumping when typing inside tables and allow image resize handles
  const bcFields8f = ['bc1Objetivo','bc2Contextualizacao','bc3Beneficios','bc4AvaliacaoAlinhamento','bc5Capex','bc6CronogramaPreliminar','bc15EstrategiaImplantacao','bc16Requisitos','bc17PremissasRestricoes','bc18Exclusoes','bc19FatoresCriticos','bc20RiscosIncertezas','bc21AvaliacaoEconomica','bc22Conclusao','bcEscopoResumido','bcDescricaoEscopo'];
  for (const f of bcFields8f) {
    const cap = f.charAt(0).toUpperCase() + f.slice(1);
    const oldDiv = '(0,t.jsx)(\"div\",{contentEditable:!0,dangerouslySetInnerHTML:{__html:' + f + '},onInput:e=>set' + cap + '(e.currentTarget.innerHTML),className:\"w-full p-2 text-sm border border-slate-200 rounded outline-none focus:border-indigo-500 transition-all min-h-[80px] whitespace-pre-wrap\",suppressContentEditableWarning:!0})';
    const newDiv = '(0,t.jsx)(\"div\",{contentEditable:!0,ref:function(el){window.bcInitEditor(el,' + f + ',set' + cap + ');},onInput:function(e){set' + cap + '(e.currentTarget.innerHTML);},className:\"w-full p-2 text-sm border border-slate-200 rounded-none rounded-b-xl border-t-0 outline-none focus:border-indigo-500 transition-all min-h-[120px] bg-white\",suppressContentEditableWarning:!0})';
    if (code.includes(oldDiv)) {
      code = code.split(oldDiv).join(newDiv);
      console.log('Replaced dangerouslySetInnerHTML with ref for ' + f);
    }
  }

  // 9. Remove window.__bcValues spread from save payload (no longer needed)
  const bcValuesPattern = ',...window.__bcValues||{}';
  if (code.includes(bcValuesPattern)) {
    code = code.replace(bcValuesPattern, '');
    console.log('Removed __bcValues from save payload');
  }

  // 10. Patch chunk 507's specific save pattern (uses bcDataRef.current instead of eh())
  const dataRefStart = 'onClick:async()=>{bcDataRef.current={';
  const dataRefStartPatched = 'onClick:async()=>{window.beforeBcSave&&window.beforeBcSave();bcDataRef.current={';
  if (code.includes(dataRefStart) && !code.includes('beforeBcSave')) {
    code = code.replace(dataRefStart, dataRefStartPatched);
    console.log('Patched chunk 507 onClick to call beforeBcSave');
  }

  const dataRefPayloadEnd = 'bcEnviarAprovacao:bcEnviarAprovacao,};';
  const dataRefPayloadPatched = 'bcEnviarAprovacao:bcEnviarAprovacao,...window.__bcValues||{}};';
  if (code.includes(dataRefPayloadEnd) && !code.includes('__bcValues||{}')) {
    code = code.replace(dataRefPayloadEnd, dataRefPayloadPatched);
    console.log('Added ...window.__bcValues to bcDataRef.current payload');
  }

  // 11. Remove __bcValues spread from bcDataRef payload (no longer needed)
  const dataRefClean = 'bcEnviarAprovacao:bcEnviarAprovacao,...window.__bcValues||{}};';
  const dataRefCleanNew = 'bcEnviarAprovacao:bcEnviarAprovacao};';
  if (code.includes(dataRefClean)) {
    code = code.replace(dataRefClean, dataRefCleanNew);
    console.log('Removed __bcValues from bcDataRef payload');
  }

  // 12. Remove window.beforeBcSave from save button onClick (no longer needed)
  const beforeBcSavePat1 = 'onClick:()=>{window.beforeBcSave&&window.beforeBcSave();setTimeout(()=>{eh();setShowBcModal(!1);});}';
  const beforeBcSavePat2 = 'onClick:()=>{window.beforeBcSave&&window.beforeBcSave();eh();setShowBcModal(!1);}';
  const cleanOnClick1 = 'onClick:()=>{setTimeout(()=>{eh();setShowBcModal(!1);});}';
  const cleanOnClick2 = 'onClick:()=>{eh();setShowBcModal(!1);}';
  if (code.includes(beforeBcSavePat1)) {
    code = code.replace(beforeBcSavePat1, cleanOnClick1);
    console.log('Removed beforeBcSave from setTimeout save button');
  }
  if (code.includes(beforeBcSavePat2)) {
    code = code.replace(beforeBcSavePat2, cleanOnClick2);
    console.log('Removed beforeBcSave from sync save button');
  }

  // 13. Remove beforeBcSave from bcDataRef save button
  const dataRefBefore = 'onClick:async()=>{window.beforeBcSave&&window.beforeBcSave();bcDataRef.current={';
  const dataRefCleanClick = 'onClick:async()=>{bcDataRef.current={';
  if (code.includes(dataRefBefore)) {
    code = code.replace(dataRefBefore, dataRefCleanClick);
    console.log('Removed beforeBcSave from bcDataRef save button');
  }

  fs.writeFileSync(f, code);
  console.log('Patched ' + f);
}
`;

fs.writeFileSync('patch_bc.js', scriptCode);
console.log('Script patch_bc.js built');
