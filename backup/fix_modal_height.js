const fs = require('fs');
let code = fs.readFileSync('generate_markup.js', 'utf8');

// 1. Add flex flex-col max-h-[95vh] overflow-hidden to main modal
code = code.replace('className:"w-[98vw] max-w-[1600px] border-emerald-500 shadow-2xl rounded-2xl"', 'className:"w-[98vw] max-w-[1600px] max-h-[95vh] flex flex-col overflow-hidden border-emerald-500 shadow-2xl rounded-2xl"');

// 2. Change middle div to flex-1
code = code.replace('className:"p-4 space-y-4 max-h-[75vh] overflow-y-auto"', 'className:"p-4 space-y-4 flex-1 overflow-y-auto"');

// 3. Ensure footer is shrink-0
// Wait, let's see what the footer has.
code = code.replace('(0,t.jsxs)(s.cN,{children:', '(0,t.jsxs)(s.cN,{className:"shrink-0",children:');

fs.writeFileSync('generate_markup.js', code);
console.log('Fixed modal layout in generate_markup.js');
