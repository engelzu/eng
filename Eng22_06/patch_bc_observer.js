const fs = require('fs');

const files = [
  'fast.html',
  'business-case.html'
];

for (let file of files) {
  let html = fs.readFileSync(file, 'utf8');
  
  // Add a MutationObserver that watches for Radix adding inert to bc-img-size-modal
  // and immediately removes it
  const target = `      window.bcOpenImgModal = function(img, editor) {`;

  const addition = `      // ── MutationObserver to prevent Radix from making bc-img-size-modal inert ──
      (function() {
        var protectedIds = ['bc-img-size-modal', 'bc-img-size-card'];
        var observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(m) {
            if (m.type === 'attributes') {
              var el = m.target;
              if (protectedIds.indexOf(el.id) !== -1) {
                if (el.hasAttribute('inert')) { el.removeAttribute('inert'); }
                if (el.getAttribute('aria-hidden') === 'true') { el.removeAttribute('aria-hidden'); }
              }
            }
          });
        });
        observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['inert', 'aria-hidden', 'data-hidden'] });
      })();

      window.bcOpenImgModal = function(img, editor) {`;

  if (html.includes(target) && !html.includes('MutationObserver to prevent Radix')) {
    html = html.replace(target, addition);
    fs.writeFileSync(file, html, 'utf8');
    console.log('Added MutationObserver in:', file);
  } else {
    console.log('Target not found or already patched in:', file);
  }
}
