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
const regex = /#\"\s*\+\s*[a-zA-Z]/g;
for (const f of files) {
  const code = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = regex.exec(code)) !== null) {
    console.log('File:', f);
    console.log('Match found:', match[0], 'at index', match.index);
    console.log('Context:', code.substring(Math.max(0, match.index - 80), Math.min(code.length, match.index + 80)));
  }
}
