const fs = require('fs');
const files = [
  'c:/Users/user2/Downloads/Eng22_06/Eng22_06/fast.html',
  'c:/Users/user2/Downloads/Eng22_06/Eng22_06/business-case.html'
];

for (let file of files) {
  let html = fs.readFileSync(file, 'utf8');
  
  let target = "if (t.classList.contains('bc-tbl-col-handle') || t.classList.contains('bc-drag-overlay')) {";
  let replacement = `
        if (t.closest && t.closest('#bc-img-size-modal')) {
            e.stopImmediatePropagation();
            return;
        }
        if (t.id === 'bc-img-resize-handle') {
            e.stopImmediatePropagation();
            return;
        }
        if (t.classList.contains('bc-tbl-col-handle') || t.classList.contains('bc-drag-overlay')) {`;
        
  if (html.includes(target) && !html.includes("t.closest('#bc-img-size-modal')")) {
    html = html.replace(target, replacement);
    fs.writeFileSync(file, html, 'utf8');
    console.log('Patched pointerdown interceptor in:', file);
  } else {
    console.log('Target not found or already patched in:', file);
  }
}
