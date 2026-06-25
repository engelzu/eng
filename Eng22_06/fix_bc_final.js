const fs = require('fs');
const files = ['business-case.html', 'OUT/business-case.html'];

for (const f of files) {
  let html = fs.readFileSync(f, 'utf8');

  // 1. Remove TinyMCE injection block
  html = html.replace(/<!-- TinyMCE Script -->[\s\S]*?<\/script>\s*\n?/, '');
  // Remove any leftover TinyMCE style/script remnants
  html = html.replace(/<!-- TinyMCE Script -->[\s\S]*?<\/script>/g, '');

  // 2. Fix bcPickImage to dispatch input event after image insertion
  // Find the line "editor.focus();" inside bcPickImage and add dispatchEvent after wrap.focus()
  const pickIdx = html.indexOf('window.bcPickImage = function()');
  if (pickIdx >= 0) {
    // Find the wrap.focus() call inside the onload handler
    const wrapFocusIdx = html.indexOf('wrap.focus();', pickIdx);
    if (wrapFocusIdx >= 0) {
      // Find the end of this statement block - look for the closing }; of the onload function
      // We'll insert dispatchEvent right after wrap.focus();
      const before = html.substring(0, wrapFocusIdx + 'wrap.focus();'.length);
      const after = html.substring(wrapFocusIdx + 'wrap.focus();'.length);
      const dispatchCode = `
                        editor.dispatchEvent(new Event('input', { bubbles: true }));`;
      html = before + dispatchCode + after;
      console.log('Fixed bcPickImage with input dispatch in ' + f);
    }
  }

  // 3. Ensure bcCreateLink also dispatches input (if it exists)
  const linkIdx = html.indexOf('window.bcCreateLink = function()');
  if (linkIdx >= 0) {
    // Add dispatchEvent after execCommand in bcCreateLink
    const execIdx = html.indexOf("document.execCommand('createLink'", linkIdx);
    if (execIdx >= 0) {
      const before = html.substring(0, execIdx);
      const after = html.substring(execIdx);
      // Find the end of the line containing execCommand
      const lineEnd = after.indexOf('\n');
      if (lineEnd >= 0) {
        const newLine = after.substring(0, lineEnd) + "\n                        editor.dispatchEvent(new Event('input', { bubbles: true }));";
        html = before + newLine + after.substring(lineEnd);
        console.log('Fixed bcCreateLink with input dispatch in ' + f);
      }
    }
  }

  fs.writeFileSync(f, html);
  console.log('Patched ' + f);
}
