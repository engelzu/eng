const fs = require('fs');
const files = ['business-case.html', 'OUT/business-case.html'];

for (const f of files) {
  let html = fs.readFileSync(f, 'utf8');

  // Find the list section and replace it
  const startMarker = "// --- List commands";
  const endMarker = "return _bcOrigExec(cmd, ui, val);";

  const startIdx = html.indexOf(startMarker);
  const endIdx = html.indexOf(endMarker, startIdx);

  if (startIdx < 0 || endIdx < 0) {
    console.log('List section not found in ' + f);
    continue;
  }

  const newSection = `// --- List commands (manual DOM with saved range fallback) ---
                if (cmd === 'insertOrderedList' || cmd === 'insertUnorderedList') {
                    var ce = document.querySelector('[contenteditable="true"]');
                    if (!ce) return _bcOrigExec(cmd, ui, val);
                    var sel = window.getSelection();
                    // Restore saved range if selection is empty
                    if ((!sel.rangeCount || sel.isCollapsed === undefined) && typeof _bcSavedRange !== 'undefined' && _bcSavedRange) {
                        try { sel.removeAllRanges(); sel.addRange(_bcSavedRange); } catch(e) {}
                        _bcSavedRange = null;
                    }
                    var tag = cmd === 'insertOrderedList' ? 'OL' : 'UL';
                    var li = document.createElement('li');
                    li.innerHTML = '\\u00A0';
                    var list = document.createElement(tag);
                    list.appendChild(li);
                    var inserted = false;
                    if (sel.rangeCount > 0) {
                        try {
                            var node = sel.getRangeAt(0).commonAncestorContainer;
                            if (node.nodeType === 3) node = node.parentNode;
                            if (ce.contains(node)) {
                                var range = sel.getRangeAt(0);
                                range.deleteContents();
                                range.insertNode(list);
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
                    return true;
                }
                
                return _bcOrigExec(cmd, ui, val);`;

  html = html.substring(0, startIdx) + newSection + html.substring(endIdx + endMarker.length);

  fs.writeFileSync(f, html);
  console.log('Updated list handling with saved range in ' + f);
}

console.log('Done!');
