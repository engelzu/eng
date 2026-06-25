const fs = require('fs');

const files = [
  'fast.html',
  'business-case.html'
];

for (let file of files) {
  let html = fs.readFileSync(file, 'utf8');
  
  // Patch the dblclick handler to also stopPropagation
  const target = `            el.addEventListener("dblclick", function(e) {
                if (e.target.tagName === "IMG") {
                    e.preventDefault();
                    if (window.bcOpenImgModal) {
                        window.bcOpenImgModal(e.target, el);
                    }
                }
            });`;

  const replacement = `            el.addEventListener("dblclick", function(e) {
                if (e.target.tagName === "IMG") {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    if (window.bcOpenImgModal) {
                        window.bcOpenImgModal(e.target, el);
                    }
                }
            });`;

  if (html.includes(target)) {
    html = html.replace(target, replacement);
    fs.writeFileSync(file, html, 'utf8');
    console.log('Patched dblclick stopPropagation in:', file);
  } else {
    console.log('Target not found in:', file);
  }
}
