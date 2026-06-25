const fs = require('fs');
const code = fs.readFileSync('c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/6120-99ba76de6fd208f3.js', 'utf8');

const regex = /#"\s*\+\s*(\w+)\.code|\"\s*0%\s*\"|dasharray|dashoffset/g;
let match;
while ((match = regex.exec(code)) !== null) {
  console.log('Match found:', match[0], 'at index', match.index);
  console.log('Context:', code.substring(Math.max(0, match.index - 50), Math.min(code.length, match.index + 50)));
}
