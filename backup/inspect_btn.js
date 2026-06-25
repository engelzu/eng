const fs = require('fs');
let code = fs.readFileSync('_next/static/chunks/507-1cbb4e1ae80f89d3.js', 'utf8');

const startMarker = ',(0,t.jsxs)("button",{type:"button",onClick:e=>{';
const startIndex = code.indexOf(startMarker);

if (startIndex !== -1) {
    const endStr = 'CARREGAR BUSINESS CASE"})]})';
    const endIndex = code.indexOf(endStr, startIndex) + endStr.length;
    console.log("STRING TO REMOVE:");
    console.log(code.substring(startIndex, endIndex));
} else {
    console.log("Start marker not found");
}
