const fs = require('fs');

const files = ['pri/priorizacao-hibrida-v2.html', 'OUT/pri/priorizacao-hibrida-v2.html'];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let html = fs.readFileSync(f, 'utf8');

  // Insert script tag in head
  if (!html.includes('i18n.js')) {
    html = html.replace('<link rel="stylesheet" href="style.css">', '<link rel="stylesheet" href="style.css">\n    <script src="../js/i18n.js"></script>');
  }

  // Replace Title
  html = html.replace('<title>Priorização Híbrida | PMO Engenharia</title>', '<title data-i18n="pri.title">Priorização Híbrida | PMO Engenharia</title>');

  // Replace Main Heading
  html = html.replace('Priorização Híbrida</h1>', '<span data-i18n="pri.heading">Priorização Híbrida</span></h1>');
  html = html.replace('<p>Scoring Multicritério, Matriz de Valor vs. Esforço e Alocação de CAPEX (Orçamento).</p>', '<p data-i18n="pri.subheading">Scoring Multicritério, Matriz de Valor vs. Esforço e Alocação de CAPEX (Orçamento).</p>');

  // Replace KPIs
  html = html.replace('<h3>Projetos Cadastrados</h3>', '<h3 data-i18n="pri.kpi.registered">Projetos Cadastrados</h3>');
  html = html.replace('<span class="trend neutral">Carteira Ativa</span>', '<span class="trend neutral" data-i18n="pri.kpi.active">Carteira Ativa</span>');
  html = html.replace('<h3>Quick Wins</h3>', '<h3 data-i18n="pri.kpi.quickwins">Quick Wins</h3>');
  html = html.replace('<span class="trend positive"><i class="ph ph-trend-up"></i> Foco Imediato</span>', '<span class="trend positive"><i class="ph ph-trend-up"></i> <span data-i18n="pri.kpi.immediate">Foco Imediato</span></span>');
  html = html.replace('<h3>CAPEX Total Estimado</h3>', '<h3 data-i18n="pri.kpi.totalcapex">CAPEX Total Estimado</h3>');
  html = html.replace('<span class="trend neutral">Orçamento Previsto</span>', '<span class="trend neutral" data-i18n="pri.kpi.budget">Orçamento Previsto</span>');
  html = html.replace('<h3>Score Médio de Valor</h3>', '<h3 data-i18n="pri.kpi.avgvalue">Score Médio de Valor</h3>');
  html = html.replace('<span class="trend neutral">Escala de 1.0 a 5.0</span>', '<span class="trend neutral" data-i18n="pri.kpi.scale">Escala de 1.0 a 5.0</span>');

  // Tabs
  html = html.replace('Avaliação (Backlog <span', '<span data-i18n="pri.tab.eval">Avaliação</span> (Backlog <span');
  html = html.replace('Matriz & Ranking (<span', '<span data-i18n="pri.tab.matrix">Matriz & Ranking</span> (<span');
  html = html.replace('Portfólio CAPEX <span', '<span data-i18n="pri.tab.capex">Portfólio CAPEX</span> <span');

  // Matrix and Ranking headers
  html = html.replace('<h2><i class="ph ph-chart-scatter"></i> Matriz de Valor vs. Esforço</h2>', '<h2><i class="ph ph-chart-scatter"></i> <span data-i18n="pri.matrix.title">Matriz de Valor vs. Esforço</span></h2>');
  html = html.replace('<span style="font-size: 0.8rem; color: var(--color-text-muted);">Passe o mouse nos\n                                    pontos para ver os detalhes</span>', '<span style="font-size: 0.8rem; color: var(--color-text-muted);" data-i18n="pri.matrix.subtitle">Passe o mouse nos pontos para ver os detalhes</span>');
  html = html.replace('<h2><i class="ph ph-sort-ascending"></i> Ranking de Projetos (Scoring)</h2>', '<h2><i class="ph ph-sort-ascending"></i> <span data-i18n="pri.ranking.title">Ranking de Projetos (Scoring)</span></h2>');

  // Buttons
  html = html.replace('<i class="ph ph-download-simple"></i> Exportar CSV', '<i class="ph ph-download-simple"></i> <span data-i18n="pri.btn.export">Exportar CSV</span>');
  html = html.replace('<i class="ph ph-database"></i> Importar da V1', '<i class="ph ph-database"></i> <span data-i18n="pri.btn.import">Importar da V1</span>');
  html = html.replace('<i class="ph ph-arrow-counter-clockwise"></i> Restaurar Testes', '<i class="ph ph-arrow-counter-clockwise"></i> <span data-i18n="pri.btn.reset">Restaurar Testes</span>');

  // Search filter
  html = html.replace('placeholder="Buscar projeto ou sponsor..."', 'placeholder="Buscar projeto ou sponsor..." data-i18n="pri.filter.search" data-i18n-attr="placeholder"');
  
  // Filter Options
  html = html.replace('<option value="">Pilar (Todos)</option>', '<option value="" data-i18n="pri.filter.pilar">Pilar (Todos)</option>');
  html = html.replace('<option value="">Área (Todas)</option>', '<option value="" data-i18n="pri.filter.area">Área (Todas)</option>');
  html = html.replace('<option value="">Quadrante (Todos)</option>', '<option value="" data-i18n="pri.filter.quadrant">Quadrante (Todos)</option>');

  // Table Headers
  html = html.replace('<th style="text-align: center;">CAPEX</th>', '<th style="text-align: center;" data-i18n="pri.col.capex">CAPEX</th>');
  html = html.replace('<th>Projeto</th>', '<th data-i18n="pri.col.project">Projeto</th>');
  html = html.replace('<th>Custo</th>', '<th data-i18n="pri.col.cost">Custo</th>');
  html = html.replace('<th style="text-align: center;">Valor</th>', '<th style="text-align: center;" data-i18n="pri.col.value">Valor</th>');
  html = html.replace('<th style="text-align: center;">Esforço</th>', '<th style="text-align: center;" data-i18n="pri.col.effort">Esforço</th>');
  html = html.replace('<th>Quadrante</th>', '<th data-i18n="pri.col.quadrant">Quadrante</th>');
  html = html.replace('<th style="text-align: center;">Ações</th>', '<th style="text-align: center;" data-i18n="pri.col.actions">Ações</th>');

  // Form Section
  html = html.replace('<h2 id="form-title"><i class="ph ph-file-plus"></i> Novo Projeto</h2>', '<h2 id="form-title"><i class="ph ph-file-plus"></i> <span data-i18n="pri.form.new">Novo Projeto</span></h2>');
  html = html.replace('<span style="font-size: 0.8rem; color: var(--color-text-muted);" id="form-subtitle">Preencha os campos e os critérios para calcular o score</span>', '<span style="font-size: 0.8rem; color: var(--color-text-muted);" id="form-subtitle" data-i18n="pri.form.subtitle">Preencha os campos e os critérios para calcular o score</span>');
  html = html.replace('<label for="project-name" style="margin: 0;">Nome do Projeto *</label>', '<label for="project-name" style="margin: 0;" data-i18n="pri.form.name">Nome do Projeto *</label>');
  html = html.replace('<option value="">Carregando projetos do FAST...</option>', '<option value="" data-i18n="pri.form.loading">Carregando projetos do FAST...</option>');
  html = html.replace('<label for="project-desc">Descrição do Projeto</label>', '<label for="project-desc" data-i18n="pri.form.desc">Descrição do Projeto</label>');
  html = html.replace('placeholder="Insira o escopo resumido e o objetivo estratégico do projeto..."', 'placeholder="Insira o escopo resumido e o objetivo estratégico do projeto..." data-i18n="pri.form.desc.placeholder" data-i18n-attr="placeholder"');
  html = html.replace('<label for="project-area">Área / Departamento Solicitante *</label>', '<label for="project-area" data-i18n="pri.form.area">Área / Departamento Solicitante *</label>');
  html = html.replace('placeholder="Buscará automático do projeto..."', 'placeholder="Buscará automático do projeto..." data-i18n="pri.form.area.placeholder" data-i18n-attr="placeholder"');
  html = html.replace('<label for="project-pilar">Pilar Estratégico *</label>', '<label for="project-pilar" data-i18n="pri.form.pilar">Pilar Estratégico *</label>');
  html = html.replace('<label for="project-status">Status Inicial *</label>', '<label for="project-status" data-i18n="pri.form.status">Status Inicial *</label>');
  html = html.replace('<label for="project-sponsor">Gerente Demandante / Patrocinador *</label>', '<label for="project-sponsor" data-i18n="pri.form.sponsor">Gerente Demandante / Patrocinador *</label>');
  html = html.replace('<label for="project-cost">Estimativa de Custo Financeiro (US$) *</label>', '<label for="project-cost" data-i18n="pri.form.cost">Estimativa de Custo Financeiro (US$) *</label>');
  
  html = html.replace('<i class="ph ph-heart-beat"></i> Critérios de Avaliação de VALOR (Escala de 1 a 5)', '<i class="ph ph-heart-beat"></i> <span data-i18n="pri.form.value.title">Critérios de Avaliação de VALOR (Escala de 1 a 5)</span>');
  html = html.replace('<i class="ph ph-wrench"></i> Critérios de Avaliação de ESFORÇO (Escala de 1 a 5)', '<i class="ph ph-wrench"></i> <span data-i18n="pri.form.effort.title">Critérios de Avaliação de ESFORÇO (Escala de 1 a 5)</span>');

  // Form Buttons
  html = html.replace('Salvar\n                                        Projeto</button>', '<span data-i18n="pri.form.btn.save">Salvar Projeto</span></button>');
  html = html.replace('Cancelar Edição</button>', '<span data-i18n="pri.form.btn.cancel">Cancelar Edição</span></button>');
  html = html.replace('Excluir Registro</button>', '<span data-i18n="pri.form.btn.delete">Excluir Registro</span></button>');
  html = html.replace('Limpar\n                                        Formulário</button>', '<span data-i18n="pri.form.btn.clear">Limpar Formulário</span></button>');

  // Simulator
  html = html.replace('<i class="ph ph-cpu"></i> Simulador de Priorização em Tempo Real', '<i class="ph ph-cpu"></i> <span data-i18n="pri.sim.title">Simulador de Priorização em Tempo Real</span>');
  html = html.replace('<div class="preview-score-label">Score de Valor Total</div>', '<div class="preview-score-label" data-i18n="pri.sim.valscore">Score de Valor Total</div>');
  html = html.replace('<div class="preview-score-label">Score de Esforço Total</div>', '<div class="preview-score-label" data-i18n="pri.sim.effscore">Score de Esforço Total</div>');
  html = html.replace('<div class="preview-score-label">Quadrante Resultante</div>', '<div class="preview-score-label" data-i18n="pri.sim.quadrant">Quadrante Resultante</div>');
  html = html.replace('Sem Classificação</div>', '<span data-i18n="pri.sim.unclassified">Sem Classificação</span></div>');
  html = html.replace('Selecione todos os critérios acima para visualizar a classificação do\n                                            projeto.', '<span data-i18n="pri.sim.selectall">Selecione todos os critérios acima para visualizar a classificação do projeto.</span>');

  // Delete Modal
  html = html.replace('<i class="ph ph-warning-octagon"></i> Confirmação de Exclusão', '<i class="ph ph-warning-octagon"></i> <span data-i18n="pri.delete.title">Confirmação de Exclusão</span>');
  html = html.replace('Tem certeza que deseja excluir este projeto permanentemente? Esta ação <strong>não pode ser desfeita</strong>.', '<span data-i18n="pri.delete.confirm.msg">Tem certeza que deseja excluir este projeto permanentemente? Esta ação não pode ser desfeita.</span>');
  html = html.replace('placeholder="Digite a senha (789512)"', 'placeholder="Digite a senha (789512)" data-i18n="pri.delete.pwd" data-i18n-attr="placeholder"');
  html = html.replace('Senha incorreta.</p>', '<span data-i18n="pri.delete.error">Senha incorreta.</span></p>');
  html = html.replace('Não, Cancelar</button>', '<span data-i18n="pri.delete.btn.cancel">Não, Cancelar</span></button>');
  html = html.replace('Sim, Excluir</button>', '<span data-i18n="pri.delete.btn.confirm">Sim, Excluir</span></button>');

  fs.writeFileSync(f, html, 'utf8');
  console.log('Successfully updated data-i18n in', f);
});
