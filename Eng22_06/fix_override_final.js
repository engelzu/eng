const fs = require('fs');
const files = ['business-case.html', 'OUT/business-case.html'];

for (const f of files) {
  let html = fs.readFileSync(f, 'utf8');

  // Find the document.execCommand function body inside the override IIFE
  // We'll replace everything from "document.execCommand = function(cmd, ui, val) {"
  // to the matching closing "};" (before the ending "})();")
  
  const funcStart = 'document.execCommand = function(cmd, ui, val) {';
  const funcEnd = 'return _bcOrigExec(cmd, ui, val);\n            };';

  const startIdx = html.indexOf(funcStart);
  const endIdx = html.indexOf(funcEnd, startIdx);

  if (startIdx < 0 || endIdx < 0) {
    console.log('execCommand function not found in ' + f + ', checking...');
    const altStart = html.indexOf('document.execCommand = function');
    if (altStart >= 0) {
      console.log('Found at ' + altStart);
      console.log(html.substring(altStart, altStart + 100));
    }
    continue;
  }

  const newFunc = `document.execCommand = function(cmd, ui, val) {
                // Restore saved selection if current selection is empty
                var sel = window.getSelection();
                if ((!sel.rangeCount || sel.isCollapsed === undefined) && typeof _bcSavedRange !== 'undefined' && _bcSavedRange) {
                    try { sel.removeAllRanges(); sel.addRange(_bcSavedRange); } catch(e) {}
                    _bcSavedRange = null;
                }
                
                // --- Image alignment ---
                if (cmd === 'justifyLeft' || cmd === 'justifyCenter' || cmd === 'justifyRight' || cmd === 'justifyFull') {
                    if (sel.rangeCount > 0) {
                        try {
                            var node = sel.getRangeAt(0).commonAncestorContainer;
                            if (node.nodeType === 3) node = node.parentNode;
                            var img = node.tagName === 'IMG' ? node : (node.querySelector ? node.querySelector('img') : null);
                            if (img) {
                                var wrap = img.closest ? img.closest('div, p') : null;
                                if (wrap) {
                                    wrap.style.textAlign = cmd.replace('justify', '').toLowerCase();
                                    var ce = wrap.closest('[contenteditable]') || document.querySelector('[contenteditable]');
                                    if (ce) ce.dispatchEvent(new Event('input', { bubbles: true }));
                                    return true;
                                }
                            }
                        } catch(e) {}
                    }
                }
                
                // --- Lists (manual DOM) ---
                if (cmd === 'insertOrderedList' || cmd === 'insertUnorderedList') {
                    var ce = document.querySelector('[contenteditable="true"]');
                    if (!ce) return _bcOrigExec(cmd, ui, val);
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
                
                return _bcOrigExec(cmd, ui, val);
            };`;

  html = html.substring(0, startIdx) + newFunc + html.substring(endIdx + funcEnd.length);

  fs.writeFileSync(f, html);
  console.log('Replaced execCommand function in ' + f);
}

console.log('Done!');
