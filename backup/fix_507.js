const fs = require('fs');
let code = fs.readFileSync('build_507_patch.js', 'utf8');

code = code.replace(
  "let stateReplacement = 'const bcDataRef=(0,r.useRef)({});[showBcModal,setShowBcModal]=(0,r.useState)(!1),';",
  "let stateReplacement = 'const bcDataRef=(0,r.useRef)({});let [showBcModal,setShowBcModal]=(0,r.useState)(!1),';"
);

code = code.replace(
  "'function X(e){var s;let ' + JSON.stringify(stateReplacement) + '{fast:a'",
  "'function X(e){var s;' + JSON.stringify(stateReplacement) + 'let {fast:a'"
);

fs.writeFileSync('build_507_patch.js', code);
console.log('Fixed let/const syntax');
