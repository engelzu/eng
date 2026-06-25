const fs = require('fs');
const fileFast = '_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';
let code = fs.readFileSync(fileFast, 'utf8');

let match = code.match(/case."EM AN\\xc1LISE":/);
if (match) {
    console.log('Found:', match[0], 'at', match.index);
    console.log('Context:', code.substring(match.index - 50, match.index + 100));
} else {
    console.log('Not found');
}
