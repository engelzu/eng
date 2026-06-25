const fs = require('fs');

const rows = [
  { id: 'eap', name: 'Modelo EAP', isBold: true, custo: 'calculatedEapCusto', indent: 0 },
  { id: 'eng', name: '1 Engenharia', isSemiBold: true, custoInput: true, indent: 6 },
  { id: 'ger', name: '2 Gerenciamento', isSemiBold: true, custoInput: true, indent: 6 },
  { id: 'sup', name: '3 Suprimentos', isBold: true, custo: 'calculatedSuprimentosCusto', indent: 6 },
  { id: 'mat', name: '3.1 Materiais', custoInput: true, indent: 10 },
  { id: 'equ', name: '3.2 Equipamentos', custoInput: true, indent: 10 },
  { id: 'ser', name: '4 Implantação', isBold: true, custo: 'calculatedImplantaCusto', indent: 6 },
  { id: 'constCiv', name: '4.1 Construção civil', custoInput: true, indent: 10 },
  { id: 'montEle', name: '4.2 Montagem Eletromecânica', isBold: true, custo: 'calculatedMontagemCusto', indent: 10 },
  { id: 'fab', name: '4.2.1 Fabricações', custoInput: true, indent: 10, textSlate: 500 },
  { id: 'mon', name: '4.2.2 Montagem', custoInput: true, indent: 10, textSlate: 500 },
  { id: 'com', name: '4.3 Comissionamento', custoInput: true, indent: 10 },
  { id: 'con', name: '5 Contingenciamento', isSemiBold: true, custoInput: true, indent: 6 }
];
const childrenMap = {
  eap: ['eng', 'ger', 'sup', 'mat', 'equ', 'ser', 'constCiv', 'montEle', 'fab', 'mon', 'com', 'con'],
  sup: ['mat', 'equ'],
  ser: ['constCiv', 'montEle', 'fab', 'mon', 'com'],
  montEle: ['fab', 'mon']
};
const parentsMap = {
  eng: ['eap'],
  ger: ['eap'],
  sup: ['eap'],
  mat: ['sup', 'eap'],
  equ: ['sup', 'eap'],
  ser: ['eap'],
  constCiv: ['ser', 'eap'],
  montEle: ['ser', 'eap'],
  fab: ['montEle', 'ser', 'eap'],
  mon: ['montEle', 'ser', 'eap'],
  com: ['ser', 'eap'],
  con: ['eap']
};

let markup = `(0,t.jsx)(s.Vq,{open:showEapModal,onOpenChange:setShowEapModal,children:(0,t.jsxs)(s.cZ,{className:"w-[98vw] max-w-[1600px] max-h-[95vh] flex flex-col overflow-hidden border-emerald-500 shadow-2xl rounded-2xl",children:[(0,t.jsxs)(s.fK,{className:"p-4 pb-2 bg-emerald-50/50 border-b border-emerald-100 shrink-0",children:[(0,t.jsxs)(s.$N,{className:"flex items-center gap-2 text-emerald-800",children:[(0,t.jsx)(v.Z,{className:"h-5 w-5"}),"CRONOGRAMA E VALORES EAP"]}),(0,t.jsx)(s.Be,{children:"Preencha os prazos e custos por tipo de estrutura EAP."})]}),(0,t.jsxs)("div",{className:"p-4 space-y-4 max-h-[70vh] overflow-y-auto",children:[(0,t.jsxs)("div",{className:"space-y-1.5",children:[(0,t.jsx)(g._,{className:"text-xs font-black text-slate-700 uppercase tracking-wide",children:"Estrutura EAP"}),(0,t.jsxs)("select",{value:eap,onChange:e=>setEap(e.target.value),className:"w-full h-8 border border-slate-200 rounded-md px-2 text-[11px] bg-white focus:border-emerald-500 outline-none",children:[(0,t.jsx)("option",{value:"",children:"Selecione..."}),null==T?void 0:T.map(e=>(0,t.jsx)("option",{value:e.name,children:e.name},e.id))]})]}),(0,t.jsx)("div",{className:"overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm",children:(0,t.jsxs)("table",{className:"w-full border-collapse text-left text-xs",children:[(0,t.jsx)("thead",{className:"bg-slate-50 border-b border-slate-200",children:(0,t.jsxs)("tr",{className:"text-slate-600 uppercase text-[10px] font-black tracking-wider",children:[(0,t.jsx)("th",{className:"py-2 px-2 w-[40px]"}),(0,t.jsx)("th",{className:"py-2 px-2 whitespace-nowrap",children:"Estrutura EAP"}),(0,t.jsx)("th",{className:"py-2 px-2 w-[120px]",children:"Início"}),(0,t.jsx)("th",{className:"py-2 px-2 w-[120px]",children:"Término"}),(0,t.jsx)("th",{className:"py-2 px-2 w-[140px] text-right",children:"Custo Total (USD)"}),(0,t.jsx)("th",{className:"py-2 px-2",children:"Distribuição Mensal"})]})}),(0,t.jsx)("tbody",{className:"divide-y divide-slate-100 text-[11px]",children:[`;

let first = true;
for (const row of rows) {
  if (!first) markup += ",";
  first = false;
  const activeVar = "set" + row.id.charAt(0).toUpperCase() + row.id.slice(1);
  const activeVarName = row.id + "Active";
  let onChangeLogic = "{const val=e.target.checked;" + activeVar + "Active(val);";
  if (row.custoInput) {
    onChangeLogic += "if(!val) " + activeVar + "Custo(\"\");";
  }
  if (childrenMap[row.id]) {
    for (const child of childrenMap[row.id]) {
      const setVarChild = "set" + child.charAt(0).toUpperCase() + child.slice(1) + "Active";
      onChangeLogic += setVarChild + "(val);";
      const childRow = rows.find(r => r.id === child);
      if (childRow && childRow.custoInput) {
        onChangeLogic += "if(!val) set" + child.charAt(0).toUpperCase() + child.slice(1) + "Custo(\"\");";
      }
    }
  }
  if (parentsMap[row.id]) {
    onChangeLogic += "if(val){";
    for (const parent of parentsMap[row.id]) {
      const setVarParent = "set" + parent.charAt(0).toUpperCase() + parent.slice(1) + "Active";
      onChangeLogic += setVarParent + "(!0);";
    }
    onChangeLogic += "}";
  }
  onChangeLogic += "}";

  let rowClass = "hover:bg-slate-50/50 transition-all group ";
  if (row.id === 'eap') rowClass += "bg-slate-100/60 font-bold text-slate-800 border-t border-slate-200 ";
  else if (row.isBold) rowClass += "bg-slate-50/50 font-bold text-slate-800 ";
  else if (row.id === 'montEle') rowClass += "bg-slate-50/20 font-semibold text-slate-800 ";

  let nameClass = "py-1.5 px-2 pl-" + (row.indent || 3) + " transition-all whitespace-nowrap ";
  if (row.id === 'eap') {
    nameClass = "py-1.5 px-2 whitespace-nowrap font-black transition-all text-slate-800";
  } else if (row.isBold) {
    nameClass += "font-bold text-slate-800";
  } else if (row.isSemiBold) {
    nameClass += "font-semibold text-slate-700";
  } else if (row.textSlate) {
    nameClass += "text-slate-500";
  } else {
    nameClass += "text-slate-600";
  }

  const dateClass = "w-full h-6 rounded border border-slate-200 px-2 py-0.5 text-[10px] outline-none focus:border-emerald-500 transition-all shadow-sm bg-white text-slate-800";
  const dateClassBg = "w-full h-6 rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] outline-none focus:border-emerald-500 transition-all shadow-sm bg-white text-slate-800";

  let custoEl;
  if (row.custoInput) {
    const custoVar = row.id + "Custo";
    const setCustoVar = "set" + custoVar.charAt(0).toUpperCase() + custoVar.slice(1);
    custoEl = `(0,t.jsx)("input",{type:"text",value:${custoVar},onChange:e=>${setCustoVar}(e.target.value),placeholder:"$ 0.00",className:"w-24 h-6 rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-right outline-none focus:border-emerald-500 transition-all shadow-sm bg-white text-slate-800"})`;
  } else {
    custoEl = `formatUSD(${row.custo})`;
  }

  let custoClass = "py-1.5 px-2 text-right ";
  if (row.id === 'eap') custoClass += "font-black text-emerald-700";
  else if (row.isBold) custoClass += "font-bold text-slate-700";
  else if (row.id === 'montEle') custoClass += "font-bold text-slate-600";

  let rowTotalCost = row.custoInput ? row.id + "Custo" : row.custo;

  let monthsTd = `(0,t.jsx)("td",{className:"py-1 px-2",children:(0,t.jsx)("div",{className:(${row.id}Inicio && ${row.id}Termino)?"flex flex-wrap gap-1.5 py-0.5":"hidden",children:getMonths(${row.id}Inicio,${row.id}Termino).map(m=>{let rDist=dist["${row.id}"]||{};let pct=rDist[m.key]!==void 0?rDist[m.key]:"";let vals=Object.values(rDist).filter(v=>v!=="");let manCount=vals.length;let totPct=vals.reduce((a,b)=>a+(parseFloat(b)||0),0);let totCusto=parseFloat(${rowTotalCost})||0;let val=0;if(pct!==""){val=totCusto*(parseFloat(pct)/100)}else{let remM=Math.max(1,getMonths(${row.id}Inicio,${row.id}Termino).length-manCount);let remC=totCusto*(1-totPct/100);val=remC/remM;}return(0,t.jsxs)("div",{className:"flex-shrink-0 w-[84px] border border-emerald-100/50 rounded-lg p-1.5 bg-white shadow-sm flex flex-col gap-1",key:m.key,children:[(0,t.jsx)("div",{className:"text-[9px] font-black text-emerald-800 uppercase text-center tracking-widest",children:m.label}),(0,t.jsxs)("div",{className:"flex items-center gap-1",children:[(0,t.jsx)("input",{type:"number",min:0,max:100,placeholder:"%",value:pct,onChange:e=>setDist({...dist,["${row.id}"]:{...rDist,[m.key]:e.target.value}}),className:"w-full h-5 text-[10px] text-center border border-slate-200 rounded bg-slate-50 outline-none focus:border-emerald-500 focus:bg-white transition-all"}),(0,t.jsx)("span",{className:"text-[9px] text-slate-400 font-bold",children:"%"})]}),(0,t.jsx)("div",{className:"text-[9px] font-bold text-slate-600 text-center bg-slate-50 rounded py-0.5 border border-slate-100",children:formatUSD(val)})]})})})})`;

  let mainRow = `(0,t.jsxs)("tr",{className:"${rowClass}",children:[(0,t.jsx)("td",{className:"py-1.5 px-2 w-[40px] text-center",children:(0,t.jsx)("input",{type:"checkbox",className:"h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"})}),(0,t.jsx)("td",{className:"${nameClass}",children:"${row.name}"}),(0,t.jsx)("td",{className:"py-1 px-1.5",children:(0,t.jsx)("input",{type:"date",value:${row.id}Inicio,onChange:e=>set${row.id.charAt(0).toUpperCase()}${row.id.slice(1)}Inicio(e.target.value),className:"${dateClass}"})}),(0,t.jsx)("td",{className:"py-1 px-1.5",children:(0,t.jsx)("input",{type:"date",value:${row.id}Termino,onChange:e=>set${row.id.charAt(0).toUpperCase()}${row.id.slice(1)}Termino(e.target.value),className:"${dateClassBg}"})}),(0,t.jsx)("td",{className:"${custoClass}",children:${custoEl}}),${monthsTd}]})`;

  markup += mainRow;
}

let clearLogic = "setDist({});";
for (const row of rows) {
  if (row.custoInput) {
    clearLogic += "set" + row.id.charAt(0).toUpperCase() + row.id.slice(1) + "Custo(\"\");";
  }
}
const confirmModal = "showClearConfirm && ((0,t.jsx)(\"div\",{className:\"fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm\",children:(0,t.jsxs)(\"div\",{className:\"bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-slate-100 mx-4\",children:[(0,t.jsx)(\"div\",{className:\"w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4\",children:(0,t.jsx)(\"svg\",{className:\"w-6 h-6\",fill:\"none\",viewBox:\"0 0 24 24\",stroke:\"currentColor\",strokeWidth:2,children:(0,t.jsx)(\"path\",{strokeLinecap:\"round\",strokeLinejoin:\"round\",d:\"M9 21l-1-0.5a2 2 0 0 1-1-1.5L5 6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v13a2 2 0 0 1-1 1.5L15 21\"})})}),(0,t.jsx)(\"h3\",{className:\"text-lg font-black text-slate-800 mb-2\",children:\"Limpar Valores Financeiros?\"}),(0,t.jsx)(\"p\",{className:\"text-sm text-slate-500 mb-6 font-medium\",children:\"Você está prestes a apagar todos os custos inseridos e a distribuição mensal. As datas e estruturas selecionadas serão mantidas.\"}),(0,t.jsxs)(\"div\",{className:\"flex items-center justify-end gap-3\",children:[(0,t.jsx)(\"button\",{onClick:()=>setShowClearConfirm(!1),className:\"px-4 py-2 text-xs font-black text-slate-600 hover:bg-slate-100 rounded-xl transition-colors tracking-widest\",children:\"CANCELAR\"}),(0,t.jsx)(\"button\",{onClick:()=>{ " + clearLogic + " setShowClearConfirm(!1) },className:\"px-4 py-2 text-xs font-black text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-md shadow-red-500/30 tracking-widest\",children:\"SIM, LIMPAR\"})]})]})" + '})' + ')';

const triggerBtn = `(0,t.jsx)(u.z,{variant:"outline",onClick:()=>setShowClearConfirm(!0),className:"rounded-xl font-black text-xs px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 mr-auto",children:"LIMPAR VALORES"})`;

markup += ']})' + ']})' + '})' + ']})' + ',';
markup += confirmModal;
markup += ',' + '(0,t.jsxs)(s.cN,{className:"shrink-0 p-3",children:[' + triggerBtn + ',(0,t.jsx)(u.z,{variant:"outline",onClick:()=>setShowEapModal(!1),className:"rounded-xl font-black text-xs px-4 py-2",children:"FECHAR"}),(0,t.jsx)(u.z,{onClick:()=>setShowEapModal(!1),className:"bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs px-4 py-2",children:"APLICAR"})]})]})})';

fs.writeFileSync('eap_modal_markup.js', 'module.exports = ' + JSON.stringify(markup) + ';');
console.log("Successfully wrote eap_modal_markup.js");
