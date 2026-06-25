const fs = require('fs');

const chunks = [
  '_next/static/chunks/6120-99ba76de6fd208f3.js',
  'OUT/_next/static/chunks/6120-99ba76de6fd208f3.js',
  '_next/static/chunks/507-1cbb4e1ae80f89d3.js',
  'OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js',
  'patch_bc.js',
  'patch_507.js',
  'patch_507_fixed.js',
  'OUT/patch_507.js',
  'OUT/patch_507_fixed.js'
];

chunks.forEach(f => {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    
    const original = 'className:"grid grid-cols-1 md:grid-cols-3 gap-3"';
    const updated = 'className:"flex flex-col gap-8 w-full max-w-[850px] mx-auto"';
    
    if (code.includes(original)) {
        // we use split and join to ensure exact replacement without regex issues
        code = code.split(original).join(updated);
        fs.writeFileSync(f, code);
        console.log('Layout atualizado no arquivo: ' + f);
    }
  }
});
