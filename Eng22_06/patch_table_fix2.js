/**
 * PATCH DEFINITIVO - Correção da raiz do problema:
 * stopImmediatePropagation no capture phase impedia nossos próprios botões 
 * de receberem eventos. Remove esse comportamento destrutivo.
 * Usa APENAS o Node.prototype.contains patch para enganar o Radix.
 */
const fs = require('fs');

const files = ['business-case.html', 'OUT/business-case.html'];

const tableScript = `
    <script id="bc-table-final">
    /* BC Table Controls - Final Fix */
    (function bcTableControls() {
        'use strict';

        var _tb  = null;
        var _hnd = [];
        var _cur = null;

        function destroy() {
            if (_tb)  { _tb.remove();  _tb  = null; }
            _hnd.forEach(function(h) { try { h.remove(); } catch(e){} });
            _hnd = [];
            _cur = null;
        }

        function build(editor, table) {
            if (_cur === table && _tb && document.body.contains(_tb)) return;
            destroy();
            _cur = table;

            var container = editor.getContainer();
            if (!container) return;
            var iframe = container.querySelector('iframe');
            if (!iframe) return;
            var ir = iframe.getBoundingClientRect();
            var tr = table.getBoundingClientRect();

            /* === TOOLBAR === */
            var tb = document.createElement('div');
            tb.className = 'bc-tbl-toolbar';
            var topPos = ir.top + tr.top - 44;
            if (topPos < 4) topPos = ir.top + tr.bottom + 4;
            tb.style.cssText = [
                'position:fixed',
                'top:' + topPos + 'px',
                'left:' + Math.max(2, ir.left + tr.left) + 'px',
                'display:flex','flex-wrap:wrap','gap:4px',
                'padding:5px 10px',
                'background:#1e293b',
                'border-radius:8px',
                'color:#fff','font-family:sans-serif','font-size:11px',
                'z-index:2147483640',
                'align-items:center',
                'box-shadow:0 4px 20px rgba(0,0,0,.5)',
                'pointer-events:auto','user-select:none'
            ].join(';');

            var DEFS = [
                {k:'label',v:'LINHAS',c:'#4ade80'},
                {k:'btn',v:'↑ Linha acima',  cmd:'mceTableInsertRowBefore'},
                {k:'btn',v:'↓ Linha abaixo', cmd:'mceTableInsertRowAfter'},
                {k:'btn',v:'✕ Del Linha',    cmd:'mceTableDeleteRow'},
                {k:'sep'},
                {k:'label',v:'COLUNAS',c:'#60a5fa'},
                {k:'btn',v:'← Col.esq', cmd:'mceTableInsertColBefore'},
                {k:'btn',v:'→ Col.dir', cmd:'mceTableInsertColAfter'},
                {k:'btn',v:'✕ Del Col', cmd:'mceTableDeleteCol'},
                {k:'sep'},
                {k:'btn',v:'✕ Del Tabela', cmd:'mceTableDelete', danger:true}
            ];

            DEFS.forEach(function(d) {
                if (d.k === 'label') {
                    var s = document.createElement('span');
                    s.textContent = d.v;
                    s.style.cssText = 'color:'+d.c+';font-weight:bold;font-size:9px;letter-spacing:.06em;margin-right:2px;';
                    tb.appendChild(s);
                } else if (d.k === 'sep') {
                    var sep = document.createElement('div');
                    sep.style.cssText = 'width:1px;height:16px;background:#475569;margin:0 2px;flex-shrink:0;';
                    tb.appendChild(sep);
                } else {
                    var btn = document.createElement('button');
                    btn.type = 'button';
                    btn.textContent = d.v;
                    btn.style.cssText = 'background:'+(d.danger?'#ef4444':'#334155')+';border:none;color:#fff;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:10px;font-weight:bold;white-space:nowrap;';
                    // mousedown: prevent editor blur so toolbar stays visible
                    btn.addEventListener('mousedown', function(e) { e.preventDefault(); });
                    // click: execute the TinyMCE command
                    (function(cmd) {
                        btn.addEventListener('click', function() {
                            try {
                                editor.focus();
                                editor.execCommand(cmd);
                            } catch(e) { console.warn('[BC-TABLE] cmd error', e); }
                            _cur = null; // force redraw after structural change
                        });
                    })(d.cmd);
                    tb.appendChild(btn);
                }
            });

            document.body.appendChild(tb);
            _tb = tb;

            /* === COLUMN HANDLES === */
            var firstRow = table.querySelector('tr');
            if (!firstRow) return;
            var cells = Array.from(firstRow.cells);

            // Ensure table-layout:fixed + colgroup
            if (table.style.tableLayout !== 'fixed') {
                var cws = cells.map(function(c) { return c.getBoundingClientRect().width; });
                var cg = table.querySelector('colgroup');
                if (!cg) {
                    cg = editor.getDoc().createElement('colgroup');
                    table.insertBefore(cg, table.firstChild);
                }
                cg.innerHTML = '';
                cws.forEach(function(w) {
                    var col = editor.getDoc().createElement('col');
                    col.style.width = Math.max(20, Math.round(w)) + 'px';
                    cg.appendChild(col);
                });
                table.style.tableLayout = 'fixed';
                table.style.width = (table.offsetWidth || 300) + 'px';
            }
            var cg2  = table.querySelector('colgroup');
            var cols = cg2 ? Array.from(cg2.querySelectorAll('col')) : [];

            cells.forEach(function(cell, idx) {
                var cr = cell.getBoundingClientRect();

                var h = document.createElement('div');
                h.className = 'bc-tbl-col-handle';
                h.style.cssText = [
                    'position:fixed',
                    'left:' + (ir.left + cr.right - 9) + 'px',
                    'top:'  + (ir.top  + cr.top)  + 'px',
                    'width:18px',
                    'height:' + (cr.height + 20) + 'px',
                    'cursor:col-resize',
                    'z-index:2147483641',
                    'display:flex','flex-direction:column','align-items:center',
                    'pointer-events:auto','user-select:none'
                ].join(';');

                h.innerHTML =
                    '<div style="width:18px;height:18px;border-radius:50%;background:#f97316;' +
                    'color:#fff;display:flex;align-items:center;justify-content:center;' +
                    'font-size:10px;font-weight:bold;border:2px solid #fff;' +
                    'box-shadow:0 2px 8px rgba(0,0,0,.5);flex-shrink:0;">' + (idx+1) + '</div>' +
                    '<div style="width:2px;background:rgba(249,115,22,.4);flex:1;min-height:4px;margin-top:2px;"></div>';

                /* Drag resize via pointer events on the handle itself */
                (function(colEl, nxC, nxW_init, sw_init) {
                    h.addEventListener('mousedown', function(e) {
                        e.preventDefault(); // prevent text selection during drag
                        var startX = e.clientX;
                        var sw   = parseFloat(colEl.style.width) || cr.width;
                        var nxW  = nxC ? (parseFloat(nxC.style.width) || 60) : null;
                        var stTW = table.offsetWidth;

                        // Full-screen overlay to capture mousemove even outside iframe
                        var ov = document.createElement('div');
                        ov.style.cssText = 'position:fixed;inset:0;z-index:2147483647;cursor:col-resize;';
                        document.body.appendChild(ov);

                        _cur = null; // allow redraw during drag

                        function move(me) {
                            var dx = me.clientX - startX;
                            colEl.style.width = Math.max(20, sw + dx) + 'px';
                            if (nxC && nxW !== null) {
                                nxC.style.width = Math.max(20, nxW - dx) + 'px';
                            } else {
                                table.style.width = (stTW + dx) + 'px';
                            }
                            _cur = null; // redraw handles
                        }

                        function up() {
                            ov.remove();
                            document.removeEventListener('mousemove', move);
                            document.removeEventListener('mouseup',   up);
                            try { editor.fire('change'); } catch(ex){}
                        }

                        document.addEventListener('mousemove', move);
                        document.addEventListener('mouseup',   up);
                    });
                })(cols[idx], cols[idx+1], null, 0);

                document.body.appendChild(h);
                _hnd.push(h);
            });
        }

        /* ---------- Node.prototype.contains patch ---------- */
        /* Makes Radix/React think our controls are INSIDE the modal,
           preventing outside-click detection from closing things */
        (function() {
            var _oc = Node.prototype.contains;
            Node.prototype.contains = function(other) {
                try {
                    var n = other;
                    if (n && n.nodeType === 3) n = n.parentNode;
                    if (n && n.nodeType === 1) {
                        var p = n;
                        while (p) {
                            if (p.classList) {
                                if (p.classList.contains('bc-tbl-toolbar') ||
                                    p.classList.contains('bc-tbl-col-handle') ||
                                    p.classList.contains('tox-tinymce-aux') ||
                                    p.classList.contains('tox-tinymce') ||
                                    p.classList.contains('tox-pop')) {
                                    // This element belongs to TinyMCE or our controls
                                    // Tell Radix it is INSIDE the modal
                                    return true;
                                }
                            }
                            p = p.parentElement;
                        }
                    }
                } catch(ex){}
                return _oc.call(this, other);
            };
        })();

        /* ---------- Hook into each TinyMCE editor via AddEditor ---------- */
        function hookEditor(editor) {
            // When selection changes, check if we're in a table
            editor.on('NodeChange click keyup', function() {
                try {
                    var n   = editor.selection.getNode();
                    var el  = n;
                    while (el && el.nodeName !== 'BODY') {
                        if (el.nodeName === 'TABLE') {
                            build(editor, el);
                            return;
                        }
                        el = el.parentElement;
                    }
                    // Not in table - only hide if focus not on our controls
                    var ae = document.activeElement;
                    if (!ae || !ae.closest ||
                        (!ae.closest('.bc-tbl-toolbar') && !ae.closest('.bc-tbl-col-handle'))) {
                        destroy();
                    }
                } catch(e){}
            });

            // Delay hide on blur to allow button clicks to register first
            editor.on('blur', function() {
                setTimeout(function() {
                    var ae = document.activeElement;
                    if (ae && ae.closest &&
                        (ae.closest('.bc-tbl-toolbar') || ae.closest('.bc-tbl-col-handle'))) {
                        return; // Focus is on our controls - keep showing
                    }
                    destroy();
                }, 250);
            });

            // Reposition on scroll
            editor.on('ScrollContent scroll', function() {
                if (_cur && _tb) { var t = _cur; _cur = null; build(editor, t); }
            });

            console.log('[BC-TABLE-FINAL] Hooked editor:', editor.id);
        }

        function attachHooks() {
            if (typeof tinymce === 'undefined') {
                setTimeout(attachHooks, 300);
                return;
            }
            // Hook existing editors
            tinymce.get().forEach(hookEditor);
            // Hook any future editors
            tinymce.on('AddEditor', function(e) { hookEditor(e.editor); });
            console.log('[BC-TABLE-FINAL] Ready. Editors:', tinymce.get().length);
        }
        attachHooks();

        // Cleanup on modal close (ESC key)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') destroy();
        });

        // Reposition on window scroll/resize
        window.addEventListener('scroll', function() {
            if (_cur && _tb) {
                var t = _cur; _cur = null;
                if (tinymce && tinymce.activeEditor) build(tinymce.activeEditor, t);
            }
        }, true);
        window.addEventListener('resize', function() {
            if (_cur && _tb) {
                var t = _cur; _cur = null;
                if (tinymce && tinymce.activeEditor) build(tinymce.activeEditor, t);
            }
        });

    })();
    </script>
`;

files.forEach(function(f) {
    if (!fs.existsSync(f)) { console.log('SKIP:', f); return; }
    let html = fs.readFileSync(f, 'utf8');

    // Remove all previous versions of our table script
    html = html.replace(/<script id="bc-table-(?:controls-v\d+|final)"[\s\S]*?<\/script>\s*/g, '');

    // Guard any old calls to bcRenderTableControls/bcRemoveTableControls
    html = html.replace(/window\.bcRenderTableControls\s*&&\s*window\.bcRenderTableControls\([^)]+\)/g, '/* removed */');
    html = html.replace(/window\.bcRenderTableControls\([^)]+\)/g, '/* removed */');
    html = html.replace(/window\.bcRemoveTableControls\s*&&\s*window\.bcRemoveTableControls\(\)/g, '/* removed */');
    html = html.replace(/window\.bcRemoveTableControls\(\)/g, '/* removed */');

    // Remove leftover injected blocks
    html = html.replace(/\/\/ === BC TABLE CONTROLS[\s\S]*?\/\/ === END BC TABLE CONTROLS ===/g, '');
    html = html.replace(/\/\/ === EVENT BYPASS[\s\S]*?\/\/ === END EVENT BYPASS ===/g, '');

    // Inject before </body>
    const bodyClose = html.lastIndexOf('</body>');
    if (bodyClose === -1) {
        html += tableScript;
    } else {
        html = html.substring(0, bodyClose) + tableScript + '\n</body>' + html.substring(bodyClose + 7);
    }

    fs.writeFileSync(f, html);
    console.log('Done:', f, Math.round(html.length/1024)+'kb');
});
