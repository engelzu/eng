const fs = require('fs');
const files = ['business-case.html', 'OUT/business-case.html'];

const listOverride = `
        // Override execCommand for list commands with manual fallback
        (function() {
            var _origExec = document.execCommand.bind(document);
            document.execCommand = function(cmd) {
                // Pass through if not a list command
                if (cmd !== 'insertOrderedList' && cmd !== 'insertUnorderedList') {
                    return _origExec.apply(document, arguments);
                }
                // Try native execCommand first
                var ret = _origExec.apply(document, arguments);
                if (ret) return ret;
                // Manual fallback if native failed
                var sel = window.getSelection();
                if (!sel.rangeCount) return false;
                var range = sel.getRangeAt(0);
                var editor = range.commonAncestorContainer;
                if (editor.nodeType === 3) editor = editor.parentNode;
                var ce = editor.closest ? editor.closest('[contenteditable]') : null;
                if (!ce) ce = document.querySelector('[contenteditable]');
                if (!ce) return false;
                var tag = cmd === 'insertOrderedList' ? 'OL' : 'UL';
                var li = document.createElement('li');
                li.innerHTML = '&nbsp;';
                var list = document.createElement(tag);
                list.appendChild(li);
                range.deleteContents();
                range.insertNode(list);
                var nr = document.createRange();
                nr.setStart(li, 0); nr.collapse(true);
                sel.removeAllRanges(); sel.addRange(nr);
                ce.dispatchEvent(new Event('input', { bubbles: true }));
                return true;
            };
        })();
`;

for (const f of files) {
  let html = fs.readFileSync(f, 'utf8');

  // Insert after the justify override (before bcPickImage)
  const pickIdx = html.indexOf('bcPickImage = function()');
  if (pickIdx >= 0) {
    // Go back to find the start of the line bcPickImage is on
    const lineStart = html.lastIndexOf('\n', pickIdx - 2) + 1;
    html = html.substring(0, lineStart) + listOverride + html.substring(lineStart);
    fs.writeFileSync(f, html);
    console.log('Added list fallback in ' + f);
  } else {
    console.log('bcPickImage not found in ' + f);
  }
}

console.log('Done!');
