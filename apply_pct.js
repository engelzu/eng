const fs = require('fs');
const files = [
  'c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/6120-99ba76de6fd208f3.js',
  'c:/Users/user2/Downloads/Eng22_06/Eng22_06/OUT/_next/static/chunks/6120-99ba76de6fd208f3.js',
  'c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/507-1cbb4e1ae80f89d3.js',
  'c:/Users/user2/Downloads/Eng22_06/Eng22_06/OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js'
];

const targetStr = '"BUSINESS CASE DIGITAL " + (r.code ? " - Código #" + r.code : "")]})';
const newStr = '"BUSINESS CASE DIGITAL " + (r.code ? " - Código #" + r.code : ""), (0,t.jsxs)("span", {className: "ml-auto px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold shadow-sm", children: [Math.round(([bc1Objetivo,bc2Contextualizacao,bc3Beneficios,bc4AvaliacaoAlinhamento,bc5Capex,bc6CronogramaPreliminar,bc15EstrategiaImplantacao,bc16Requisitos,bc17PremissasRestricoes,bc18Exclusoes,bc19FatoresCriticos,bc20RiscosIncertezas,bc21AvaliacaoEconomica,bc22Conclusao].filter(c=>c&&c.replace(/<[^>]*>?/gm, \'\').trim().length>0).length/14)*100), "% Preenchido"]})]})';

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let code = fs.readFileSync(f, 'utf8');
  if (code.includes(targetStr)) {
    code = code.replace(targetStr, newStr);
    fs.writeFileSync(f, code);
    console.log('Patched ' + f);
  } else {
    console.log('Target not found or already patched in ' + f);
  }
}
