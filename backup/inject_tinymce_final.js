const fs = require('fs');
const htmlPaths = ['business-case.html', 'OUT/business-case.html'];

// Trocar o wrapper da imagem no bcPickImage para usar div com suporte a alinhamento
for (const f of htmlPaths) {
  let html = fs.readFileSync(f, 'utf8');

  // Encontrar e substituir o trecho que cria o wrapper da imagem
  const oldCode = `var wrap = document.createElement('span');
                        wrap.style.cssText = 'display:inline-block;overflow:hidden;resize:both;border:1px dashed #94a3b8;border-radius:4px;line-height:0;padding:2px;max-width:100%;vertical-align:top';
                        var img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.cssText = 'display:block;width:auto;height:auto;max-width:100%;border-radius:2px;pointer-events:none;user-select:none';
                        wrap.appendChild(img);
                        range.deleteContents();
                        range.insertNode(wrap);
                        var nr = document.createRange();
                        nr.setStartAfter(wrap); nr.collapse(true);
                        sel.removeAllRanges(); sel.addRange(nr);
                        wrap.focus();`;

  const newCode = `var div = document.createElement('div');
                        div.style.cssText = 'text-align:left;border:1px dashed #94a3b8;border-radius:4px;padding:4px;margin:4px 0;line-height:0';
                        var img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.cssText = 'display:inline-block;width:auto;height:auto;max-width:100%;border-radius:2px';
                        div.appendChild(img);
                        range.deleteContents();
                        range.insertNode(div);
                        var nr = document.createRange();
                        nr.setStart(div, 0); nr.collapse(true);
                        sel.removeAllRanges(); sel.addRange(nr);
                        div.focus();`;

  if (html.includes(oldCode)) {
    html = html.replace(oldCode, newCode);
    fs.writeFileSync(f, html);
    console.log('Updated bcPickImage with alignment support in ' + f);
  } else {
    console.log('Pattern not found in ' + f + ' - may need manual check');
  }
}

console.log('Done!');
