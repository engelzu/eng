const fs = require('fs');

let fastHtml = fs.readFileSync('c:/Users/user2/Downloads/Eng22_06/Eng22_06/fast.html', 'utf8');
let bcHtml = fs.readFileSync('c:/Users/user2/Downloads/Eng22_06/Eng22_06/business-case.html', 'utf8');

function extractModal(html) {
  let idx = html.indexOf('id="bc-img-size-modal"');
  if (idx === -1) return null;
  return html.substring(idx, idx + 2000);
}

let fModal = extractModal(fastHtml);
let bModal = extractModal(bcHtml);

console.log('Modals identical?', fModal === bModal);
if (fModal !== bModal) {
    console.log('Length f:', fModal && fModal.length, 'Length b:', bModal && bModal.length);
}
