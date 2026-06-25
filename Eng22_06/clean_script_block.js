const fs = require('fs');
const files = ['business-case.html', 'OUT/business-case.html'];

for (const f of files) {
  let html = fs.readFileSync(f, 'utf8');

  // Find the script block that contains _bcSavedRange
  const markerIdx = html.indexOf('_bcSavedRange');
  if (markerIdx < 0) { console.log('Override not found in ' + f); continue; }
  
  // Find the opening <script> tag before our code
  let scriptStart = html.lastIndexOf('<script>', markerIdx);
  if (scriptStart < 0) { console.log('Script start not found in ' + f); continue; }
  
  // Find the closing </script> after our code
  let scriptEnd = html.indexOf('</script>', markerIdx);
  if (scriptEnd < 0) { console.log('Script end not found in ' + f); continue; }
  scriptEnd += '</script>'.length;
  
  // Get the content between script tags
  let scriptContent = html.substring(scriptStart, scriptEnd);
  
  // Clean the script content:
  // 1. Remove dangling "window."
  scriptContent = scriptContent.replace(/window\.\s*\n\s*/g, '\n');
  
  // 2. Remove duplicate bcCreateLink (keep the first one with dispatchEvent)
  const firstLink = 'window.bcCreateLink = function()';
  const linkIdx = scriptContent.indexOf(firstLink);
  if (linkIdx >= 0) {
    const secondLinkIdx = scriptContent.indexOf(firstLink, linkIdx + 10);
    if (secondLinkIdx >= 0) {
      // Find the end of the second function (another `};` or next function or `</script>`)
      const endMarker = scriptContent.indexOf(';</script>', secondLinkIdx);
      if (endMarker >= 0) {
        // Remove from secondLinkIdx to endMarker+1 (the ';')
        scriptContent = scriptContent.substring(0, secondLinkIdx) + scriptContent.substring(endMarker + 1);
      } else {
        // Fallback: remove to end of script tag
        scriptContent = scriptContent.substring(0, secondLinkIdx) + '\n';
      }
    }
  }
  
  // 3. Ensure proper spacing around IIFE closing
  scriptContent = scriptContent.replace(/}\);\)\(\);\s*\n\s*bcPickImage/g, '})();\n        window.bcPickImage');
  scriptContent = scriptContent.replace(/}\);\)\(\);\s*\n\s*window\.bcPickImage/g, '})();\n        window.bcPickImage');
  
  // Replace the old script block with the cleaned one
  html = html.substring(0, scriptStart) + scriptContent + html.substring(scriptEnd);
  
  fs.writeFileSync(f, html);
  console.log('Cleaned script block in ' + f);
}

console.log('Done!');
