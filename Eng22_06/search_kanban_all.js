const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (file !== 'OUT') {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (file.endsWith('.js')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
}

const chunksDir = 'c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks';
const files = walkSync(chunksDir);

const regex = /#"\s*\+\s*(\w+)\.code|\"\s*0%\s*\"|dasharray|dashoffset/g;

for (const f of files) {
  const code = fs.readFileSync(f, 'utf8');
  let match;
  let found = false;
  while ((match = regex.exec(code)) !== null) {
    if (!found) {
      console.log('--- File:', f);
      found = true;
    }
    console.log('Match found:', match[0], 'at index', match.index);
    console.log('Context:', code.substring(Math.max(0, match.index - 50), Math.min(code.length, match.index + 50)));
  }
}
