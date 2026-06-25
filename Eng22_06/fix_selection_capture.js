const fs = require('fs');
const files = ['business-case.html', 'OUT/business-case.html'];

for (const f of files) {
  let html = fs.readFileSync(f, 'utf8');

  // Update the capture listener to also preventDefault
  const oldListener = "document.addEventListener('mousedown', function(e) {\n                var btn = e.target.closest('.bc-editor-toolbar button, .bc-editor-toolbar select');\n                if (btn) {\n                    var sel = window.getSelection();\n                    if (sel.rangeCount > 0) {\n                        var ce = document.querySelector('[contenteditable=\"true\"]');\n                        if (ce && ce.contains(sel.getRangeAt(0).commonAncestorContainer)) {\n                            _bcSavedRange = sel.getRangeAt(0).cloneRange();\n                        }\n                    }\n                }\n            }, true);";

  const newListener = "document.addEventListener('mousedown', function(e) {\n                var btn = e.target.closest('.bc-editor-toolbar button, .bc-editor-toolbar select');\n                if (btn) {\n                    var sel = window.getSelection();\n                    if (sel.rangeCount > 0) {\n                        var ce = document.querySelector('[contenteditable=\"true\"]');\n                        if (ce && ce.contains(sel.getRangeAt(0).commonAncestorContainer)) {\n                            _bcSavedRange = sel.getRangeAt(0).cloneRange();\n                            e.preventDefault();\n                        }\n                    }\n                }\n            }, true);";

  if (html.includes(oldListener)) {
    html = html.replace(oldListener, newListener);
    fs.writeFileSync(f, html);
    console.log('Updated listener with preventDefault in ' + f);
  } else {
    console.log('Old listener pattern not found in ' + f + ', checking...');
    const idx = html.indexOf('_bcSavedRange');
    if (idx >= 0) {
      const snippetIdx = html.indexOf('e.target.closest', idx);
      if (snippetIdx >= 0) {
        console.log('Found at', snippetIdx, ':', html.substring(snippetIdx, snippetIdx + 100));
      }
    }
  }
}

console.log('Done!');
