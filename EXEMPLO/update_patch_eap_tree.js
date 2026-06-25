const fs = require('fs');
let code = fs.readFileSync('patch_eap_tree.js', 'utf8');

// 1. Add dist state
code = code.replace(
  '[showCronogramaModal,setShowCronogramaModal]=(0,E.useState)(!1),[gerCusto,setGerCusto]=(0,E.useState)(r.gerCusto||""),',
  '[showCronogramaModal,setShowCronogramaModal]=(0,E.useState)(!1),[dist,setDist]=(0,E.useState)(r.distribuicaoMensal||{}),[gerCusto,setGerCusto]=(0,E.useState)(r.gerCusto||""),'
);

// 2. Reset dist state
code = code.replace(
  'setShowCronogramaModal(!1),setGerCusto(r.gerCusto||""),',
  'setShowCronogramaModal(!1),setDist(r.distribuicaoMensal||{}),setGerCusto(r.gerCusto||""),'
);

// 3. Save dist state
code = code.replace(
  'equTermino:equActive?equTermino:"",updatedAt:',
  'equTermino:equActive?equTermino:"",distribuicaoMensal:dist,updatedAt:'
);

// 4. Inject getMonths helper
code = code.replace(
  'em=(0,E.useRef)(null);let calculatedSuprimentosCusto=',
  'em=(0,E.useRef)(null);let getMonths=(e,t)=>{if(!e||!t)return[];let n=new Date(e+"T00:00:00"),r=new Date(t+"T00:00:00");if(n>r)return[];let a=[],o=new Date(n.getFullYear(),n.getMonth(),1);for(;o<=r||o.getFullYear()===r.getFullYear()&&o.getMonth()===r.getMonth();)a.push({key:o.getFullYear()+"-"+o.getMonth(),label:o.toLocaleDateString("pt-BR",{month:"short",year:"2-digit"})}),o.setMonth(o.getMonth()+1);return a},calculatedSuprimentosCusto='
);

fs.writeFileSync('patch_eap_tree.js', code);
console.log('patched patch_eap_tree.js');
