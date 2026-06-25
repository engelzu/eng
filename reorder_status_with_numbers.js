const fs = require('fs');

const file507 = 'c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/507-1cbb4e1ae80f89d3.js';
const file507Out = 'c:/Users/user2/Downloads/Eng22_06/Eng22_06/OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js';

for (let f of [file507, file507Out]) {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');
    
    const oldDropdownOptions = '(j.Bw,{children:[' +
      '(0,t.jsx)(j.Ql,{value:"DEVOLUTIVA",children:"DEVOLUTIVA"}),' +
      '(0,t.jsx)(j.Ql,{value:"CAIXA DE ENTRADA",children:"CAIXA DE ENTRADA"}),' +
      '(0,t.jsx)(j.Ql,{value:"PRIORIZADOS",children:"PRIORIZADOS"}),' +
      '(0,t.jsx)(j.Ql,{value:"EM AN\\xc1LISE",children:"EM AN\\xc1LISE"}),' +
      '(0,t.jsx)(j.Ql,{value:"EM ANDAMENTO",children:"EM ANDAMENTO"}),' +
      '(0,t.jsx)(j.Ql,{value:"AGUARDANDO APROVAÇÃO",children:"AGUARDANDO APROVAÇÃO"}),' +
      '(0,t.jsx)(j.Ql,{value:"REVISÃO FINAL",children:"REVISÃO FINAL"}),' +
      '(0,t.jsx)(j.Ql,{value:"CONCLU\\xcdDO",children:"CONCLU\\xcdDO"}),' +
      '(0,t.jsx)(j.Ql,{value:"CANCELADO",children:"CANCELADO"})' +
    ']})';

    const newDropdownOptionsWithNumbers = '(j.Bw,{children:[' +
      '(0,t.jsx)(j.Ql,{value:"DEVOLUTIVA",children:"1 - DEVOLUTIVA"}),' +
      '(0,t.jsx)(j.Ql,{value:"CAIXA DE ENTRADA",children:"2 - CAIXA DE ENTRADA"}),' +
      '(0,t.jsx)(j.Ql,{value:"PRIORIZADOS",children:"3 - PRIORIZADOS"}),' +
      '(0,t.jsx)(j.Ql,{value:"EM AN\\xc1LISE",children:"4 - EM AN\\xc1LISE"}),' +
      '(0,t.jsx)(j.Ql,{value:"EM ANDAMENTO",children:"5 - EM ANDAMENTO"}),' +
      '(0,t.jsx)(j.Ql,{value:"AGUARDANDO APROVAÇÃO",children:"6 - AGUARDANDO APROVAÇÃO"}),' +
      '(0,t.jsx)(j.Ql,{value:"REVISÃO FINAL",children:"7 - REVISÃO FINAL"}),' +
      '(0,t.jsx)(j.Ql,{value:"CONCLU\\xcdDO",children:"8 - CONCLU\\xcdDO"}),' +
      '(0,t.jsx)(j.Ql,{value:"CANCELADO",children:"9 - CANCELADO"})' +
    ']})';

    if (code.includes(oldDropdownOptions)) {
      code = code.replace(oldDropdownOptions, newDropdownOptionsWithNumbers);
      fs.writeFileSync(f, code, 'utf8');
      console.log('Reordered status dropdown with numbers in:', f);
    } else {
       console.log('Could not find exact old string in:', f);
    }
  }
}
