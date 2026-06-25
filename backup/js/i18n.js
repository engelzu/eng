(function () {
  const LANG_KEY = 'gestor-lang';

  const dict = {
    'pt-BR': {
      /* ===== Login ===== */
      'login.title': 'Login - ProjectFlow SAS',
      'login.heading': 'Gestor Engenharia',
      'login.subtitle': 'ProjectFlow SAS — Fa\u00e7a login para continuar',
      'login.email.label': 'E-mail',
      'login.email.placeholder': 'seu@email.com',
      'login.password.label': 'Senha',
      'login.password.placeholder': 'Sua senha',
      'login.button': 'ENTRAR',
      'login.button.loading': 'ENTRANDO...',
      'login.error.generic': 'Erro ao fazer login. Verifique suas credenciais.',
      'login.error.notfound': 'Usu\u00e1rio n\u00e3o encontrado.',
      'login.error.wrongpassword': 'Senha incorreta.',
      'login.error.invalidemail': 'E-mail inv\u00e1lido.',
      'login.error.toomanyrequests': 'Muitas tentativas. Tente mais tarde.',

      /* ===== Sidebar ===== */
      'sidebar.title': 'Gestor Engenharia',
      'sidebar.subtitle': 'ProjectFlow SAS',
      'sidebar.menu.planning': 'PLANEJAMENTO',
      'sidebar.menu.fast': 'FAST',
      'sidebar.menu.hybridprioritization': 'PRIORIZAÇÃO HÍBRIDA',
      'sidebar.menu.businesscase': 'BUSINESS CASE',
      'sidebar.menu.resourceload': 'CARGA DE RECURSOS',
      'sidebar.menu.scheduleload': 'CARGA DE CRONOGRAMA',
      'sidebar.menu.checklist': 'CHECKLIST',
      'sidebar.menu.gates': 'GATES DE APROVA\u00c7\u00c3O',
      'sidebar.menu.fup': 'FUP',
      'sidebar.menu.re': 'RE - RELAT\u00d3RIO ENG',
      'sidebar.menu.database': 'BANCO DE DADOS',
      'sidebar.menu.admin': 'ADMIN',
      'sidebar.status.online': 'SISTEMA ONLINE',
      'sidebar.logout': 'SAIR',

      /* ===== Welcome ===== */
      'welcome.title': 'Gestor de Engenharia',
      'welcome.subtitle': 'ProjectFlow SAS \u00b7 Sistema Integrado',
      'welcome.badge': 'Sistema Online e Operacional',

      /* ===== Admin Modal ===== */
      'admin.restricted': '\u00c1rea Restrita',
      'admin.instruction': 'Insira a senha de administrador',
      'admin.cancel': 'CANCELAR',
      'admin.enter': 'ENTRAR',
      'admin.error': '\u26a0 Senha incorreta. Tente novamente.',

      /* ===== Checklist Manager ===== */
      'chk.manager.title': 'Gerenciador de Checklists',
      'chk.tab.new': 'NOVO CHECKLIST',
      'chk.tab.history': 'HIST\u00d3RICO NO FIREBASE',
      'chk.project.label': 'NOME DO PROJETO',
      'chk.project.select.arrow': '\u{1F448} SELECIONE O PROJETO PARA EXIBIR O CHECKLIST',
      'chk.project.placeholder': 'Selecione o Projeto...',
      'chk.project.with.count': 'Selecione o Projeto ({count} encontrados)...',
      'chk.sync': '\u{1F504} ATUALIZAR',
      'chk.save': 'SALVAR NA TABELA CHECKLISTS',
      'chk.saving': 'SALVANDO...',
      'chk.update': 'ATUALIZAR REGISTRO',
      'chk.clear.all': '\u{1F5D1}\ufe0f Limpar Todo o Hist\u00f3rico',
      'chk.delete.modal.title': 'Excluir Hist\u00f3rico',
      'chk.delete.all.title': 'Limpar Todo o Hist\u00f3rico',
      'chk.delete.single.title': 'Excluir Checklist',
      'chk.delete.all.desc': 'Tem certeza que deseja excluir <b>TODOS</b> os registros de checklists do banco de dados? Esta a\u00e7\u00e3o \u00e9 definitiva e n\u00e3o poder\u00e1 ser desfeita.',
      'chk.delete.single.desc': 'Tem certeza que deseja excluir o checklist do projeto <b>{projectName}</b> permanentemente?',
      'chk.delete.cancel': 'CANCELAR',
      'chk.delete.confirm': 'EXCLUIR',
      'chk.delete.deleting': 'EXCLUINDO...',
      'chk.fel.criteria': '\u2139\ufe0f Crit\u00e9rios FEL: FEL 1 (20-29%) | FEL 2 (53-64%) | FEL 3 (64-100%)',
      'chk.score.label': 'SCORE PDRI:',
      'chk.table.phase': 'FASE',
      'chk.table.item': '#',
      'chk.table.element': 'ELEMENTO DE VERIFICA\u00c7\u00c3O',
      'chk.table.category': 'CATEGORIA',
      'chk.table.evaluation': 'AVALIA\u00c7\u00c3O',
      'chk.table.observations': 'OBSERVA\u00c7\u00d5ES',
      'chk.table.obs.placeholder': 'Observa\u00e7\u00e3o...',
      'chk.table.eval.empty': '--',
      'chk.table.eval.1': '1 - Completo',
      'chk.table.eval.2': '2 - Importante',
      'chk.table.eval.3': '3 - Parcial',
      'chk.table.eval.4': '4 - Rascunho/Incompleto',
      'chk.table.eval.5': '5 - Faltando',

      /* ===== Toast Messages ===== */
      'toast.saved': 'Novo checklist salvo com sucesso!',
      'toast.updated': 'Registro atualizado com sucesso!',
      'toast.loaded': 'Checklist carregado para edi\u00e7\u00e3o.',
      'toast.notfound': 'Documento n\u00e3o encontrado!',
      'toast.deleted': 'Checklist exclu\u00eddo com sucesso!',
      'toast.all.deleted': 'Todo o hist\u00f3rico de checklists foi exclu\u00eddo!',
      'toast.none.delete': 'Nenhum checklist para excluir.',
      'toast.firebase.error': 'Erro ao salvar no Firebase.',
      'toast.firebase.delete.error': 'Erro ao excluir do Firebase.',
      'toast.sync.success': 'Lista de {count} projetos do FAST sincronizada!',
      'toast.sync.error': 'Erro ao sincronizar do Firebase.',
      'toast.project.required': 'Digite o nome do projeto!',
      'toast.firebase.notfound': 'Erro: Firebase n\u00e3o encontrado.',

      /* ===== Gates Page ===== */
      'gates.title': 'Gates de Aprova\u00e7\u00e3o - ProjectFlow',

      /* ===== Checklists Page ===== */
      'chklists.title': 'Checklists de Maturidade - ProjectFlow',
      'chklists.header.title': 'Lista de Checklists',
      'chklists.header.subtitle': '\u00cdndice Global de Maturidade do Investimento',
      'chklists.back': '\u2190 Voltar ao In\u00edcio',
      'chklists.search.placeholder': 'Buscar por projeto...',
      'chklists.clear.history': '\u{1F5D1}\ufe0f LIMPAR HIST\u00d3RICO',
      'chklists.new.checklist': '+ NOVO CHECKLIST',
      'chklists.loading': 'Carregando banco de dados...',
      'chklists.col.id': 'ID',
      'chklists.col.project': 'Projeto',
      'chklists.col.date': 'Data de Cria\u00e7\u00e3o',
      'chklists.col.maturity': 'Maturidade',
      'chklists.col.actions': 'A\u00e7\u00f5es',
      'chklists.col.datetime': 'DATA/HORA',
      'chklists.col.user': 'USU\u00c1RIO',
      'chklists.no.data': 'Nenhum checklist encontrado.',
      'chk.edit': 'EDITAR',
      'chk.no.name': 'Sem Nome',

      /* ===== Database Page ===== */
      'db.title': 'BANCO DE DADOS (Registros Completos)',
      'db.back': '\u2190 Voltar',
      'db.restricted': 'Acesso Restrito',
      'db.pwd.placeholder': 'Digite a senha (789512)',
      'db.access': 'Acessar Banco de Dados',
      'db.error': 'Senha incorreta. Acesso negado.',
      'db.col.actions': 'A\u00e7\u00f5es',
      'db.waiting': 'Aguardando login...',
      'db.showing': 'Mostrando {count} registros',
      'db.previous': 'Anterior',
      'db.next': 'Pr\u00f3xima',
      'db.edit': 'Editar Registro',

      /* ===== Gates Page ===== */
      'gates.back': '\u2190 Voltar ao Painel',
      'gates.main.title': 'Gates de Aprova\u00e7\u00e3o',
      'gates.subtitle': 'Acompanhamento das etapas de maturidade dos projetos CMPC',
      'gates.select.project': 'Selecionar Projeto...',
      'gates.no.project': 'Nenhum projeto selecionado.',
      'gates.select.prompt': 'Selecione um projeto acima para visualizar os gates.',
      'gates.stage': 'Etapa',
      'gates.status': 'Status',
      'gates.date': 'Data',
      'gates.responsible': 'Respons\u00e1vel',
      'gates.notes': 'Observa\u00e7\u00f5es',
      'gates.status.pending': 'Pendente',
      'gates.status.approved': 'Aprovado',
      'gates.status.reproved': 'Reprovado',
      'gates.status.in_progress': 'Em Andamento',
      'gates.save': 'Salvar',
      'gates.saving': 'Salvando...',
      'gates.saved': 'Gates salvos com sucesso!',
      'gates.error': 'Erro ao salvar gates.',
      'gates.loading': 'Carregando...',

      /* ===== FUP Page ===== */
      'fup.title': 'FUP Projetos – Reuni\u00e3o',
      'fup.brand': 'FUP',
      'fup.brand.title': 'Follow-Up de Projetos',

      /* ===== RE Page ===== */
      're.title': 'Dashboard Projetos v3 \u2013 CMPC',
      're.brand': 'RE',
      're.brand.title': 'Relat\u00f3rio de Engenharia',

      /* ===== Schedule Page ===== */
      'schedule.title': 'Carga de Cronograma - SharePoint',
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
      'pri.sim.desc.quickwin': 'Projetos de alto impacto com baixo esforço. Devem ser priorizados e executados imediatamente.',
      'pri.sim.desc.grande': 'Projetos de alto impacto, mas alta complexidade. Exigem planejamento estruturado e alocação cuidadosa de recursos.',
      'pri.sim.desc.ingrata': 'Projetos de baixo impacto e baixo esforço. Devem ser executados apenas se houver recursos remanescentes na carteira.',
      'pri.sim.desc.sumidouro': 'Projetos de baixo impacto e alto esforço. Devem ser descartados ou completamente reavaliados.',
      'pri.btn.editrow': 'Editar',
      'pri.btn.deleterow': 'Excluir',
      'pri.budget.other': 'Outros / Sem Pilar Definido',
      'pri.budget.consumed': 'Consumido:',
      'pri.budget.nolimit': '(Sem limite definido)',
      'pri.budget.nopilar': 'Sem Pilar',
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
      'Sumidouro de Tempo': 'Sumidouro de Tempo',
    },

    'es-ES': {
      /* ===== Login ===== */
      'login.title': 'Iniciar Sesi\u00f3n - ProjectFlow SAS',
      'login.heading': 'Gestor Ingenier\u00eda',
      'login.subtitle': 'ProjectFlow SAS \u2014 Inicie sesi\u00f3n para continuar',
      'login.email.label': 'Correo electr\u00f3nico',
      'login.email.placeholder': 'su@email.com',
      'login.password.label': 'Contrase\u00f1a',
      'login.password.placeholder': 'Su contrase\u00f1a',
      'login.button': 'INGRESAR',
      'login.button.loading': 'INGRESANDO...',
      'login.error.generic': 'Error al iniciar sesi\u00f3n. Verifique sus credenciales.',
      'login.error.notfound': 'Usuario no encontrado.',
      'login.error.wrongpassword': 'Contrase\u00f1a incorrecta.',
      'login.error.invalidemail': 'Correo inv\u00e1lido.',
      'login.error.toomanyrequests': 'Demasiados intentos. Intente m\u00e1s tarde.',

      /* ===== Sidebar ===== */
      'sidebar.title': 'Gestor Ingenier\u00eda',
      'sidebar.subtitle': 'ProjectFlow SAS',
      'sidebar.menu.planning': 'PLANIFICACI\u00d3N',
      'sidebar.menu.fast': 'FAST',
      'sidebar.menu.hybridprioritization': 'PRIORIZACIÓN HÍBRIDA',
      'sidebar.menu.businesscase': 'BUSINESS CASE',
      'sidebar.menu.resourceload': 'CARGA DE RECURSOS',
      'sidebar.menu.scheduleload': 'CARGA DE CRONOGRAMA',
      'sidebar.menu.checklist': 'CHECKLIST',
      'sidebar.menu.gates': 'GATES DE APROBACI\u00d3N',
      'sidebar.menu.fup': 'FUP',
      'sidebar.menu.re': 'RE - INFORME ING',
      'sidebar.menu.database': 'BASE DE DATOS',
      'sidebar.menu.admin': 'ADMIN',
      'sidebar.status.online': 'SISTEMA EN L\u00cdNEA',
      'sidebar.logout': 'SALIR',

      /* ===== Welcome ===== */
      'welcome.title': 'Gestor de Ingenier\u00eda',
      'welcome.subtitle': 'ProjectFlow SAS \u00b7 Sistema Integrado',
      'welcome.badge': 'Sistema en L\u00ednea y Operacional',

      /* ===== Admin Modal ===== */
      'admin.restricted': '\u00c1rea Restringida',
      'admin.instruction': 'Ingrese la contrase\u00f1a de administrador',
      'admin.cancel': 'CANCELAR',
      'admin.enter': 'INGRESAR',
      'admin.error': '\u26a0 Contrase\u00f1a incorrecta. Intente de nuevo.',

      /* ===== Checklist Manager ===== */
      'chk.manager.title': 'Gestor de Checklists',
      'chk.tab.new': 'NUEVO CHECKLIST',
      'chk.tab.history': 'HISTORIAL EN FIREBASE',
      'chk.project.label': 'NOMBRE DEL PROYECTO',
      'chk.project.select.arrow': '\u{1F448} SELECCIONE EL PROYECTO PARA VER EL CHECKLIST',
      'chk.project.placeholder': 'Seleccione el Proyecto...',
      'chk.project.with.count': 'Seleccione el Proyecto ({count} encontrados)...',
      'chk.sync': '\u{1F504} ACTUALIZAR',
      'chk.save': 'GUARDAR EN TABLA CHECKLISTS',
      'chk.saving': 'GUARDANDO...',
      'chk.update': 'ACTUALIZAR REGISTRO',
      'chk.clear.all': '\u{1F5D1}\ufe0f Limpiar Todo el Historial',
      'chk.delete.modal.title': 'Eliminar Historial',
      'chk.delete.all.title': 'Limpiar Todo el Historial',
      'chk.delete.single.title': 'Eliminar Checklist',
      'chk.delete.all.desc': '\u00bfEst\u00e1 seguro de eliminar <b>TODOS</b> los registros de checklists de la base de datos? Esta acci\u00f3n es definitiva y no se puede deshacer.',
      'chk.delete.single.desc': '\u00bfEst\u00e1 seguro de eliminar el checklist del proyecto <b>{projectName}</b> permanentemente?',
      'chk.delete.cancel': 'CANCELAR',
      'chk.delete.confirm': 'ELIMINAR',
      'chk.delete.deleting': 'ELIMINANDO...',
      'chk.fel.criteria': '\u2139\ufe0f Criterios FEL: FEL 1 (20-29%) | FEL 2 (53-64%) | FEL 3 (64-100%)',
      'chk.score.label': 'SCORE PDRI:',
      'chk.table.phase': 'FASE',
      'chk.table.item': '#',
      'chk.table.element': 'ELEMENTO DE VERIFICACI\u00d3N',
      'chk.table.category': 'CATEGOR\u00cdA',
      'chk.table.evaluation': 'EVALUACI\u00d3N',
      'chk.table.observations': 'OBSERVACIONES',
      'chk.table.obs.placeholder': 'Observaci\u00f3n...',
      'chk.table.eval.empty': '--',
      'chk.table.eval.1': '1 - Completo',
      'chk.table.eval.2': '2 - Importante',
      'chk.table.eval.3': '3 - Parcial',
      'chk.table.eval.4': '4 - Borrador/Incompleto',
      'chk.table.eval.5': '5 - Faltante',

      /* ===== Toast Messages ===== */
      'toast.saved': '\u00a1Nuevo checklist guardado con \u00e9xito!',
      'toast.updated': '\u00a1Registro actualizado con \u00e9xito!',
      'toast.loaded': 'Checklist cargado para edici\u00f3n.',
      'toast.notfound': '\u00a1Documento no encontrado!',
      'toast.deleted': '\u00a1Checklist eliminado con \u00e9xito!',
      'toast.all.deleted': '\u00a1Todo el historial de checklists fue eliminado!',
      'toast.none.delete': 'No hay checklists para eliminar.',
      'toast.firebase.error': 'Error al guardar en Firebase.',
      'toast.firebase.delete.error': 'Error al eliminar de Firebase.',
      'toast.sync.success': '\u00a1Lista de {count} proyectos del FAST sincronizada!',
      'toast.sync.error': 'Error al sincronizar de Firebase.',
      'toast.project.required': '\u00a1Ingrese el nombre del proyecto!',
      'toast.firebase.notfound': 'Error: Firebase no encontrado.',

      
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

      /* ===== Gates Page ===== */
      'gates.title': 'Gates de Aprobaci\u00f3n - ProjectFlow',

      /* ===== Checklists Page ===== */
      'chklists.title': 'Checklists de Madurez - ProjectFlow',
      'chklists.header.title': 'Lista de Checklists',
      'chklists.header.subtitle': '\u00cdndice Global de Madurez de la Inversi\u00f3n',
      'chklists.back': '\u2190 Volver al Inicio',
      'chklists.search.placeholder': 'Buscar por proyecto...',
      'chklists.clear.history': '\u{1F5D1}\ufe0f LIMPIAR HISTORIAL',
      'chklists.new.checklist': '+ NUEVO CHECKLIST',
      'chklists.loading': 'Cargando base de datos...',
      'chklists.col.id': 'ID',
      'chklists.col.project': 'Proyecto',
      'chklists.col.date': 'Fecha de Creaci\u00f3n',
      'chklists.col.maturity': 'Madurez',
      'chklists.col.actions': 'Acciones',
      'chklists.col.datetime': 'FECHA/HORA',
      'chklists.col.user': 'USUARIO',
      'chklists.no.data': 'Ning\u00fan checklist encontrado.',
      'chk.edit': 'EDITAR',
      'chk.no.name': 'Sin Nombre',

      /* ===== Database Page ===== */
      'db.title': 'BASE DE DATOS (Registros Completos)',
      'db.back': '\u2190 Volver',
      'db.restricted': 'Acceso Restringido',
      'db.pwd.placeholder': 'Ingrese la contrase\u00f1a (789512)',
      'db.access': 'Acceder a Base de Datos',
      'db.error': 'Contrase\u00f1a incorrecta. Acceso denegado.',
      'db.col.actions': 'Acciones',
      'db.waiting': 'Esperando inicio de sesi\u00f3n...',
      'db.showing': 'Mostrando {count} registros',
      'db.previous': 'Anterior',
      'db.next': 'Siguiente',
      'db.edit': 'Editar Registro',

      /* ===== Gates Page ===== */
      'gates.back': '\u2190 Volver al Panel',
      'gates.main.title': 'Gates de Aprobaci\u00f3n',
      'gates.subtitle': 'Seguimiento de las etapas de madurez de los proyectos CMPC',
      'gates.select.project': 'Seleccionar Proyecto...',
      'gates.no.project': 'Ning\u00fan proyecto seleccionado.',
      'gates.select.prompt': 'Seleccione un proyecto arriba para ver los gates.',
      'gates.stage': 'Etapa',
      'gates.status': 'Estado',
      'gates.date': 'Fecha',
      'gates.responsible': 'Responsable',
      'gates.notes': 'Observaciones',
      'gates.status.pending': 'Pendiente',
      'gates.status.approved': 'Aprobado',
      'gates.status.reproved': 'Rechazado',
      'gates.status.in_progress': 'En Curso',
      'gates.save': 'Guardar',
      'gates.saving': 'Guardando...',
      'gates.saved': '\u00a1Gates guardados con \u00e9xito!',
      'gates.error': 'Error al guardar gates.',
      'gates.loading': 'Cargando...',

      /* ===== FUP Page ===== */
      'fup.title': 'FUP Proyectos – Reuni\u00f3n',
      'fup.brand': 'FUP',
      'fup.brand.title': 'Seguimiento de Proyectos',

      /* ===== RE Page ===== */
      're.title': 'Dashboard Proyectos v3 \u2013 CMPC',
      're.brand': 'RE',
      're.brand.title': 'Informe de Ingenier\u00eda',
    }
  };

  function detectLang() {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === 'pt-BR' || stored === 'es-ES') return stored;
    return 'pt-BR';
  }

  let currentLang = detectLang();

  function t(key, replacements) {
    const langDict = dict[currentLang];
    let val = langDict && langDict[key] ? langDict[key] : (dict['pt-BR'][key] || key);
    if (replacements) {
      Object.keys(replacements).forEach(k => {
        val = val.replace(new RegExp('\\{' + k + '\\}', 'g'), replacements[k]);
      });
    }
    return val;
  }

  function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const attr = el.getAttribute('data-i18n-attr');
      const text = t(key);
      if (attr) {
        if (attr === 'placeholder') {
          el.placeholder = text;
        } else if (attr === 'title') {
          el.title = text;
        } else if (attr === 'value') {
          el.value = text;
        }
      } else {
        el.textContent = text;
      }
    });
    const titleEl = document.querySelector('title[data-i18n]');
    if (!titleEl) {
      document.title = t(document.title) || document.title;
    }
  }

  function setLang(lang) {
    if (lang !== 'pt-BR' && lang !== 'es-ES') return;
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    translatePage();
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  function getLang() { return currentLang; }

  function init() {
    document.documentElement.lang = currentLang;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', translatePage);
    } else {
      translatePage();
    }
  }

  window.i18n = { t: t, setLang: setLang, getLang: getLang, init: init, translatePage: translatePage, dict: dict };

  init();
})();
