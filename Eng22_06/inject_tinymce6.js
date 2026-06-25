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
    </style>
    <script>
        console.log('[TinyMCE] Inject script loaded v6 (Open Source CDN)');
        
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
                Node.prototype.contains = function(otherNode) {
                    try {
                        let targetNode = otherNode;
                        if (targetNode && targetNode.nodeType === Node.TEXT_NODE) {
                            targetNode = targetNode.parentNode;
                        }
                        if (targetNode && targetNode.nodeType === Node.ELEMENT_NODE) {
                            // If the target is part of TinyMCE...
                            if (targetNode.closest('.tox-tinymce-aux, .tox-tinymce, .tox-pop, .tiny-ui-container')) {
                                // And the element calling contains() is NOT TinyMCE itself (e.g. it's the Radix Modal)
                                if (this.nodeType === Node.ELEMENT_NODE && !this.closest('.tox-tinymce-aux, .tox-tinymce, .tox-pop, .tiny-ui-container')) {
                                    return true;
                                }
                            }
                        }
                    } catch (e) {}
                    return originalContains.call(this, otherNode);
                };
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

        setInterval(() => {
            if (typeof tinymce === 'undefined') return;
            const textareas = document.querySelectorAll('textarea:not([data-tiny-init="true"])');
            if (textareas.length > 0) {
                textareas.forEach(ta => {
                    if (ta.style.display === 'none' || ta.offsetParent === null) return;
                    
                    ta.setAttribute('data-tiny-init', 'true');
                    // We don't need to force an ID anymore since we use target, but it's okay to have one
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
                            setup: function (editor) {
                                editor.ui.registry.addButton('customimage', {
                                    icon: 'image',
                                    tooltip: 'Insert Image',
                                    onAction: function () {
                                        const input = document.createElement('input');
                                        input.setAttribute('type', 'file');
                                        input.setAttribute('accept', 'image/*');
                                        input.onchange = function () {
                                            const file = this.files[0];
                                            const reader = new FileReader();
                                            reader.onload = function () {
                                                // Insert base64 directly, bypassing TinyMCE image dialog entirely
                                                editor.insertContent('<img src="' + reader.result + '" alt="' + file.name.replace(/"/g, '') + '" style="max-width: 100%; height: auto;" />');
                                            };
                                            reader.readAsDataURL(file);
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
