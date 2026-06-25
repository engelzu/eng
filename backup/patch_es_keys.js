const fs = require('fs');

const esES_keys = `
      'pri.title': 'Priorización Híbrida | PMO Ingeniería',
      'pri.heading': 'Priorización Híbrida',
      'pri.subheading': 'Scoring Multicriterio, Matriz de Valor vs. Esfuerzo y Asignación de CAPEX (Presupuesto).',
      'pri.kpi.registered': 'Proyectos Registrados',
      'pri.kpi.active': 'Cartera Activa',
      'pri.kpi.quickwins': 'Quick Wins',
      'pri.kpi.immediate': 'Foco Inmediato',
      'pri.kpi.totalcapex': 'CAPEX Total Estimado',
      'pri.kpi.budget': 'Presupuesto Previsto',
      'pri.kpi.avgvalue': 'Score Medio de Valor',
      'pri.kpi.scale': 'Escala de 1.0 a 5.0',
      'pri.tab.eval': 'Evaluación',
      'pri.tab.matrix': 'Matriz & Ranking',
      'pri.tab.capex': 'Portafolio CAPEX',
      'pri.matrix.title': 'Matriz de Valor vs. Esfuerzo',
      'pri.matrix.subtitle': 'Pase el ratón sobre los puntos para ver detalles',
      'pri.ranking.title': 'Ranking de Proyectos (Scoring)',
      'pri.btn.export': 'Exportar CSV',
      'pri.btn.import': 'Importar de V1',
      'pri.btn.reset': 'Restaurar Pruebas',
      'pri.filter.search': 'Buscar proyecto o sponsor...',
      'pri.filter.pilar': 'Pilar (Todos)',
      'pri.filter.area': 'Área (Todas)',
      'pri.filter.quadrant': 'Cuadrante (Todos)',
      'pri.col.capex': 'CAPEX',
      'pri.col.project': 'Proyecto',
      'pri.col.cost': 'Costo',
      'pri.col.value': 'Valor',
      'pri.col.effort': 'Esfuerzo',
      'pri.col.quadrant': 'Cuadrante',
      'pri.col.actions': 'Acciones',
      'pri.form.new': 'Nuevo Proyecto',
      'pri.form.edit': 'Editar Proyecto #{id}',
      'pri.form.subtitle': 'Complete los campos y criterios para calcular el score',
      'pri.form.editing': 'Editando los datos de: {name}',
      'pri.form.name': 'Nombre del Proyecto *',
      'pri.form.loading': 'Cargando proyectos del FAST...',
      'pri.form.desc': 'Descripción del Proyecto',
      'pri.form.desc.placeholder': 'Ingrese el alcance resumido y objetivo estratégico del proyecto...',
      'pri.form.area': 'Área / Departamento Solicitante *',
      'pri.form.area.placeholder': 'Buscará automático del proyecto...',
      'pri.form.pilar': 'Pilar Estratégico *',
      'pri.form.status': 'Estado Inicial *',
      'pri.form.sponsor': 'Gerente Solicitante / Patrocinador *',
      'pri.form.cost': 'Estimación de Costo Financiero (US$) *',
      'pri.form.value.title': 'Criterios de Evaluación de VALOR (Escala de 1 a 5)',
      'pri.form.effort.title': 'Criterios de Evaluación de ESFUERZO (Escala de 1 a 5)',
      'pri.form.btn.save': 'Guardar Proyecto',
      'pri.form.btn.cancel': 'Cancelar Edición',
      'pri.form.btn.delete': 'Eliminar Registro',
      'pri.form.btn.clear': 'Limpiar Formulario',
      'pri.sim.title': 'Simulador de Priorización en Tiempo Real',
      'pri.sim.valscore': 'Score de Valor Total',
      'pri.sim.valweighted': 'Ponderado (Peso 3/3/2)',
      'pri.sim.effscore': 'Score de Esfuerzo Total',
      'pri.sim.effarith': 'Aritmético (Peso 1/1)',
      'pri.sim.quadrant': 'Cuadrante Resultante',
      'pri.sim.unclassified': 'Sin Clasificación',
      'pri.sim.selectall': 'Seleccione todos los criterios anteriores para ver la clasificación del proyecto.',
      'pri.sim.desc.quickwin': 'Proyectos de alto impacto con bajo esfuerzo. Deben ser priorizados y ejecutados de inmediato.',
      'pri.sim.desc.grande': 'Proyectos de alto impacto, pero alta complejidad. Exigen planificación estructurada y asignación cuidadosa de recursos.',
      'pri.sim.desc.ingrata': 'Proyectos de bajo impacto y bajo esfuerzo. Deben ser ejecutados solo si hay recursos remanentes en la cartera.',
      'pri.sim.desc.sumidouro': 'Proyectos de bajo impacto y alto esfuerzo. Deben ser descartados o completamente reevaluados.',
      'pri.btn.editrow': 'Editar',
      'pri.btn.deleterow': 'Eliminar',
      'pri.budget.other': 'Otros / Sin Pilar Definido',
      'pri.budget.consumed': 'Consumido:',
      'pri.budget.nolimit': '(Sin límite definido)',
      'pri.budget.nopilar': 'Sin Pilar',
      'pri.budget.title': 'Asignación de CAPEX (Presupuesto / Cestas)',
      'pri.budget.teto': 'Tope (US$ k):',
      'pri.budget.remaining': 'Restante: US$ {val}',
      'pri.delete.title': 'Confirmación de Eliminación',
      'pri.delete.confirm.msg': '¿Está seguro que desea eliminar este proyecto permanentemente? Esta acción no se puede deshacer.',
      'pri.delete.pwd': 'Ingrese la contraseña (789512)',
`;

const paths = ['js/i18n.js', 'OUT/js/i18n.js'];

paths.forEach(p => {
    if (!fs.existsSync(p)) return;
    let code = fs.readFileSync(p, 'utf8');

    if (!code.includes("'pri.title': 'Priorización Híbrida | PMO Ingeniería',")) {
        // Insert right after 'schedule.title' in es-ES section
        // To be safe, look for 'schedule.title': 'Carga de Cronograma - SharePoint', but we know in es-ES there isn't a schedule.title yet?
        // Wait, looking at lines 375+, there is NO schedule.title.
        // It jumps to 'gates.title'. Let's insert before 'gates.title' in es-ES section.
        
        // Find the block in es-ES:
        const searchTarget = "      /* ===== Gates Page ===== */\\n      'gates.title': 'Gates de Aprobaci\\\\u00f3n - ProjectFlow',";
        
        // But since JSON keys can be tricky with unicode, let's just insert before `/* ===== Checklists Page ===== */` in es-ES
        // Wait, gates.title is there twice in es-ES! Lines 375 and 412.
        
        // Let's just find the first `/* ===== Gates Page ===== */` after `toast.firebase.notfound`
        const targetToken = "/* ===== Gates Page ===== */";
        
        // Make sure we are in the es-ES block by finding it after `es-ES` definition
        const esEsIndex = code.indexOf("'es-ES': {");
        if (esEsIndex !== -1) {
            const insertPoint = code.indexOf(targetToken, esEsIndex);
            if (insertPoint !== -1) {
                code = code.slice(0, insertPoint) + esES_keys + "\n      " + code.slice(insertPoint);
                fs.writeFileSync(p, code, 'utf8');
                console.log('Successfully injected es-ES keys in', p);
            }
        }
    }
});
