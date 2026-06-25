const fs = require('fs');
const getAllFiles = function(dirPath, arrayOfFiles) {
  let files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
    } else {
      if (file.endsWith('.js')) {
        arrayOfFiles.push(dirPath + '/' + file);
      }
    }
  });
  return arrayOfFiles;
};

const allFiles = getAllFiles('c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks');
for (let f of allFiles) {
  let code = fs.readFileSync(f, 'utf8');
  if (code.includes('Preencha os dados abaixo')) {
    let match = code.match(/className:"grid [^"]*"/g);
    console.log(f, match ? match.slice(0, 3) : 'No grid class found');
  }
}
