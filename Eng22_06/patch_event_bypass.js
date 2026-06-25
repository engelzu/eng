const fs = require('fs');

const files = ['business-case.html', 'OUT/business-case.html'];

// Code to inject: event bypass for our custom table controls
const bypassCode = `
        // === EVENT BYPASS: Prevent Radix from blocking bc-tbl-toolbar and bc-tbl-col-handle clicks ===
        (function() {
            // 1. Extend Node.prototype.contains if already patched, or patch fresh
            var _bcCustomSelectors = '.tox-tinymce-aux, .tox-tinymce, .tox-pop, .bc-tbl-toolbar, .bc-tbl-col-handle';
            if (!window._bcEventBypassInstalled) {
                window._bcEventBypassInstalled = true;

                // Block Radix from seeing pointerdown/mousedown/click on our controls
                ['pointerdown', 'mousedown', 'click'].forEach(function(evtName) {
                    document.addEventListener(evtName, function(e) {
                        try {
                            if (e.target && typeof e.target.closest === 'function') {
                                if (e.target.closest('.bc-tbl-toolbar, .bc-tbl-col-handle')) {
                                    e.stopImmediatePropagation();
                                }
                            }
                        } catch(ex) {}
                    }, true); // capture phase - runs before React/Radix
                });

                // Patch Node.prototype.contains to make Radix think our controls are inside the modal
                var _origContains = Node.prototype.contains;
                Node.prototype.contains = function(otherNode) {
                    try {
                        var target = otherNode;
                        if (target && target.nodeType === 3) target = target.parentNode; // text node
                        if (target && target.nodeType === 1 && typeof target.closest === 'function') {
                            if (target.closest(_bcCustomSelectors)) {
                                if (this.nodeType === 1 && !this.closest(_bcCustomSelectors)) {
                                    return true;
                                }
                            }
                        }
                    } catch(ex) {}
                    return _origContains.call(this, otherNode);
                };
            }
        })();
        // === END EVENT BYPASS ===
`;

// Inject just before </body>
files.forEach(function(f) {
    if (!fs.existsSync(f)) { console.log('SKIP:', f); return; }
    let html = fs.readFileSync(f, 'utf8');

    if (html.indexOf('_bcEventBypassInstalled') !== -1) {
        console.log('Already has event bypass:', f);
        return;
    }

    // Find our table controls section and inject the bypass BEFORE it
    const marker = '// === BC TABLE CONTROLS';
    const idx = html.indexOf(marker);
    if (idx === -1) {
        console.log('WARNING: marker not found in', f);
        return;
    }

    html = html.substring(0, idx) + bypassCode + '\n        ' + html.substring(idx);
    fs.writeFileSync(f, html);
    console.log('Injected event bypass into:', f);
});
