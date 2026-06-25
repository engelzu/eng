const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const chunks = walk('_next/static/chunks');
console.log(`Searching in ${chunks.length} chunks...`);
for (const c of chunks) {
  const content = fs.readFileSync(c, 'utf8');
  if (content.toLowerCase().includes('sair sem salvar') || content.toLowerCase().includes('sairsem')) {
    console.log(`FOUND in: ${c}`);
  }
}
