const fs = require('fs');
let html = fs.readFileSync('c:/Users/user2/Downloads/Eng22_06/Eng22_06/fast.html', 'utf8');

console.log('Has MutationObserver guard:', html.includes('MutationObserver to prevent Radix'));
console.log('Has portal move:', html.includes('data-radix-portal'));
console.log('Has stopImmediatePropagation on dblclick:', html.includes('stopImmediatePropagation'));
console.log('Has pointerdown modal bypass:', html.includes("bc-img-size-modal") && html.includes("t.closest"));
