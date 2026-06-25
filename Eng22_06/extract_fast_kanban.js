const fs = require('fs');
const fileFast = '_next/static/chunks/app/fast/page-5d0c28c966a6b026.js';
if (fs.existsSync(fileFast)) {
  let code = fs.readFileSync(fileFast, 'utf8');
  
  let idxCols = code.indexOf('Y=[{title:"DEVOLUTIVA"');
  if(idxCols !== -1) console.log('Cols:', code.substring(idxCols, idxCols+1000));
  
  let idxMap = code.indexOf('"EM AN\\xc1LISE"===t');
  if(idxMap !== -1) console.log('Map:', code.substring(Math.max(0, idxMap-100), idxMap+100));
  
  let idxFilters = code.indexOf('children:"PRIORIZADOS"})');
  if(idxFilters !== -1) console.log('Filters:', code.substring(Math.max(0, idxFilters-100), idxFilters+300));
  
  let idxSwitch = code.indexOf('case"PRIORIZADOS":');
  if(idxSwitch !== -1) console.log('Switch:', code.substring(Math.max(0, idxSwitch-100), idxSwitch+200));
}
