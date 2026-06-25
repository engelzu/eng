const fs = require('fs');
const files = ['business-case.html', 'OUT/business-case.html'];

const BULLET = '\u2022';

for (const f of files) {
  let html = fs.readFileSync(f, 'utf8');

  const marker = '// Save selection on toolbar mousedown';
  const markerIdx = html.indexOf(marker);
  
  if (markerIdx < 0) {
    console.log('Marker not found in ' + f);
    continue;
  }

  // Update the existing mousedown listener to also store range globally
  const oldListener = "if (btn) {\n                    var sel = window.getSelection();\n                    if (sel.rangeCount > 0) {\n                        var ce = document.querySelector('[contenteditable=\"true\"]');\n                        if (ce && ce.contains(sel.getRangeAt(0).commonAncestorContainer)) {\n                            _bcSavedRange = sel.getRangeAt(0).cloneRange();\n                            e.preventDefault();\n                        }\n                    }\n                }";
  const newListener = "if (btn) {\n                    var sel = window.getSelection();\n                    if (sel.rangeCount > 0) {\n                        var ce = document.querySelector('[contenteditable=\"true\"]');\n                        if (ce && ce.contains(sel.getRangeAt(0).commonAncestorContainer)) {\n                            _bcSavedRange = sel.getRangeAt(0).cloneRange();\n                            window._bcSavedRange = _bcSavedRange;\n                            e.preventDefault();\n                        }\n                    }\n                }";

  if (html.includes(oldListener)) {
    html = html.replace(oldListener, newListener);
  }

  // Inject the direct click handler and insertList function
  const injectCode = `
        // Direct toolbar click handler for list buttons
        document.addEventListener('click', function(e) {
            var btn = e.target.closest('.bc-editor-toolbar button');
            if (!btn) return;
            var text = btn.textContent.trim();
            if (text === '${BULLET}') {
                e.preventDefault();
                e.stopPropagation();
                insertList('UL');
                return;
            }
            if (text === '1.') {
                e.preventDefault();
                e.stopPropagation();
                insertList('OL');
                return;
            }
        }, true);

        function insertList(tag) {
            var ce = document.querySelector('[contenteditable="true"]');
            if (!ce) return;
            var sel = window.getSelection();
            var range = window._bcSavedRange || (sel.rangeCount > 0 ? sel.getRangeAt(0) : null);
            window._bcSavedRange = null;
            var li = document.createElement('li');
            li.innerHTML = '\\u00A0';
            var list = document.createElement(tag);
            list.appendChild(li);
            var inserted = false;
            if (range) {
                try {
                    var node = range.commonAncestorContainer;
                    if (node.nodeType === 3) node = node.parentNode;
                    if (ce.contains(node)) {
                        var r = range.cloneRange();
                        r.deleteContents();
                        r.insertNode(list);
                        inserted = true;
                    }
                } catch(e) {}
            }
            if (!inserted) {
                ce.appendChild(list);
            }
            try {
                var nr = document.createRange();
                nr.setStart(li, 0); nr.collapse(true);
                sel.removeAllRanges(); sel.addRange(nr);
            } catch(e) {}
            ce.dispatchEvent(new Event('input', { bubbles: true }));
        }
`;

  html = html.substring(0, markerIdx) + injectCode + html.substring(markerIdx);

  fs.writeFileSync(f, html);
  console.log('Injected direct list handler in ' + f);
}

console.log('Done!');
