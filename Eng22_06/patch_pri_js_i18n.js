const fs = require('fs');

const jsFiles = ['pri/priorizacao-hibrida-v2.js', 'OUT/pri/priorizacao-hibrida-v2.js'];

jsFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let js = fs.readFileSync(f, 'utf8');

    // 1. Simulator quadrant unclassified
    js = js.replace(
        'previewQuadrant.innerText = "Sem Classificação";',
        'previewQuadrant.innerText = window.i18n ? window.i18n.t("pri.sim.unclassified") : "Sem Classificação";'
    );
    js = js.replace(
        'previewQuadrantDescription.innerText = "Selecione todos os critérios acima para visualizar a classificação do projeto.";',
        'previewQuadrantDescription.innerText = window.i18n ? window.i18n.t("pri.sim.selectall") : "Selecione todos os critérios acima para visualizar a classificação do projeto.";'
    );

    // 2. Simulator quadrant name text
    js = js.replace(
        /previewQuadrant\.innerText = quadName\.replace\(\/ \\\(.+\\\)\/g, ''\);/g,
        'previewQuadrant.innerText = (window.i18n ? window.i18n.t(quadName) : quadName).replace(/ \\\\(.+\\\\)/g, \'\');'
    );

    // 3. Ranking table quadrant text
    js = js.replace(
        /<td><span class="quadrant-badge \$\{quadClass\}">\$\{p\.quadrante\.replace\(\/ \\\(.+\\\)\/g, ''\)\}<\/span><\/td>/g,
        '<td><span class="quadrant-badge ${quadClass}">${(window.i18n ? window.i18n.t(p.quadrante) : p.quadrante).replace(/ \\\\(.+\\\\)/g, \'\')}</span></td>'
    );

    // 4. Chart.js Axis Titles
    js = js.replace(
        "text: 'SCORE DE ESFORÇO TOTAL (1 a 5) → Mais complexo/pesado',",
        "text: window.i18n ? window.i18n.t('pri.chart.x') || 'SCORE DE ESFORÇO TOTAL (1 a 5) → Mais complexo/pesado' : 'SCORE DE ESFORÇO TOTAL (1 a 5) → Mais complexo/pesado',"
    );
    js = js.replace(
        "text: 'SCORE DE VALOR TOTAL (1 a 5) → Maior retorno estratégico',",
        "text: window.i18n ? window.i18n.t('pri.chart.y') || 'SCORE DE VALOR TOTAL (1 a 5) → Maior retorno estratégico' : 'SCORE DE VALOR TOTAL (1 a 5) → Maior retorno estratégico',"
    );

    // 5. Chart.js quadrants text
    js = js.replace(
        "ctx.fillText('QUICK WIN (PRIORIDADE MÁXIMA)', left + 12, top + 18);",
        "ctx.fillText(window.i18n ? (window.i18n.t('Quick Win (Prioridade Máxima)')).toUpperCase() : 'QUICK WIN (PRIORIDADE MÁXIMA)', left + 12, top + 18);"
    );
    js = js.replace(
        "ctx.fillText('GRANDE PROJETO (PLANEJAR)', xSplit + 12, top + 18);",
        "ctx.fillText(window.i18n ? (window.i18n.t('Grande Projeto (Planejar)')).toUpperCase() : 'GRANDE PROJETO (PLANEJAR)', xSplit + 12, top + 18);"
    );
    js = js.replace(
        "ctx.fillText('TAREFA INGRATA (SE HOUVER TEMPO)', left + 12, ySplit + 18);",
        "ctx.fillText(window.i18n ? (window.i18n.t('Tarefa Ingrata (Fazer se houver tempo)')).toUpperCase() : 'TAREFA INGRATA (SE HOUVER TEMPO)', left + 12, ySplit + 18);"
    );
    js = js.replace(
        "ctx.fillText('SUMIDOURO DE TEMPO (DESCARTAR)', xSplit + 12, ySplit + 18);",
        "ctx.fillText(window.i18n ? (window.i18n.t('Sumidouro de Tempo (Descartar)')).toUpperCase() : 'SUMIDOURO DE TEMPO (DESCARTAR)', xSplit + 12, ySplit + 18);"
    );
    
    // 6. Cestas "Outros" texts
    js = js.replace(
        '<div class="cesta-title" style="color: #64748b;">Outros / Sem Pilar Definido</div>',
        '<div class="cesta-title" style="color: #64748b;">${window.i18n ? window.i18n.t("pri.budget.other") || "Outros / Sem Pilar Definido" : "Outros / Sem Pilar Definido"}</div>'
    );
    js = js.replace(
        '<div>Consumido: <span id="budget-consumed-outros" style="font-weight: 600;">R$ 0,00</span></div>',
        '<div>${window.i18n ? window.i18n.t("pri.budget.consumed") || "Consumido:" : "Consumido:"} <span id="budget-consumed-outros" style="font-weight: 600;">R$ 0,00</span></div>'
    );
    js = js.replace(
        '<div>(Sem limite definido)</div>',
        '<div>${window.i18n ? window.i18n.t("pri.budget.nolimit") || "(Sem limite definido)" : "(Sem limite definido)"}</div>'
    );
    js = js.replace(
        '<span style="font-size: 0.7rem; color: #ef4444;">(${p.pilar || \'Sem Pilar\'})</span>',
        '<span style="font-size: 0.7rem; color: #ef4444;">(${p.pilar || (window.i18n ? window.i18n.t("pri.budget.nopilar") || "Sem Pilar" : "Sem Pilar")})</span>'
    );

    // 7. Action buttons
    js = js.replace(
        />✎ Editar<\/button>/g,
        '>✎ ${window.i18n ? window.i18n.t("pri.btn.editrow") || "Editar" : "Editar"}</button>'
    );
    js = js.replace(
        />✕ Excluir<\/button>/g,
        '>✕ ${window.i18n ? window.i18n.t("pri.btn.deleterow") || "Excluir" : "Excluir"}</button>'
    );

    // 8. Tooltips
    js = js.replace(
        /\`Projeto: \$\{raw\.name\}\`/g,
        '`${window.i18n ? window.i18n.t("pri.col.project") || "Projeto" : "Projeto"}: ${raw.name}`'
    );
    js = js.replace(
        /\`Custo: \$\{formatCurrency\(raw\.custo\)\}\`/g,
        '`${window.i18n ? window.i18n.t("pri.col.cost") || "Custo" : "Custo"}: ${formatCurrency(raw.custo)}`'
    );
    js = js.replace(
        /\`Quadrante: \$\{raw\.quadrant\}\`/g,
        '`${window.i18n ? window.i18n.t("pri.col.quadrant") || "Quadrante" : "Quadrante"}: ${window.i18n ? window.i18n.t(raw.quadrant) || raw.quadrant : raw.quadrant}`'
    );

    // 9. Langchange listener
    if (!js.includes("window.addEventListener('langchange'")) {
        js = js.replace(
            'loadFastProjects();\n});',
            'loadFastProjects();\n\n    window.addEventListener(\'langchange\', () => {\n        updateDashboard();\n        updateSimulatorPreview();\n    });\n});'
        );
    }

    fs.writeFileSync(f, js, 'utf8');
    console.log('Successfully patched', f);
});
