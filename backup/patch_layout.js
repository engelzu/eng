const fs = require('fs');

const chunks = [
  '_next/static/chunks/6120-99ba76de6fd208f3.js',
  'OUT/_next/static/chunks/6120-99ba76de6fd208f3.js',
  'patch_bc.js'
];

chunks.forEach(f => {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    
    // Altera o layout de grid (3 colunas) para 1 coluna centralizada como folha A4
    code = code.replace(/className:"grid grid-cols-1 md:grid-cols-3 gap-3"/g, 'className:"flex flex-col gap-8 w-full max-w-[850px] mx-auto"');
    
    fs.writeFileSync(f, code);
    console.log('Layout atualizado no arquivo: ' + f);
  }
});

// Agora vamos atualizar o script de injecao do TinyMCE para habilitar o autoresize e melhorar a altura
const injectScriptPath = 'inject_tinymce6.js';
if (fs.existsSync(injectScriptPath)) {
    let code = fs.readFileSync(injectScriptPath, 'utf8');
    
    // Adicionar plugin autoresize e ajustar alturas
    code = code.replace(/plugins: 'lists link table code',/g, "plugins: 'lists link table code autoresize',");
    code = code.replace(/height: 250,/g, "min_height: 300, max_height: 1200,");
    
    fs.writeFileSync(injectScriptPath, code);
    console.log('Plugin autoresize e alturas atualizados em ' + injectScriptPath);
}

// Tambem precisamos reaplicar o inject_tinymce6.js nos HTMLs porque o scriptToInject lá dentro mudou
