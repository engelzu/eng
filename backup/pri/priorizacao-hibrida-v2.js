// priorizacao-hibrida.js - PMO Engenharia CMPC Guaíba

document.addEventListener('DOMContentLoaded', () => {
    // --- LocalStorage Keys ---
    const DB_KEY = 'ppm_hibrido_projetos';

    // --- State Variables ---
    let projects = [];
    let activeTab = 'tab-matriz';
    let scatterChart = null;
    let editModeId = null;

    // Default mock data if LocalStorage is empty
    const mockProjects = [];

    // --- DOM Elements ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const projectForm = document.getElementById('project-form');
    const projectCostInput = document.getElementById('project-cost');
    const searchFilterInput = document.getElementById('filter-search');
    if (searchFilterInput) {
        searchFilterInput.value = '';
        setTimeout(() => { searchFilterInput.value = ''; }, 100);
        setTimeout(() => { searchFilterInput.value = ''; }, 500);
    }
    const filterPilarSelect = document.getElementById('filter-pilar');
    const areaFilterSelect = document.getElementById('filter-area');
    const quadrantFilterSelect = document.getElementById('filter-quadrante');
    const rankingTableBody = document.getElementById('ranking-table-body');
    const tabCadastroTrigger = document.getElementById('tab-cadastro-trigger');

    // Form elements
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const projectIdInput = document.getElementById('project-id');
    const projectNameInput = document.getElementById('project-name');
    const projectDescInput = document.getElementById('project-desc');
    const projectAreaSelect = document.getElementById('project-area');
    const projectPilarSelect = document.getElementById('project-pilar');
    const projectStatusSelect = document.getElementById('project-status');
    const projectSponsorInput = document.getElementById('project-sponsor');
    const btnCancelEdit = document.getElementById('btn-cancel-edit');
    const btnDeleteProject = document.getElementById('btn-delete-project');
    const btnResetForm = document.getElementById('btn-reset-form');

    // Simulator Preview Elements
    const previewValScore = document.getElementById('preview-val-score');
    const previewEffScore = document.getElementById('preview-eff-score');
    const previewQuadrant = document.getElementById('preview-quadrant');
    const previewQuadrantDescription = document.getElementById('preview-quadrant-description');
    const previewVectorDot = document.getElementById('preview-vector-dot');

    // --- Data Logic (CRUD) ---
    async function ensureAuthenticated() {
        const auth = firebase.auth();
        const user = auth.currentUser;
        if (!user || user.isAnonymous) {
            console.log("No authenticated user or user is anonymous. Redirecting to login...");
            window.location.replace("../login.html");
            throw new Error("Sessão expirada. Redirecionando para login...");
        }
    }

    function loadData() {
        const stored = localStorage.getItem(DB_KEY);
        if (stored) {
            try {
                projects = JSON.parse(stored);
            } catch (e) {
                projects = [];
            }
        }

        projects.forEach(p => {
            if (p.status === "FEL 1") p.status = "FEL1";
            if (p.status === "FEL 2") p.status = "FEL2";
            if (p.status === "FEL 3") p.status = "FEL3";
            calculateScores(p);
        });
        updateDashboard();
    }

    function saveData() {
        localStorage.setItem(DB_KEY, JSON.stringify(projects));
    }

    let unsubscribePriorizacao = null;
    function startListeningPriorizacao() {
        if (unsubscribePriorizacao) unsubscribePriorizacao();
        unsubscribePriorizacao = db.collection('priorizacao').onSnapshot(snap => {
            projects = [];
            let allTetos = {};
            snap.forEach(doc => {
                if (doc.id.startsWith('config_tetos')) {
                    allTetos[doc.id] = doc.data();
                    return;
                }
                const data = doc.data();
                projects.push({
                    docId: doc.id,
                    ...data
                });
            });
            projects.forEach(p => {
                if (p.status === "FEL 1") p.status = "FEL1";
                if (p.status === "FEL 2") p.status = "FEL2";
                if (p.status === "FEL 3") p.status = "FEL3";
                calculateScores(p);
            });

            // Apply loaded tetos for current year if exists
            const currentYear = getCurrentYear();
            const yearTetoDocId = `config_tetos_${currentYear}`;
            const currentYearTetos = allTetos[yearTetoDocId] || allTetos['config_tetos'];
            if (currentYearTetos) {
                applyLoadedTetos(currentYearTetos);
            }

            window.allLoadedTetos = allTetos;

            updateDashboard();
        }, error => {
            console.error("Error listening to priorizacao:", error);
        });
    }

    function calculateScores(proj) {
        // Value formula: ((Alinhamento * 3) + (Retorno * 3) + (Impacto * 2)) / 8
        proj.scoreValor = ((proj.alinhamento * 3) + (proj.retorno * 3) + (proj.impacto * 2)) / 8;

        // Effort formula: (Complexidade + Esforço de Equipe) / 2
        proj.scoreEsforco = (proj.complexidade + proj.esforcoEquipe) / 2;

        // Quadrant evaluation
        if (proj.scoreValor >= 3.5 && proj.scoreEsforco < 3) {
            proj.quadrante = "Quick Win (Prioridade Máxima)";
        } else if (proj.scoreValor >= 3.5 && proj.scoreEsforco >= 3) {
            proj.quadrante = "Grande Projeto (Planejar)";
        } else if (proj.scoreValor < 3.5 && proj.scoreEsforco < 3) {
            proj.quadrante = "Tarefa Ingrata (Fazer se houver tempo)";
        } else {
            proj.quadrante = "Sumidouro de Tempo (Descartar)";
        }
    }

    // --- Helper Formatters ---
    function formatCurrency(val) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    }

    function formatUSDK(val) {
        return 'US$ ' + (val / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 0 }) + ' k';
    }

    function getNumericCost(str) {
        if (!str) return 0;
        return parseFloat(str.replace(/[^\d]/g, '')) / 100;
    }

    // --- Update Views / Dashboard ---
    function updateDashboard() {
        // 1. Recalculate KPIs
        updateKPIs();

        // 2. Populate Filters (Area dropdown list based on current active areas)
        populateAreaFilter();

        // 3. Render Views based on tab
        renderRankingTable();
        initOrUpdateScatterPlot();
        renderOrcamentoTab();
    }

    function updateKPIs() {
        const total = projects.length;
        let quickWins = 0;
        let totalCapex = 0;
        let sumValue = 0;

        projects.forEach(p => {
            if (p.quadrante.includes("Quick Win")) quickWins++;
            totalCapex += p.custo;
            sumValue += p.scoreValor;
        });

        const avgValue = total > 0 ? (sumValue / total).toFixed(2) : "0.00";

        document.getElementById('kpi-total-projects').innerText = total;
        document.getElementById('kpi-quick-wins').innerText = quickWins;
        document.getElementById('kpi-total-capex').innerText = formatCurrency(totalCapex);
        document.getElementById('kpi-avg-value').innerText = avgValue;
    }

    function populateAreaFilter() {
        const areas = [...new Set(projects.map(p => p.area))].sort();
        const currentSelection = areaFilterSelect.value;

        areaFilterSelect.innerHTML = '<option value="">Área (Todas)</option>';
        areas.forEach(a => {
            const opt = document.createElement('option');
            opt.value = a;
            opt.innerText = a;
            if (a === currentSelection) opt.selected = true;
            areaFilterSelect.appendChild(opt);
        });
    }

    // --- Rating Click Event Bindings ---
    const ratingContainers = document.querySelectorAll('.rating-container');
    ratingContainers.forEach(container => {
        const btns = container.querySelectorAll('.rating-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Recalculate simulator preview
                updateSimulatorPreview();
            });
        });
    });

    function getSelectedRating(criterionName) {
        const container = document.querySelector(`.rating-container[data-criterion="${criterionName}"]`);
        if (!container) return 0; // default
        const activeBtn = container.querySelector('.rating-btn.active');
        return activeBtn ? parseInt(activeBtn.dataset.val) : 0;
    }

    function setSelectedRating(criterionName, val) {
        const container = document.querySelector(`.rating-container[data-criterion="${criterionName}"]`);
        if (!container) return;
        const btns = container.querySelectorAll('.rating-btn');
        btns.forEach(b => {
            if (parseInt(b.dataset.val) === val) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });
    }

    // Dynamic label updater for Segurança, Meio Ambiente e Sustentabilidade
    const roiTitleSpan = document.querySelector('.rating-container[data-criterion="retorno"] .title');
    const roiDescDiv = document.querySelector('.rating-container[data-criterion="retorno"] .rating-desc');

    function updateRoiFieldLabels() {
        if (!projectPilarSelect) return;
        const selectedPilar = projectPilarSelect.value;
        if (selectedPilar === "Segurança, Meio Ambiente e Sustentabilidade") {
            if (roiTitleSpan) roiTitleSpan.innerText = "Potencial de Redução de Acidentes, Impactos Ambientais ou Aumento de Benefícios Sociais";
            if (roiDescDiv) roiDescDiv.innerText = "1 = Baixo potencial de mitigação ou benefício social | 5 = Impacto crítico de redução de acidentes severos, risco ambiental zero ou alto benefício social.";
        } else {
            if (roiTitleSpan) roiTitleSpan.innerText = "Retorno Financeiro / ROI Estimado";
            if (roiDescDiv) roiDescDiv.innerText = "1 = Sem retorno claro ou payback muito longo | 5 = ROI altíssimo e retorno financeiro imediato atestado pelo comitê.";
        }
    }

    if (projectPilarSelect) {
        projectPilarSelect.addEventListener('change', () => {
            updateRoiFieldLabels();
            updateSimulatorPreview();
        });
    }

    function updateSimulatorPreview() {
        const alinhamento = getSelectedRating('alinhamento');
        const retorno = getSelectedRating('retorno');
        const impacto = getSelectedRating('impacto');
        const complexidade = getSelectedRating('complexidade');
        const esforcoEquipe = getSelectedRating('esforcoEquipe');

        // Check if any rating is not yet selected (value is 0)
        if (alinhamento === 0 || retorno === 0 || impacto === 0 || complexidade === 0 || esforcoEquipe === 0) {
            previewValScore.innerText = "0.00";
            previewEffScore.innerText = "0.00";
            previewQuadrant.className = "preview-quadrant-badge";
            previewQuadrant.style.backgroundColor = "#e2e8f0";
            previewQuadrant.style.color = "#475569";
            previewQuadrant.innerText = window.i18n ? window.i18n.t("pri.sim.unclassified") : "Sem Classificação";
            previewQuadrantDescription.innerText = window.i18n ? window.i18n.t("pri.sim.selectall") : "Selecione todos os critérios acima para visualizar a classificação do projeto.";
            previewVectorDot.style.opacity = "0";
            return;
        }

        previewVectorDot.style.opacity = "1";
        const valScore = ((alinhamento * 3) + (retorno * 3) + (impacto * 2)) / 8;
        const effScore = (complexidade + esforcoEquipe) / 2;

        previewValScore.innerText = valScore.toFixed(2);
        previewEffScore.innerText = effScore.toFixed(2);

        // Evaluate quadrant
        let quadName = "";
        let quadClass = "";
        let quadDesc = "";

        if (valScore >= 3.5 && effScore < 3) {
            quadName = "Quick Win (Prioridade Máxima)";
            quadClass = "badge-quickwin";
            quadDesc = window.i18n ? window.i18n.t("pri.sim.desc.quickwin") || "Projetos de alto impacto com baixo esforço. Devem ser priorizados e executados imediatamente." : "Projetos de alto impacto com baixo esforço. Devem ser priorizados e executados imediatamente.";
        } else if (valScore >= 3.5 && effScore >= 3) {
            quadName = "Grande Projeto (Planejar)";
            quadClass = "badge-grande";
            quadDesc = window.i18n ? window.i18n.t("pri.sim.desc.grande") || "Projetos de alto impacto, mas alta complexidade. Exigem planejamento estruturado e alocação cuidadosa de recursos." : "Projetos de alto impacto, mas alta complexidade. Exigem planejamento estruturado e alocação cuidadosa de recursos.";
        } else if (valScore < 3.5 && effScore < 3) {
            quadName = "Tarefa Ingrata (Fazer se houver tempo)";
            quadClass = "badge-ingrata";
            quadDesc = window.i18n ? window.i18n.t("pri.sim.desc.ingrata") || "Projetos de baixo impacto e baixo esforço. Devem ser executados apenas se houver recursos remanescentes na carteira." : "Projetos de baixo impacto e baixo esforço. Devem ser executados apenas se houver recursos remanescentes na carteira.";
        } else {
            quadName = "Sumidouro de Tempo (Descartar)";
            quadClass = "badge-sumidouro";
            quadDesc = window.i18n ? window.i18n.t("pri.sim.desc.sumidouro") || "Projetos de baixo impacto e alto esforço. Devem ser descartados ou completamente reavaliados." : "Projetos de baixo impacto e alto esforço. Devem ser descartados ou completamente reavaliados.";
        }

        previewQuadrant.className = `preview-quadrant-badge ${quadClass}`;
        // Reset custom styles if any were applied when it was unclassified
        previewQuadrant.style.backgroundColor = "";
        previewQuadrant.style.color = "";
        previewQuadrant.innerText = (window.i18n ? window.i18n.t(quadName) : quadName).replace(/ \\(.+\\)/g, ''); // strip explanation in parenthesis
        previewQuadrantDescription.innerText = quadDesc;

        // Reposition Vector Dot in 2D grid simulator
        // X-axis: Esforço (1 to 5). Left margin: 10% to 90%
        // Y-axis: Valor (1 to 5). Bottom margin to Top: 90% to 10%
        const xPct = ((effScore - 1) / 4) * 80 + 10;
        const yPct = 90 - ((valScore - 1) / 4) * 80;

        previewVectorDot.style.left = `calc(${xPct}% - 6px)`;
        previewVectorDot.style.top = `calc(${yPct}% - 6px)`;
    }

    // --- Tab Switching Logic ---
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            switchTab(tabId);
        });
    });

    function switchTab(tabId) {
        activeTab = tabId;
        tabButtons.forEach(b => {
            if (b.dataset.tab === tabId) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });

        tabContents.forEach(c => {
            if (c.id === tabId) {
                c.classList.add('active');
            } else {
                c.classList.remove('active');
            }
        });

        if (tabId === 'tab-matriz') {
            setTimeout(() => {
                if (scatterChart) {
                    scatterChart.resize();
                    scatterChart.update();
                }
            }, 100);
        }
    }

    // --- Form Management (Cadastro) ---
    // Auto formatting currency input
    projectCostInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value === '') {
            e.target.value = '';
            return;
        }
        let formatted = (parseInt(value) / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'USD'
        });
        e.target.value = formatted;
    });

    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const costNumeric = getNumericCost(projectCostInput.value);
        if (costNumeric <= 0) {
            alert("Por favor, insira um custo financeiro válido.");
            return;
        }

        const projectData = {
            nome: projectNameInput.value.trim(),
            descricao: projectDescInput.value.trim(),
            area: projectAreaSelect.value,
            pilar: projectPilarSelect.value,
            status: projectStatusSelect.value,
            sponsor: projectSponsorInput.value.trim(),
            custo: costNumeric,
            alinhamento: getSelectedRating('alinhamento'),
            retorno: getSelectedRating('retorno'),
            impacto: getSelectedRating('impacto'),
            complexidade: getSelectedRating('complexidade'),
            esforcoEquipe: getSelectedRating('esforcoEquipe')
        };

        if (editModeId) {
            // Edit existing project in Firestore
            const proj = projects.find(p => p.id === editModeId);
            if (proj && proj.docId) {
                projectData.id = editModeId;
                calculateScores(projectData);
                try {
                    await ensureAuthenticated();
                    await db.collection('priorizacao').doc(proj.docId).set(projectData);
                    alert("Projeto atualizado com sucesso!");
                    resetForm();
                    switchTab('tab-matriz');
                } catch (err) {
                    console.error("Error updating project in Firestore:", err);
                    alert("Erro ao atualizar o projeto no banco de dados: " + err.message);
                }
            }
        } else {
            // New project (autonumeric ID)
            const maxId = projects.reduce((max, p) => p.id > max ? p.id : max, 0);
            projectData.id = maxId + 1;
            projectData.selectedForCapex = false;
            calculateScores(projectData);

            try {
                await ensureAuthenticated();
                await db.collection('priorizacao').add(projectData);
                alert("Projeto cadastrado com sucesso!");
                resetForm();
                switchTab('tab-matriz');
            } catch (err) {
                console.error("Error saving project to Firestore:", err);
                alert("Erro ao salvar o projeto no banco de dados: " + err.message);
            }
        }
    });

    function resetForm() {
        editModeId = null;
        formTitle.innerHTML = '<i class="ph ph-file-plus"></i> Novo Projeto';
        formSubtitle.innerText = 'Preencha os campos e os critérios para calcular o score';
        projectIdInput.value = "";
        projectForm.reset();

        // Reset ratings (clear active classes)
        document.querySelectorAll('.rating-container .rating-btn').forEach(b => b.classList.remove('active'));

        // Reset pilar specific labels
        updateRoiFieldLabels();

        btnCancelEdit.style.display = "none";
        if (btnDeleteProject) {
            btnDeleteProject.disabled = true;
            btnDeleteProject.style.backgroundColor = "#f1f5f9";
            btnDeleteProject.style.color = "#94a3b8";
            btnDeleteProject.style.borderColor = "#cbd5e1";
            btnDeleteProject.style.cursor = "not-allowed";
            btnDeleteProject.onmouseover = null;
            btnDeleteProject.onmouseout = null;
        }

        updateSimulatorPreview();
    }

    btnResetForm.addEventListener('click', resetForm);
    btnCancelEdit.addEventListener('click', resetForm);



    // Edit project trigger
    function startEditProject(proj) {
        editModeId = proj.id;
        formTitle.innerHTML = `<i class="ph ph-note-pencil"></i> Editar Projeto #${proj.id}`;
        formSubtitle.innerText = `Editando os dados de: ${proj.nome}`;
        projectIdInput.value = proj.id;
        projectNameInput.value = proj.nome;
        projectDescInput.value = proj.descricao || "";
        projectAreaSelect.value = proj.area;
        projectPilarSelect.value = proj.pilar || "";
        projectStatusSelect.value = proj.status;
        projectSponsorInput.value = proj.sponsor;

        // Format cost
        projectCostInput.value = proj.custo.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'USD'
        });

        // Set ratings
        setSelectedRating('alinhamento', proj.alinhamento);
        setSelectedRating('retorno', proj.retorno);
        setSelectedRating('impacto', proj.impacto);
        setSelectedRating('complexidade', proj.complexidade);
        setSelectedRating('esforcoEquipe', proj.esforcoEquipe);

        // Update labels for pilar
        updateRoiFieldLabels();

        btnCancelEdit.style.display = "inline-block";
        if (btnDeleteProject) {
            btnDeleteProject.disabled = false;
            btnDeleteProject.style.backgroundColor = "#dc2626";
            btnDeleteProject.style.color = "white";
            btnDeleteProject.style.borderColor = "#dc2626";
            btnDeleteProject.style.cursor = "pointer";
            btnDeleteProject.onmouseover = () => {
                btnDeleteProject.style.backgroundColor = "#b91c1c";
                btnDeleteProject.style.borderColor = "#b91c1c";
            };
            btnDeleteProject.onmouseout = () => {
                btnDeleteProject.style.backgroundColor = "#dc2626";
                btnDeleteProject.style.borderColor = "#dc2626";
            };
        }

        updateSimulatorPreview();
        switchTab('tab-cadastro');
    }

    // Delete project trigger
    const deleteModal = document.getElementById('delete-modal');
    const deletePasswordInput = document.getElementById('delete-password');
    const deleteError = document.getElementById('delete-error');
    const btnCancelDelete = document.getElementById('btn-cancel-delete');
    const btnConfirmDelete = document.getElementById('btn-confirm-delete');
    let projectToDeleteId = null;

    function openDeleteModal() {
        if (deleteModal) {
            deletePasswordInput.value = "";
            deleteError.style.display = "none";
            deleteModal.style.display = "flex";
        }
    }

    function closeDeleteModal() {
        if (deleteModal) {
            deleteModal.style.display = "none";
            projectToDeleteId = null;
        }
    }

    if (btnCancelDelete) {
        btnCancelDelete.addEventListener('click', closeDeleteModal);
    }

    if (btnConfirmDelete) {
        btnConfirmDelete.addEventListener('click', async () => {
            const pwd = deletePasswordInput.value.trim();
            if (pwd === '789512') {
                if (projectToDeleteId) {
                    const proj = projects.find(p => p.id === projectToDeleteId);
                    if (proj && proj.docId) {
                        btnConfirmDelete.innerText = "Excluindo...";
                        btnConfirmDelete.disabled = true;
                        try {
                            await ensureAuthenticated();
                            await db.collection('priorizacao').doc(proj.docId).delete();
                            alert("Projeto excluído com sucesso!");
                            closeDeleteModal();
                            resetForm();
                        } catch (err) {
                            console.error("Error deleting project from Firestore:", err);
                            alert("Erro ao excluir o projeto do banco de dados: " + err.message);
                        } finally {
                            btnConfirmDelete.innerText = "Sim, Excluir";
                            btnConfirmDelete.disabled = false;
                        }
                    }
                }
            } else {
                deleteError.style.display = "block";
            }
        });
    }

    function deleteProject(id) {
        projectToDeleteId = id;
        openDeleteModal();
    }

    if (btnDeleteProject) {
        btnDeleteProject.addEventListener('click', () => {
            if (editModeId) {
                deleteProject(editModeId);
            }
        });
    }

    // --- Render Ranking Table (with Filter and Sort) ---
    function renderRankingTable() {
        const query = searchFilterInput.value.toLowerCase();
        const selectedPilar = filterPilarSelect.value;
        const selectedArea = areaFilterSelect.value;
        const selectedQuad = quadrantFilterSelect.value;

        // Apply filters
        let filtered = projects.filter(p => {
            const matchesQuery = p.nome.toLowerCase().includes(query) || p.sponsor.toLowerCase().includes(query);
            const matchesPilar = selectedPilar === "" || p.pilar === selectedPilar;
            const matchesArea = selectedArea === "" || p.area === selectedArea;
            const matchesQuad = selectedQuad === "" || p.quadrante.includes(selectedQuad);
            return matchesQuery && matchesPilar && matchesArea && matchesQuad;
        });

        // Sort: scoreValor descending, then scoreEsforco ascending
        filtered.sort((a, b) => {
            if (b.scoreValor !== a.scoreValor) {
                return b.scoreValor - a.scoreValor;
            }
            return a.scoreEsforco - b.scoreEsforco;
        });

        rankingTableBody.innerHTML = '';

        if (filtered.length === 0) {
            rankingTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 24px; color: var(--color-text-muted);">
                        Nenhum projeto corresponde aos filtros aplicados.
                    </td>
                </tr>
            `;
            return;
        }

        filtered.forEach(p => {
            const tr = document.createElement('tr');
            tr.dataset.projectId = p.id;

            let quadClass = "";
            if (p.quadrante.includes("Quick Win")) quadClass = "badge-quickwin";
            else if (p.quadrante.includes("Grande Projeto")) quadClass = "badge-grande";
            else if (p.quadrante.includes("Tarefa Ingrata")) quadClass = "badge-ingrata";
            else quadClass = "badge-sumidouro";

            tr.innerHTML = `
                <td style="text-align: center; vertical-align: middle;">
                    <label class="switch" style="margin-left: 0;">
                        <input type="checkbox" class="capex-toggle-ranking" data-id="${p.id}" ${p.selectedForCapex ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </td>
                <td>
                    <div style="font-weight: 700; color: var(--color-primary-dark);">${p.nome}</div>
                    <div style="font-size: 0.75rem; color: var(--color-text-muted); display: flex; gap: 8px; margin-top: 4px;">
                        <span>ID: #${p.id}</span> • <span>${p.area}</span> • <span>Pilar: ${p.pilar || 'Não Def.'}</span> • <span>Resp: ${p.sponsor}</span>
                    </div>
                </td>
                <td style="font-family: monospace; font-weight: 600;">${formatCurrency(p.custo)}</td>
                <td style="text-align: center; font-weight: 700; color: var(--color-primary);">${p.scoreValor.toFixed(2)}</td>
                <td style="text-align: center; font-weight: 700; color: #b45309;">${p.scoreEsforco.toFixed(2)}</td>
                <td><span class="quadrant-badge ${quadClass}">${(window.i18n ? window.i18n.t(p.quadrante) : p.quadrante).replace(/ \\(.+\\)/g, '')}</span></td>
                <td style="text-align: center;">
                    <div style="display: flex; gap: 8px; justify-content: center;">
                        <button class="icon-btn btn-edit" style="color: #0369a1; background-color: #e0f2fe; border: 1px solid #bae6fd; padding: 6px 10px; border-radius: 6px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; font-family: 'Inter', sans-serif; font-size: 0.75rem;" title="Editar">✎ ${window.i18n ? window.i18n.t("pri.btn.editrow") || "Editar" : "Editar"}</button>
                        <button class="icon-btn btn-delete" style="color: #dc2626; background-color: #fee2e2; border: 1px solid #fecaca; padding: 6px 10px; border-radius: 6px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; font-family: 'Inter', sans-serif; font-size: 0.75rem;" title="Excluir">✕ ${window.i18n ? window.i18n.t("pri.btn.deleterow") || "Excluir" : "Excluir"}</button>
                    </div>
                </td>
            `;

            // Hover interactions between table and chart points
            tr.addEventListener('mouseenter', () => {
                highlightChartPoint(p.id);
            });

            tr.addEventListener('mouseleave', () => {
                resetChartHighlight();
            });

            tr.querySelector('.btn-edit').addEventListener('click', (e) => {
                e.stopPropagation();
                startEditProject(p);
            });

            tr.querySelector('.btn-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteProject(p.id);
            });

            const toggleCapex = tr.querySelector('.capex-toggle-ranking');
            if (toggleCapex) {
                toggleCapex.addEventListener('change', async (e) => {
                    e.stopPropagation();
                    const id = e.target.dataset.id;
                    const proj = projects.find(x => x.id.toString() === id.toString());
                    if (proj && proj.docId) {
                        try {
                            await ensureAuthenticated();
                            await db.collection('priorizacao').doc(proj.docId).update({
                                selectedForCapex: e.target.checked
                            });
                        } catch (err) {
                            console.error("Error updating capex status:", err);
                        }
                    }
                });
                toggleCapex.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }

            tr.addEventListener('click', () => {
                // Clicking row highlights chart point persistently
                highlightChartPoint(p.id, true);
            });

            rankingTableBody.appendChild(tr);
        });
    }

    // Filter listeners
    searchFilterInput.addEventListener('input', renderRankingTable);
    filterPilarSelect.addEventListener('change', renderRankingTable);
    areaFilterSelect.addEventListener('change', renderRankingTable);
    quadrantFilterSelect.addEventListener('change', renderRankingTable);

    // CSV Export
    document.getElementById('btn-export-csv').addEventListener('click', () => {
        let csv = 'ID;Nome;Area;Status;Sponsor;Custo(R$);Alinhamento;Retorno;Impacto;Complexidade;EsforcoEquipe;ScoreValor;ScoreEsforco;Quadrante\n';
        projects.forEach(p => {
            csv += `${p.id};"${p.nome}";"${p.area}";"${p.status}";"${p.sponsor}";${p.custo};${p.alinhamento};${p.retorno};${p.impacto};${p.complexidade};${p.esforcoEquipe};${p.scoreValor.toFixed(2)};${p.scoreEsforco.toFixed(2)};"${p.quadrante}"\n`;
        });
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'text/csv;charset=utf-8;' }); // Add BOM for Excel compatibility
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pmo_priorizacao_hibrida_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // --- Chart.js Scatter Plot Config & Plugins ---
    const quadrantBackgroundsPlugin = {
        id: 'quadrantBackgrounds',
        beforeDraw(chart) {
            const { ctx, chartArea: { top, right, bottom, left }, scales: { x, y } } = chart;
            if (!x || !y) return;

            const xSplit = x.getPixelForValue(3.0);
            const ySplit = y.getPixelForValue(3.5);

            ctx.save();

            // 1. Fill Quadrants Backgrounds
            // Top-Left: Quick Win (Green)
            ctx.fillStyle = 'rgba(16, 185, 129, 0.05)';
            ctx.fillRect(left, top, xSplit - left, ySplit - top);

            // Top-Right: Grande Projeto (Blue)
            ctx.fillStyle = 'rgba(59, 130, 246, 0.05)';
            ctx.fillRect(xSplit, top, right - xSplit, ySplit - top);

            // Bottom-Left: Tarefa Ingrata (Yellow/Orange)
            ctx.fillStyle = 'rgba(245, 158, 11, 0.05)';
            ctx.fillRect(left, ySplit, xSplit - left, bottom - ySplit);

            // Bottom-Right: Sumidouro de Tempo (Red)
            ctx.fillStyle = 'rgba(239, 68, 68, 0.05)';
            ctx.fillRect(xSplit, ySplit, right - xSplit, bottom - ySplit);

            // 2. Draw Divider Lines (dashed)
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = 'rgba(15, 23, 42, 0.15)';
            ctx.setLineDash([6, 6]);

            // Vertical line at Effort = 3.0
            ctx.beginPath();
            ctx.moveTo(xSplit, top);
            ctx.lineTo(xSplit, bottom);
            ctx.stroke();

            // Horizontal line at Value = 3.5
            ctx.beginPath();
            ctx.moveTo(left, ySplit);
            ctx.lineTo(right, ySplit);
            ctx.stroke();

            ctx.restore();

            // 3. Render Quadrant Labels
            ctx.save();
            ctx.font = 'bold 10px Inter, sans-serif';

            // Top-Left: Quick Win
            ctx.fillStyle = '#059669';
            ctx.fillText(window.i18n ? (window.i18n.t('Quick Win (Prioridade Máxima)')).toUpperCase() : 'QUICK WIN (PRIORIDADE MÁXIMA)', left + 12, top + 18);

            // Top-Right: Grande Projeto
            ctx.fillStyle = '#2563eb';
            ctx.fillText(window.i18n ? (window.i18n.t('Grande Projeto (Planejar)')).toUpperCase() : 'GRANDE PROJETO (PLANEJAR)', xSplit + 12, top + 18);

            // Bottom-Left: Tarefa Ingrata
            ctx.fillStyle = '#d97706';
            ctx.fillText(window.i18n ? (window.i18n.t('Tarefa Ingrata (Fazer se houver tempo)')).toUpperCase() : 'TAREFA INGRATA (SE HOUVER TEMPO)', left + 12, ySplit + 18);

            // Bottom-Right: Sumidouro de Tempo
            ctx.fillStyle = '#dc2626';
            ctx.fillText(window.i18n ? (window.i18n.t('Sumidouro de Tempo (Descartar)')).toUpperCase() : 'SUMIDOURO DE TEMPO (DESCARTAR)', xSplit + 12, ySplit + 18);

            ctx.restore();
        }
    };

    function initOrUpdateScatterPlot() {
        const ctx = document.getElementById('scatterPlotChart').getContext('2d');

        // Create datasets
        // Map projects to scatter points
        const scatterData = projects.map(p => ({
            x: p.scoreEsforco,
            y: p.scoreValor,
            id: p.id,
            name: p.nome,
            pilar: p.pilar || 'Não Def.',
            area: p.area,
            sponsor: p.sponsor,
            custo: p.custo,
            quadrant: p.quadrante.replace(/ \(.+\)/g, '')
        }));

        if (scatterChart) {
            // Update data
            scatterChart.data.datasets[0].data = scatterData;
            scatterChart.update();
            return;
        }




        // Initialize Chart.js
        scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Projetos',
                    data: scatterData,
                    backgroundColor: (context) => {
                        const raw = context.raw;
                        if (!raw) return '#94a3b8';
                        if (raw.quadrant.includes("Quick Win")) return '#10b981'; // Green
                        if (raw.quadrant.includes("Grande Projeto")) return '#3b82f6'; // Blue
                        if (raw.quadrant.includes("Tarefa Ingrata")) return '#f59e0b'; // Yellow/Orange
                        return '#ef4444'; // Red
                    },
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    pointRadius: 10,
                    pointHoverRadius: 14,
                    pointStyle: 'circle'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        titleColor: '#ffffff',
                        bodyColor: '#e2e8f0',
                        padding: 12,
                        cornerRadius: 8,
                        titleFont: { family: 'Inter, sans-serif', size: 12, weight: 'bold' },
                        bodyFont: { family: 'Inter, sans-serif', size: 11 },
                        callbacks: {
                            label: function (context) {
                                const raw = context.raw;
                                return [
                                    `${window.i18n ? window.i18n.t("pri.col.project") || "Projeto" : "Projeto"}: ${raw.name}`,
                                    `Pilar: ${raw.pilar}`,
                                    `Área: ${raw.area}`,
                                    `Sponsor: ${raw.sponsor}`,
                                    `${window.i18n ? window.i18n.t("pri.col.cost") || "Custo" : "Custo"}: ${formatCurrency(raw.custo)}`,
                                    `Valor (Y): ${raw.y.toFixed(2)}`,
                                    `Esforço (X): ${raw.x.toFixed(2)}`,
                                    `${window.i18n ? window.i18n.t("pri.col.quadrant") || "Quadrante" : "Quadrante"}: ${window.i18n ? window.i18n.t(raw.quadrant) || raw.quadrant : raw.quadrant}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        min: 1.0,
                        max: 5.0,
                        title: {
                            display: true,
                            text: window.i18n ? window.i18n.t('pri.chart.x') || 'SCORE DE ESFORÇO TOTAL (1 a 5) → Mais complexo/pesado' : 'SCORE DE ESFORÇO TOTAL (1 a 5) → Mais complexo/pesado',
                            font: { family: 'Inter, sans-serif', size: 11, weight: 'bold' },
                            color: '#475569'
                        },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' },
                        ticks: { stepSize: 0.5, font: { family: 'Inter, sans-serif', size: 10 } }
                    },
                    y: {
                        min: 1.0,
                        max: 5.0,
                        title: {
                            display: true,
                            text: window.i18n ? window.i18n.t('pri.chart.y') || 'SCORE DE VALOR TOTAL (1 a 5) → Maior retorno estratégico' : 'SCORE DE VALOR TOTAL (1 a 5) → Maior retorno estratégico',
                            font: { family: 'Inter, sans-serif', size: 11, weight: 'bold' },
                            color: '#475569'
                        },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' },
                        ticks: { stepSize: 0.5, font: { family: 'Inter, sans-serif', size: 10 } }
                    }
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        const clickedProj = scatterChart.data.datasets[0].data[index];
                        highlightTableRow(clickedProj.id);
                    }
                },
                onHover: (event, elements) => {
                    const canvas = event.chart.canvas;
                    if (elements.length > 0) {
                        canvas.style.cursor = 'pointer';
                        const index = elements[0].index;
                        const hoveredProj = scatterChart.data.datasets[0].data[index];
                        highlightTableRow(hoveredProj.id, false); // Highlight row on hover (no scrolling)
                    } else {
                        canvas.style.cursor = 'default';
                        // Remove highlight of rows unless they were clicked
                    }
                }
            },
            plugins: [quadrantBackgroundsPlugin]
        });
    }

    // --- V2: Budget / Orçamento Tab Logic ---
    const budgetInputs = {
        'Excelência Operacional': document.getElementById('budget-input-excelencia'),
        'Segurança, Meio Ambiente e Sustentabilidade': document.getElementById('budget-input-sms'),
        'Inovação e Digital': document.getElementById('budget-input-inovacao'),
        'Clientes e Qualidade': document.getElementById('budget-input-clientes'),
        'Talento, Organização e Cultura': document.getElementById('budget-input-talentos')
    };

    function getCurrentYear() {
        const yearSelect = document.getElementById('capex-year-select');
        return yearSelect ? yearSelect.value : '2026';
    }

    function applyLoadedTetos(tetosData) {
        if (!tetosData) return;
        if (budgetInputs['Excelência Operacional'] && tetosData.excelencia !== undefined) {
            budgetInputs['Excelência Operacional'].value = tetosData.excelencia;
        }
        if (budgetInputs['Segurança, Meio Ambiente e Sustentabilidade'] && tetosData.sms !== undefined) {
            budgetInputs['Segurança, Meio Ambiente e Sustentabilidade'].value = tetosData.sms;
        }
        if (budgetInputs['Inovação e Digital'] && tetosData.inovacao !== undefined) {
            budgetInputs['Inovação e Digital'].value = tetosData.inovacao;
        }
        if (budgetInputs['Clientes e Qualidade'] && tetosData.clientes !== undefined) {
            budgetInputs['Clientes e Qualidade'].value = tetosData.clientes;
        }
        if (budgetInputs['Talento, Organização e Cultura'] && tetosData.talentos !== undefined) {
            budgetInputs['Talento, Organização e Cultura'].value = tetosData.talentos;
        }
    }

    function resetTetosToDefault() {
        if (budgetInputs['Excelência Operacional']) budgetInputs['Excelência Operacional'].value = '100.000';
        if (budgetInputs['Segurança, Meio Ambiente e Sustentabilidade']) budgetInputs['Segurança, Meio Ambiente e Sustentabilidade'].value = '80.000';
        if (budgetInputs['Inovação e Digital']) budgetInputs['Inovação e Digital'].value = '40.000';
        if (budgetInputs['Clientes e Qualidade']) budgetInputs['Clientes e Qualidade'].value = '50.000';
        if (budgetInputs['Talento, Organização e Cultura']) budgetInputs['Talento, Organização e Cultura'].value = '30.000';
    }

    async function saveTetosToDb() {
        const currentYear = getCurrentYear();
        const docId = `config_tetos_${currentYear}`;
        const tetosData = {
            excelencia: budgetInputs['Excelência Operacional'] ? budgetInputs['Excelência Operacional'].value : '100.000',
            sms: budgetInputs['Segurança, Meio Ambiente e Sustentabilidade'] ? budgetInputs['Segurança, Meio Ambiente e Sustentabilidade'].value : '80.000',
            inovacao: budgetInputs['Inovação e Digital'] ? budgetInputs['Inovação e Digital'].value : '40.000',
            clientes: budgetInputs['Clientes e Qualidade'] ? budgetInputs['Clientes e Qualidade'].value : '50.000',
            talentos: budgetInputs['Talento, Organização e Cultura'] ? budgetInputs['Talento, Organização e Cultura'].value : '30.000'
        };
        try {
            await ensureAuthenticated();
            await db.collection('priorizacao').doc(docId).set(tetosData, { merge: true });
            console.log("Tetos salvas no Firestore para o ano:", currentYear);
        } catch (err) {
            console.error("Erro ao salvar tetos no Firestore:", err);
        }
    }

    Object.values(budgetInputs).forEach(input => {
        if (input) {
            input.addEventListener('input', (e) => {
                let val = e.target.value.replace(/\D/g, '');
                if (val !== '') {
                    e.target.value = parseInt(val, 10).toLocaleString('pt-BR');
                } else {
                    e.target.value = '';
                }
                renderOrcamentoTab();
            });
            input.addEventListener('change', () => {
                saveTetosToDb();
            });
        }
    });

    const yearSelect = document.getElementById('capex-year-select');
    if (yearSelect) {
        yearSelect.addEventListener('change', () => {
            const currentYear = yearSelect.value;
            if (window.allLoadedTetos) {
                const yearTetoDocId = `config_tetos_${currentYear}`;
                const currentYearTetos = window.allLoadedTetos[yearTetoDocId];
                if (currentYearTetos) {
                    applyLoadedTetos(currentYearTetos);
                } else {
                    resetTetosToDefault();
                }
            } else {
                resetTetosToDefault();
            }
            updateDashboard();
        });
    }

    const normalizePilar = (s) => (s || "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    function renderOrcamentoTab() {
        if (!document.getElementById('tab-orcamento')) return;

        const pilares = [
            { id: 'excelencia', name: 'Excelência Operacional' },
            { id: 'sms', name: 'Segurança, Meio Ambiente e Sustentabilidade' },
            { id: 'inovacao', name: 'Inovação e Digital' },
            { id: 'clientes', name: 'Clientes e Qualidade' },
            { id: 'talentos', name: 'Talento, Organização e Cultura' }
        ];

        pilares.forEach(pilar => {
            const listEl = document.getElementById(`list-${pilar.id}`);
            if (!listEl) return;

            const normalizedPilarName = normalizePilar(pilar.name);
            const pilarProjects = projects
                .filter(p => normalizePilar(p.pilar) === normalizedPilarName)
                .sort((a, b) => b.scoreValor - a.scoreValor);

            let consumed = 0;
            pilarProjects.forEach(p => {
                if (p.selectedForCapex) {
                    consumed += p.custo;
                }
            });

            const limitInput = budgetInputs[pilar.name];
            const limitStr = limitInput ? limitInput.value.replace(/\./g, '') : '0';
            const limit = parseFloat(limitStr) || 0;
            const realLimit = limit * 1000;
            const percent = realLimit > 0 ? Math.min((consumed / realLimit) * 100, 100) : 0;

            const fillEl = document.getElementById(`progress-fill-${pilar.id}`);
            const consumedEl = document.getElementById(`budget-consumed-${pilar.id}`);
            const remainingEl = document.getElementById(`budget-remaining-${pilar.id}`);

            if (fillEl) {
                fillEl.style.width = `${percent}%`;
                fillEl.style.backgroundColor = percent >= 100 ? '#ef4444' : (percent > 80 ? '#f59e0b' : '#3b82f6');
            }
            if (consumedEl) consumedEl.innerText = formatUSDK(consumed);
            if (remainingEl) remainingEl.innerText = `Restante: ${formatUSDK(realLimit - consumed)}`;

            listEl.innerHTML = '';

            if (pilarProjects.length === 0) {
                listEl.innerHTML = '<div style="padding: 12px; text-align: center; color: var(--color-text-muted); font-size: 0.85rem;">Nenhum projeto cadastrado neste pilar.</div>';
                return;
            }

            pilarProjects.forEach(p => {
                const item = document.createElement('div');
                item.className = `cesta-project-item ${p.selectedForCapex ? 'selected' : ''}`;
                item.innerHTML = `
                    <div class="cesta-project-info">
                        <div class="cesta-project-name">${p.nome} (Score: ${p.scoreValor.toFixed(2)})</div>
                        <div class="cesta-project-cost">${formatUSDK(p.custo)} | ID: #${p.id}</div>
                    </div>
                    <label class="switch">
                        <input type="checkbox" ${p.selectedForCapex ? 'checked' : ''} data-id="${p.id}">
                        <span class="slider"></span>
                    </label>
                `;

                const cb = item.querySelector('input');
                cb.addEventListener('change', async (e) => {
                    const id = e.target.dataset.id;
                    const proj = projects.find(x => x.id.toString() === id.toString());
                    if (proj && proj.docId) {
                        try {
                            await ensureAuthenticated();
                            await db.collection('priorizacao').doc(proj.docId).update({
                                selectedForCapex: e.target.checked
                            });
                        } catch (err) {
                            console.error("Error updating capex status:", err);
                        }
                    }
                });

                listEl.appendChild(item);
            });
        });

        // Add Outros fallback
        const matchedPilares = pilares.map(p => normalizePilar(p.name));
        const unmatchedProjects = projects.filter(p => !matchedPilares.includes(normalizePilar(p.pilar)));

        let outrosContainer = document.getElementById('container-outros');
        if (unmatchedProjects.length > 0) {
            if (!outrosContainer) {
                outrosContainer = document.createElement('div');
                outrosContainer.id = 'container-outros';
                outrosContainer.className = 'panel-card';
                outrosContainer.innerHTML = `
                    <div class="cesta-header">
                        <div class="cesta-title" style="color: #64748b;">${window.i18n ? window.i18n.t("pri.budget.other") || "Outros / Sem Pilar Definido" : "Outros / Sem Pilar Definido"}</div>
                    </div>
                    <div class="progress-bar-container" style="background-color: #f1f5f9;">
                        <div class="progress-bar-fill" id="progress-fill-outros" style="width: 0%; background-color: #94a3b8;"></div>
                    </div>
                    <div class="budget-stats" style="color: #64748b;">
                        <div>${window.i18n ? window.i18n.t("pri.budget.consumed") || "Consumido:" : "Consumido:"} <span id="budget-consumed-outros" style="font-weight: 600;">R$ 0,00</span></div>
                        <div>${window.i18n ? window.i18n.t("pri.budget.nolimit") || "(Sem limite definido)" : "(Sem limite definido)"}</div>
                    </div>
                    <div class="cesta-project-list" id="list-outros"></div>
                `;
                const orcamentoGrid = document.querySelector('#tab-orcamento .budget-grid');
                if (orcamentoGrid) orcamentoGrid.appendChild(outrosContainer);
            }

            const listOutros = document.getElementById('list-outros');
            if (listOutros) {
                listOutros.innerHTML = '';
                unmatchedProjects.sort((a, b) => b.scoreValor - a.scoreValor).forEach(p => {
                    const item = document.createElement('div');
                    item.className = `cesta-project-item ${p.selectedForCapex ? 'selected' : ''}`;
                    item.innerHTML = `
                        <div class="cesta-project-info">
                            <div class="cesta-project-name">${p.nome} <span style="font-size: 0.7rem; color: #ef4444;">(${p.pilar || (window.i18n ? window.i18n.t("pri.budget.nopilar") || "Sem Pilar" : "Sem Pilar")})</span></div>
                            <div class="cesta-project-cost">${formatUSDK(p.custo)} | ID: #${p.id}</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${p.selectedForCapex ? 'checked' : ''} data-id="${p.id}">
                            <span class="slider"></span>
                        </label>
                    `;
                    const cb = item.querySelector('input');
                    cb.addEventListener('change', async (e) => {
                        const id = e.target.dataset.id;
                        const proj = projects.find(x => x.id.toString() === id.toString());
                        if (proj && proj.docId) {
                            try {
                                await ensureAuthenticated();
                                await db.collection('priorizacao').doc(proj.docId).update({
                                    selectedForCapex: e.target.checked
                                });
                            } catch (err) {
                                console.error("Error updating capex status:", err);
                            }
                        }
                    });
                    listOutros.appendChild(item);
                });
                let consumedOutros = 0;
                unmatchedProjects.forEach(p => { if (p.selectedForCapex) consumedOutros += p.custo; });
                const consumedEl = document.getElementById('budget-consumed-outros');
                if (consumedEl) consumedEl.innerText = formatUSDK(consumedOutros);
            }
        } else {
            if (outrosContainer) outrosContainer.remove();
        }
    }

    let btnImportV1 = document.getElementById('btn-import-v1');
    if (!btnImportV1) {
        const header = document.querySelector('.panel-card-header h2');
        if (header) {
            btnImportV1 = document.createElement('button');
            btnImportV1.id = 'btn-import-v1';
            btnImportV1.className = 'btn-secondary';
            btnImportV1.style = 'background-color: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; margin-left: 12px; padding: 4px 8px; font-size: 0.75rem; cursor: pointer;';
            btnImportV1.innerHTML = '<i class="ph ph-database"></i> Importar V1';
            header.parentNode.appendChild(btnImportV1);
        }
    }

    if (btnImportV1) {
        btnImportV1.addEventListener('click', async () => {
            const storedV1 = localStorage.getItem('ppm_hibrido_projetos');
            if (storedV1) {
                if (confirm("Isso irá importar os dados da V1 para a tabela 'priorizacao' no banco de dados. Confirmar?")) {
                    try {
                        const v1Projects = JSON.parse(storedV1);
                        const batch = db.batch();
                        v1Projects.forEach(p => {
                            delete p.docId;
                            const ref = db.collection('priorizacao').doc();
                            batch.set(ref, p);
                        });
                        await batch.commit();
                        alert("Dados da Versão 1 importados com sucesso para o banco de dados!");
                    } catch (e) {
                        alert("Erro ao importar dados: " + e.message);
                    }
                }
            } else {
                alert("Nenhum dado encontrado na Versão 1.");
            }
        });
    }

    const btnResetMock = document.getElementById('btn-reset-mock');
    if (btnResetMock) {
        btnResetMock.addEventListener('click', async () => {
            if (confirm("Deseja mesmo limpar a base de dados de priorização?")) {
                try {
                    const snap = await db.collection('priorizacao').get();
                    const batch = db.batch();
                    snap.forEach(doc => {
                        batch.delete(doc.ref);
                    });
                    await batch.commit();
                    alert("Base de dados de priorização limpa com sucesso!");
                } catch (e) {
                    alert("Erro ao limpar dados: " + e.message);
                }
            }
        });
    }

    function highlightChartPoint(projectId, setFocus = false) {
        if (!scatterChart) return;
        const dataset = scatterChart.data.datasets[0];
        const idx = dataset.data.findIndex(p => p.id === projectId);
        if (idx !== -1) {
            // Apply scale effect or activate elements
            scatterChart.setActiveElements([{ datasetIndex: 0, index: idx }]);
            if (setFocus) {
                scatterChart.tooltip.setActiveElements([{ datasetIndex: 0, index: idx }], { x: 0, y: 0 });
            }
            scatterChart.update();
        }
    }

    function resetChartHighlight() {
        if (!scatterChart) return;
        scatterChart.setActiveElements([]);
        scatterChart.update();
    }

    function highlightTableRow(projectId, scrollIntoView = true) {
        const rows = rankingTableBody.querySelectorAll('tr');
        rows.forEach(r => {
            if (parseInt(r.dataset.projectId) === projectId) {
                r.classList.add('highlighted');
                if (scrollIntoView) {
                    r.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            } else {
                r.classList.remove('highlighted');
            }
        });
    }



    // --- Initialize ---
    loadData();
    updateSimulatorPreview();

    // Firebase initialization
    const firebaseConfig = {
        projectId: "studio-2837535581-1b461",
        appId: "1:734126703234:web:b5e076685289c0f43fea9b",
        storageBucket: "studio-2837535581-1b461.firebasestorage.app",
        apiKey: atob("QUl6YVN5QkRmTXRrMG9CQWROd1VKMUpPWDJtd1VQU0txMjZsNkt3"),
        authDomain: "studio-2837535581-1b461.firebaseapp.com",
        messagingSenderId: "734126703234"
    };

    if (!window.firebaseInitialized) {
        if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
        window.firebaseInitialized = true;
    }
    const db = firebase.firestore();

    let fastProjectsList = [];

    async function loadFastProjects() {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user && !user.isAnonymous) {
                console.log("Firebase authenticated as:", user.email || user.uid);
                startListeningPriorizacao();
                try {
                    const snap = await db.collection('fasts').get();
                    console.log("Fasts collection size:", snap.size);
                    fastProjectsList = [];
                    snap.forEach(doc => {
                        const data = doc.data();
                        const status = (data.status || data.situacaoAtual || '').toUpperCase().trim();
                        console.log("Project:", data.title || data.tituloIntencao, "Status:", status);
                        if (status === 'CONCLUÍDO' || status === 'CONCLUIDO') {
                            fastProjectsList.push({
                                id: doc.id,
                                title: data.title || data.tituloIntencao || '',
                                ...data
                            });
                        }
                    });
                    console.log("Loaded completed fast projects count:", fastProjectsList.length);
                    populateProjectNameSelect();
                } catch (e) {
                    console.error("Error loading fast projects:", e);
                }
            } else {
                console.log("No authenticated user or user is anonymous. Redirecting to login...");
                window.location.replace("../login.html");
            }
        });
    }

    function populateProjectNameSelect() {
        if (!projectNameInput) return;
        const currentVal = projectNameInput.value;

        projectNameInput.innerHTML = '<option value="">Selecione um projeto concluído do FAST...</option>';

        fastProjectsList.sort((a, b) => a.title.localeCompare(b.title));

        fastProjectsList.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.title;
            opt.innerText = p.title;
            projectNameInput.appendChild(opt);
        });

        if (currentVal) {
            let found = false;
            for (let i = 0; i < projectNameInput.options.length; i++) {
                if (projectNameInput.options[i].value === currentVal) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                const opt = document.createElement('option');
                opt.value = currentVal;
                opt.innerText = currentVal;
                projectNameInput.appendChild(opt);
            }
            projectNameInput.value = currentVal;
        }
    }

    if (projectNameInput) {
        projectNameInput.addEventListener('change', () => {
            const selectedTitle = projectNameInput.value;
            if (!selectedTitle) {
                if (projectDescInput) projectDescInput.value = "";
                if (projectAreaSelect) projectAreaSelect.value = "";
                return;
            }
            const foundProject = fastProjectsList.find(p => p.title === selectedTitle);
            if (foundProject) {
                if (projectDescInput) {
                    projectDescInput.value = foundProject.title || ""; // Título da Intenção
                }
                if (projectAreaSelect) {
                    projectAreaSelect.value = foundProject.managerArea || foundProject.area || "";
                }
                if (projectSponsorInput) {
                    projectSponsorInput.value = foundProject.manager || "";
                }
                if (projectPilarSelect) {
                    const vp = foundProject.vp2028 || foundProject.VP2028 || foundProject.vp || foundProject.VP || foundProject.pilar || "";
                    if (vp) {
                        projectPilarSelect.value = vp;
                    } else {
                        projectPilarSelect.value = "";
                    }
                }
            }
        });
    }

    loadFastProjects();

    window.addEventListener('langchange', () => {
        updateDashboard();
        updateSimulatorPreview();
    });
});



