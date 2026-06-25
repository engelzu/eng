const fs = require('fs');
const files = ['business-case.html', 'OUT/business-case.html'];

const override = `
        // Override execCommand to support image alignment in <p> wrapper
        (function() {
            var origExec = document.execCommand.bind(document);
            document.execCommand = function(cmd, ui, val) {
                if (cmd === 'justifyLeft' || cmd === 'justifyCenter' || cmd === 'justifyRight' || cmd === 'justifyFull') {
                    var sel = window.getSelection();
                    if (sel.rangeCount > 0) {
                        var node = sel.getRangeAt(0).commonAncestorContainer;
                        if (node.nodeType === 3) node = node.parentNode;
                        var img = node.tagName === 'IMG' ? node : (node.querySelector ? node.querySelector('img') : null);
                        if (img) {
                            var p = img.closest ? img.closest('p') : null;
                            if (p) {
                                var align = cmd.replace('justify', '').toLowerCase();
                                p.style.textAlign = align;
                                var ce = p.closest('[contenteditable]') || document.querySelector('[contenteditable]');
                                if (ce) ce.dispatchEvent(new Event('input', { bubbles: true }));
                                return true;
                            }
                        }
                    }
                }
                return origExec(cmd, ui, val);
            };
        })();
`;

for (const f of files) {
  let html = fs.readFileSync(f, 'utf8');

  // Insert the override right before bcPickImage function
  const pickIdx = html.indexOf('bcPickImage = function()');
  if (pickIdx >= 0) {
    // Go back to find the start of the line
    const lineStart = html.lastIndexOf('\n', pickIdx - 1) + 1;
    html = html.substring(0, lineStart) + override + html.substring(lineStart);
    fs.writeFileSync(f, html);
    console.log('Injected alignment override in ' + f);
  } else {
    console.log('bcPickImage not found in ' + f);
  }
}

console.log('Done!');
