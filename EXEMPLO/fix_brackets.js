const fs = require('fs');
let code = fs.readFileSync('patch_eap_tree.js', 'utf8');

// The correct ending for a row with an input is cursor-not-allowed")}) (input) + }) (td) + ]}) (tr)
// So it should be cursor-not-allowed")})})]})
// But wait, there might be typos like })})]} or })})}
// Let's replace any malformed ending before a comma and a new tr.

code = code.replace(/cursor-not-allowed"\)\}\)\}\)\]\}\)\],/g, 'cursor-not-allowed")})})]}),'); // Fix over-closes
code = code.replace(/cursor-not-allowed"\)\}\)\}\)\]\}/g, 'cursor-not-allowed")})})]}');
code = code.replace(/cursor-not-allowed"\)\}\)\}\)\}/g, 'cursor-not-allowed")})})]}');

// Let's just blindly replace the end of EVERY input td + tr to be strictly correct.
// We know that an input td inside a tr ends with:
// cursor-not-allowed") // end of className string
// }) // end of input
// }) // end of td
// ]}) // end of tr
// Total: cursor-not-allowed")})})]})
code = code.replace(/cursor-not-allowed"\)[\}\]A-Za-z0-9,]+?\,\(0\,t\.jsxs\)\("tr"/g, 'cursor-not-allowed")})})]}),(0,t.jsxs)("tr"');

// And for the very last row (Contingenciamento), it is followed by the tbody close: ]})
// Then table close: ]})
// Then overflow div close: })
// Then EAP modal body div close: ]})
// Then the footer: ,(0,t.jsxs)(s.cN,...
// So the end should be:
// cursor-not-allowed")})})]})]}),(0,t.jsxs)(s.cN... wait, tbody close ]}), table close ]}), wrapper div close }), EAP body div close ]}), footer ,(0,t.jsxs)(s.cN
code = code.replace(/cursor-not-allowed"\)[\}\]A-Za-z0-9,]+?\,\(0\,t\.jsxs\)\(s\.cN/g, 'cursor-not-allowed")})})]})]})]})]})]}),(0,t.jsxs)(s.cN');

fs.writeFileSync('patch_eap_tree.js', code);
console.log("Fixed code written!");
