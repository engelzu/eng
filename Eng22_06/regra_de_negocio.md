# Regras de Negócio do Sistema

Este documento descreve as regras de negócio consolidadas para as funcionalidades da plataforma.

---

## 1. Cadastro de Novos Colaboradores (Usuários)

### Descrição da Funcionalidade
* **Como:** Administrador do sistema
* **Eu quero:** Cadastrar novos usuários com perfil **ATEC** informando nome, e-mail, perfil, sub-região e UO
* **Para que:** Eles possam acessar a plataforma com suas respectivas permissões.

### Critérios de Aceite
1. **Exibição de campos por perfil**:
   * Ao clicar em **"Adicionar novo"**: exibir **Nome**, **E-mail** e **Perfil**.
   * Ao selecionar o perfil **ATEC**: exibir adicionalmente **Sub-região** (multi-seleção) e **UO** (lista de UOs pertencentes às sub-regiões selecionadas).
   * Ao selecionar o perfil **Admin**: ocultar os campos **Sub-região** e **UO**.
2. **Regra de dependência (Sub-região x UO)**:
   * O campo **UO** deve ser carregado dinamicamente com a união de todas as UOs pertencentes às sub-regiões selecionadas.
3. **Obrigatoriedade**:
   * **Perfil ATEC**: Nome, E-mail, Perfil, pelo menos 1 Sub-região e pelo menos 1 UO são obrigatórios.
   * **Perfil Admin**: Nome, E-mail e Perfil são obrigatórios.
4. **Validação de e-mail**:
   * Formato válido (ex: `usuario@empresa.com`) e unicidade (e-mail não duplicado).
5. **Persistência e Feedback**:
   * Exibir mensagem de sucesso após salvar, redirecionar para a listagem e exibir a lotação correspondente na tabela.
6. **Ações na Listagem**:
   * Ícone de lápis com tooltip **"Editar"** e ícone de "X" com tooltip **"Desativar"**.

---

## 2. Priorização FAST de Intenções

### Descrição da Funcionalidade
* **Como:** Gestor ou Administrador do sistema
* **Eu quero:** Configurar e priorizar as intenções técnicas do FAST através do painel de priorização.
* **Para que:** O sistema compute o índice GUT e vincule a intenção a um Pilar e Programa específicos.

### Critérios de Aceite
1. **Simplicidade de Priorização**:
   * Na seção **Priorização FAST de Intenções** dentro do formulário/modal de edição, os botões/interruptores anteriores (`PRODUÇÃO`, `MA`, `SMS`, `QUALIDADE`) foram desativados/removidos do layout visual.
   * Apenas o interruptor **PILAR** é exibido para o usuário.
2. **Seleção de Pilar e Programa**:
   * Ao ativar o interruptor **PILAR**, exibir os seletores dinâmicos de **Pilar** e **Programa**.
   * Ao selecionar um Pilar, carregar dinamicamente a lista de Programas correspondentes.
   * O **Objetivo Principal (Explicação)** correspondente ao pilar e programa selecionados deve ser exibido em modo somente leitura como feedback visual.
3. **Cálculo de Prioridade (GUT)**:
   * Devem ser informadas as notas de **Gravidade**, **Urgência** e **Tendência** (escala de 1 a 5).
   * O **Índice GUT** deve ser calculado automaticamente pelo produto destas três notas (G x U x T), variando de 1 a 125, exibido de forma destacada no formulário.

---

## 3. Listagem de Registros FAST

### Critérios de Aceite
1. **Exibição Compacta (Sem quebras de linha)**:
   * Os dados e registros na tabela do FAST devem ser exibidos estritamente em uma única linha por registro (`white-space: nowrap`), evitando quebras de texto verticais e garantindo máxima densidade de informações na tela.
   * Textos muito longos devem apresentar reticências (`ellipsis`) no final da linha. Para visualizar o conteúdo completo, o usuário deve clicar sobre a linha correspondente para abrir o editor/detalhe do registro.
2. **Layout da Tabela e Scroll**:
   * A tabela do FAST deve possuir layout fixo com largura de `2450px` e suporte a rolagem horizontal suave, garantindo que os cabeçalhos das colunas permaneçam organizados e alinhados verticalmente com seus respectivos campos.
   * A coluna **Solicitante** e a linha de filtros associada devem estar perfeitamente alinhadas, evitando deslocamentos.

---

## 4. Visualização de Checklists de Projetos

### Critérios de Aceite
1. **Ocultação Condicional**:
   * O painel ou tabela de perguntas do Checklist de Projetos deve permanecer **completamente oculto** até que o usuário selecione ativamente o nome de um projeto no seletor correspondente.
2. **Sinalização Visual (Indicador)**:
   * Quando nenhum projeto estiver selecionado, o sistema deve exibir uma seta vermelha pulsante animada apontando em direção ao título/rótulo **"NOME DO PROJETO"** para guiar o usuário na seleção.
   * Ao selecionar um projeto, a tabela de checklist é carregada, e a seta indicadora é ocultada.

---

## 5. Banco de Dados

### Critérios de Aceite
1. **Remoção de Ações Inválidas**:
   * Na tela de gerenciamento de banco de dados, o botão **"Novo Registro"** no cabeçalho das tabelas foi removido para evitar inserções inconsistentes diretamente na tabela de histórico.

---

## 6. Business Case e Detalhamento FAST

### Critérios de Aceite
1. **Cabeçalho Compacto e Integrado**:
   * As informações gerais (Código, Data, Categoria, Origem, Gerente e Área) devem ser exibidas em formato compacto lado a lado.
   * O bloco de cálculo/resultado do **Índice GUT** do registro deve estar posicionado no cabeçalho do detalhamento, à direita da mesma linha de dados gerais, otimizando o espaço vertical.
2. **Ações e Cards Consolidados**:
    * Os cards de interação principais da tela (Carregar Business Case, Material de Apoio, Cronograma e Valores EAP, Cronograma Físico Financeiro) devem ficar dispostos em uma grade com 4 colunas em uma mesma linha (salvo em telas muito estreitas).
    * O botão "Definir EAP" deve ser destacado visualmente (fonte azul).
3. **Editor de Textos Rich Text (TinyMCE)**:
   * Todos os campos de texto descritivos do Business Case devem ser renderizados usando o editor **TinyMCE** (versão Open Source, sem restrições de API Key).
   * O editor suporta formatação de texto rico, permitindo tabelas, listas ordenadas, alinhamentos e marcações HTML complexas, convertendo o preenchimento de formulário em um processo similar ao Microsoft Word.
4. **Layout em Formato Documento (Word/A4)**:
   * O layout dos editores de texto na janela do Business Case foi padronizado para uma **coluna única centralizada**, com largura delimitada (`max-w-[850px]`), simulando propositalmente as margens e a visualização de uma folha sulfite A4.
   * Foi incorporada a lógica de expansão contínua (`autoresize`); à medida em que o usuário digita mais linhas, o editor cresce para baixo dinamicamente, eliminando barras de rolagem restritas dentro da caixa e favorecendo leitura contínua.
5. **Estrutura de Tópicos e Seções do Documento**:
   * O layout obedece à numeração corporativa restrita abaixo. Foram incluídos novos campos específicos para a quebra de escopo (5.0 e 5.1), devidamente mapeados para o banco de dados sem quebrar os históricos passados:
     * 1 - Objetivo
     * 2 - Contextualização
     * 3 - Benefícios
     * 4 - Avaliação de Alinhamento Estratégico
     * 5 - Escopo Resumido
     * 5.1 - Descrição do escopo
     * 5.2 - Requisitos
     * 5.3 - Premissas e restrições
     * 5.4 - Exclusões
     * 6 - CAPEX
     * 7 - Cronograma Preliminar
     * 8 - Fatores Críticos de Sucesso
     * 9 - Riscos
     * 10 - Avaliação Econômica
     * 11 - Conclusão

---

## 7. Modal de Cronograma e Valores EAP

### Critérios de Aceite
1. **Tamanho e Padronização**:
   * O modal deve usar um padrão restrito de largura (`max-w-3xl`) que não polua visualmente a tela com espaços em branco excessivos.
   * Os campos de inserção de valores e datas devem adotar formato slim (alturas e respiros reduzidos, bordas discretas), seguindo padrões visuais coesos com menos espaçamentos entre as divisões internas (Engenharia, Materiais, Serviços, Equipamentos).
2. **Cálculo Automático de Totais**:
   * **Custo Total**: O componente deve somar automaticamente os valores reportados nas 4 categorias (Engenharia, Materiais, Serviços, Equipamentos) e exibir o valor monetário absoluto.
   * **Total em Dias**: O componente deve capturar e validar todas as datas de "Início" e "Término" fornecidas. A funcionalidade deve calcular e exibir automaticamente a distância em dias entre a menor data de Início identificada e a maior data de Término em todas as categorias preenchidas.
