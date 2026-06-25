const fs = require('fs');
const files = ['business-case.html', 'OUT/business-case.html'];

for (const f of files) {
  let html = fs.readFileSync(f, 'utf8');

  // Replace p wrapper with div wrapper
  const oldP = "var p = document.createElement('p');\n                        p.style.cssText = 'text-align:left;border:1px dashed #94a3b8;border-radius:4px;padding:4px;margin:4px 0';\n                        var img = document.createElement('img');\n                        img.src = e.target.result;\n                        img.style.cssText = 'max-width:100%;height:auto;display:inline-block;vertical-align:bottom;border-radius:2px';\n                        p.appendChild(img);\n                        range.deleteContents();\n                        range.insertNode(p);\n                        var nr = document.createRange();\n                        nr.setStart(p, 0); nr.collapse(true);\n                        sel.removeAllRanges(); sel.addRange(nr);\n                        p.focus();";

  const newDiv = "var div = document.createElement('div');\n                        div.style.cssText = 'text-align:left;border:1px dashed #94a3b8;border-radius:4px;padding:4px;margin:4px 0';\n                        var img = document.createElement('img');\n                        img.src = e.target.result;\n                        img.style.cssText = 'max-width:100%;height:auto;display:inline-block';\n                        div.appendChild(img);\n                        range.deleteContents();\n                        range.insertNode(div);\n                        var nr = document.createRange();\n                        nr.setStart(div, 0); nr.collapse(true);\n                        sel.removeAllRanges(); sel.addRange(nr);\n                        div.focus();";

  if (html.includes(oldP)) {
    html = html.replace(oldP, newDiv);
    fs.writeFileSync(f, html);
    console.log('Fixed ' + f + ' - replaced p with div');
  } else {
    console.log('Pattern not found in ' + f + ', checking current state...');
    const pIdx = html.indexOf("document.createElement('p');");
    if (pIdx >= 0) {
      console.log('Found p at ' + pIdx + ':');
      console.log(html.substring(pIdx - 20, pIdx + 500));
    } else {
      console.log('No p wrapper found');
      const divIdx = html.indexOf("document.createElement('div');");
      if (divIdx >= 0) {
        console.log('Found div at ' + divIdx + ' (might already be fixed)');
      }
    }
  }

  // Also update the execCommand override to use closest('div') instead of closest('p')
  const oldOverride = "var p = img.closest ? img.closest('p') : null;\n                            if (p) {\n                                var align = cmd.replace('justify', '').toLowerCase();\n                                p.style.textAlign = align;\n                                var ce = p.closest('[contenteditable]') || document.querySelector('[contenteditable]');";
  const newOverride = "var wrap = img.closest ? img.closest('div, p') : null;\n                            if (wrap) {\n                                var align = cmd.replace('justify', '').toLowerCase();\n                                wrap.style.textAlign = align;\n                                var ce = wrap.closest('[contenteditable]') || document.querySelector('[contenteditable]');";
  
  if (html.includes(oldOverride)) {
    html = html.replace(oldOverride, newOverride);
    fs.writeFileSync(f, html);
    console.log('Updated override for wrapper detection in ' + f);
  } else {
    console.log('Override pattern not found in ' + f);
    const oIdx = html.indexOf("closest('p')");
    if (oIdx >= 0) {
      console.log('Found closest p at ' + oIdx);
    } else {
      console.log('No closest p found');
    }
  }
}

console.log('Done!');
