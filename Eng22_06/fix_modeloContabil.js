const fs = require('fs');

function fixFile(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');
  
  const pat = ');[modeloContabil,setModeloContabil]=(0,g.useState)((e.fast&&e.fast.modeloContabil)||""),[tipoCapex';
  if (c.includes(pat)) {
    c = c.replace(pat, ');let [modeloContabil,setModeloContabil]=(0,g.useState)((e.fast&&e.fast.modeloContabil)||""),[tipoCapex');
    fs.writeFileSync(filePath, c);
    console.log(filePath + ': Fixed let keyword');
  } else {
    console.log(filePath + ': Pattern not found');
    const idx = c.indexOf('modeloContabil');
    if (idx >= 0) {
      console.log(filePath + ': Context:', c.substring(Math.max(0, idx-10), idx+60));
    }
  }
}

fixFile('_next/static/chunks/507-1cbb4e1ae80f89d3.js');
fixFile('OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js');
