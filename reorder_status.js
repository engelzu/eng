const fs = require('fs');

const file507 = 'c:/Users/user2/Downloads/Eng22_06/Eng22_06/_next/static/chunks/507-1cbb4e1ae80f89d3.js';
const file507Out = 'c:/Users/user2/Downloads/Eng22_06/Eng22_06/OUT/_next/static/chunks/507-1cbb4e1ae80f89d3.js';

for (let f of [file507, file507Out]) {
  if (fs.existsSync(f)) {
    let code = fs.readFileSync(f, 'utf8');

    // The exact old string we found (which could vary slightly depending on previous patches, but we know all these are in it)
    let idx = code.indexOf('(j.Bw,{children:[(0,t.jsx)(j.Ql,{value:"REVISÃO FINAL"');
    if (idx === -1) {
      idx = code.indexOf('(j.Bw,{children:[(0,t.jsx)(j.Ql,{value:"AGUARDANDO APROVAÇÃO"');
    }

    if (idx !== -1) {
      // Find the end of this dropdown block
      let endIdx = code.indexOf(']})', idx);
      if (endIdx !== -1) {
        const oldStr = code.substring(idx, endIdx + 3);

        // Ensure this is the status dropdown
        if (oldStr.includes('CAIXA DE ENTRADA')) {
          const newDropdownOptions = '(j.Bw,{children:[' +
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

          code = code.replace(oldStr, newDropdownOptions);
          fs.writeFileSync(f, code, 'utf8');
          console.log('Reordered status dropdown in:', f);
        }
      }
    }
  }
}
