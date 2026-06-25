const fs = require('fs');

// Add missing keys to i18n.js
const extra_ptBR = {
    'pri.sim.desc.quickwin': 'Projetos de alto impacto com baixo esforço. Devem ser priorizados e executados imediatamente.',
    'pri.sim.desc.grande': 'Projetos de alto impacto, mas alta complexidade. Exigem planejamento estruturado e alocação cuidadosa de recursos.',
    'pri.sim.desc.ingrata': 'Projetos de baixo impacto e baixo esforço. Devem ser executados apenas se houver recursos remanescentes na carteira.',
    'pri.sim.desc.sumidouro': 'Projetos de baixo impacto e alto esforço. Devem ser descartados ou completamente reavaliados.',
    'pri.btn.editrow': 'Editar',
    'pri.btn.deleterow': 'Excluir',
    'pri.budget.other': 'Outros / Sem Pilar Definido',
    'pri.budget.consumed': 'Consumido:',
    'pri.budget.nolimit': '(Sem limite definido)',
    'pri.budget.nopilar': 'Sem Pilar'
};

const extra_esES = {
    'pri.sim.desc.quickwin': 'Proyectos de alto impacto con bajo esfuerzo. Deben ser priorizados y ejecutados de inmediato.',
    'pri.sim.desc.grande': 'Proyectos de alto impacto, pero alta complejidad. Exigen planificación estructurada y asignación cuidadosa de recursos.',
    'pri.sim.desc.ingrata': 'Proyectos de bajo impacto y bajo esfuerzo. Deben ser ejecutados solo si hay recursos remanentes en la cartera.',
    'pri.sim.desc.sumidouro': 'Proyectos de bajo impacto y alto esfuerzo. Deben ser descartados o completamente reevaluados.',
    'pri.btn.editrow': 'Editar',
    'pri.btn.deleterow': 'Eliminar',
    'pri.budget.other': 'Otros / Sin Pilar Definido',
    'pri.budget.consumed': 'Consumido:',
    'pri.budget.nolimit': '(Sin límite definido)',
    'pri.budget.nopilar': 'Sin Pilar'
};

const i18nPaths = ['js/i18n.js', 'OUT/js/i18n.js'];

i18nPaths.forEach(p => {
    if (!fs.existsSync(p)) return;
    let code = fs.readFileSync(p, 'utf8');

    // Add to pt-BR if not exists
    if (!code.includes("'pri.btn.editrow'")) {
        let ptRepl = "'pri.sim.selectall': 'Selecione todos os critérios acima para visualizar a classificação do projeto.',\n";
        for (const [k, v] of Object.entries(extra_ptBR)) {
            ptRepl += `      '${k}': '${v}',\n`;
        }
        code = code.replace("'pri.sim.selectall': 'Selecione todos os critérios acima para visualizar a classificação do projeto.',", ptRepl.trimEnd());
    }

    // Add to es-ES if not exists
    if (!code.includes("'pri.btn.editrow'")) {
        let esRepl = "'pri.sim.selectall': 'Seleccione todos los criterios anteriores para ver la clasificación del proyecto.',\n";
        for (const [k, v] of Object.entries(extra_esES)) {
            esRepl += `      '${k}': '${v}',\n`;
        }
        code = code.replace("'pri.sim.selectall': 'Seleccione todos los criterios anteriores para ver la clasificación del proyecto.',", esRepl.trimEnd());
    }

    fs.writeFileSync(p, code, 'utf8');
    console.log('Successfully patched i18n keys in', p);
});

// Patch priorizacao-hibrida-v2.js for quadDesc
const jsFiles = ['pri/priorizacao-hibrida-v2.js', 'OUT/pri/priorizacao-hibrida-v2.js'];

jsFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let js = fs.readFileSync(f, 'utf8');

    js = js.replace(
        'quadDesc = "Projetos de alto impacto com baixo esforço. Devem ser priorizados e executados imediatamente.";',
        'quadDesc = window.i18n ? window.i18n.t("pri.sim.desc.quickwin") || "Projetos de alto impacto com baixo esforço. Devem ser priorizados e executados imediatamente." : "Projetos de alto impacto com baixo esforço. Devem ser priorizados e executados imediatamente.";'
    );
    js = js.replace(
        'quadDesc = "Projetos de alto impacto, mas alta complexidade. Exigem planejamento estruturado e alocação cuidadosa de recursos.";',
        'quadDesc = window.i18n ? window.i18n.t("pri.sim.desc.grande") || "Projetos de alto impacto, mas alta complexidade. Exigem planejamento estruturado e alocação cuidadosa de recursos." : "Projetos de alto impacto, mas alta complexidade. Exigem planejamento estruturado e alocação cuidadosa de recursos.";'
    );
    js = js.replace(
        'quadDesc = "Projetos de baixo impacto e baixo esforço. Devem ser executados apenas se houver recursos remanescentes na carteira.";',
        'quadDesc = window.i18n ? window.i18n.t("pri.sim.desc.ingrata") || "Projetos de baixo impacto e baixo esforço. Devem ser executados apenas se houver recursos remanescentes na carteira." : "Projetos de baixo impacto e baixo esforço. Devem ser executados apenas se houver recursos remanescentes na carteira.";'
    );
    js = js.replace(
        'quadDesc = "Projetos de baixo impacto e alto esforço. Devem ser descartados ou completamente reavaliados.";',
        'quadDesc = window.i18n ? window.i18n.t("pri.sim.desc.sumidouro") || "Projetos de baixo impacto e alto esforço. Devem ser descartados ou completamente reavaliados." : "Projetos de baixo impacto e alto esforço. Devem ser descartados ou completamente reavaliados.";'
    );

    fs.writeFileSync(f, js, 'utf8');
    console.log('Successfully patched quadDesc in', f);
});
