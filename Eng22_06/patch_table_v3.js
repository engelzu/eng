/**
 * Abordagem completamente nova: polling-based table controls.
 * Remove todos os patches anteriores de tabela e injeta um sistema limpo
 * baseado em setInterval no documento PAI para detectar seleção de tabela.
 */
const fs = require('fs');

const files = ['business-case.html', 'OUT/business-case.html'];

// ---- NOVO CÓDIGO DE CONTROLE DE TABELA (vai ser colocado como <script> antes de </body>) ----
const tableScript = `
    <script id="bc-table-controls-v3">
    (function() {
        // Aguarda o DOM e TinyMCE estarem prontos
        var _toolbar = null;
        var _handles = [];
        var _lastTable = null;
        var _lastEditorId = null;

        function removeControls() {
            if (_toolbar) { try { _toolbar.remove(); } catch(e) {} _toolbar = null; }
            _handles.forEach(function(h) { try { h.remove(); } catch(e) {} });
            _handles = [];
            _lastTable = null;
        }

        function isSameTable(tbl) {
            return _lastTable === tbl;
        }

        function buildControls(editor, table) {
            if (isSameTable(table) && _toolbar && document.contains(_toolbar)) return;
            removeControls();
            _lastTable = table;

            var iframe = editor.getContainer() && editor.getContainer().querySelector('iframe');
            if (!iframe) return;

            var iRect = iframe.getBoundingClientRect();
            var tRect = table.getBoundingClientRect();

            // --- Toolbar flutuante ---
            var tb = document.createElement('div');
            tb.id = 'bc-table-toolbar-v3';
            tb.className = 'bc-tbl-toolbar';
            var tbTop = iRect.top + tRect.top - 44;
            if (tbTop < 4) tbTop = iRect.top + tRect.bottom + 4;
            Object.assign(tb.style, {
                position: 'fixed',
                top: tbTop + 'px',
                left: Math.max(4, iRect.left + tRect.left) + 'px',
                display: 'flex', flexWrap: 'wrap', gap: '4px',
                padding: '5px 10px',
                background: '#1e293b',
                borderRadius: '8px',
                color: 'white',
                fontFamily: 'sans-serif', fontSize: '11px',
                zIndex: '2147483640',
                alignItems: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                pointerEvents: 'auto',
                userSelect: 'none'
            });

            var BTNS = [
                {t:'label', label:'LINHAS', color:'#4ade80'},
                {t:'btn', label:'↑ Linha acima', cmd:'mceTableInsertRowBefore'},
                {t:'btn', label:'↓ Linha abaixo', cmd:'mceTableInsertRowAfter'},
                {t:'btn', label:'✕ Del Linha', cmd:'mceTableDeleteRow'},
                {t:'sep'},
                {t:'label', label:'COLUNAS', color:'#60a5fa'},
                {t:'btn', label:'← Col.esq', cmd:'mceTableInsertColBefore'},
                {t:'btn', label:'→ Col.dir', cmd:'mceTableInsertColAfter'},
                {t:'btn', label:'✕ Del Col', cmd:'mceTableDeleteCol'},
                {t:'sep'},
                {t:'btn', label:'✕ Del Tabela', cmd:'mceTableDelete', danger:true}
            ];

            BTNS.forEach(function(b) {
                if (b.t === 'label') {
                    var s = document.createElement('span');
                    s.textContent = b.label;
                    s.style.cssText = 'color:' + b.color + ';font-weight:bold;font-size:9px;letter-spacing:.05em;margin-right:2px;';
                    tb.appendChild(s);
                } else if (b.t === 'sep') {
                    var d = document.createElement('div');
                    d.style.cssText = 'width:1px;background:#475569;height:16px;margin:0 2px;';
                    tb.appendChild(d);
                } else {
                    var btn = document.createElement('button');
                    btn.type = 'button';
                    btn.textContent = b.label;
                    btn.style.cssText = 'background:' + (b.danger ? '#ef4444' : '#334155') + ';border:none;color:white;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:10px;font-weight:bold;white-space:nowrap;';
                    btn.addEventListener('pointerdown', function(e) { e.stopImmediatePropagation(); e.preventDefault(); });
                    btn.addEventListener('mousedown', function(e) { e.stopImmediatePropagation(); e.preventDefault(); });
                    btn.addEventListener('click', function(e) {
                        e.stopImmediatePropagation();
                        try { editor.focus(); editor.execCommand(b.cmd); } catch(err) {}
                        _lastTable = null; // force redraw after command
                    });
                    tb.appendChild(btn);
                }
            });

            document.body.appendChild(tb);
            _toolbar = tb;

            // --- Handles de coluna laranjas ---
            var firstRow = table.querySelector('tr');
            if (!firstRow) return;
            var cells = Array.from(firstRow.cells);

            // Garante table-layout fixed + colgroup
            if (table.style.tableLayout !== 'fixed') {
                var widths = cells.map(function(c) { return c.getBoundingClientRect().width; });
                var cg = table.querySelector('colgroup');
                if (!cg) { cg = editor.getDoc().createElement('colgroup'); table.insertBefore(cg, table.firstChild); }
                cg.innerHTML = '';
                widths.forEach(function(w) {
                    var col = editor.getDoc().createElement('col');
                    col.style.width = Math.max(30, Math.round(w)) + 'px';
                    cg.appendChild(col);
                });
                table.style.tableLayout = 'fixed';
                table.style.width = (table.offsetWidth || 300) + 'px';
            }
            var cg2 = table.querySelector('colgroup');
            var cols = cg2 ? Array.from(cg2.querySelectorAll('col')) : [];

            cells.forEach(function(cell, idx) {
                var cr = cell.getBoundingClientRect();
                var h = document.createElement('div');
                h.className = 'bc-tbl-col-handle';
                Object.assign(h.style, {
                    position: 'fixed',
                    left: (iRect.left + cr.right - 9) + 'px',
                    top: (iRect.top + cr.top) + 'px',
                    width: '18px',
                    height: (cr.height + 18) + 'px',
                    cursor: 'col-resize',
                    zIndex: '2147483641',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pointerEvents: 'auto',
                    userSelect: 'none'
                });
                h.innerHTML =
                    '<div style="width:18px;height:18px;border-radius:50%;background:#f97316;color:white;' +
                    'display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;' +
                    'border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.4);flex-shrink:0;">' + (idx + 1) + '</div>' +
                    '<div style="width:2px;background:rgba(249,115,22,.45);flex:1;min-height:6px;margin-top:2px;"></div>';

                document.body.appendChild(h);
                _handles.push(h);

                // Drag resize
                h.addEventListener('pointerdown', function(e) {
                    e.stopImmediatePropagation(); e.preventDefault();
                    var startX = e.clientX;
                    var colEl = cols[idx];
                    if (!colEl) return;
                    var startW = parseFloat(colEl.style.width) || cr.width;
                    var nextCol = cols[idx + 1];
                    var nextStartW = nextCol ? (parseFloat(nextCol.style.width) || (cells[idx+1] ? cells[idx+1].getBoundingClientRect().width : 80)) : null;
                    var startTW = table.offsetWidth;

                    var ov = document.createElement('div');
                    ov.style.cssText = 'position:fixed;inset:0;z-index:2147483647;cursor:col-resize;';
                    document.body.appendChild(ov);
                    _lastTable = null; // allow redraw during drag

                    function move(me) {
                        var delta = me.clientX - startX;
                        colEl.style.width = Math.max(30, startW + delta) + 'px';
                        if (nextCol && nextStartW !== null) {
                            nextCol.style.width = Math.max(30, nextStartW - delta) + 'px';
                        } else {
                            table.style.width = (startTW + delta) + 'px';
                        }
                        _lastTable = null; // trigger redraw
                    }
                    function up() {
                        ov.remove();
                        document.removeEventListener('pointermove', move);
                        document.removeEventListener('pointerup', up);
                        try { editor.fire('change'); } catch(er) {}
                    }
                    document.addEventListener('pointermove', move);
                    document.addEventListener('pointerup', up);
                });
            });
        }

        // Bloqueia Radix de interceptar eventos nos nossos controles
        ['pointerdown','mousedown','click','touchstart'].forEach(function(evName) {
            document.addEventListener(evName, function(e) {
                try {
                    var t = e.target;
                    while (t) {
                        if (t.classList && (t.classList.contains('bc-tbl-toolbar') || t.classList.contains('bc-tbl-col-handle'))) {
                            e.stopImmediatePropagation();
                            return;
                        }
                        t = t.parentElement;
                    }
                } catch(ex) {}
            }, true);
        });

        // Patch Node.prototype.contains para que Radix ache que nossos elementos estao dentro do modal
        (function() {
            var orig = Node.prototype.contains;
            Node.prototype.contains = function(other) {
                try {
                    var n = other;
                    if (n && n.nodeType === 3) n = n.parentNode;
                    if (n && n.nodeType === 1) {
                        var p = n;
                        while (p) {
                            if (p.classList && (p.classList.contains('bc-tbl-toolbar') || p.classList.contains('bc-tbl-col-handle') || p.classList.contains('tox-tinymce-aux') || p.classList.contains('tox-tinymce') || p.classList.contains('tox-pop'))) {
                                if (this.nodeType === 1 && !this.classList.contains('bc-tbl-toolbar') && !this.classList.contains('bc-tbl-col-handle') && !this.classList.contains('tox-tinymce-aux') && !this.classList.contains('tox-tinymce')) {
                                    return true;
                                }
                                break;
                            }
                            p = p.parentElement;
                        }
                    }
                } catch(ex) {}
                return orig.call(this, other);
            };
        })();

        // POLLING PRINCIPAL: verifica a cada 250ms se há uma tabela selecionada
        setInterval(function() {
            try {
                if (typeof tinymce === 'undefined') return;
                var editor = tinymce.activeEditor;
                if (!editor) {
                    // Tenta todos os editores ativos
                    if (!tinymce.editors || !tinymce.editors.length) return;
                    // usa o primeiro que tiver foco
                    for (var i = 0; i < tinymce.editors.length; i++) {
                        var ed = tinymce.editors[i];
                        try {
                            var nd = ed.selection.getStart();
                            if (nd) { editor = ed; break; }
                        } catch(ei) {}
                    }
                    if (!editor) return;
                }

                var selNode = editor.selection.getStart(true);
                if (!selNode) { removeControls(); return; }

                // Sobe na árvore para encontrar a tabela
                var tbl = null;
                var cur = selNode;
                while (cur && cur.nodeName !== 'BODY') {
                    if (cur.nodeName === 'TABLE') { tbl = cur; break; }
                    cur = cur.parentElement;
                }

                if (tbl) {
                    buildControls(editor, tbl);
                } else {
                    // Verifica se foco está em nosso toolbar - se sim, não remove
                    var ae = document.activeElement;
                    var inOurUI = ae && (function(el) {
                        while(el) {
                            if (el.classList && (el.classList.contains('bc-tbl-toolbar') || el.classList.contains('bc-tbl-col-handle'))) return true;
                            el = el.parentElement;
                        }
                        return false;
                    })(ae);
                    if (!inOurUI) removeControls();
                }
            } catch(e) {}
        }, 250);

        // Limpa quando modal fechar
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') removeControls();
        });

        console.log('[BC-TABLE-V3] Table controls polling started');
    })();
    </script>
`;

files.forEach(function(f) {
    if (!fs.existsSync(f)) { console.log('SKIP:', f); return; }
    let html = fs.readFileSync(f, 'utf8');

    // Remove qualquer versão anterior dos controles de tabela
    html = html.replace(/<script id="bc-table-controls-v\d+"[\s\S]*?<\/script>\s*/g, '');
    html = html.replace(/\/\/ === BC TABLE CONTROLS[\s\S]*?\/\/ === END BC TABLE CONTROLS ===[^\n]*/g, '');
    html = html.replace(/\/\/ === EVENT BYPASS[\s\S]*?\/\/ === END EVENT BYPASS ===[^\n]*/g, '');
    html = html.replace(/window\._bcEventBypassInstalled[\s\S]*?}\)\(\);/g, '');

    // Injeta o novo script antes de </body>
    const bodyClose = html.lastIndexOf('</body>');
    if (bodyClose === -1) {
        console.log('WARNING: no </body> in', f);
        html += tableScript;
    } else {
        html = html.substring(0, bodyClose) + tableScript + '\n</body>' + html.substring(bodyClose + 7);
    }

    fs.writeFileSync(f, html);
    console.log('Done:', f, '(' + Math.round(html.length/1024) + 'kb)');
});
