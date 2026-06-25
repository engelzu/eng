const fs = require('fs');
const files = ['business-case.html', 'OUT/business-case.html'];

for (const f of files) {
  let html = fs.readFileSync(f, 'utf8');

  // Find the script block containing the overrides
  const scriptIdx = html.indexOf('<script>');
  if (scriptIdx < 0) { console.log('No script found in ' + f); continue; }

  // Find all script blocks and fix the one with our code
  // We need to fix: dangling "window." and duplicate bcCreateLink
  
  // Fix 1: Remove dangling "window." (followed by whitespace/newline before our override)
  html = html.replace(/\/\/\s*Save selection on toolbar mousedown/, '// Save selection on toolbar mousedown');
  
  // Find the pattern "window.\n        // Save selection..." and fix it
  // The dangling window. might have whitespace after it
  html = html.replace(/window\.\s*\n\s*\/\/ Save selection on toolbar mousedown/, '\n        // Save selection on toolbar mousedown');
  
  // Also catch if it was just "window.\n" before our code
  html = html.replace(/window\.\s*\n\s*\(function\(\)\s*\{[\s\S]*?_bcSavedRange/, '(function() {\n            var _bcSavedRange');
  
  // Fix 2: Remove duplicate bcCreateLink - keep the first one (with dispatchEvent)
  // Find the second bcCreateLink definition and remove it
  const firstLinkIdx = html.indexOf('window.bcCreateLink = function()');
  if (firstLinkIdx >= 0) {
    const secondLinkIdx = html.indexOf('window.bcCreateLink = function()', firstLinkIdx + 10);
    if (secondLinkIdx >= 0) {
      // Find where the second definition ends (the next significant line)
      const afterSecond = html.indexOf('//', secondLinkIdx + 30);
      const afterSecond2 = html.indexOf('\n        window.', secondLinkIdx + 30);
      let endIdx = afterSecond;
      if (afterSecond2 >= 0 && (endIdx < 0 || afterSecond2 < endIdx)) endIdx = afterSecond2;
      // Actually, let's just remove from the second "window.bcCreateLink" to the next "window." or end of script
      const scriptEnd = html.indexOf('</script>', secondLinkIdx);
      if (scriptEnd >= 0) {
        // Find where the line with the second definition ends
        const lineEnd = html.indexOf('\n', secondLinkIdx);
        const lineEnd2 = html.indexOf('\n', lineEnd + 1);
        if (lineEnd2 >= 0) {
          html = html.substring(0, secondLinkIdx) + html.substring(lineEnd2 + 1);
        }
      }
    }
  }
  
  // Fix 3: Add missing semicolons or fix any other issues
  // Make sure the override IIFE is properly closed before bcPickImage
  html = html.replace(/}\);\s*\n\s*bcPickImage/, '})();\n        window.bcPickImage');
  
  fs.writeFileSync(f, html);
  console.log('Fixed syntax errors in ' + f);
}

console.log('Done!');
