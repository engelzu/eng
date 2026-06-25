const fs = require('fs');
const files = ['business-case.html', 'OUT/business-case.html'];

for (const f of files) {
  let html = fs.readFileSync(f, 'utf8');

  const marker = '_bcSave';
  const idx = html.indexOf(marker);
  if (idx < 0) { console.log('Override not found in ' + f); continue; }

  const scriptStart = html.lastIndexOf('<script>', idx);
  const scriptEnd = html.indexOf('</script>', idx) + 9;
  if (scriptStart < 0 || scriptEnd < 0) { console.log('Script bounds issue in ' + f); continue; }

  const cleanScript = `<script>
        // Override execCommand for image alignment and list support
        (function() {
            var _bcSave = null;
            var _bcEditor = null;
            var _bcOrig = document.execCommand.bind(document);

            // Save selection in capture phase before toolbar buttons steal focus
            document.addEventListener('mousedown', function(e) {
                var btn = e.target.closest('.bc-editor-toolbar button, .bc-editor-toolbar select');
                if (!btn) return;
                var sel = window.getSelection();
                if (sel.rangeCount) {
                    var n = sel.getRangeAt(0).commonAncestorContainer;
                    if (n.nodeType === 3) n = n.parentNode;
                    var editor = n.closest ? n.closest('[contenteditable="true"]') : null;
                    if (editor) {
                        _bcSave = sel.getRangeAt(0).cloneRange();
                        _bcEditor = editor;
                    }
                }
                e.preventDefault();
            }, true);

            document.execCommand = function(cmd, ui, val) {
                var sel = window.getSelection();

                // Lists: restore saved range, use native execCommand
                if (cmd === 'insertOrderedList' || cmd === 'insertUnorderedList') {
                    if (_bcSave && _bcEditor) {
                        try { sel.removeAllRanges(); sel.addRange(_bcSave); _bcEditor.focus(); } catch(e) {}
                    }
                    var result = _bcOrig(cmd, ui, val);
                    if (!result && _bcEditor) {
                        // Manual fallback
                        try {
                            var li = document.createElement('li');
                            li.innerHTML = '\u00A0';
                            var list = document.createElement(cmd === 'insertOrderedList' ? 'OL' : 'UL');
                            list.appendChild(li);
                            if (sel.rangeCount > 0) {
                                sel.getRangeAt(0).deleteContents();
                                sel.getRangeAt(0).insertNode(list);
                            } else if (_bcEditor) {
                                _bcEditor.appendChild(list);
                            }
                            var nr = document.createRange();
                            nr.setStart(li, 0); nr.collapse(true);
                            sel.removeAllRanges(); sel.addRange(nr);
                            result = true;
                        } catch(e) {}
                    }
                    if (result && _bcEditor) {
                        try { _bcEditor.dispatchEvent(new Event('input', { bubbles: true })); } catch(e) {}
                    }
                    _bcSave = null;
                    _bcEditor = null;
                    return result || false;
                }

                // Image alignment (justify)
                if (cmd === 'justifyLeft' || cmd === 'justifyCenter' || cmd === 'justifyRight' || cmd === 'justifyFull') {
                    try {
                        if (sel.rangeCount > 0) {
                            var n = sel.getRangeAt(0).commonAncestorContainer;
                            if (n.nodeType === 3) n = n.parentNode;
                            var img = n.tagName === 'IMG' ? n : (n.querySelector ? n.querySelector('img') : null);
                            if (img) {
                                var w = img.closest ? img.closest('div, p') : null;
                                if (w) {
                                    w.style.textAlign = cmd.replace('justify', '').toLowerCase();
                                    var editor = w.closest('[contenteditable]') || document.querySelector('[contenteditable]');
                                    if (editor) editor.dispatchEvent(new Event('input', { bubbles: true }));
                                    return true;
                                }
                            }
                        }
                    } catch(e) {}
                }

                // Other commands: restore saved range if selection is lost
                if (_bcSave && (_bcEditor || !sel.rangeCount)) {
                    try { sel.removeAllRanges(); sel.addRange(_bcSave); } catch(e) {}
                }
                var result = _bcOrig(cmd, ui, val);
                _bcSave = null;
                _bcEditor = null;
                return result;
            };
        })();

        // Global image picker
        window.bcPickImage = function() {
            var editor = document.activeElement && document.activeElement.isContentEditable
                ? document.activeElement : document.querySelector('[contenteditable="true"]');
            if (!editor) return;
            var i = document.createElement('input');
            i.type = 'file';
            i.accept = 'image/*';
            i.onchange = function() {
                var f = i.files[0];
                if (!f) return;
                var r = new FileReader();
                r.onload = function(e) {
                    editor.focus();
                    var sel = window.getSelection();
                    var range = (sel.rangeCount > 0 && editor.contains(sel.getRangeAt(0).commonAncestorContainer))
                        ? sel.getRangeAt(0)
                        : (function(){var r2=document.createRange();r2.selectNodeContents(editor);r2.collapse(false);return r2;})();
                    var div = document.createElement('div');
                    div.style.cssText = 'text-align:left;border:1px dashed #94a3b8;border-radius:4px;padding:4px;margin:4px 0';
                    var img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.cssText = 'max-width:100%;height:auto;display:inline-block';
                    div.appendChild(img);
                    range.deleteContents();
                    range.insertNode(div);
                    var nr = document.createRange();
                    nr.setStart(div, 0); nr.collapse(true);
                    sel.removeAllRanges(); sel.addRange(nr);
                    div.focus();
                    editor.dispatchEvent(new Event('input', { bubbles: true }));
                };
                r.readAsDataURL(f);
            };
            i.click();
        };

        // Table inserter
        window.bcShowTablePicker = function() {
            var editor = document.activeElement && document.activeElement.isContentEditable
                ? document.activeElement : document.querySelector('[contenteditable="true"]');
            if (!editor) return;
            var r = prompt('Linhas:', '3');
            if (r === null || r === '') return;
            var c = prompt('Colunas:', '3');
            if (c === null || c === '') return;
            r = parseInt(r, 10) || 3; if (r < 1) r = 1; if (r > 20) r = 20;
            c = parseInt(c, 10) || 3; if (c < 1) c = 1; if (c > 20) c = 20;
            editor.focus();
            var sel = window.getSelection();
            var range = (sel.rangeCount > 0 && editor.contains(sel.getRangeAt(0).commonAncestorContainer))
                ? sel.getRangeAt(0)
                : (function(){var r2=document.createRange();r2.selectNodeContents(editor);r2.collapse(false);return r2;})();
            var table = document.createElement('table');
            table.border = '1'; table.cellPadding = '6'; table.cellSpacing = '0';
            table.style.cssText = 'width:100%;border-collapse:collapse;font-size:13px;margin:4px 0';
            for (var ri = 0; ri < r; ri++) {
                var tr = document.createElement('tr');
                for (var ci = 0; ci < c; ci++) {
                    var td = document.createElement('td');
                    td.style.cssText = 'padding:6px;border:1px solid #94a3b8;min-width:40px';
                    td.innerHTML = '&nbsp;';
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
            range.deleteContents();
            range.insertNode(table);
            var fc = table.querySelector('td');
            if (fc) {
                var nr = document.createRange();
                nr.setStart(fc, 0); nr.collapse(true);
                sel.removeAllRanges(); sel.addRange(nr);
            }
            editor.dispatchEvent(new Event('input', { bubbles: true }));
        };

        window.bcCreateLink = function() {
            var u = prompt('URL:');
            if (!u) return;
            var editor = document.activeElement && document.activeElement.isContentEditable
                ? document.activeElement : document.querySelector('[contenteditable="true"]');
            if (!editor) return;
            editor.focus();
            var sel = window.getSelection();
            var range = (sel.rangeCount > 0 && editor.contains(sel.getRangeAt(0).commonAncestorContainer))
                ? sel.getRangeAt(0)
                : (function(){var r2=document.createRange();r2.selectNodeContents(editor);r2.collapse(false);return r2;})();
            if (range.toString()) {
                document.execCommand('createLink', false, u);
            } else {
                var a = document.createElement('a');
                a.href = u;
                a.textContent = u;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                range.deleteContents();
                range.insertNode(a);
                var nr = document.createRange();
                nr.setStartAfter(a); nr.collapse(true);
                sel.removeAllRanges(); sel.addRange(nr);
            }
            editor.dispatchEvent(new Event('input', { bubbles: true }));
        };
    </script>`;

  html = html.substring(0, scriptStart) + cleanScript + html.substring(scriptEnd);

  fs.writeFileSync(f, html);
  console.log('Replaced with clean script in ' + f);
}

console.log('Done!');
