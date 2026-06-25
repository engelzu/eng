const fs = require('fs');
const files = fs.readdirSync('_next/static/chunks').filter(f => f.endsWith('.js'));
for (const f of files) {
  const content = fs.readFileSync('_next/static/chunks/' + f, 'utf8');
  const lower = content.toLowerCase();
  const idx1 = lower.indexOf('carregar');
  if (idx1 !== -1) {
    console.log('Found "carregar" in', f);
    console.log(content.substring(Math.max(0, idx1 - 100), idx1 + 200));
  }
}
