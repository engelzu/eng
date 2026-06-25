const fs = require('fs');

const files = [
  'C:\\Users\\Admin\\Downloads\\Eng18_06\\Eng15_06\\_next\\static\\chunks\\507-1cbb4e1ae80f89d3.js',
  'C:\\Users\\Admin\\Downloads\\Eng18_06\\Eng15_06\\OUT\\_next\\static\\chunks\\507-1cbb4e1ae80f89d3.js'
];

let totalChanges = 0;

for (const filePath of files) {
  console.log('Processing: ' + filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  let initialLen = content.length;

  // 1. Remove injected BC state declarations after setShowCronogramaModal
  // Pattern: ,[showBcModal,setShowBcModal]=(...) ,[bc...,setBc...]=(...) ... ,[bcEnviarAprovacao,setBcEnviarAprovacao]=(...)
  {
    const re = /,\[showBcModal,setShowBcModal\]=\w+\(!1\),\[bcStatusAnterior,setBcStatusAnterior\]=\w+\([^)]+\),\[bc1Objetivo,setBc1Objetivo\]=\w+\([^)]+\),\[bc2Contextualizacao,setBc2Contextualizacao\]=\w+\([^)]+\),\[bc3Beneficios,setBc3Beneficios\]=\w+\([^)]+\),\[bc4AvaliacaoAlinhamento,setBc4AvaliacaoAlinhamento\]=\w+\([^)]+\),\[bc5Capex,setBc5Capex\]=\w+\([^)]+\),\[bc6CronogramaPreliminar,setBc6CronogramaPreliminar\]=\w+\([^)]+\),\[bc15EstrategiaImplantacao,setBc15EstrategiaImplantacao\]=\w+\([^)]+\),\[bc16Requisitos,setBc16Requisitos\]=\w+\([^)]+\),\[bc17PremissasRestricoes,setBc17PremissasRestricoes\]=\w+\([^)]+\),\[bc18Exclusoes,setBc18Exclusoes\]=\w+\([^)]+\),\[bc19FatoresCriticos,setBc19FatoresCriticos\]=\w+\([^)]+\),\[bc20RiscosIncertezas,setBc20RiscosIncertezas\]=\w+\([^)]+\),\[bc21AvaliacaoEconomica,setBc21AvaliacaoEconomica\]=\w+\([^)]+\),\[bc22Conclusao,setBc22Conclusao\]=\w+\([^)]+\],\[bcEnviarAprovacao,setBcEnviarAprovacao\]=\w+\([^)]+\)/g;
    const matches = content.match(re);
    if (matches) {
      content = content.replace(re, '');
      console.log('  [OK] Removed BC state declarations: ' + matches.length + ' match(es)');
      totalChanges++;
    }
  }

  // 2. Remove injected BC payload (starts with bcAvaliacaoMesAno:bcAvaliacaoMesAno and ends with __bcValues)
  {
    const re = /,bcAvaliacaoMesAno:bcAvaliacaoMesAno,bcGerenciaEstudos:bcGerenciaEstudos,bcGerenciaEngenharia:bcGerenciaEngenharia,bcAutores:bcAutores,bcCodigoDoc:bcCodigoDoc,bcCodigoFast:bcCodigoFast,bcTituloProjeto:bcTituloProjeto,bcEtapa:bcEtapa,bcUnidadeNegocio:bcUnidadeNegocio,bcCategoria:bcCategoria,bcPilarEstrategico:bcPilarEstrategico,bcPrograma:bcPrograma,bcArea:bcArea,bcTema:bcTema,bcEscopoResumido:bcEscopoResumido,bcDescricaoEscopo:bcDescricaoEscopo,bc1Objetivo:bc1Objetivo,bc2Contextualizacao:bc2Contextualizacao,bc3Beneficios:bc3Beneficios,bc4AvaliacaoAlinhamento:bc4AvaliacaoAlinhamento,bc5Capex:bc5Capex,bc6CronogramaPreliminar:bc6CronogramaPreliminar,bc15EstrategiaImplantacao:bc15EstrategiaImplantacao,bc16Requisitos:bc16Requisitos,bc17PremissasRestricoes:bc17PremissasRestricoes,bc18Exclusoes:bc18Exclusoes,bc19FatoresCriticos:bc19FatoresCriticos,bc20RiscosIncertezas:bc20RiscosIncertezas,bc21AvaliacaoEconomica:bc21AvaliacaoEconomica,bc22Conclusao:bc22Conclusao,bcEnviarAprovacao:bcEnviarAprovacao[^,]*?\.\.\.window\.__bcValues\|\|\{\},?/g;
    const matches = content.match(re);
    if (matches) {
      content = content.replace(re, '');
      console.log('  [OK] Removed BC payload: ' + matches.length + ' match(es)');
      totalChanges++;
    }
  }

  // 3. Remove FAZER O BUSINESS CASE DIGITAL button
  {
    const re = /,?\(0,\w+\.jsx\|\|t\.jsx\)\(\w+,\{className:"bg-emerald-600 hover:bg-emerald-700 text-white font-black text-\[9px\] flex items-center gap-1 border border-emerald-700 shadow-sm uppercase tracking-wider rounded-full",onClick:\(\)=>\{[^}]*setShowBcModal\(!0\)[^}]*\},children:"FAZER O BUSINESS CASE DIGITAL"\}\)/g;
    const matches = content.match(re);
    if (matches) {
      content = content.replace(re, '');
      console.log('  [OK] Removed FAZER O BUSINESS CASE DIGITAL button: ' + matches.length + ' match(es)');
      totalChanges++;
    }
  }

  // 4. Remove showBcModal dialog markup
  {
    // Match from ,(0,t.jsx)(s.Vq,{open:showBcModal... to its closing ]})})
    // Use a non-greedy approach - find the start and manually scan
    const startIdx = content.indexOf(',(0,t.jsx)(s.Vq,{open:showBcModal,');
    if (startIdx >= 0) {
      // Try simpler: match just the DialogContent and DialogFooter parts
      // Actually use a pattern that matches from ,(0,t.jsx)(s.Vq, to the matching closing
      // Since we can't do proper bracket matching with regex, let's try a targeted approach
      const re2 = /,\(0,t\.jsx\)\(s\.Vq,\{open:showBcModal,onOpenChange:setShowBcModal[^}]*\}\)/g;
      const matches2 = content.match(re2);
      if (matches2) {
        content = content.replace(re2, '');
        console.log('  [OK] Removed showBcModal dialog (simple): ' + matches2.length + ' match(es)');
        totalChanges++;
      }
    }
  }

  // 5. Remove bcEnviarAprovacao setters from useEffect
  {
    const re = /,setBcEnviarAprovacao\(r\.bcEnviarAprovacao\|\|!1\),setBcStatusAnterior\(r\.bcStatusAnterior[^)]*\),setBcAvaliacaoMesAno\(r\.bcAvaliacaoMesAno[^)]*\),setBcGerenciaEstudos\(r\.bcGerenciaEstudos[^)]*\),setBcGerenciaEngenharia\(r\.bcGerenciaEngenharia[^)]*\),setBcAutores\(r\.bcAutores[^)]*\),setBcCodigoDoc\(r\.bcCodigoDoc[^)]*\)/g;
    const matches = content.match(re);
    if (matches) {
      content = content.replace(re, '');
      console.log('  [OK] Removed bc setters from useEffect: ' + matches.length + ' match(es)');
      totalChanges++;
    }
  }

  // 6. Remove window.beforeBcSave && window.beforeBcSave() calls
  {
    const re = /window\.beforeBcSave\s*&&\s*window\.beforeBcSave\(\);?\s*/g;
    let count = 0;
    let newContent = content.replace(re, () => { count++; return ''; });
    if (count > 0) {
      content = newContent;
      console.log('  [OK] Removed window.beforeBcSave calls: ' + count);
      totalChanges++;
    }
  }

  // 7. Remove id attributes from bc textareas
  {
    const re = /,id:"bc\d+\w*"/g;
    let count = 0;
    let newContent = content.replace(re, () => { count++; return ''; });
    if (count > 0) {
      content = newContent;
      console.log('  [OK] Removed bc textarea id attributes: ' + count);
      totalChanges++;
    }
  }

  // 8. Remove all __bcValues references
  {
    const re = /\.\.\.window\.__bcValues\|\|\{\},?/g;
    let count = 0;
    let newContent = content.replace(re, () => { count++; return ''; });
    if (count > 0) {
      content = newContent;
      console.log('  [OK] Removed __bcValues references: ' + count);
      totalChanges++;
    }
  }

  // 9. Remove any remaining FAZER O BUSINESS CASE DIGITAL text
  {
    const re = /FAZER O BUSINESS CASE DIGITAL/g;
    let count = 0;
    let newContent = content.replace(re, () => { count++; return ''; });
    if (count > 0) {
      content = newContent;
      console.log('  [OK] Removed remaining FAZER text: ' + count);
      totalChanges++;
    }
  }

  // 10. Clean up double/triple commas
  content = content.replace(/,+/g, ',');
  content = content.replace(/,\s*\)/g, ')');
  content = content.replace(/,\s*\]/g, ']');
  content = content.replace(/,\s*\}/g, '}');

  let finalLen = content.length;
  console.log('  Size: ' + initialLen + ' -> ' + finalLen + ' bytes (' + (initialLen - finalLen) + ' removed)');

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('\nDone. Total changes applied: ' + totalChanges);
