const fs = require('fs');

const fields = [
  'bcAvaliacaoMesAno', 'bcGerenciaEstudos', 'bcGerenciaEngenharia', 'bcAutores', 'bcCodigoDoc', 'bcCodigoFast', 'bcTituloProjeto', 'bcEtapa', 'bcUnidadeNegocio', 'bcCategoria', 'bcPilarEstrategico', 'bcPrograma', 'bcArea', 'bcTema', 'bc1Objetivo', 'bc2Contextualizacao', 'bc3Beneficios', 'bc4AvaliacaoAlinhamento', 'bc5Capex', 'bc6CronogramaPreliminar', 'bc15EstrategiaImplantacao', 'bc16Requisitos', 'bc17PremissasRestricoes', 'bc18Exclusoes', 'bc19FatoresCriticos', 'bc20RiscosIncertezas', 'bc21AvaliacaoEconomica', 'bc22Conclusao', 'bcEnviarAprovacao'
];

let stateReplacement = 'const bcDataRef=(0,g.useRef)({});let [showBcModal,setShowBcModal]=(0,g.useState)(!1),';
for (const field of fields) {
  let defaultVal = '(e.fast && e.fast.' + field + ')||""';
  if (field === 'bcCodigoFast') defaultVal = `(e.fast && (e.fast.${field}||e.fast.code))||""`;
  if (field === 'bcTituloProjeto') defaultVal = `(e.fast && (e.fast.${field}||e.fast.nomeDaIniciativa||e.fast.title||e.fast.name))||""`;
  if (field === 'bcCategoria') defaultVal = `(e.fast && (e.fast.${field}||e.fast.category))||""`;
  if (field === 'bcArea') defaultVal = `(e.fast && (e.fast.${field}||e.fast.managerArea))||""`;
  if (field === 'bcAvaliacaoMesAno') defaultVal = `(e.fast && e.fast.${field})||((d=new Date())=>String(d.getMonth()+1).padStart(2,0)+String.fromCharCode(47)+d.getFullYear())()`;
  if (field === 'bcEnviarAprovacao') defaultVal = `(e.fast && e.fast.${field})||!1`;
  stateReplacement += `[${field},set${field.charAt(0).toUpperCase() + field.slice(1)}]=(0,g.useState)(${defaultVal}),`;
}
stateReplacement = stateReplacement.slice(0, -1) + ';';

let saveObj = '{';
for (const field of fields) {
  saveObj += `${field}:${field},`;
}
saveObj += '}';

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

let modalMarkup = "(0,t.jsx)(ModalLibrary_507.Vq,{open:showBcModal,onOpenChange:setShowBcModal,children:(0,t.jsxs)(ModalLibrary_507.cZ,{className:\"w-[98vw] max-w-[1200px] max-h-[95vh] flex flex-col overflow-hidden border-indigo-500 shadow-2xl rounded-2xl\",children:[(0,t.jsxs)(ModalLibrary_507.fK,{className:\"p-4 pb-3 bg-indigo-50/50 border-b border-indigo-100 shrink-0\",children:[(0,t.jsxs)(ModalLibrary_507.$N,{className:\"flex items-center gap-2 text-indigo-800 text-lg font-black\",children:[(0,t.jsx)(S.Z,{className:\"h-6 w-6\"}),\"BUSINESS CASE DIGITAL \" + ((a&&a.code) ? \" - Código #\" + a.code : \"\")]}),(0,t.jsx)(ModalLibrary_507.Be,{className:\"text-sm text-indigo-600/80\",children:\"Preencha os dados abaixo para compor o documento de Business Case.\"})]}),(0,t.jsxs)(\"div\",{className:\"p-4 space-y-4 flex-1 overflow-y-auto bg-slate-50/30\",children:[";

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

modalMarkup += "(0,t.jsx)(\"div\",{className:\"grid grid-cols-1 md:grid-cols-3 gap-3\",children:[";
let firstTa = true;
for (const ta of textareas) {
  if (!firstTa) modalMarkup += ",";
  firstTa = false;
  modalMarkup += "(0,t.jsxs)(\"div\",{className:\"flex flex-col gap-1.5 p-3 bg-white border border-slate-200 rounded-xl shadow-sm\",children:[(0,t.jsx)(\"h3\",{className:\"text-xs font-bold text-slate-800 uppercase tracking-wide\",children:\"" + ta.label + "\"}),(0,t.jsx)(\"textarea\",{value:" + ta.id + ",onChange:e=>set" + ta.id.charAt(0).toUpperCase() + ta.id.slice(1) + "(e.target.value),rows:4,className:\"w-full p-2 text-sm border border-slate-200 rounded outline-none focus:border-indigo-500 transition-all resize-y min-h-[80px]\"})]})";
}
modalMarkup += "]})]})";

let applyLogic = "bcDataRef.current=" + saveObj + ";setShowBcModal(!1);";
let switchToggle = "(0,t.jsxs)(\"div\",{onClick:()=>setBcEnviarAprovacao(!bcEnviarAprovacao),className:\"flex items-center gap-2 cursor-pointer select-none\",children:[(0,t.jsx)(\"div\",{className:\"w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out \"+(bcEnviarAprovacao?\"bg-emerald-500\":\"bg-slate-300\"),children:(0,t.jsx)(\"div\",{className:\"w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out\",style:{transform:bcEnviarAprovacao?\"translateX(16px)\":\"translateX(0)\"}})}),(0,t.jsx)(\"span\",{className:\"text-xs font-black text-slate-700 uppercase tracking-wide\",children:\"ENVIAR PARA APROVAÇÃO\"})]})";
modalMarkup += ",(0,t.jsxs)(ModalLibrary_507.cN,{className:\"shrink-0 p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center gap-2\",children:[" + switchToggle + ",(0,t.jsxs)(\"div\",{className:\"flex gap-2\",children:[(0,t.jsx)(\"button\",{type:\"button\",onClick:()=>setShowBcModal(!1),className:\"rounded-xl font-black text-xs px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 bg-white\",children:\"FECHAR\"}),(0,t.jsx)(\"button\",{type:\"button\",onClick:()=>{" + applyLogic + "},className:\"bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 rounded-xl font-black text-xs px-4 py-2 shadow-sm\",children:\"SALVAR BUSINESS CASE\"})]})]})]})})";

let triggerBcBtn = "(0,t.jsxs)(\"button\",{type:\"button\",onClick:()=>setShowBcModal(!0),className:\"flex items-center gap-1 px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 rounded text-indigo-700 hover:text-indigo-800 transition-colors uppercase font-black text-[9px]\",title:\"Preencher Business Case Digital\",children:[(0,t.jsx)(S.Z,{className:\"h-3.5 w-3.5\"}),(0,t.jsx)(\"span\",{className:\"text-xs font-semibold\",children:\"FAZER O BUSINESS CASE DIGITAL\"})]})";

const scriptCode = `
const fs = require('fs');
const files = [
  '_next/static/chunks/507-1cbb4e1ae80f89d3.js',
  'OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js'
];

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let code = fs.readFileSync(f, 'utf8');

  const aliasTarget = 'var t=a(57437),r=a(74291),';
  if (code.includes(aliasTarget) && !code.includes('ModalLibrary_507')) {
    code = code.replace(aliasTarget, 'var t=a(57437),r=a(74291),ModalLibrary_507=r,');
    console.log('Injected ModalLibrary_507 alias');
  }

  const stateTarget = 'function X(e){var s;let{fast:a';
  if (code.includes(stateTarget) && !code.includes('bcDataRef')) {
    code = code.replace(stateTarget, 'function X(e){var s;' + ${JSON.stringify(stateReplacement)} + 'let {fast:a');
    console.log('Injected state');
  }

  const submitTarget = 'eV=async e=>{';
  if (code.includes(submitTarget) && !code.includes('bcDataRef.current')) {
    code = code.replace(submitTarget, 'eV=async e=>{Object.assign(e, bcDataRef.current);if(bcDataRef.current.bcEnviarAprovacao)e.status="AGUARDANDO APROVAÇÃO";');
    console.log('Injected submit logic');
  }

  const exactContainer = 'children:[(0,t.jsx)(d.lX,{children:"T' + String.fromCharCode(92) + 'xcdTULO DA INTEN' + String.fromCharCode(92) + 'xc7' + String.fromCharCode(92) + 'xc3O"}),(0,t.jsxs)("button",{type:"button",onClick:e=>{';
  if (code.includes(exactContainer) && !code.includes('FAZER O BUSINESS CASE DIGITAL')) {
    code = code.replace(exactContainer, 'children:[(0,t.jsx)(d.lX,{children:"T' + String.fromCharCode(92) + 'xcdTULO DA INTEN' + String.fromCharCode(92) + 'xc7' + String.fromCharCode(92) + 'xc3O"}),' + ${JSON.stringify(triggerBcBtn)} + ',(0,t.jsxs)("button",{type:"button",onClick:e=>{');
    console.log('Injected Button');
  }


  const modalTarget = '(0,t.jsx)(eT,{fieldName:"general"})]})}}),';
  if (code.includes(modalTarget) && !code.includes('SALVAR BUSINESS CASE')) {
    code = code.replace(modalTarget, '(0,t.jsx)(eT,{fieldName:"general"}),' + ${JSON.stringify(modalMarkup)} + ']})}}),');
    console.log('Injected Modal Markup');
  }

  const selectDropdownTarget = '(0,t.jsx)(j.Ql,{value:"PRIORIZADOS",children:"PRIORIZADOS"})';
  if (code.includes(selectDropdownTarget) && !code.includes('value:"AGUARDANDO APROVAÇÃO"')) {
    code = code.replace(selectDropdownTarget, '(0,t.jsx)(j.Ql,{value:"AGUARDANDO APROVAÇÃO",children:"AGUARDANDO APROVAÇÃO"}),(0,t.jsx)(j.Ql,{value:"PRIORIZADOS",children:"PRIORIZADOS"})');
    console.log('Injected dropdown option');
  }

  fs.writeFileSync(f, code);
  console.log('Patched ' + f);
}
`;

fs.writeFileSync('patch_507_fixed.js', scriptCode);
console.log('Script built');
