const fs = require('fs');

const files = [
  '_next/static/chunks/app/fast/page-5d0c28c966a6b026.js',
  'OUT/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js'
];

const targetStr = `fCnt=isStudy?Object.keys(s.studyChecklist||{}).length:bcFields.filter(f=>s[f]&&typeof s[f]==='string'&&s[f].trim()!=='').length`;
const newStr = `fCnt=isStudy?Object.keys(s.studyChecklist||{}).length:bcFields.filter(f=>s[f]&&typeof s[f]==='string'&&s[f].replace(/<[^>]*>?/gm, '').trim().length>0).length`;

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let code = fs.readFileSync(f, 'utf8');
  if (code.includes(targetStr)) {
    code = code.replace(targetStr, newStr);
    fs.writeFileSync(f, code, 'utf8');
    console.log('Patched kanban circle HTML stripping in ' + f);
  }
}

let patchBcCode = fs.readFileSync('c:/Users/user2/Downloads/Eng22_06/patch_bc.js', 'utf8');
if (patchBcCode.includes(targetStr)) {
  patchBcCode = patchBcCode.replace(targetStr, newStr);
  fs.writeFileSync('c:/Users/user2/Downloads/Eng22_06/patch_bc.js', patchBcCode, 'utf8');
  console.log('Updated patch_bc.js with HTML stripping logic');
}
