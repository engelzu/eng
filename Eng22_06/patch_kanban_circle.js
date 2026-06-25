const fs = require('fs');

const files = [
  '_next/static/chunks/app/fast/page-5d0c28c966a6b026.js',
  'OUT/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js'
];

const targetStr = `("PARA ESTUDAR"===e.title||"PARA ESTUDAR"===s.status||"Em Estudo"===s.status)&&(()=>{let e=Object.keys(s.studyChecklist||{}).length,t=Math.round(e/r.LK.length*100),l=2*Math.PI*16;return(0,a.jsxs)("div",{className:"relative flex items-center justify-center h-9 w-9",title:"".concat(t,"% Conclu\\xeddo (").concat(e,"/11)"),children:[(0,a.jsxs)("svg",{className:"transform -rotate-90 w-full h-full",viewBox:"0 0 ".concat(36," ").concat(36),children:[(0,a.jsx)("circle",{className:"text-gray-200",strokeWidth:4,stroke:"currentColor",fill:"transparent",r:16,cx:18,cy:18}),(0,a.jsx)("circle",{className:"transition-all duration-500 ease-in-out",strokeWidth:4,strokeDasharray:l,strokeDashoffset:l-t/100*l,strokeLinecap:"round",stroke:100===t?"#22c55e":"#3b82f6",fill:"transparent",r:16,cx:18,cy:18})]}),(0,a.jsxs)("span",{className:"absolute text-[10px] font-bold text-slate-700",children:[t,"%"]})]})})()`;

const replacementStr = `(()=>{let isStudy=("PARA ESTUDAR"===e.title||"PARA ESTUDAR"===s.status||"Em Estudo"===s.status),bcFields=['bc1Objetivo','bc2Contextualizacao','bc3Beneficios','bc4AvaliacaoAlinhamento','bc5Capex','bc6CronogramaPreliminar','bc15EstrategiaImplantacao','bc16Requisitos','bc17PremissasRestricoes','bc18Exclusoes','bc19FatoresCriticos','bc20RiscosIncertezas','bc21AvaliacaoEconomica','bc22Conclusao'],fCnt=isStudy?Object.keys(s.studyChecklist||{}).length:bcFields.filter(f=>s[f]&&typeof s[f]==='string'&&s[f].trim()!=='').length,fTot=isStudy?r.LK.length:14,t=fTot===0?0:Math.round(fCnt/fTot*100),l=2*Math.PI*16;return(0,a.jsxs)("div",{className:"relative flex items-center justify-center h-9 w-9",title:t+"% "+(isStudy?"Conclu\\xeddo":"Preenchido BC")+" ("+fCnt+"/"+fTot+")",children:[(0,a.jsxs)("svg",{className:"transform -rotate-90 w-full h-full",viewBox:"0 0 36 36",children:[(0,a.jsx)("circle",{className:"text-gray-200",strokeWidth:4,stroke:"currentColor",fill:"transparent",r:16,cx:18,cy:18}),(0,a.jsx)("circle",{className:"transition-all duration-500 ease-in-out",strokeWidth:4,strokeDasharray:l,strokeDashoffset:l-t/100*l,strokeLinecap:"round",stroke:100===t?"#22c55e":(isStudy?"#3b82f6":"#4f46e5"),fill:"transparent",r:16,cx:18,cy:18})]}),(0,a.jsxs)("span",{className:"absolute text-[10px] font-bold text-slate-700",children:[t,"%"]})]})})()`;

let anyPatched = false;

for (const f of files) {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    if (code.includes(targetStr)) {
      code = code.replace(targetStr, replacementStr);
      fs.writeFileSync(f, code, 'utf8');
      console.log('Patched', f);
      anyPatched = true;
    } else if (code.includes('isStudy=("PARA ESTUDAR"===e.title')) {
      console.log('Already patched', f);
    } else {
      console.log('Target string not found in', f);
    }
  } else {
    console.log('File not found:', f);
  }
}

if (!anyPatched) {
  console.log('Failed to patch files. Check target string.');
}
