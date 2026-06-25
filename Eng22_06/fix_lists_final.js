const fs = require('fs');
const files = ['business-case.html', 'OUT/business-case.html'];

for (const f of files) {
  let html = fs.readFileSync(f, 'utf8');

  // Replace the list handling section in the combined override
  // Find the list section: from "// --- List commands ---" to the next "return _bcOrigExec"
  const listSectionStart = "// --- List commands ---";
  const listSectionEnd = "return _bcOrigExec(cmd, ui, val);";

  const startIdx = html.indexOf(listSectionStart);
  const endIdx = html.indexOf(listSectionEnd, startIdx);

  if (startIdx < 0 || endIdx < 0) {
    console.log('List section not found in ' + f);
    continue;
  }

  const newListSection = `// --- List commands (always manual DOM) ---
                if (cmd === 'insertOrderedList' || cmd === 'insertUnorderedList') {
                    var ce = document.querySelector('[contenteditable="true"]');
                    if (!ce) return _bcOrigExec(cmd, ui, val);
                    var tag = cmd === 'insertOrderedList' ? 'OL' : 'UL';
                    var li = document.createElement('li');
                    li.innerHTML = '\\u00A0';
                    var list = document.createElement(tag);
                    list.appendChild(li);
                    var sel = window.getSelection();
                    var inserted = false;
                    if (sel.rangeCount > 0) {
                        var node = sel.getRangeAt(0).commonAncestorContainer;
                        if (node.nodeType === 3) node = node.parentNode;
                        if (ce.contains(node)) {
                            var range = sel.getRangeAt(0);
                            try { range.deleteContents(); } catch(e) {}
                            range.insertNode(list);
                            inserted = true;
                        }
                    }
                    if (!inserted) {
                        ce.appendChild(list);
                    }
                    var nr = document.createRange();
                    nr.setStart(li, 0); nr.collapse(true);
                    sel.removeAllRanges(); sel.addRange(nr);
                    ce.dispatchEvent(new Event('input', { bubbles: true }));
                    return true;
                }
                
                return _bcOrigExec(cmd, ui, val);`;

  html = html.substring(0, startIdx) + newListSection + html.substring(endIdx + listSectionEnd.length);

  fs.writeFileSync(f, html);
  console.log('Updated list handling in ' + f);
}

console.log('Done!');
