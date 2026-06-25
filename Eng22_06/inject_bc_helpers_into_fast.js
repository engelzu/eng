const fs = require('fs');

const bcHtml = fs.readFileSync('business-case.html', 'utf8');
const startToken = '<!-- Modal moderno para redimensionar imagem -->';
const endToken = '<!-- Test buttons for list debugging -->'; // we can search for the end of the script before body

const startIdx = bcHtml.indexOf(startToken);
const endIdx = bcHtml.lastIndexOf('</body>');

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find helper blocks in business-case.html');
  process.exit(1);
}

const helpersBlock = bcHtml.substring(startIdx, endIdx);

let fastHtml = fs.readFileSync('fast.html', 'utf8');
if (fastHtml.includes('bc-img-size-modal')) {
  console.log('Helpers already injected in fast.html');
} else {
  const insertIdx = fastHtml.lastIndexOf('</body>');
  if (insertIdx === -1) {
    console.error('Could not find </body> in fast.html');
    process.exit(1);
  }
  fastHtml = fastHtml.substring(0, insertIdx) + helpersBlock + '\n' + fastHtml.substring(insertIdx);
  fs.writeFileSync('fast.html', fastHtml);
  console.log('Successfully injected BC helpers block into fast.html');
}
