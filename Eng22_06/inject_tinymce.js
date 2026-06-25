const fs = require('fs');

const chunks = [
  '_next/static/chunks/6120-99ba76de6fd208f3.js',
  'OUT/_next/static/chunks/6120-99ba76de6fd208f3.js'
];

chunks.forEach(f => {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    // Replaces the textarea class
    code = code.replace(/className:"w-full p-2 text-sm border border-slate-200 rounded outline-none focus:border-indigo-500 transition-all resize-y min-h-\[80px\]"/g, 'className:"bc-tinymce w-full p-2 text-sm border border-slate-200 rounded outline-none focus:border-indigo-500 transition-all resize-y min-h-[80px]"');
    fs.writeFileSync(f, code);
    console.log('Patched chunk ' + f);
  }
});

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
        // Prevent focus loop when TinyMCE is inside a Bootstrap/React modal
        document.addEventListener('focusin', function(e) {
            if (e.target.closest('.tox-tinymce-aux, .moxman-window, .tam-assetmanager-root') !== null) {
                e.stopImmediatePropagation();
            }
        }, true);

        document.addEventListener('DOMContentLoaded', () => {
            const observer = new MutationObserver((mutations) => {
                const textareas = document.querySelectorAll('textarea.bc-tinymce');
                textareas.forEach(ta => {
                    // Check if it's already initialized by checking if it has a style "display: none" which TinyMCE adds
                    if (ta.style.display === 'none') return;
                    
                    if (!ta.id) {
                        ta.id = 'tinymce-' + Math.random().toString(36).substr(2, 9);
                    }
                    if (!tinymce.get(ta.id)) {
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
                    }
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    </script>
`;

htmlFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    if (!code.includes('tinymce.min.js')) {
      code = code.replace('</body>', scriptToInject + '\\n</body>');
      fs.writeFileSync(f, code);
      console.log('Injected TinyMCE into ' + f);
    }
  }
});

// Also fix patch_bc.js for future runs
if (fs.existsSync('patch_bc.js')) {
  let patchCode = fs.readFileSync('patch_bc.js', 'utf8');
  patchCode = patchCode.replace(/className:"w-full p-2 text-sm border border-slate-200 rounded outline-none focus:border-indigo-500 transition-all resize-y min-h-\[80px\]"/g, 'className:"bc-tinymce w-full p-2 text-sm border border-slate-200 rounded outline-none focus:border-indigo-500 transition-all resize-y min-h-[80px]"');
  fs.writeFileSync('patch_bc.js', patchCode);
  console.log('Updated patch_bc.js');
}

console.log('TinyMCE injection completed.');
