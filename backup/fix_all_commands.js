const fs = require('fs');
const files = ['business-case.html', 'OUT/business-case.html'];

// Read the existing HTML
for (const f of files) {
  let html = fs.readFileSync(f, 'utf8');

  // Find all the existing override IIFEs and replace them with a single comprehensive one
  // The pattern we need to remove:
  // 1. The "Override execCommand to support image alignment" IIFE
  // 2. The "Override execCommand for list commands" IIFE
  
  // Remove everything from "// Override execCommand to support image alignment" to the closing "})();"
  // Then also remove the list override IIFE
  
  // Strategy: find all IIFEs that start with "// Override execCommand" or "(function() {" before bcPickImage
  // and contain "origExec" or "_origExec", and replace them with a single combined override
  
  const pickIdx = html.indexOf('bcPickImage = function()');
  if (pickIdx < 0) { console.log('bcPickImage not found in ' + f); continue; }
  
  // Find the start: look for the last </script> before bcPickImage
  const scriptStart = html.lastIndexOf('<script>', pickIdx);
  
  // Extract the content between <script> and bcPickImage
  const beforeScript = html.substring(0, scriptStart + '<script>'.length);
  const afterScript = html.substring(pickIdx);
  
  // Now, within the content between <script> and bcPickImage, remove ALL existing override IIFEs
  let scriptContent = html.substring(scriptStart + '<script>'.length, pickIdx);
  
  // Remove all IIFEs that match the override pattern
  // Pattern: starts with "// Override execCommand" or just "(function() {" with origExec
  // We'll use a more robust approach: remove everything between "// Override execCommand" and "})();"
  // and also remove everything between standalone "(function() {" (that contains origExec) and "})();"
  
  // First, remove the justify override
  scriptContent = scriptContent.replace(/\/\/ Override execCommand to support image alignment in <p> wrapper[\s\S]*?\}\)\(\);\s*/g, '');
  
  // Remove the list override
  scriptContent = scriptContent.replace(/\/\/ Override execCommand for list commands with manual fallback[\s\S]*?\}\)\(\);\s*/g, '');
  
  // Also try removing any remaining standalone IIFEs that override execCommand
  // (in case comments were slightly different)
  scriptContent = scriptContent.replace(/\/\/ Override execCommand[\s\S]*?\}\)\(\);\s*/g, '');
  
  // Now insert the COMBINED override
  const combinedOverride = `
        // Save selection on toolbar mousedown + handle all execCommand overrides
        (function() {
            var _bcSavedRange = null;
            var _bcOrigExec = document.execCommand.bind(document);
            
            document.addEventListener('mousedown', function(e) {
                var btn = e.target.closest('.bc-editor-toolbar button, .bc-editor-toolbar select');
                if (btn) {
                    var sel = window.getSelection();
                    if (sel.rangeCount > 0) {
                        var ce = document.querySelector('[contenteditable="true"]');
                        if (ce && ce.contains(sel.getRangeAt(0).commonAncestorContainer)) {
                            _bcSavedRange = sel.getRangeAt(0).cloneRange();
                        }
                    }
                }
            }, true);
            
            document.execCommand = function(cmd, ui, val) {
                // Restore saved selection if current selection is empty
                var sel = window.getSelection();
                var hasSel = sel.rangeCount > 0;
                if ((!hasSel || sel.isCollapsed === undefined) && _bcSavedRange) {
                    try { sel.removeAllRanges(); sel.addRange(_bcSavedRange); } catch(e) {}
                    _bcSavedRange = null;
                }
                
                // --- Image alignment override ---
                if (cmd === 'justifyLeft' || cmd === 'justifyCenter' || cmd === 'justifyRight' || cmd === 'justifyFull') {
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
                }
                
                // --- List commands ---
                if (cmd === 'insertOrderedList' || cmd === 'insertUnorderedList') {
                    var listRet = _bcOrigExec(cmd, ui, val);
                    if (listRet) return listRet;
                    // Manual fallback
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
                    try { range.deleteContents(); } catch(e) {}
                    range.insertNode(list);
                    var nr = document.createRange();
                    nr.setStart(li, 0); nr.collapse(true);
                    sel.removeAllRanges(); sel.addRange(nr);
                    ce.dispatchEvent(new Event('input', { bubbles: true }));
                    return true;
                }
                
                return _bcOrigExec(cmd, ui, val);
            };
        })();
`;
  
  const newScriptContent = scriptContent + combinedOverride;
  html = beforeScript + newScriptContent + afterScript;
  
  fs.writeFileSync(f, html);
  console.log('Fixed all execCommand overrides in ' + f);
}

console.log('Done!');
