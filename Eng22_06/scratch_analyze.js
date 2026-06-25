const fs = require('fs');
const path = require('path');
const root = 'c:/Users/Admin/Downloads/Eng18_06/Eng15_06/_next/static/chunks';

const files = [
  '6120-99ba76de6fd208f3.js',
  '6120-99ba76de6fd208f3.js.bak',
  '6120-99ba76de6fd208f3.js.eap_patch.bak',
  '507-1cbb4e1ae80f89d3.js',
  '507-1cbb4e1ae80f89d3.js.bak'
];

files.forEach(f => {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) {
    console.log(`${f}: not found`);
    return;
  }
  const code = fs.readFileSync(p, 'utf8');
  console.log(`=== ${f} (${code.length} bytes) ===`);
  console.log(`  has showEapModal:`, code.includes('showEapModal'));
  console.log(`  has showCronogramaModal:`, code.includes('showCronogramaModal'));
  console.log(`  has showBcModal:`, code.includes('showBcModal'));
});
