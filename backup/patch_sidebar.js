const fs = require('fs');

const files = ['js/i18n.js', 'OUT/js/i18n.js'];

files.forEach(p => {
    if (!fs.existsSync(p)) return;
    let code = fs.readFileSync(p, 'utf8');

    if (!code.includes("'sidebar.menu.hybridprioritization'")) {
        // PT-BR target
        code = code.replace(
            "'sidebar.menu.fast': 'FAST',",
            "'sidebar.menu.fast': 'FAST',\n      'sidebar.menu.hybridprioritization': 'PRIORIZAÇÃO HÍBRIDA',"
        );
        
        // However, replace() only replaces the first occurrence, so the ES-ES target needs the second pass
        // Let's replace the second occurrence explicitly or just use a global replace? Wait, ES-ES has the exact same string.
        // Let's use a trick: we replace the one in pt-BR section and the one in es-ES section.
        // Or better yet, look for 'sidebar.menu.businesscase'
    }
    
    fs.writeFileSync(p, code, 'utf8');
    console.log('Successfully patched', p);
});

// Since replace only does the first occurrence, let's do it cleanly by doing it globally for pt-BR and manually for es-ES
files.forEach(p => {
    if (!fs.existsSync(p)) return;
    let code = fs.readFileSync(p, 'utf8');
    
    // Check if the Spanish one got replaced (the Spanish one will have "PRIORIZAÇÃO HÍBRIDA" if it matched, or it was skipped).
    // Let's just do a specific replace for the Spanish text. We know it's near 'sidebar.menu.fast'.
    // Actually, we can just replace the spanish translation:
    code = code.replace(
        "'sidebar.menu.businesscase': 'BUSINESS CASE',\n      'sidebar.menu.resourceload': 'CARGA DE RECURSOS',",
        "'sidebar.menu.businesscase': 'BUSINESS CASE',\n      'sidebar.menu.hybridprioritization': 'PRIORIZACIÓN HÍBRIDA',\n      'sidebar.menu.resourceload': 'CARGA DE RECURSOS',"
    );

    fs.writeFileSync(p, code, 'utf8');
});
