const fs = require('fs');
const path = require('path');
function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (file !== 'OUT') filelist = walkSync(dirFile, filelist);
    } else {
      if (file.endsWith('.js')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
}
const files = walkSync('c:/Users/user2/Downloads/Eng22_06/Eng22_06');
const regex = /#\"\s*\+\s*([a-zA-Z0-9_\.]+)/g;
for (const f of files) {
  const code = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = regex.exec(code)) !== null) {
    if (match[1] !== 't' && match[1] !== 'r' && match[1] !== 'e' && match[1] !== 's' && match[1] !== 'a' && match[1] !== 'n' && match[1] !== 'u' && match[1] !== 'P' && match[1] !== 'T' && match[1] !== 'h' && match[1] !== 'b' && match[1] !== 'F') {
      console.log('File:', f);
      console.log('Match found:', match[0], 'at index', match.index);
      console.log('Context:', code.substring(Math.max(0, match.index - 80), Math.min(code.length, match.index + 80)));
    }
  }
}
