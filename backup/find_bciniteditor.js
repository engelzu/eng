const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    // Ignore node_modules and OUT
    if (file === 'node_modules' || file === 'OUT' || file === '.git') return;
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.js') || file.endsWith('.html')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('.');
console.log(`Searching in ${files.length} files...`);
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('bcInitEditor')) {
    console.log(`FOUND in: ${f}`);
  }
}
