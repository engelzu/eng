const startTarget = 'children:[(0,t.jsxs)("div",{className:"flex flex-col md:flex-row items-end gap-4 w-full md:w-auto",children:[(0,t.jsx)("div",{className:"w-full md:w-[280px]",children:a&&K&&(0,t.jsx)(d.Wi,{';
const capexSelectorMarkup = '(0,t.jsxs)("div",{className:"w-full md:w-[280px] space-y-2",children:[(0,t.jsx)(d.lX,{className:"text-xs font-bold text-green-700 uppercase",children:"MODELO CONT\\xc1BIL"}),(0,t.jsxs)("select",{value:modeloContabil,onChange:e=>{let val=e.target.value;setModeloContabil(val);if(val==="CAPEX"){setShowCapexModal(!0)}else{setTipoCapex("")}},className:"flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-medium text-slate-800",children:[(0,t.jsx)("option",{value:"",children:"Selecione..."}),(0,t.jsx)("option",{value:"CAPEX",children:"CAPEX"}),(0,t.jsx)("option",{value:"C.CUSTO",children:"C.CUSTO"})]}),modeloContabil==="CAPEX"&&tipoCapex&&(0,t.jsx)("span",{className:"text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded mt-1.5 cursor-pointer hover:bg-emerald-100/80 transition-all block text-center uppercase tracking-wider",onClick:()=>setShowCapexModal(!0),children:tipoCapex})]}),';

// Let's test different endings
const endings = [
  ']})),',
  ']}),',
  ']})',
  ']}))',
];

endings.forEach(ending => {
  const full = startTarget + 'control:eC.control,name:"status",render:e=>{let{field:s}=e;return(0,t.jsxs)(d.xJ,{className:"space-y-0",children:[(0,t.jsxs)("div",{className:"flex flex-col md:flex-row items-start gap-4",children:[(0,t.jsxs)("div",{className:"space-y-2 min-w-[240px]",children:[(0,t.jsx)(d.lX,{className:"text-xs font-bold text-green-700 uppercase",children:"Status"}),(0,t.jsxs)(j.Ph,{onValueChange:e=>{},value:s.value,disabled:false,children:[(0,t.jsx)(d.NI,{children:(0,t.jsx)(j.i4,{className:"h-10 bg-white border-input",children:(0,t.jsx)(j.ki,{placeholder:"STATUS"})})}),(0,t.jsxs)(j.Bw,{children:[]})]})]})]})]}) }}) })' + ', ' + capexSelectorMarkup + ending;
  
  let stack = [];
  for (let i = 0; i < full.length; i++) {
    const c = full[i];
    if (c === '(' || c === '{' || c === '[') {
      stack.push(c);
    } else if (c === ')' || c === '}' || c === ']') {
      const top = stack[stack.length - 1];
      const expected = { ')': '(', '}': '{', ']': '[' }[c];
      if (top === expected) {
        stack.pop();
      } else {
        stack.push(c);
      }
    }
  }
  console.log(`Ending '${ending}': Unbalanced =`, stack.join(' '));
});
