const fs = require('fs');

const htmlFiles = [
  'fast.html',
  'OUT/fast.html',
  'business-case.html',
  'OUT/business-case.html'
];

const scriptToInject = `
    <!-- TinyMCE Script -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.2/tinymce.min.js" referrerpolicy="origin"></script>
    <script>
        console.log('[TinyMCE] Inject script loaded');
        // Usar um intervalo para garantir que o TinyMCE inicialize mesmo ap\u00f3s renderiza\u00e7\u00e3o do React
        setInterval(() => {
            if (typeof tinymce === 'undefined') return;
            const textareas = document.querySelectorAll('textarea.bc-tinymce:not([data-tiny-init="true"])');
            if (textareas.length > 0) {
                console.log('[TinyMCE] Found uninitialized textareas:', textareas.length);
                textareas.forEach(ta => {
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
    
    // Remove the old script block
    code = code.replace(/<!-- TinyMCE Script -->[\s\S]*?<\/script>\s*<\/script>/, '');
    code = code.replace(/<!-- TinyMCE Script -->[\s\S]*?<\/script>\s*<\/script>/, ''); // run twice just in case
    
    // Some regex might fail, let's just do a string split
    if (code.includes('<!-- TinyMCE Script -->')) {
        const parts = code.split('<!-- TinyMCE Script -->');
        const endParts = parts[1].split('</script>\n');
        // It had 2 scripts (the CDN and the inline script)
        endParts.shift(); // remove CDN
        endParts.shift(); // remove inline script
        code = parts[0] + endParts.join('</script>\n');
    }

    code = code.replace('</body>', scriptToInject + '\\n</body>');
    fs.writeFileSync(f, code);
    console.log('Injected updated TinyMCE into ' + f);
  }
});
