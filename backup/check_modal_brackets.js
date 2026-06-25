const fields = [
  'bcAvaliacaoMesAno', 'bcGerenciaEstudos', 'bcGerenciaEngenharia', 'bcAutores', 'bcCodigoDoc', 'bcCodigoFast', 'bcTituloProjeto', 'bcEtapa', 'bcUnidadeNegocio', 'bcCategoria', 'bcPilarEstrategico', 'bcPrograma', 'bcArea', 'bcTema', 'bc1Objetivo', 'bc2Contextualizacao', 'bc3Beneficios', 'bc4AvaliacaoAlinhamento', 'bc5Capex', 'bc6CronogramaPreliminar', 'bc7ExecucaoFaseUnica', 'bc8Execucao6Fases', 'bc9EscopoResumido', 'bc10FornecimentoEquip', 'bc11ConstrucaoInstalacao', 'bc12AutomacaoControle', 'bc13Comissionamento', 'bc14Treinamento', 'bc15EstrategiaImplantacao', 'bc16Requisitos', 'bc17PremissasRestricoes', 'bc18Exclusoes', 'bc19FatoresCriticos', 'bc20RiscosIncertezas', 'bc21AvaliacaoEconomica', 'bc22Conclusao'
];
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
const textareas = [
  { id: 'bc1Objetivo', label: '1. Objetivo' },
  { id: 'bc2Contextualizacao', label: '2. Contextualização' },
  { id: 'bc3Beneficios', label: '3. Benefícios' },
  { id: 'bc4AvaliacaoAlinhamento', label: '4. Avaliação de alinhamento estratégico' },
  { id: 'bc5Capex', label: '5. CAPEX' },
  { id: 'bc6CronogramaPreliminar', label: '6. Cronograma Preliminar (CRONOGRAMA) Fel 2 e 3' },
  { id: 'bc7ExecucaoFaseUnica', label: '7. Execução Fase Única (CRONOGRAMA)' },
  { id: 'bc8Execucao6Fases', label: '8. Execução 6 fases (CRONOGRAMA)' },
  { id: 'bc9EscopoResumido', label: '9. Escopo Resumido' },
  { id: 'bc10FornecimentoEquip', label: '10. Fornecimento de Equipamentos' },
  { id: 'bc11ConstrucaoInstalacao', label: '11. Construção, Instalação e Integração' },
  { id: 'bc12AutomacaoControle', label: '12. Automação e Controle' },
  { id: 'bc13Comissionamento', label: '13. Comissionamento e Start-up' },
  { id: 'bc14Treinamento', label: '14. Treinamento' },
  { id: 'bc15EstrategiaImplantacao', label: '15. Estratégia de Implantação' },
  { id: 'bc16Requisitos', label: '16. Requisitos' },
  { id: 'bc17PremissasRestricoes', label: '17. Premissas e Restrições' },
  { id: 'bc18Exclusoes', label: '18. Exclusões' },
  { id: 'bc19FatoresCriticos', label: '19. Fatores críticos de sucesso' },
  { id: 'bc20RiscosIncertezas', label: '20. Riscos e Incertezas' },
  { id: 'bc21AvaliacaoEconomica', label: '21. Avaliação econômica' },
  { id: 'bc22Conclusao', label: '22. Conclusão' }
];

let saveObj = '{';
for (const field of fields) {
  saveObj += `${field}:${field},`;
}
saveObj += '}';

let modalMarkup = "(0,t.jsx)(ModalLibrary_507.Vq,{open:showBcModal,onOpenChange:setShowBcModal,children:(0,t.jsxs)(ModalLibrary_507.cZ,{className:\"w-[98vw] max-w-[1200px] max-h-[95vh] flex flex-col overflow-hidden border-indigo-500 shadow-2xl rounded-2xl\",children:[(0,t.jsxs)(ModalLibrary_507.fK,{className:\"p-4 pb-3 bg-indigo-50/50 border-b border-indigo-100 shrink-0\",children:[(0,t.jsxs)(ModalLibrary_507.$N,{className:\"flex items-center gap-2 text-indigo-800 text-lg font-black\",children:[(0,t.jsx)(S.Z,{className:\"h-6 w-6\"}),\"BUSINESS CASE DIGITAL \" + ((a&&a.code) ? \" - Código #\" + a.code : \"\")]}),(0,t.jsx)(ModalLibrary_507.Be,{className:\"text-sm text-indigo-600/80\",children:\"Preencha os dados abaixo para compor o documento de Business Case.\"})]}),(0,t.jsxs)(\"div\",{className:\"p-4 space-y-4 flex-1 overflow-y-auto bg-slate-50/30\",children:[";

modalMarkup += "(0,t.jsx)(\"div\",{className:\"grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm\",children:[";
let firstInput = true;
for (const input of inputs) {
  if (!firstInput) modalMarkup += ",";
  firstInput = false;
  modalMarkup += "(0,t.jsxs)(\"div\",{className:\"flex flex-col gap-1\",children:[(0,t.jsx)(\"label\",{className:\"text-[10px] font-black tracking-wider text-slate-500 uppercase\",children:\"" + input.label + "\"}),(0,t.jsx)(\"input\",{type:\"text\",value:" + input.id + ",onChange:e=>set" + input.id.charAt(0).toUpperCase() + input.id.slice(1) + "(e.target.value),className:\"w-full h-8 px-2 text-xs border border-slate-200 rounded outline-none focus:border-indigo-500 transition-all\"})]})";
}
modalMarkup += "]}),";

modalMarkup += "(0,t.jsx)(\"div\",{className:\"space-y-4\",children:[";
let firstTa = true;
for (const ta of textareas) {
  if (!firstTa) modalMarkup += ",";
  firstTa = false;
  modalMarkup += "(0,t.jsxs)(\"div\",{className:\"flex flex-col gap-1.5 p-3 bg-white border border-slate-200 rounded-xl shadow-sm\",children:[(0,t.jsx)(\"h3\",{className:\"text-xs font-bold text-slate-800 uppercase tracking-wide\",children:\"" + ta.label + "\"}),(0,t.jsx)(\"textarea\",{value:" + ta.id + ",onChange:e=>set" + ta.id.charAt(0).toUpperCase() + ta.id.slice(1) + "(e.target.value),rows:4,className:\"w-full p-2 text-sm border border-slate-200 rounded outline-none focus:border-indigo-500 transition-all resize-y min-h-[80px]\"})]})";
}
modalMarkup += "]})]})";

let applyLogic = "bcDataRef.current=" + saveObj + ";setShowBcModal(!1);";
modalMarkup += ",(0,t.jsxs)(ModalLibrary_507.cN,{className:\"shrink-0 p-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2\",children:[(0,t.jsx)(\"button\",{type:\"button\",onClick:()=>setShowBcModal(!1),className:\"rounded-xl font-black text-xs px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100\",children:\"FECHAR\"}),(0,t.jsx)(\"button\",{type:\"button\",onClick:()=>{" + applyLogic + "},className:\"bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs px-4 py-2\",children:\"SALVAR BUSINESS CASE\"})]})]})})";

// Let's count brackets
let round = 0, curly = 0, square = 0;
let stack = [];
for (let i = 0; i < modalMarkup.length; i++) {
  const c = modalMarkup[i];
  if (c === '(' || c === '{' || c === '[') {
    stack.push(c);
  } else if (c === ')' || c === '}' || c === ']') {
    const last = stack[stack.length - 1];
    if (
      (c === ')' && last === '(') ||
      (c === '}' && last === '{') ||
      (c === ']' && last === '[')
    ) {
      stack.pop();
    } else {
      stack.push(c);
    }
  }
}

console.log('Unbalanced brackets in modalMarkup:', stack.join(' '));
