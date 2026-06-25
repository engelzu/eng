const fs = require('fs');
const code = fs.readFileSync('c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/app/fast/page-5d0c28c966a6b026.js', 'utf8');
const idx = code.indexOf('("PARA ESTUDAR"===e.title');
console.log('Context:', code.substring(idx, idx + 1000));
