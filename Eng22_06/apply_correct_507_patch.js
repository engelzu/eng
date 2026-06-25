const fs = require('fs');

// Ensure we start from a clean copy of 507 first by copying from the backup
console.log('Restoring clean 507 chunk...');
fs.copyFileSync('C:/Users/Admin/Downloads/Eng0206/Eng0206/_next/static/chunks/507-1cbb4e1ae80f89d3.js', '_next/static/chunks/507-1cbb4e1ae80f89d3.js');
fs.copyFileSync('C:/Users/Admin/Downloads/Eng0206/Eng0206/_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js');
console.log('Restored.');

const files = [
  '_next/static/chunks/507-1cbb4e1ae80f89d3.js',
  'OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js'
];

// Define inputs and textareas variables
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

let inputsMarkup = inputs.map(input => {
  return `(0,t.jsxs)("div",{className:"flex flex-col gap-1",children:[(0,t.jsx)("label",{className:"text-[10px] font-black tracking-wider text-slate-500 uppercase",children:"${input.label}"}),(0,t.jsx)("input",{type:"text",value:${input.id},onChange:e=>set${input.id.charAt(0).toUpperCase() + input.id.slice(1)}(e.target.value),className:"w-full h-8 px-2 text-xs border border-slate-200 rounded outline-none focus:border-indigo-500 transition-all"})]})`;
}).join(',');

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

let textareasMarkup = textareas.map(ta => {
  return `(0,t.jsxs)("div",{className:"flex flex-col gap-1.5 p-3 bg-white border border-slate-200 rounded-xl shadow-sm",children:[(0,t.jsx)("h3",{className:"text-xs font-bold text-slate-800 uppercase tracking-wide",children:"${ta.label}"}),${toolbarJsx},(0,t.jsx)("div",{contentEditable:!0,ref:function(el){window.bcInitEditor(el,${ta.id},set${ta.id.charAt(0).toUpperCase() + ta.id.slice(1)});},onInput:e=>set${ta.id.charAt(0).toUpperCase() + ta.id.slice(1)}(e.currentTarget.innerHTML),className:"w-full p-2 text-sm border border-slate-200 rounded-none rounded-b-xl border-t-0 outline-none focus:border-indigo-500 transition-all min-h-[120px] bg-white",suppressContentEditableWarning:!0})]})`;
}).join(',');

let switchToggle = `(0,t.jsxs)("div",{onClick:()=>setBcEnviarAprovacao(!bcEnviarAprovacao),className:"flex items-center gap-2 cursor-pointer select-none",children:[(0,t.jsx)("div",{className:"w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out "+(bcEnviarAprovacao?"bg-emerald-500":"bg-slate-300"),children:(0,t.jsx)("div",{className:"w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out",style:{transform:bcEnviarAprovacao?"translateX(16px)":"translateX(0)"}})}),(0,t.jsx)("span",{className:"text-xs font-black text-slate-700 uppercase tracking-wide",children:"ENVIAR PARA APROVAÇÃO"})]})`;

let saveVars = 'bcAvaliacaoMesAno:bcAvaliacaoMesAno,bcGerenciaEstudos:bcGerenciaEstudos,bcGerenciaEngenharia:bcGerenciaEngenharia,bcAutores:bcAutores,bcCodigoDoc:bcCodigoDoc,bcCodigoFast:bcCodigoFast,bcTituloProjeto:bcTituloProjeto,bcEtapa:bcEtapa,bcUnidadeNegocio:bcUnidadeNegocio,bcCategoria:bcCategoria,bcPilarEstrategico:bcPilarEstrategico,bcPrograma:bcPrograma,bcArea:bcArea,bcTema:bcTema,bc1Objetivo:bc1Objetivo,bc2Contextualizacao:bc2Contextualizacao,bc3Beneficios:bc3Beneficios,bc4AvaliacaoAlinhamento:bc4AvaliacaoAlinhamento,bc5Capex:bc5Capex,bc6CronogramaPreliminar:bc6CronogramaPreliminar,bc15EstrategiaImplantacao:bc15EstrategiaImplantacao,bc16Requisitos:bc16Requisitos,bc17PremissasRestricoes:bc17PremissasRestricoes,bc18Exclusoes:bc18Exclusoes,bc19FatoresCriticos:bc19FatoresCriticos,bc20RiscosIncertezas:bc20RiscosIncertezas,bc21AvaliacaoEconomica:bc21AvaliacaoEconomica,bc22Conclusao:bc22Conclusao,bcEnviarAprovacao:bcEnviarAprovacao,';

let modalMarkup = `(0,t.jsx)(ModalLibrary_507.Vq,{open:showBcModal,onOpenChange:setShowBcModal,children:(0,t.jsxs)(ModalLibrary_507.cZ,{className:"w-[98vw] max-w-[1200px] max-h-[95vh] flex flex-col overflow-hidden border-indigo-500 shadow-2xl rounded-2xl",children:[(0,t.jsxs)(ModalLibrary_507.fK,{className:"p-4 pb-3 bg-indigo-50/50 border-b border-indigo-100 shrink-0",children:[(0,t.jsxs)(ModalLibrary_507.$N,{className:"flex items-center gap-2 text-indigo-800 text-lg font-black",children:[(0,t.jsx)(S.Z,{className:"h-6 w-6"}),"BUSINESS CASE DIGITAL " + ((a&&a.code) ? " - Código #" + a.code : "")]}),(0,t.jsx)(ModalLibrary_507.Be,{className:"text-sm text-indigo-600/80",children:"Preencha os dados abaixo para compor o documento de Business Case."})]}),(0,t.jsxs)("div",{className:"p-4 space-y-4 flex-1 overflow-y-auto bg-slate-50/30",children:[(0,t.jsx)("div",{className:"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 gap-2 p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm",children:[${inputsMarkup}]}),(0,t.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-1 gap-3",children:[${textareasMarkup}]})]}),(0,t.jsxs)(ModalLibrary_507.cN,{className:"shrink-0 p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center gap-2",children:[${switchToggle},(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)("button",{type:"button",onClick:()=>setShowBcModal(!1),className:"rounded-xl font-black text-xs px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 bg-white",children:"FECHAR"}),(0,t.jsx)("button",{type:"button",onClick:()=>{bcDataRef.current={${saveVars}};setShowBcModal(!1);},className:"bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 rounded-xl font-black text-xs px-4 py-2 shadow-sm",children:"SALVAR BUSINESS CASE"})]})]})]})})`;

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let code = fs.readFileSync(f, 'utf8');

  // 1. Inject ModalLibrary_507 alias
  const aliasTarget = 'var t=a(57437),r=a(74291),';
  if (code.includes(aliasTarget) && !code.includes('ModalLibrary_507')) {
    code = code.replace(aliasTarget, 'var t=a(57437),r=a(74291),ModalLibrary_507=r,');
    console.log('Injected ModalLibrary_507 alias');
  }

  // 2. Inject state
  const stateTarget = 'function X(e){var s;let{fast:a';
  if (code.includes(stateTarget) && !code.includes('bcDataRef')) {
    code = code.replace(stateTarget, 'function X(e){var s;' + "const bcDataRef=(0,g.useRef)({});let [showBcModal,setShowBcModal]=(0,g.useState)(!1),[bcAvaliacaoMesAno,setBcAvaliacaoMesAno]=(0,g.useState)((e.fast && e.fast.bcAvaliacaoMesAno)||((d=new Date())=>String(d.getMonth()+1).padStart(2,0)+String.fromCharCode(47)+d.getFullYear())()),[bcGerenciaEstudos,setBcGerenciaEstudos]=(0,g.useState)((e.fast && e.fast.bcGerenciaEstudos)||\"\"),[bcGerenciaEngenharia,setBcGerenciaEngenharia]=(0,g.useState)((e.fast && e.fast.bcGerenciaEngenharia)||\"\"),[bcAutores,setBcAutores]=(0,g.useState)((e.fast && e.fast.bcAutores)||\"\"),[bcCodigoDoc,setBcCodigoDoc]=(0,g.useState)((e.fast && e.fast.bcCodigoDoc)||\"\"),[bcCodigoFast,setBcCodigoFast]=(0,g.useState)((e.fast && (e.fast.bcCodigoFast||e.fast.code))||\"\"),[bcTituloProjeto,setBcTituloProjeto]=(0,g.useState)((e.fast && (e.fast.bcTituloProjeto||e.fast.nomeDaIniciativa||e.fast.title||e.fast.name))||\"\"),[bcEtapa,setBcEtapa]=(0,g.useState)((e.fast && e.fast.bcEtapa)||\"\"),[bcUnidadeNegocio,setBcUnidadeNegocio]=(0,g.useState)((e.fast && e.fast.bcUnidadeNegocio)||\"\"),[bcCategoria,setBcCategoria]=(0,g.useState)((e.fast && (e.fast.bcCategoria||e.fast.category))||\"\"),[bcPilarEstrategico,setBcPilarEstrategico]=(0,g.useState)((e.fast && e.fast.bcPilarEstrategico)||\"\"),[bcPrograma,setBcPrograma]=(0,g.useState)((e.fast && e.fast.bcPrograma)||\"\"),[bcArea,setBcArea]=(0,g.useState)((e.fast && (e.fast.bcArea||e.fast.managerArea))||\"\"),[bcTema,setBcTema]=(0,g.useState)((e.fast && e.fast.bcTema)||\"\"),[bc1Objetivo,setBc1Objetivo]=(0,g.useState)((e.fast && e.fast.bc1Objetivo)||\"\"),[bc2Contextualizacao,setBc2Contextualizacao]=(0,g.useState)((e.fast && e.fast.bc2Contextualizacao)||\"\"),[bc3Beneficios,setBc3Beneficios]=(0,g.useState)((e.fast && e.fast.bc3Beneficios)||\"\"),[bc4AvaliacaoAlinhamento,setBc4AvaliacaoAlinhamento]=(0,g.useState)((e.fast && e.fast.bc4AvaliacaoAlinhamento)||\"\"),[bc5Capex,setBc5Capex]=(0,g.useState)((e.fast && e.fast.bc5Capex)||\"\"),[bc6CronogramaPreliminar,setBc6CronogramaPreliminar]=(0,g.useState)((e.fast && e.fast.bc6CronogramaPreliminar)||\"\"),[bc15EstrategiaImplantacao,setBc15EstrategiaImplantacao]=(0,g.useState)((e.fast && e.fast.bc15EstrategiaImplantacao)||\"\"),[bc16Requisitos,setBc16Requisitos]=(0,g.useState)((e.fast && e.fast.bc16Requisitos)||\"\"),[bc17PremissasRestricoes,setBc17PremissasRestricoes]=(0,g.useState)((e.fast && e.fast.bc17PremissasRestricoes)||\"\"),[bc18Exclusoes,setBc18Exclusoes]=(0,g.useState)((e.fast && e.fast.bc18Exclusoes)||\"\"),[bc19FatoresCriticos,setBc19FatoresCriticos]=(0,g.useState)((e.fast && e.fast.bc19FatoresCriticos)||\"\"),[bc20RiscosIncertezas,setBc20RiscosIncertezas]=(0,g.useState)((e.fast && e.fast.bc20RiscosIncertezas)||\"\"),[bc21AvaliacaoEconomica,setBc21AvaliacaoEconomica]=(0,g.useState)((e.fast && e.fast.bc21AvaliacaoEconomica)||\"\"),[bc22Conclusao,setBc22Conclusao]=(0,g.useState)((e.fast && e.fast.bc22Conclusao)||\"\"),[bcEnviarAprovacao,setBcEnviarAprovacao]=(0,g.useState)((e.fast && e.fast.bcEnviarAprovacao)||!1);" + 'let {fast:a');
    console.log('Injected state');
  }

  // 3. Inject form submit merge logic
  const submitTarget = 'eV=async e=>{';
  if (code.includes(submitTarget) && !code.includes('bcDataRef.current')) {
    code = code.replace(submitTarget, 'eV=async e=>{Object.assign(e, bcDataRef.current);if(bcDataRef.current.bcEnviarAprovacao)e.status="AGUARDANDO APROVAÇÃO";');
    console.log('Injected submit logic');
  }

  // 4. Inject Button next to SAIR SEM SALVAR
  const exitBtnTarget = 'X&&(0,t.jsxs)(o.z,{type:"button",variant:"destructive",size:"lg",onClick:X,className:"h-12 px-8 font-bold shadow-sm hover:shadow-md transition-all",children:[(0,t.jsx)(R.Z,{className:"w-5 h-5 mr-2"}),"SAIR SEM SALVAR"]})';
  const newExitBtn = 'X&&(0,t.jsxs)("div",{className:"flex gap-2 items-center",children:[(0,t.jsxs)("button",{type:"button",onClick:()=>setShowBcModal(!0),className:"h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 border border-emerald-700 shadow-sm uppercase rounded-xl transition-all hover:shadow-md active:scale-95",children:[(0,t.jsx)(S.Z,{className:"h-5 w-5 text-white"}),"FAZER O BUSINESS CASE DIGITAL"]}),(0,t.jsxs)(o.z,{type:"button",variant:"destructive",size:"lg",onClick:X,className:"h-12 px-8 font-bold shadow-sm hover:shadow-md transition-all",children:[(0,t.jsx)(R.Z,{className:"w-5 h-5 mr-2"}),"SAIR SEM SALVAR"]})]})';
  
  if (code.includes(exitBtnTarget) && !code.includes('FAZER O BUSINESS CASE DIGITAL')) {
    code = code.replace(exitBtnTarget, newExitBtn);
    console.log('Injected Button next to exit button');
  }

  // 5. Inject Modal Markup
  const modalTarget = '(0,t.jsx)(eT,{fieldName:"general"})]})}}),';
  if (code.includes(modalTarget) && !code.includes('SALVAR BUSINESS CASE')) {
    code = code.replace(modalTarget, '(0,t.jsx)(eT,{fieldName:"general"}),' + modalMarkup + ']})}}),');
    console.log('Injected Modal Markup');
  }

  // 6. Inject dropdown option
  const selectDropdownTarget = '(0,t.jsx)(j.Ql,{value:"PRIORIZADOS",children:"PRIORIZADOS"})';
  if (code.includes(selectDropdownTarget) && !code.includes('value:"AGUARDANDO APROVAÇÃO"')) {
    code = code.replace(selectDropdownTarget, '(0,t.jsx)(j.Ql,{value:"AGUARDANDO APROVAÇÃO",children:"AGUARDANDO APROVAÇÃO"}),(0,t.jsx)(j.Ql,{value:"PRIORIZADOS",children:"PRIORIZADOS"})');
    console.log('Injected dropdown option');
  }

  fs.writeFileSync(f, code);
  console.log('Patched ' + f);
}
