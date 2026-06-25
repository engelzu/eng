const fs = require('fs');

const htmlFiles = [
  'fast.html',
  'OUT/fast.html',
  'business-case.html',
  'OUT/business-case.html',
  'index.html',
  'OUT/index.html'
];

const scriptToInject = `
    <!-- TinyMCE Script -->
    <script src="https://cdn.jsdelivr.net/npm/tinymce@6.8.2/tinymce.min.js"></script>
    <style>
        .tox-notifications-container { display: none !important; }
        .tox-promotion { display: none !important; }
        /* Fix for Radix/Tailwind modals that add pointer-events: none to body */
        .tox-tinymce-aux {
            pointer-events: auto !important;
            z-index: 9999999 !important;
        }
        /* Prevent tables and editors from overflowing container width */
        .tox-tinymce {
            max-width: 100% !important;
        }
        table {
            max-width: 100% !important;
            width: 100% !important;
            table-layout: auto !important;
        }
        img {
            max-width: 100% !important;
            height: auto !important;
        }
    </style>
    <script type="module">
        import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
        import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';

        const firebaseConfig = {
            apiKey: atob("QUl6YVN5QkRmTXRrMG9CQWROd1VKMUpPWDJtd1VQU0txMjZsNkt3"),
            authDomain: "studio-2837535581-1b461.firebaseapp.com",
            projectId: "studio-2837535581-1b461",
            storageBucket: "studio-2837535581-1b461.firebasestorage.app",
            messagingSenderId: "734126703234",
            appId: "1:734126703234:web:b5e076685289c0f43fea9b"
        };

        const app = getApps().length === 0 ? initializeApp(firebaseConfig, 'bc-tiny-storage') : getApps().find(a => a.name === 'bc-tiny-storage') || initializeApp(firebaseConfig, 'bc-tiny-storage');
        const storage = getStorage(app);

        console.log('[TinyMCE] Inject script loaded v6 (Open Source CDN with Firebase Storage Support)');
        
        // ULTIMATE FIX FOR REACT FOCUS TRAP INFINITE LOOPS
        // Monkey-patch HTMLElement.prototype.focus to prevent the React modal from stealing focus
        // while a TinyMCE dialog (like Insert Image or Link) is open.
        if (!window._tinymceFocusPatched) {
            window._tinymceFocusPatched = true;
            const originalFocus = HTMLElement.prototype.focus;
            HTMLElement.prototype.focus = function(options) {
                try {
                    if (this.ownerDocument !== window.document) return originalFocus.call(this, options);
                    if (!window.document.contains(this)) return originalFocus.call(this, options);
                    
                    if (!this.closest('.tox-tinymce-aux') && !this.closest('.tox-tinymce')) {
                        const aux = document.querySelector('.tox-tinymce-aux');
                        if (aux && aux.innerHTML.trim() !== '') {
                            return; // Block focus steal if ANY TinyMCE popup is open!
                        }
                    }
                } catch (e) {
                    console.error('[TinyMCE-Patch Error]', e);
                }
                return originalFocus.call(this, options);
            };

            // THE ULTIMATE BYPASS: SPOOFING NODE.CONTAINS
            // React and Radix use modalRef.current.contains(event.target) to detect outside clicks.
            // By patching contains, we force it to return true whenever the click target is inside TinyMCE!
            // This prevents the modal from closing, WITHOUT intercepting any events, allowing TinyMCE's math to work perfectly!
            if (!window._tinymceContainsPatch) {
                window._tinymceContainsPatch = true;
                const originalContains = Node.prototype.contains;
                // Selector covering TinyMCE UI AND our custom table controls
                const _bcTinySelectors = '.tox-tinymce-aux, .tox-tinymce, .tox-pop, .tiny-ui-container, .bc-tbl-toolbar, .bc-tbl-col-handle';
                Node.prototype.contains = function(otherNode) {
                    try {
                        let targetNode = otherNode;
                        if (targetNode && targetNode.nodeType === Node.TEXT_NODE) {
                            targetNode = targetNode.parentNode;
                        }
                        if (targetNode && targetNode.nodeType === Node.ELEMENT_NODE) {
                            // If the target is part of TinyMCE OR our custom table controls...
                            if (targetNode.closest(_bcTinySelectors)) {
                                // And the element calling contains() is NOT TinyMCE itself (e.g. it's the Radix Modal)
                                if (this.nodeType === Node.ELEMENT_NODE && !this.closest(_bcTinySelectors)) {
                                    return true;
                                }
                            }
                        }
                    } catch (e) {}
                    return originalContains.call(this, otherNode);
                };

                // Also block pointerdown/mousedown from Radix when target is our custom controls
                document.addEventListener('pointerdown', function(e) {
                    try {
                        if (e.target && e.target.closest && e.target.closest('.bc-tbl-toolbar, .bc-tbl-col-handle')) {
                            e.stopImmediatePropagation();
                        }
                    } catch(ex) {}
                }, true);
                document.addEventListener('mousedown', function(e) {
                    try {
                        if (e.target && e.target.closest && e.target.closest('.bc-tbl-toolbar, .bc-tbl-col-handle')) {
                            e.stopImmediatePropagation();
                        }
                    } catch(ex) {}
                }, true);
            }
        }

        // Global function to force-sync all TinyMCE editors before BC save
        window.beforeBcSave = function() {
            window.__bcValues = {};
            if (typeof tinymce !== 'undefined' && tinymce.editors && tinymce.editors.length) {
                tinymce.editors.forEach(function(ed) {
                    try {
                        ed.save();
                        var ta = ed.getElement();
                        if (ta && ta.id) {
                            window.__bcValues[ta.id] = ed.getContent();
                        }
                    } catch(e) {}
                });
            }
            console.log('[BC-TINY] beforeBcSave called. __bcValues keys:', Object.keys(window.__bcValues));
        };

        // BC Custom Table Controls inside TinyMCE
        window._bcActiveTableToolbar = null;
        window._bcActiveTableHandles = [];

        function removeTableControls() {
            if (window._bcActiveTableToolbar) {
                window._bcActiveTableToolbar.remove();
                window._bcActiveTableToolbar = null;
            }
            if (window._bcActiveTableHandles) {
                window._bcActiveTableHandles.forEach(h => h.remove());
                window._bcActiveTableHandles = [];
            }
        }

        function renderTableControls(editor, table) {
            removeTableControls();
            
            const iframe = editor.getContainer().querySelector('iframe');
            if (!iframe) return;
            
            const iframeRect = iframe.getBoundingClientRect();
            
            // 1. Render Table Toolbar
            const toolbar = document.createElement('div');
            toolbar.className = 'bc-tbl-toolbar';
            toolbar.style.cssText = \`
                position: absolute;
                display: flex;
                gap: 6px;
                padding: 6px 12px;
                background: #1e293b;
                border-radius: 8px;
                color: white;
                font-family: sans-serif;
                font-size: 11px;
                z-index: 2147483640;
                align-items: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                pointer-events: auto;
                user-select: none;
            \`;
            
            toolbar.innerHTML = \`
                <span style="color: #4ade80; font-weight: bold; margin-right: 4px; font-size: 10px; letter-spacing: 0.05em;">LINHAS</span>
                <button type="button" class="bc-tbl-btn" data-action="row-above" style="background: #334155; border: none; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold;">↑ Linha acima</button>
                <button type="button" class="bc-tbl-btn" data-action="row-below" style="background: #334155; border: none; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold;">↓ Linha abaixo</button>
                <button type="button" class="bc-tbl-btn" data-action="row-del" style="background: #334155; border: none; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold;">✕ Del Linha</button>
                <div style="width: 1px; background: #475569; height: 16px; margin: 0 4px;"></div>
                <span style="color: #60a5fa; font-weight: bold; margin-right: 4px; font-size: 10px; letter-spacing: 0.05em;">COLUNAS</span>
                <button type="button" class="bc-tbl-btn" data-action="col-left" style="background: #334155; border: none; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold;">← Col.esq</button>
                <button type="button" class="bc-tbl-btn" data-action="col-right" style="background: #334155; border: none; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold;">→ Col.dir</button>
                <button type="button" class="bc-tbl-btn" data-action="col-del" style="background: #334155; border: none; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold;">✕ Del Col</button>
                <div style="width: 1px; background: #475569; height: 16px; margin: 0 4px;"></div>
                <button type="button" class="bc-tbl-btn" data-action="tbl-del" style="background: #ef4444; border: none; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold;">✕ Del Tabela</button>
            \`;
            
            const tableRect = table.getBoundingClientRect();
            const toolbarTop = iframeRect.top + window.scrollY + tableRect.top - 45;
            const toolbarLeft = iframeRect.left + window.scrollX + tableRect.left;
            toolbar.style.top = toolbarTop + 'px';
            toolbar.style.left = toolbarLeft + 'px';
            
            document.body.appendChild(toolbar);
            window._bcActiveTableToolbar = toolbar;
            
            toolbar.querySelectorAll('.bc-tbl-btn').forEach(btn => {
                btn.addEventListener('mousedown', e => e.preventDefault());
                btn.addEventListener('click', () => {
                    const action = btn.getAttribute('data-action');
                    editor.focus();
                    if (action === 'row-above') editor.execCommand('mceTableInsertRowBefore');
                    if (action === 'row-below') editor.execCommand('mceTableInsertRowAfter');
                    if (action === 'row-del') editor.execCommand('mceTableDeleteRow');
                    if (action === 'col-left') editor.execCommand('mceTableInsertColBefore');
                    if (action === 'col-right') editor.execCommand('mceTableInsertColAfter');
                    if (action === 'col-del') editor.execCommand('mceTableDeleteCol');
                    if (action === 'tbl-del') editor.execCommand('mceTableDelete');
                    
                    setTimeout(() => {
                        const activeTable = editor.dom.getParent(editor.selection.getStart(), 'table');
                        if (activeTable) {
                            renderTableControls(editor, activeTable);
                        } else {
                            removeTableControls();
                        }
                    }, 50);
                });
            });
            
            // 2. Render Column Handles with Numbers
            const firstRow = table.querySelector('tr');
            if (!firstRow) return;
            
            const cells = Array.from(firstRow.cells);
            
            if (table.style.tableLayout !== 'fixed') {
                const cellWidths = cells.map(c => c.getBoundingClientRect().width);
                let colgroup = table.querySelector('colgroup');
                if (!colgroup) {
                    colgroup = editor.getDoc().createElement('colgroup');
                    table.insertBefore(colgroup, table.firstChild);
                }
                colgroup.innerHTML = '';
                cellWidths.forEach(w => {
                    const col = editor.getDoc().createElement('col');
                    col.style.width = Math.round(w) + 'px';
                    colgroup.appendChild(col);
                });
                table.style.tableLayout = 'fixed';
                table.style.width = table.offsetWidth + 'px';
            }
            
            const colgroup = table.querySelector('colgroup');
            const cols = colgroup ? Array.from(colgroup.querySelectorAll('col')) : [];
            
            cells.forEach((cell, idx) => {
                const handle = document.createElement('div');
                handle.className = 'bc-tbl-col-handle';
                handle.style.cssText = \`
                    position: absolute;
                    width: 14px;
                    cursor: col-resize;
                    z-index: 2147483641;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    user-select: none;
                    touch-action: none;
                    pointer-events: auto;
                \`;
                
                handle.innerHTML = \`
                    <div style="width: 16px; height: 16px; border-radius: 50%; background: #f97316; color: white; display: flex; align-items: center; justify-content: center; font-family: sans-serif; font-size: 10px; font-weight: bold; border: 1px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.25);">\${idx + 1}</div>
                    <div style="width: 2px; background: rgba(249, 115, 22, 0.35); flex: 1; border-left: 1px solid rgba(249, 115, 22, 0.2); border-right: 1px solid rgba(249, 115, 22, 0.2); min-height: 20px; margin-top: 2px;"></div>
                \`;
                
                const cellRect = cell.getBoundingClientRect();
                handle.style.left = (iframeRect.left + window.scrollX + cellRect.right - 7) + 'px';
                handle.style.top = (iframeRect.top + window.scrollY + cellRect.top) + 'px';
                handle.style.height = (cellRect.height + 16) + 'px';
                
                const line = handle.querySelector('div:last-child');
                if (line) line.style.height = cellRect.height + 'px';
                
                document.body.appendChild(handle);
                window._bcActiveTableHandles.push(handle);
                
                handle.addEventListener('mousedown', e => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const startX = e.clientX;
                    const colEl = cols[idx];
                    if (!colEl) return;
                    
                    const startW = parseFloat(colEl.style.width) || cell.getBoundingClientRect().width;
                    const nextCol = cols[idx + 1];
                    const nextStartW = nextCol ? (parseFloat(nextCol.style.width) || firstRow.cells[idx + 1].getBoundingClientRect().width) : null;
                    const startTableW = table.offsetWidth;
                    
                    const overlay = document.createElement('div');
                    overlay.style.cssText = \`
                        position: fixed;
                        inset: 0;
                        z-index: 2147483647;
                        cursor: col-resize;
                        background: transparent;
                        user-select: none;
                        pointer-events: auto;
                    \`;
                    document.body.appendChild(overlay);
                    
                    function onMouseMove(moveEvt) {
                        const delta = moveEvt.clientX - startX;
                        const newW = Math.max(20, startW + delta);
                        colEl.style.width = newW + 'px';
                        
                        if (nextCol && nextStartW !== null) {
                            nextCol.style.width = Math.max(20, nextStartW - delta) + 'px';
                        } else {
                            table.style.width = (startTableW + (newW - startW)) + 'px';
                        }
                        
                        setTimeout(() => {
                            renderTableControls(editor, table);
                        }, 0);
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
        }

        // Window resize/scroll global listeners to update overlays
        window.addEventListener('scroll', () => {
            if (typeof tinymce !== 'undefined' && tinymce.activeEditor) {
                const table = tinymce.activeEditor.dom.getParent(tinymce.activeEditor.selection.getStart(), 'table');
                if (table) {
                    renderTableControls(tinymce.activeEditor, table);
                }
            }
        }, true);
        window.addEventListener('resize', () => {
            if (typeof tinymce !== 'undefined' && tinymce.activeEditor) {
                const table = tinymce.activeEditor.dom.getParent(tinymce.activeEditor.selection.getStart(), 'table');
                if (table) {
                    renderTableControls(tinymce.activeEditor, table);
                }
            }
        });

        setInterval(() => {
            if (typeof tinymce === 'undefined') return;
            const textareas = document.querySelectorAll('textarea.bc-tinymce:not([data-tiny-init="true"])');
            if (textareas.length > 0) {
                textareas.forEach(ta => {
                    if (ta.style.display === 'none' || ta.offsetParent === null) return;
                    
                    ta.setAttribute('data-tiny-init', 'true');
                    if (!ta.id) ta.id = 'tinymce-' + Math.random().toString(36).substr(2, 9);
                    try {
                        tinymce.init({
                            target: ta,
                            menubar: false,
                            branding: false,
                            promotion: false,
                            plugins: 'lists link image table code autoresize',
                            toolbar: 'undo redo | bold italic underline | bullist numlist | alignleft aligncenter alignright alignjustify | link customimage table | code',
                            paste_data_images: true,
                            min_height: 300, max_height: 1200,
                            object_resizing: true,
                            table_resize_bars: true,
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px } table { max-width: 100%; } img { max-width: 100%; height: auto; }',
                            setup: function (editor) {
                                editor.on('click keyup NodeChange', function () {
                                    const table = editor.dom.getParent(editor.selection.getStart(), 'table');
                                    if (table) {
                                        renderTableControls(editor, table);
                                    } else {
                                        removeTableControls();
                                    }
                                });
                                editor.on('blur', function () {
                                    setTimeout(() => {
                                        const activeEl = document.activeElement;
                                        if (activeEl && (activeEl.closest('.bc-tbl-toolbar') || activeEl.closest('.bc-tbl-col-handle'))) {
                                            return;
                                        }
                                        removeTableControls();
                                    }, 150);
                                });
                                editor.on('Scroll', function () {
                                    const table = editor.dom.getParent(editor.selection.getStart(), 'table');
                                    if (table) {
                                        renderTableControls(editor, table);
                                    }
                                });

                                editor.ui.registry.addButton('customimage', {
                                    icon: 'image',
                                    tooltip: 'Insert Image',
                                    onAction: function () {
                                        const input = document.createElement('input');
                                        input.setAttribute('type', 'file');
                                        input.setAttribute('accept', 'image/*');
                                        input.onchange = async function () {
                                            const file = this.files[0];
                                            if (!file) return;
                                            
                                            editor.insertContent('<span id="temp-upload-placeholder">Enviando imagem...</span>');
                                            
                                            try {
                                                const uniqueName = 'business-cases/images/' + Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9\\._-]/g, '_');
                                                const storageRef = ref(storage, uniqueName);
                                                
                                                await uploadBytes(storageRef, file);
                                                const downloadUrl = await getDownloadURL(storageRef);
                                                
                                                const placeholder = editor.dom.select('#temp-upload-placeholder')[0];
                                                if (placeholder) {
                                                    editor.dom.setOuterHTML(placeholder, '<img src="' + downloadUrl + '" alt="' + file.name.replace(/"/g, "") + '" style="max-width: 100%; height: auto;" />');
                                                } else {
                                                    editor.insertContent('<img src="' + downloadUrl + '" alt="' + file.name.replace(/"/g, "") + '" style="max-width: 100%; height: auto;" />');
                                                }
                                            } catch (err) {
                                                console.error('Failed to upload image:', err);
                                                const placeholder = editor.dom.select('#temp-upload-placeholder')[0];
                                                if (placeholder) {
                                                    editor.dom.setOuterHTML(placeholder, '<span style="color: red;">Erro ao carregar imagem</span>');
                                                }
                                            }
                                        };
                                        input.click();
                                    }
                                });

                                editor.on('change keyup blur', function () {
                                    editor.save();
                                });
                            }
                        });
                    } catch (err) {
                        console.error('[TinyMCE] Failed to init on', ta.id, err);
                        ta.removeAttribute('data-tiny-init');
                    }
                });
            }
        }, 1000);
    </script>
`;

htmlFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    
    let cleaned = code.split('<!-- TinyMCE Script -->')[0];
    cleaned = cleaned.replace(/<\/body>\s*<\/html>\s*$/, '');
    cleaned = cleaned.trim();
    
    code = cleaned + '\\n' + scriptToInject + '\\n</body>\\n</html>';
    fs.writeFileSync(f, code);
    console.log('Injected Open Source TinyMCE v6 into ' + f);
  }
});
