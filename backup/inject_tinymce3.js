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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.2/tinymce.min.js" referrerpolicy="origin"></script>
    <script>
        console.log('[TinyMCE] Inject script loaded v3');
        setInterval(() => {
            if (typeof tinymce === 'undefined') return;
            // Target ANY textarea in the DOM that hasn't been initialized
            // This bypasses the need for chunk patching to have worked or cache to be cleared for the chunk
            const textareas = document.querySelectorAll('textarea:not([data-tiny-init="true"]):not([style*="display: none"])');
            if (textareas.length > 0) {
                console.log('[TinyMCE] Found uninitialized textareas:', textareas.length);
                textareas.forEach(ta => {
                    // Only target textareas that are likely part of the BC modal (e.g. have a minimum height or rows)
                    // The textareas have rows="4" or are inside the modal
                    ta.setAttribute('data-tiny-init', 'true');
                    if (!ta.id) ta.id = 'tinymce-' + Math.random().toString(36).substr(2, 9);
                    
                    tinymce.init({
                        selector: '#' + ta.id,
                        menubar: false,
                        branding: false,
                        promotion: false,
                        plugins: 'lists link table code',
                        toolbar: 'undo redo | bold italic underline | bullist numlist | alignleft aligncenter alignright alignjustify | link table | code',
                        height: 200,
                        setup: function (editor) {
                            editor.on('init', function() {
                                console.log('[TinyMCE] Editor initialized on', ta.id);
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
                });
            }
        }, 1000);
    </script>
`;

htmlFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    
    // Cleanup previous scripts to avoid duplicates
    let cleaned = code.split('<!-- TinyMCE Script -->')[0];
    cleaned = cleaned.replace(/<\/body>\s*<\/html>\s*$/, '');
    
    code = cleaned + scriptToInject + '\\n</body>\\n</html>';
    fs.writeFileSync(f, code);
    console.log('Injected aggressive TinyMCE into ' + f);
  }
});
