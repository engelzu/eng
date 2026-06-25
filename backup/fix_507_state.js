const fs = require('fs');
const files = [
  '_next/static/chunks/507-1cbb4e1ae80f89d3.js',
  'OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js'
];

files.forEach(f => {
    if (fs.existsSync(f)) {
        let code = fs.readFileSync(f, 'utf8');
        
        const regex = /(\[bc1Objetivo,setBc1Objetivo\]=\(0,([a-zA-Z_]+)\.useState\)\(\(([a-zA-Z_\.]+)\s*&&\s*[a-zA-Z_\.]+\.bc1Objetivo\)\|\|""\))/;
        
        const match = code.match(regex);
        if (match && !code.includes('bcEscopoResumido,setBcEscopoResumido')) {
            const fullMatch = match[1];
            const hook = match[2]; 
            const obj = match[3]; 
            
            const injected = `[bcEscopoResumido,setBcEscopoResumido]=(0,${hook}.useState)((${obj} && ${obj}.bcEscopoResumido)||""),[bcDescricaoEscopo,setBcDescricaoEscopo]=(0,${hook}.useState)((${obj} && ${obj}.bcDescricaoEscopo)||""),`;
            
            code = code.replace(fullMatch, injected + fullMatch);
            fs.writeFileSync(f, code);
            console.log('Fixed 507 state in ' + f);
        } else {
            if (code.includes('bcEscopoResumido,setBcEscopoResumido')) {
                console.log('Already fixed in ' + f);
            } else {
                console.log('Regex did not match in ' + f);
            }
        }
    }
});
