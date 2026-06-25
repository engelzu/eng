const fs = require('fs');

const files = [
  'c:/Users/user2/Downloads/Eng22_06/Eng22_06/fast.html',
  'c:/Users/user2/Downloads/Eng22_06/Eng22_06/business-case.html'
];

for (let file of files) {
  let html = fs.readFileSync(file, 'utf8');
  
  // Target the bcOpenImgModal function - we need to move the modal into the 
  // active Radix dialog portal before showing it, so it's not affected by inert
  const target = `        var modal = document.getElementById('bc-img-size-modal');
        var card  = document.getElementById('bc-img-size-card');
        if (!modal || !card) return;
        modal.style.display = 'flex';`;

  const replacement = `        var modal = document.getElementById('bc-img-size-modal');
        var card  = document.getElementById('bc-img-size-card');
        if (!modal || !card) return;
        // Move modal into the topmost Radix portal so Radix doesn't make it inert
        // (This is needed when BC editor opens inside a nested Radix Dialog like FAST)
        var radixPortals = document.querySelectorAll('[data-radix-portal]');
        var topPortal = radixPortals.length > 0 ? radixPortals[radixPortals.length - 1] : document.body;
        if (modal.parentNode !== topPortal) {
          topPortal.appendChild(modal);
        }
        // Remove any inert or aria-hidden that Radix may have set on the modal
        modal.removeAttribute('inert');
        modal.removeAttribute('aria-hidden');
        modal.style.pointerEvents = 'all';
        modal.style.display = 'flex';`;

  if (html.includes(target) && !html.includes('data-radix-portal')) {
    html = html.replace(target, replacement);
    fs.writeFileSync(file, html, 'utf8');
    console.log('Patched bcOpenImgModal portal move in:', file);
  } else {
    console.log('Target not found or already patched in:', file);
  }
}
