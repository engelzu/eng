const fs = require('fs');

const files = ['business-case.html', 'OUT/business-case.html'];

// The table controls JS code to be injected into the page (not inside a template string, directly in the script)
const tableControlsCode = `
        // === BC TABLE CONTROLS (toolbar flutuante + alças laranjas) ===
        window._bcActiveTableToolbar = window._bcActiveTableToolbar || null;
        window._bcActiveTableHandles = window._bcActiveTableHandles || [];

        window.bcRemoveTableControls = function() {
            if (window._bcActiveTableToolbar) {
                window._bcActiveTableToolbar.remove();
                window._bcActiveTableToolbar = null;
            }
            if (window._bcActiveTableHandles) {
                window._bcActiveTableHandles.forEach(function(h) { try { h.remove(); } catch(e) {} });
                window._bcActiveTableHandles = [];
            }
        };

        window.bcRenderTableControls = function(editor, table) {
            window.bcRemoveTableControls();

            var iframe = editor.getContainer().querySelector('iframe');
            if (!iframe) return;

            var iframeRect = iframe.getBoundingClientRect();

            // --- Floating Toolbar ---
            var toolbar = document.createElement('div');
            toolbar.className = 'bc-tbl-toolbar';
            toolbar.setAttribute('style', [
                'position:fixed',
                'display:flex',
                'gap:5px',
                'padding:5px 10px',
                'background:#1e293b',
                'border-radius:8px',
                'color:white',
                'font-family:sans-serif',
                'font-size:11px',
                'z-index:2147483640',
                'align-items:center',
                'box-shadow:0 4px 12px rgba(0,0,0,0.3)',
                'pointer-events:auto',
                'user-select:none',
                'flex-wrap:wrap'
            ].join(';'));

            var buttons = [
                {label:'LINHAS', type:'label', color:'#4ade80'},
                {label:'↑ Linha acima', action:'row-above'},
                {label:'↓ Linha abaixo', action:'row-below'},
                {label:'✕ Del Linha', action:'row-del'},
                {label:'|', type:'sep'},
                {label:'COLUNAS', type:'label', color:'#60a5fa'},
                {label:'← Col.esq', action:'col-left'},
                {label:'→ Col.dir', action:'col-right'},
                {label:'✕ Del Col', action:'col-del'},
                {label:'|', type:'sep'},
                {label:'✕ Del Tabela', action:'tbl-del', danger:true}
            ];

            buttons.forEach(function(b) {
                if (b.type === 'label') {
                    var sp = document.createElement('span');
                    sp.style.cssText = 'color:' + b.color + ';font-weight:bold;font-size:9px;letter-spacing:.05em;margin-right:2px;';
                    sp.textContent = b.label;
                    toolbar.appendChild(sp);
                } else if (b.type === 'sep') {
                    var div = document.createElement('div');
                    div.style.cssText = 'width:1px;background:#475569;height:16px;margin:0 3px;';
                    toolbar.appendChild(div);
                } else {
                    var btn = document.createElement('button');
                    btn.type = 'button';
                    btn.setAttribute('data-action', b.action);
                    btn.style.cssText = 'background:' + (b.danger ? '#ef4444' : '#334155') + ';border:none;color:white;padding:3px 7px;border-radius:4px;cursor:pointer;font-size:10px;font-weight:bold;white-space:nowrap;';
                    btn.textContent = b.label;
                    btn.addEventListener('mousedown', function(e) { e.preventDefault(); e.stopPropagation(); });
                    btn.addEventListener('click', function() {
                        var action = btn.getAttribute('data-action');
                        editor.focus();
                        var cmds = {
                            'row-above': 'mceTableInsertRowBefore',
                            'row-below': 'mceTableInsertRowAfter',
                            'row-del':   'mceTableDeleteRow',
                            'col-left':  'mceTableInsertColBefore',
                            'col-right': 'mceTableInsertColAfter',
                            'col-del':   'mceTableDeleteCol',
                            'tbl-del':   'mceTableDelete'
                        };
                        if (cmds[action]) editor.execCommand(cmds[action]);
                        setTimeout(function() {
                            var t2 = editor.dom.getParent(editor.selection.getStart(), 'table');
                            if (t2) window.bcRenderTableControls(editor, t2);
                            else window.bcRemoveTableControls();
                        }, 80);
                    });
                    toolbar.appendChild(btn);
                }
            });

            var tableRect = table.getBoundingClientRect();
            var toolbarTop = iframeRect.top + tableRect.top - 40;
            if (toolbarTop < 5) toolbarTop = iframeRect.top + tableRect.bottom + 5;
            toolbar.style.top = toolbarTop + 'px';
            toolbar.style.left = iframeRect.left + tableRect.left + 'px';

            document.body.appendChild(toolbar);
            window._bcActiveTableToolbar = toolbar;

            // --- Column Handles ---
            var firstRow = table.querySelector('tr');
            if (!firstRow) return;
            var cells = Array.from(firstRow.cells);

            // Ensure table-layout: fixed + colgroup
            if (table.style.tableLayout !== 'fixed') {
                var cellWidths = cells.map(function(c) { return c.getBoundingClientRect().width; });
                var colgroup = table.querySelector('colgroup');
                if (!colgroup) {
                    colgroup = editor.getDoc().createElement('colgroup');
                    table.insertBefore(colgroup, table.firstChild);
                }
                colgroup.innerHTML = '';
                cellWidths.forEach(function(w) {
                    var col = editor.getDoc().createElement('col');
                    col.style.width = Math.round(w) + 'px';
                    colgroup.appendChild(col);
                });
                table.style.tableLayout = 'fixed';
                table.style.width = (table.offsetWidth || 400) + 'px';
            }

            var colgroup2 = table.querySelector('colgroup');
            var cols = colgroup2 ? Array.from(colgroup2.querySelectorAll('col')) : [];

            cells.forEach(function(cell, idx) {
                var cellRect = cell.getBoundingClientRect();
                var handle = document.createElement('div');
                handle.className = 'bc-tbl-col-handle';
                handle.style.cssText = [
                    'position:fixed',
                    'width:18px',
                    'cursor:col-resize',
                    'z-index:2147483641',
                    'display:flex',
                    'flex-direction:column',
                    'align-items:center',
                    'user-select:none',
                    'pointer-events:auto',
                    'left:' + (iframeRect.left + cellRect.right - 9) + 'px',
                    'top:' + (iframeRect.top + cellRect.top) + 'px',
                    'height:' + (cellRect.height + 20) + 'px'
                ].join(';');

                handle.innerHTML = '<div style="width:18px;height:18px;border-radius:50%;background:#f97316;color:white;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);flex-shrink:0;">' + (idx + 1) + '</div><div style="width:2px;background:rgba(249,115,22,0.4);flex:1;min-height:10px;margin-top:2px;"></div>';

                document.body.appendChild(handle);
                window._bcActiveTableHandles.push(handle);

                // Drag to resize
                handle.addEventListener('mousedown', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var startX = e.clientX;
                    var colEl = cols[idx];
                    if (!colEl) return;

                    var startW = parseFloat(colEl.style.width) || cellRect.width;
                    var nextCol = cols[idx + 1];
                    var nextStartW = nextCol ? (parseFloat(nextCol.style.width) || (cells[idx + 1] ? cells[idx + 1].getBoundingClientRect().width : 80)) : null;
                    var startTableW = table.offsetWidth;

                    var overlay = document.createElement('div');
                    overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483647;cursor:col-resize;background:transparent;user-select:none;pointer-events:auto;';
                    document.body.appendChild(overlay);

                    function onMouseMove(moveEvt) {
                        var delta = moveEvt.clientX - startX;
                        var newW = Math.max(30, startW + delta);
                        colEl.style.width = newW + 'px';
                        if (nextCol && nextStartW !== null) {
                            nextCol.style.width = Math.max(30, nextStartW - delta) + 'px';
                        } else {
                            table.style.width = (startTableW + (newW - startW)) + 'px';
                        }
                        // Live-update handle positions
                        window.bcRenderTableControls(editor, table);
                    }

                    function onMouseUp() {
                        overlay.remove();
                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('mouseup', onMouseUp);
                        editor.fire('change');
                    }

                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                });
            });
        };

        // Update handles on scroll/resize
        window.addEventListener('scroll', function() {
            if (!window._bcActiveTableToolbar) return;
            if (typeof tinymce !== 'undefined' && tinymce.activeEditor) {
                var t = tinymce.activeEditor.dom.getParent(tinymce.activeEditor.selection.getStart(), 'table');
                if (t) window.bcRenderTableControls(tinymce.activeEditor, t);
            }
        }, true);
        window.addEventListener('resize', function() {
            if (!window._bcActiveTableToolbar) return;
            if (typeof tinymce !== 'undefined' && tinymce.activeEditor) {
                var t = tinymce.activeEditor.dom.getParent(tinymce.activeEditor.selection.getStart(), 'table');
                if (t) window.bcRenderTableControls(tinymce.activeEditor, t);
            }
        });
        // === END BC TABLE CONTROLS ===
`;

// The setup code to be added inside tinymce.init > setup function of initBcTinymce
// We need to replace the existing setup function in initBcTinymce to add the table events
const oldSetup = `setup: function(editor) {
                            editor.on('init', function() {
                                console.log('[TinyMCE] Editor initialized on', ta.id);
                            });
                            editor.on('change keyup blur', function() {
                                editor.save();
                                const event = new Event('input', { bubbles: true });
                                ta.dispatchEvent(event);
                            });
                        }`;

const newSetup = `setup: function(editor) {
                            editor.on('init', function() {
                                console.log('[TinyMCE] Editor initialized on', ta.id);
                            });
                            editor.on('change keyup blur', function() {
                                editor.save();
                                const event = new Event('input', { bubbles: true });
                                ta.dispatchEvent(event);
                            });
                            // Table controls
                            editor.on('click keyup NodeChange', function() {
                                var tbl = editor.dom.getParent(editor.selection.getStart(), 'table');
                                if (tbl) {
                                    window.bcRenderTableControls(editor, tbl);
                                } else {
                                    window.bcRemoveTableControls();
                                }
                            });
                            editor.on('blur', function() {
                                setTimeout(function() {
                                    var activeEl = document.activeElement;
                                    if (activeEl && (activeEl.closest('.bc-tbl-toolbar') || activeEl.closest('.bc-tbl-col-handle'))) return;
                                    window.bcRemoveTableControls();
                                }, 200);
                            });
                            editor.on('ScrollContent Scroll', function() {
                                var tbl = editor.dom.getParent(editor.selection.getStart(), 'table');
                                if (tbl) window.bcRenderTableControls(editor, tbl);
                            });
                        }`;

files.forEach(function(f) {
    if (!fs.existsSync(f)) {
        console.log('SKIP (not found):', f);
        return;
    }

    let html = fs.readFileSync(f, 'utf8');

    // 1. Inject the tableControlsCode BEFORE the closing </script> of the first initBcTinymce block
    //    We find the marker "// Observar mudancas" which comes right after the first initBcTinymce definition
    const markerComment = '// Observar mudancas no DOM';
    if (html.indexOf('bcRenderTableControls') !== -1) {
        console.log('Table controls already patched in:', f);
    } else {
        const markerIdx = html.indexOf(markerComment);
        if (markerIdx === -1) {
            console.log('WARNING: Could not find insertion marker in:', f);
        } else {
            html = html.substring(0, markerIdx) + tableControlsCode + '\n        ' + html.substring(markerIdx);
            console.log('Injected table controls code into:', f);
        }
    }

    // 2. Patch the setup function to include table events
    if (html.indexOf(oldSetup) !== -1) {
        html = html.replace(oldSetup, newSetup);
        console.log('Patched setup function in:', f);
    } else {
        console.log('WARNING: Could not find old setup function in:', f, '- checking if already patched...');
        if (html.indexOf('bcRenderTableControls') !== -1) {
            console.log('  -> Already patched.');
        }
    }

    fs.writeFileSync(f, html);
    console.log('Written:', f);
});
