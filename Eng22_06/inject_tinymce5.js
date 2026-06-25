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
    <script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>
    <style>
        /* Esconde o aviso de API Key do TinyMCE */
        .tox-notifications-container {
            display: none !important;
        }
    </style>
    <script>
        console.log('[TinyMCE] Inject script loaded v5');
        
        // Prevent focus loop when TinyMCE is inside a Bootstrap/React modal
        document.addEventListener('focusin', function(e) {
            if (e.target.closest('.tox-tinymce-aux, .moxman-window, .tam-assetmanager-root') !== null) {
                e.stopImmediatePropagation();
            }
        }, true);

        setInterval(() => {
            if (typeof tinymce === 'undefined') return;
            const textareas = document.querySelectorAll('textarea:not([data-tiny-init="true"])');
            if (textareas.length > 0) {
                textareas.forEach(ta => {
                    if (ta.style.display === 'none' || ta.offsetParent === null) return;
                    
                    ta.setAttribute('data-tiny-init', 'true');
                    if (!ta.id) ta.id = 'tinymce-' + Math.random().toString(36).substr(2, 9);
                    
                    try {
                        tinymce.init({
                            selector: '#' + ta.id,
                            menubar: false,
                            branding: false,
                            promotion: false,
                            plugins: 'lists link image table code',
                            toolbar: 'undo redo | bold italic underline | bullist numlist | alignleft aligncenter alignright alignjustify | link image table | code',
                            paste_data_images: true,
                            height: 250,
                            setup: function (editor) {
                                editor.on('change keyup blur', function () {
                                    editor.save();
                                    const taElement = editor.getElement();
                                    const event = new Event('input', { bubbles: true });
                                    const tracker = taElement._valueTracker;
                                    if (tracker) {
                                        tracker.setValue(taElement.value);
                                    }
                                    taElement.dispatchEvent(event);
                                    const changeEvent = new Event('change', { bubbles: true });
                                    taElement.dispatchEvent(changeEvent);
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
    
    // Remover o script antigo
    let cleaned = code.split('<!-- TinyMCE Script -->')[0];
    cleaned = cleaned.replace(/<\/body>\s*<\/html>\s*$/, '');
    cleaned = cleaned.trim();
    
    // Injetar o novo
    code = cleaned + '\\n' + scriptToInject + '\\n</body>\\n</html>';
    fs.writeFileSync(f, code);
    console.log('Injected Cloud TinyMCE v5 (with CSS fix) into ' + f);
  }
});
