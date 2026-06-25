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
    <script>
        console.log('[TinyMCE] Inject script loaded v4');
        setInterval(() => {
            if (typeof tinymce === 'undefined') return;
            const textareas = document.querySelectorAll('textarea:not([data-tiny-init="true"])');
            if (textareas.length > 0) {
                console.log('[TinyMCE] Found textareas to init:', textareas.length);
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
                            plugins: 'lists link table code',
                            toolbar: 'undo redo | bold italic underline | bullist numlist | alignleft aligncenter alignright alignjustify | link table | code',
                            height: 250,
                            setup: function (editor) {
                                editor.on('init', function() {
                                    console.log('[TinyMCE] Editor initialized successfully on', ta.id);
                                });
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
                        ta.removeAttribute('data-tiny-init'); // retry later
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
    console.log('Injected Cloud TinyMCE into ' + f);
  }
});
