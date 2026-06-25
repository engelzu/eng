const fs = require('fs');
let code = fs.readFileSync('generate_markup.js', 'utf8');

code = code.replace('max-w-[95vw] w-[1400px]', 'w-[98vw] max-w-[1600px]');
code = code.replace('w-[500px]\",children:\"Distribuição Mensal', '\",children:\"Distribuição Mensal');
code = code.replace('flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-transparent max-w-[500px]', 'flex flex-wrap gap-2 p-1');

fs.writeFileSync('generate_markup.js', code);
console.log('generate_markup updated successfully');
