const fs = require('fs');

const chunks = [
  '_next/static/chunks/6120-99ba76de6fd208f3.js',
  'OUT/_next/static/chunks/6120-99ba76de6fd208f3.js',
  '_next/static/chunks/507-1cbb4e1ae80f89d3.js',
  'OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js',
  'patch_bc.js'
];

const makeField = (label, valueVar, setValueVar) => `(0,t.jsxs)("div",{className:"flex flex-col gap-1.5 p-3 bg-white border border-slate-200 rounded-xl shadow-sm",children:[(0,t.jsx)("h3",{className:"text-xs font-bold text-slate-800 uppercase tracking-wide",children:"${label}"}),(0,t.jsx)("textarea",{value:${valueVar},onChange:e=>${setValueVar}(e.target.value),rows:4,className:"bc-tinymce w-full p-2 text-sm border border-slate-200 rounded outline-none focus:border-indigo-500 transition-all resize-y min-h-[80px]"})]})`;

const newFields = [
  makeField("1 - Objetivo", "bc1Objetivo", "setBc1Objetivo"),
  makeField("2 - Contextualização", "bc2Contextualizacao", "setBc2Contextualizacao"),
  makeField("3 - Benefícios", "bc3Beneficios", "setBc3Beneficios"),
  makeField("4 - Avaliação de Alinhamento Estratégico", "bc4AvaliacaoAlinhamento", "setBc4AvaliacaoAlinhamento"),
  makeField("5 - Escopo Resumido", "bcEscopoResumido", "setBcEscopoResumido"),
  makeField("5.1 - Descrição do escopo", "bcDescricaoEscopo", "setBcDescricaoEscopo"),
  makeField("5.2 - Requisitos", "bc16Requisitos", "setBc16Requisitos"),
  makeField("5.3 - Premissas e restrições", "bc17PremissasRestricoes", "setBc17PremissasRestricoes"),
  makeField("5.4 - Exclusões", "bc18Exclusoes", "setBc18Exclusoes"),
  makeField("6 - CAPEX", "bc5Capex", "setBc5Capex"),
  makeField("7 - Cronograma Preliminar", "bc6CronogramaPreliminar", "setBc6CronogramaPreliminar"),
  makeField("8 - Fatores Críticos de Sucesso", "bc19FatoresCriticos", "setBc19FatoresCriticos"),
  makeField("9 - Riscos", "bc20RiscosIncertezas", "setBc20RiscosIncertezas"),
  makeField("10 - Avaliação Econômica", "bc21AvaliacaoEconomica", "setBc21AvaliacaoEconomica"),
  makeField("11 - Conclusão", "bc22Conclusao", "setBc22Conclusao")
];

const newChildrenStr = `[` + newFields.join(',') + `]`;

chunks.forEach(f => {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    
    // Inject state variables
    const stateAnchor = '[bc1Objetivo,setBc1Objetivo]=(0,E.useState)(r.bc1Objetivo||"")';
    if (code.includes(stateAnchor) && !code.includes('bcEscopoResumido')) {
        code = code.replace(stateAnchor, '[bcEscopoResumido,setBcEscopoResumido]=(0,E.useState)(r.bcEscopoResumido||""),[bcDescricaoEscopo,setBcDescricaoEscopo]=(0,E.useState)(r.bcDescricaoEscopo||""),' + stateAnchor);
    }
    
    // Inject save logic
    const saveAnchor = 'bc1Objetivo:bc1Objetivo,';
    if (code.includes(saveAnchor) && !code.includes('bcEscopoResumido:bcEscopoResumido,')) {
        code = code.replace(saveAnchor, 'bcEscopoResumido:bcEscopoResumido,bcDescricaoEscopo:bcDescricaoEscopo,' + saveAnchor);
    }

    // Replace fields children
    const containerPrefix = 'className:"flex flex-col gap-8 w-full max-w-[850px] mx-auto",children:';
    if (code.includes(containerPrefix)) {
        const startIdx = code.indexOf(containerPrefix) + containerPrefix.length;
        
        // Find the matching closing bracket for children array
        let bracketCount = 0;
        let endIdx = -1;
        for (let i = startIdx; i < code.length; i++) {
            if (code[i] === '[') bracketCount++;
            if (code[i] === ']') {
                bracketCount--;
                if (bracketCount === 0) {
                    endIdx = i + 1; // including the ']'
                    break;
                }
            }
        }
        
        if (endIdx !== -1) {
            code = code.substring(0, startIdx) + newChildrenStr + code.substring(endIdx);
            fs.writeFileSync(f, code);
            console.log('Successfully reordered fields in ' + f);
        } else {
            console.log('Failed to find end of children array in ' + f);
        }
    }
  }
});
