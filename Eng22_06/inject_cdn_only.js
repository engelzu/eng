/**
 * Inject only the TinyMCE CDN + contains patch into business-case.html (backup version)
 * Does NOT add Firebase or conflicting TinyMCE init (backup already has its own)
 */
const fs = require('fs');

const files = [
    'C:/Users/user2/Downloads/EngV1/Eng25_06/Eng22_06/business-case.html',
    'C:/Users/user2/Downloads/EngV1/Eng25_06/Eng22_06/OUT/business-case.html'
];

const inject = `
    <!-- TinyMCE CDN -->
    <script src="https://cdn.jsdelivr.net/npm/tinymce@6.8.2/tinymce.min.js"></script>
    <style>
        .tox-notifications-container { display: none !important; }
        .tox-promotion { display: none !important; }
        .tox-tinymce-aux { pointer-events: auto !important; z-index: 9999999 !important; }
    </style>
    <script>
        /* Fix para Radix Modal interceptar cliques no TinyMCE */
        (function() {
            if (window._containsPatch) return;
            window._containsPatch = true;
            var orig = Node.prototype.contains;
            var sel = '.tox-tinymce-aux,.tox-tinymce,.tox-pop,.bc-tbl-toolbar,.bc-tbl-col-handle';
            Node.prototype.contains = function(other) {
                try {
                    var n = other;
                    if (n && n.nodeType === 3) n = n.parentNode;
                    if (n && n.nodeType === 1 && n.closest) {
                        if (n.closest(sel)) {
                            if (this.nodeType === 1 && !this.closest(sel)) return true;
                        }
                    }
                } catch(e){}
                return orig.call(this, other);
            };
        })();
    </script>
`;

files.forEach(function(f) {
    if (!fs.existsSync(f)) { console.log('SKIP:', f); return; }
    let html = fs.readFileSync(f, 'utf8');
    
    if (html.indexOf('tinymce.min.js') !== -1) {
        console.log('Already has TinyMCE CDN:', f);
        return;
    }
    
    // Inject after <head> tag or at start of body
    var headClose = html.indexOf('</head>');
    if (headClose !== -1) {
        html = html.substring(0, headClose) + inject + '\n</head>' + html.substring(headClose + 7);
    } else {
        // Inject at start of body
        var bodyOpen = html.indexOf('<body');
        var bodyEnd = html.indexOf('>', bodyOpen) + 1;
        html = html.substring(0, bodyEnd) + inject + html.substring(bodyEnd);
    }
    
    fs.writeFileSync(f, html);
    console.log('Injected TinyMCE CDN into:', f, Math.round(html.length/1024)+'kb');
});
