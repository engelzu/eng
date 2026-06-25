const fs = require('fs');
const files = [
  'c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/6120-99ba76de6fd208f3.js',
  'c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/507-1cbb4e1ae80f89d3.js',
  'c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js',
  'c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/app/admin/page-ba7e68b4f74a7dcc.js',
  'c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/app/planning/page-838c61e89ae20466.js',
  'c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/app/page-ff8e451c63f5d79e.js'
];
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  const code = fs.readFileSync(f, 'utf8');
  // Look for render pattern of ID like "#" + e.code or similar, or stroke-dashoffset inside a kanban loop
  const regex = /#\"\s*\+\s*([a-zA-Z0-9_]+)\.(code|id)/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    console.log('File:', f);
    console.log('Match found:', match[0], 'at index', match.index);
    console.log('Context:', code.substring(Math.max(0, match.index - 80), Math.min(code.length, match.index + 80)));
  }
}
