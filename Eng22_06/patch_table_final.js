/**
 * PATCH FINAL - Abordagem definitiva:
 * 1. Remove todo código de tabela anterior
 * 2. Injeta UMA solução self-contained que usa tinymce.on('AddEditor') 
 *    para hookear cada editor diretamente, sem depender de initBcTinymce
 */
const fs = require('fs');

const files = ['business-case.html', 'OUT/business-case.html'];

const tableScript = `
    <script id="bc-table-final">
    /* BC Table Controls - Final Version */
    (function bcTableControls() {
        'use strict';

        var _tb  = null;   // toolbar element
        var _hnd = [];     // handle elements
        var _ov  = null;   // drag overlay
        var _cur = null;   // current table element

        /* ---------- Remove all overlays ---------- */
        function destroy() {
            if (_tb)  { _tb.remove();  _tb  = null; }
            _hnd.forEach(function(h) { try { h.remove(); } catch(e){} });
            _hnd = [];
            _cur = null;
        }

        /* ---------- Build toolbar + handles ---------- */
        function build(editor, table) {
            // Skip if same table already shown
            if (_cur === table && _tb && document.body.contains(_tb)) return;
            destroy();
            _cur = table;

            /* Position of TinyMCE iframe in viewport */
            var container = editor.getContainer();
            if (!container) return;
            var iframe = container.querySelector('iframe');
            if (!iframe) return;
            var ir = iframe.getBoundingClientRect();

            /* Position of table inside the iframe viewport */
            var tr = table.getBoundingClientRect();  // already in iframe-local coords

            /* === TOOLBAR === */
            var tb = document.createElement('div');
            tb.className = 'bc-tbl-toolbar';
            tb.style.cssText = [
                'position:fixed',
                'top:' + Math.max(2, ir.top + tr.top - 42) + 'px',
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
                {k:'btn',v:'↑ Acima',   cmd:'mceTableInsertRowBefore'},
                {k:'btn',v:'↓ Abaixo',  cmd:'mceTableInsertRowAfter'},
                {k:'btn',v:'✕ Del Lin', cmd:'mceTableDeleteRow'},
                {k:'sep'},
                {k:'label',v:'COLUNAS',c:'#60a5fa'},
                {k:'btn',v:'← Col.esq', cmd:'mceTableInsertColBefore'},
                {k:'btn',v:'→ Col.dir', cmd:'mceTableInsertColAfter'},
                {k:'btn',v:'✕ Del Col', cmd:'mceTableDeleteCol'},
                {k:'sep'},
                {k:'btn',v:'✕ Del Tab', cmd:'mceTableDelete', danger:true}
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
                    (function(cmd){ 
                        btn.addEventListener('click', function() {
                            try { editor.focus(); editor.execCommand(cmd); } catch(e){}
                            _cur = null; // trigger rebuild
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

            // Ensure table-layout:fixed + colgroup for resize
            if (table.style.tableLayout !== 'fixed') {
                var cws = cells.map(function(c){ return c.getBoundingClientRect().width; });
                var cg = table.querySelector('colgroup');
                if (!cg) {
                    cg = editor.getDoc().createElement('colgroup');
                    table.insertBefore(cg, table.firstChild);
                }
                cg.innerHTML = '';
                cws.forEach(function(w){
                    var col = editor.getDoc().createElement('col');
                    col.style.width = Math.max(20, Math.round(w)) + 'px';
                    cg.appendChild(col);
                });
                table.style.tableLayout = 'fixed';
                table.style.width = (table.offsetWidth||300) + 'px';
            }
            var cg2  = table.querySelector('colgroup');
            var cols = cg2 ? Array.from(cg2.querySelectorAll('col')) : [];

            cells.forEach(function(cell, idx) {
                var cr = cell.getBoundingClientRect();
                var hLeft = ir.left + cr.right - 9;
                var hTop  = ir.top  + cr.top;

                var h = document.createElement('div');
                h.className = 'bc-tbl-col-handle';
                h.style.cssText = [
                    'position:fixed',
                    'left:'+hLeft+'px',
                    'top:'+hTop+'px',
                    'width:18px',
                    'height:'+(cr.height+20)+'px',
                    'cursor:col-resize',
                    'z-index:2147483641',
                    'display:flex','flex-direction:column','align-items:center',
                    'pointer-events:auto','user-select:none'
                ].join(';');
                h.innerHTML =
                    '<div style="width:18px;height:18px;border-radius:50%;background:#f97316;'+
                    'color:#fff;display:flex;align-items:center;justify-content:center;'+
                    'font-size:10px;font-weight:bold;border:2px solid #fff;'+
                    'box-shadow:0 2px 8px rgba(0,0,0,.5);flex-shrink:0;">'+(idx+1)+'</div>'+
                    '<div style="width:2px;background:rgba(249,115,22,.4);flex:1;min-height:4px;margin-top:2px;"></div>';

                // Drag logic
                h.addEventListener('pointerdown', function(e) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    h.setPointerCapture(e.pointerId);
                    var sx = e.clientX;
                    var colEl = cols[idx];
                    if (!colEl) return;
                    var sw   = parseFloat(colEl.style.width) || cr.width;
                    var nxC  = cols[idx+1];
                    var nxW  = nxC ? (parseFloat(nxC.style.width) || (cells[idx+1]?cells[idx+1].getBoundingClientRect().width:60)) : null;
                    var stW  = table.offsetWidth;

                    _cur = null; // let polling redraw on move

                    function pmove(me) {
                        var dx = me.clientX - sx;
                        colEl.style.width = Math.max(20, sw+dx) + 'px';
                        if (nxC && nxW !== null) nxC.style.width = Math.max(20, nxW-dx) + 'px';
                        else table.style.width = (stW+dx) + 'px';
                        _cur = null;
                    }
                    function pup() {
                        h.removeEventListener('pointermove', pmove);
                        h.removeEventListener('pointerup', pup);
                        try { editor.fire('change'); } catch(ex){}
                    }
                    h.addEventListener('pointermove', pmove);
                    h.addEventListener('pointerup', pup);
                });

                document.body.appendChild(h);
                _hnd.push(h);
            });
        }

        /* ---------- Event bypass for Radix ---------- */
        var _bypassSel = '.bc-tbl-toolbar,.bc-tbl-col-handle';
        ['pointerdown','mousedown','click','touchstart'].forEach(function(en) {
            document.addEventListener(en, function(e) {
                try {
                    if (e.target && e.target.closest && e.target.closest(_bypassSel)) {
                        e.stopImmediatePropagation();
                    }
                } catch(ex){}
            }, true);
        });

        // Node.prototype.contains patch - faz Radix achar que cliques nos controles sao dentro do modal
        (function(){
            var _oc = Node.prototype.contains;
            var _my = '.bc-tbl-toolbar,.bc-tbl-col-handle,.tox-tinymce-aux,.tox-tinymce,.tox-pop';
            Node.prototype.contains = function(other) {
                try {
                    var n = other;
                    if (n && n.nodeType === 3) n = n.parentNode;
                    if (n && n.nodeType === 1 && n.closest) {
                        if (n.closest(_my)) {
                            if (this.nodeType === 1 && !this.closest(_my)) return true;
                        }
                    }
                } catch(ex){}
                return _oc.call(this, other);
            };
        })();

        /* ---------- Hook via tinymce.on('AddEditor') ---------- */
        /* This fires for EVERY editor TinyMCE creates, regardless of initBcTinymce */
        function hookEditor(editor) {
            editor.on('NodeChange click keyup', function() {
                try {
                    var n = editor.selection.getNode();
                    // walk up to find TABLE
                    var el = n;
                    while (el && el.nodeName !== 'BODY') {
                        if (el.nodeName === 'TABLE') { build(editor, el); return; }
                        el = el.parentElement;
                    }
                    // Not in a table - check if focus is on our controls
                    var ae = document.activeElement;
                    var onCtrl = ae && ae.closest && ae.closest(_bypassSel);
                    if (!onCtrl) destroy();
                } catch(e){}
            });
            editor.on('blur', function() {
                setTimeout(function() {
                    var ae = document.activeElement;
                    if (!ae || !ae.closest || !ae.closest(_bypassSel)) destroy();
                }, 200);
            });
            editor.on('ScrollContent scroll', function() {
                // Reposition
                try {
                    var n = editor.selection.getNode();
                    var el = n; while(el && el.nodeName !== 'BODY') { if(el.nodeName==='TABLE'){_cur=null;build(editor,el);return;} el=el.parentElement; }
                } catch(e){}
            });
        }

        /* Try to hook now (if tinymce is already loaded) and on AddEditor */
        function attachHooks() {
            if (typeof tinymce === 'undefined') { setTimeout(attachHooks, 300); return; }
            // Hook all currently existing editors
            tinymce.get().forEach(hookEditor);
            // Hook future editors
            tinymce.on('AddEditor', function(e) { hookEditor(e.editor); });
            console.log('[BC-TABLE-FINAL] Hooks attached, editors:', tinymce.get().length);
        }
        attachHooks();

        /* Also cleanup on ESC */
        document.addEventListener('keydown', function(e){ if(e.key==='Escape') destroy(); });
    })();
    </script>
`;

files.forEach(function(f) {
    if (!fs.existsSync(f)) { console.log('SKIP:', f); return; }
    let html = fs.readFileSync(f, 'utf8');

    // Remove ALL previous table control script tags
    html = html.replace(/<script id="bc-table-controls-v\d+"[\s\S]*?<\/script>\s*/g, '');
    html = html.replace(/<script id="bc-table-final"[\s\S]*?<\/script>\s*/g, '');

    // Fix broken setup function calls (bcRenderTableControls -> noop)
    html = html.replace(
        /window\.bcRenderTableControls\(editor,\s*tbl\)/g,
        'window.bcRenderTableControls && window.bcRenderTableControls(editor, tbl)'
    );
    html = html.replace(
        /window\.bcRemoveTableControls\(\)/g,
        'window.bcRemoveTableControls && window.bcRemoveTableControls()'
    );

    // Remove leftover injected table controls blocks
    html = html.replace(/\/\/ === BC TABLE CONTROLS \(toolbar[\s\S]*?\/\/ === END BC TABLE CONTROLS ===/g, '');
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
