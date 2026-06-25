const fs = require('fs');

const ptBR_keys = {
  'pri.title': 'Priorização Híbrida | PMO Engenharia',
  'pri.heading': 'Priorização Híbrida',
  'pri.subheading': 'Scoring Multicritério, Matriz de Valor vs. Esforço e Alocação de CAPEX (Orçamento).',
  'pri.kpi.registered': 'Projetos Cadastrados',
  'pri.kpi.active': 'Carteira Ativa',
  'pri.kpi.quickwins': 'Quick Wins',
  'pri.kpi.immediate': 'Foco Imediato',
  'pri.kpi.totalcapex': 'CAPEX Total Estimado',
  'pri.kpi.budget': 'Orçamento Previsto',
  'pri.kpi.avgvalue': 'Score Médio de Valor',
  'pri.kpi.scale': 'Escala de 1.0 a 5.0',
  'pri.tab.eval': 'Avaliação',
  'pri.tab.matrix': 'Matriz & Ranking',
  'pri.tab.capex': 'Portfólio CAPEX',
  'pri.matrix.title': 'Matriz de Valor vs. Esforço',
  'pri.matrix.subtitle': 'Passe o mouse nos pontos para ver os detalhes',
  'pri.ranking.title': 'Ranking de Projetos (Scoring)',
  'pri.btn.export': 'Exportar CSV',
  'pri.btn.import': 'Importar da V1',
  'pri.btn.reset': 'Restaurar Testes',
  'pri.filter.search': 'Buscar projeto ou sponsor...',
  'pri.filter.pilar': 'Pilar (Todos)',
  'pri.filter.area': 'Área (Todas)',
  'pri.filter.quadrant': 'Quadrante (Todos)',
  'pri.col.capex': 'CAPEX',
  'pri.col.project': 'Projeto',
  'pri.col.cost': 'Custo',
  'pri.col.value': 'Valor',
  'pri.col.effort': 'Esforço',
  'pri.col.quadrant': 'Quadrante',
  'pri.col.actions': 'Ações',
  'pri.form.new': 'Novo Projeto',
  'pri.form.edit': 'Editar Projeto #{id}',
  'pri.form.subtitle': 'Preencha os campos e os critérios para calcular o score',
  'pri.form.editing': 'Editando os dados de: {name}',
  'pri.form.name': 'Nome do Projeto *',
  'pri.form.loading': 'Carregando projetos do FAST...',
  'pri.form.desc': 'Descrição do Projeto',
  'pri.form.desc.placeholder': 'Insira o escopo resumido e o objetivo estratégico do projeto...',
  'pri.form.area': 'Área / Departamento Solicitante *',
  'pri.form.area.placeholder': 'Buscará automático do projeto...',
  'pri.form.pilar': 'Pilar Estratégico *',
  'pri.form.status': 'Status Inicial *',
  'pri.form.sponsor': 'Gerente Demandante / Patrocinador *',
  'pri.form.cost': 'Estimativa de Custo Financeiro (US$) *',
  'pri.form.value.title': 'Critérios de Avaliação de VALOR (Escala de 1 a 5)',
  'pri.form.effort.title': 'Critérios de Avaliação de ESFORÇO (Escala de 1 a 5)',
  'pri.form.btn.save': 'Salvar Projeto',
  'pri.form.btn.cancel': 'Cancelar Edição',
  'pri.form.btn.delete': 'Excluir Registro',
  'pri.form.btn.clear': 'Limpar Formulário',
  'pri.sim.title': 'Simulador de Priorização em Tempo Real',
  'pri.sim.valscore': 'Score de Valor Total',
  'pri.sim.valweighted': 'Ponderado (Peso 3/3/2)',
  'pri.sim.effscore': 'Score de Esforço Total',
  'pri.sim.effarith': 'Aritmético (Peso 1/1)',
  'pri.sim.quadrant': 'Quadrante Resultante',
  'pri.sim.unclassified': 'Sem Classificação',
  'pri.sim.selectall': 'Selecione todos os critérios acima para visualizar a classificação do projeto.',
  'pri.budget.title': 'Alocação de CAPEX (Orçamento / Cestas)',
  'pri.budget.teto': 'Teto (US$ k):',
  'pri.budget.remaining': 'Restante: US$ {val}',
  'pri.delete.title': 'Confirmação de Exclusão',
  'pri.delete.confirm.msg': 'Tem certeza que deseja excluir este projeto permanentemente? Esta ação não pode ser desfeita.',
  'pri.delete.pwd': 'Digite a senha (789512)',
  'pri.delete.error': 'Senha incorreta.',
  'pri.delete.btn.cancel': 'Não, Cancelar',
  'pri.delete.btn.confirm': 'Sim, Excluir',
  'pri.delete.btn.deleting': 'Excluindo...',
  'pri.status.fast': 'Fast',
  'pri.status.fel1': 'FEL1',
  'pri.status.fel2': 'FEL2',
  'pri.status.fel3': 'FEL3',
  'pri.status.execution': 'Execução',
  'pri.status.completed': 'Concluído',
  'pri.status.cancelled': 'Cancelado',
  'pri.pilar.excelence': 'Excelência Operacional',
  'pri.pilar.sms': 'Segurança, Meio Ambiente e Sustentabilidade',
  'pri.pilar.innovation': 'Inovação e Digital',
  'pri.pilar.clients': 'Clientes e Qualidade',
  'pri.pilar.talent': 'Talento, Organização e Cultura',
  'Quick Win (Prioridade Máxima)': 'Quick Win (Prioridade Máxima)',
  'Grande Projeto (Planejar)': 'Grande Projeto (Planejar)',
  'Tarefa Ingrata (Fazer se houver tempo)': 'Tarefa Ingrata (Fazer se houver tempo)',
  'Sumidouro de Tempo (Descartar)': 'Sumidouro de Tempo (Descartar)',
  'Quick Win': 'Quick Win',
  'Grande Projeto': 'Grande Projeto',
  'Tarefa Ingrata': 'Tarefa Ingrata',
  'Sumidouro de Tempo': 'Sumidouro de Tempo'
};

const esES_keys = {
  'pri.title': 'Priorización Híbrida | PMO Ingeniería',
  'pri.heading': 'Priorización Híbrida',
  'pri.subheading': 'Scoring Multicriterio, Matriz de Valor vs. Esfuerzo y Asignación de CAPEX (Presupuesto).',
  'pri.kpi.registered': 'Proyectos Registrados',
  'pri.kpi.active': 'Cartera Activa',
  'pri.kpi.quickwins': 'Quick Wins',
  'pri.kpi.immediate': 'Foco Inmediato',
  'pri.kpi.totalcapex': 'CAPEX Total Estimado',
  'pri.kpi.committed': 'Presupuesto Comprometido',
  'pri.kpi.budget': 'Presupuesto Previsto',
  'pri.kpi.avgvalue': 'Score Medio de Valor',
  'pri.kpi.scale': 'Escala de 1.0 a 5.0',
  'pri.tab.eval': 'Evaluación',
  'pri.tab.matrix': 'Matriz y Ranking',
  'pri.tab.capex': 'Cartera CAPEX',
  'pri.matrix.title': 'Matriz de Valor vs. Esfuerzo',
  'pri.matrix.subtitle': 'Pase el cursor por los puntos para ver los detalles',
  'pri.ranking.title': 'Ranking de Proyectos (Scoring)',
  'pri.btn.export': 'Exportar CSV',
  'pri.btn.import': 'Importar de la V1',
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
  'pri.form.subtitle': 'Complete los campos y los criterios para calcular el score',
  'pri.form.editing': 'Editando los datos de: {name}',
  'pri.form.name': 'Nombre del Proyecto *',
  'pri.form.loading': 'Cargando proyectos del FAST...',
  'pri.form.desc': 'Descripción del Proyecto',
  'pri.form.desc.placeholder': 'Ingrese el alcance resumido y el objetivo estratégico del proyecto...',
  'pri.form.area': 'Área / Departamento Solicitante *',
  'pri.form.area.placeholder': 'Se buscará automáticamente del proyecto...',
  'pri.form.pilar': 'Pilar Estratégico *',
  'pri.form.status': 'Estado Inicial *',
  'pri.form.sponsor': 'Gerente Demandante / Patrocinador *',
  'pri.form.cost': 'Estimación de Costo Financiero (US$) *',
  'pri.form.value.title': 'Criterios de Evaluación de VALOR (Escala de 1 a 5)',
  'pri.form.effort.title': 'Criterios de Evaluación de ESFUERZO (Escala de 1 a 5)',
  'pri.form.btn.save': 'Guardar Proyecto',
  'pri.form.btn.cancel': 'Cancelar Edición',
  'pri.form.btn.delete': 'Eliminar Registro',
  'pri.form.btn.clear': 'Limpiar Formulario',
  'pri.sim.title': 'Simulador de Priorización en Tempo Real',
  'pri.sim.valscore': 'Score de Valor Total',
  'pri.sim.valweighted': 'Ponderado (Peso 3/3/2)',
  'pri.sim.effscore': 'Score de Esfuerzo Total',
  'pri.sim.effarith': 'Aritmético (Peso 1/1)',
  'pri.sim.quadrant': 'Cuadrante Resultante',
  'pri.sim.unclassified': 'Sin Clasificación',
  'pri.sim.selectall': 'Seleccione todos los criterios anteriores para ver la clasificación del proyecto.',
  'pri.budget.title': 'Asignación de CAPEX (Presupuesto / Cestas)',
  'pri.budget.teto': 'Techo (US$ k):',
  'pri.budget.remaining': 'Restante: US$ {val}',
  'pri.delete.title': 'Confirmación de Eliminación',
  'pri.delete.confirm.msg': '¿Está seguro de que desea eliminar este proyecto permanentemente? Esta acción no se puede deshacer.',
  'pri.delete.pwd': 'Ingrese la contraseña (789512)',
  'pri.delete.error': 'Contraseña incorrecta.',
  'pri.delete.btn.cancel': 'No, Cancelar',
  'pri.delete.btn.confirm': 'Sí, Eliminar',
  'pri.delete.btn.deleting': 'Eliminando...',
  'pri.status.fast': 'Fast',
  'pri.status.fel1': 'FEL1',
  'pri.status.fel2': 'FEL2',
  'pri.status.fel3': 'FEL3',
  'pri.status.execution': 'Ejecución',
  'pri.status.completed': 'Concluido',
  'pri.status.cancelled': 'Cancelado',
  'pri.pilar.excelence': 'Excelencia Operacional',
  'pri.pilar.sms': 'Seguridad, Medio Ambiente y Sostenibilidad',
  'pri.pilar.innovation': 'Innovación y Digital',
  'pri.pilar.clients': 'Clientes y Calidad',
  'pri.pilar.talent': 'Talento, Organización y Cultura',
  'Quick Win (Prioridade Máxima)': 'Quick Win (Prioridad Máxima)',
  'Grande Projeto (Planejar)': 'Gran Proyecto (Planificar)',
  'Tarefa Ingrata (Fazer se houver tempo)': 'Tarea Ingrata (Hacer si hay tiempo)',
  'Sumidouro de Tempo (Descartar)': 'Sumidero de Tiempo (Descartar)',
  'Quick Win': 'Quick Win',
  'Grande Projeto': 'Gran Proyecto',
  'Tarefa Ingrata': 'Tarea Ingrata',
  'Sumidouro de Tempo': 'Sumidero de Tiempo'
};

const paths = ['js/i18n.js', 'OUT/js/i18n.js'];

// Let's first restore clean i18n copies
try {
  fs.copyFileSync('c:/Users/user2/Downloads/Eng0906 - Copia/Eng0206/Eng0206/js/i18n.js', 'js/i18n.js');
  fs.copyFileSync('c:/Users/user2/Downloads/Eng0906 - Copia/Eng0206/Eng0206/js/i18n.js', 'OUT/js/i18n.js');
  console.log('Restored clean copies of i18n.js');
} catch (e) {
  console.log('Restore backup fail (fine if already correct):', e.message);
}

paths.forEach(p => {
  if (!fs.existsSync(p)) return;
  let code = fs.readFileSync(p, 'utf8');
  
  // Locate pt-BR target
  const ptBRTarget = '      \'schedule.title\': \'Carga de Cronograma - SharePoint\',';
  if (code.includes(ptBRTarget)) {
    let ptBRRepl = ptBRTarget + '\n';
    for (const [k, v] of Object.entries(ptBR_keys)) {
      ptBRRepl += `      '${k}': '${v.replace(/'/g, "\\'")}',\n`;
    }
    code = code.replace(ptBRTarget, ptBRRepl.trimEnd());
  }
  
  // Locate es-ES target
  const esESTarget = '      \'re.brand.title\': \'Informe de Ingenier\u00eda\',';
  if (code.includes(esESTarget)) {
    let esERepl = esESTarget + '\n';
    for (const [k, v] of Object.entries(esES_keys)) {
      esERepl += `      '${k}': '${v.replace(/'/g, "\\'")}',\n`;
    }
    code = code.replace(esESTarget, esERepl.trimEnd());
  }
  
  fs.writeFileSync(p, code, 'utf8');
  console.log('Successfully patched', p);
});
