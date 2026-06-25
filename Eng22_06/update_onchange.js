const fs = require('fs');

const code = fs.readFileSync('generate_markup.js', 'utf8');

const oldLogic = 'let onChangeLogic = `{const val=e.target.checked;${setVar}(val);`;\\n  if (childrenMap[row.id]) {\\n    for (const child of childrenMap[row.id]) {\\n      const setVarChild = `set${child.charAt(0).toUpperCase() + child.slice(1)}Active`;\\n      onChangeLogic += `${setVarChild}(val);`;\\n    }\\n  }\\n  if (parentsMap[row.id]) {\\n    onChangeLogic += `if(val){`;\\n    for (const parent of parentsMap[row.id]) {\\n      const setVarParent = `set${parent.charAt(0).toUpperCase() + parent.slice(1)}Active`;\\n      onChangeLogic += `${setVarParent}(!0);`;\\n    }\\n    onChangeLogic += `}`;\\n  }\\n  onChangeLogic += `}`;';

const newLogic = `let onChangeLogic = \\\`{const val=e.target.checked;\\\${setVar}(val);\\\`;
  if (row.custoInput) {
    onChangeLogic += \\\`if(!val) set\\\${row.id.charAt(0).toUpperCase() + row.id.slice(1)}Custo("");\\\`;
  }
  if (childrenMap[row.id]) {
    for (const child of childrenMap[row.id]) {
      const setVarChild = \\\`set\\\${child.charAt(0).toUpperCase() + child.slice(1)}Active\\\`;
      onChangeLogic += \\\`\\\${setVarChild}(val);\\\`;
      const childRow = rows.find(r => r.id === child);
      if (childRow && childRow.custoInput) {
        onChangeLogic += \\\`if(!val) set\\\${child.charAt(0).toUpperCase() + child.slice(1)}Custo("");\\\`;
      }
    }
  }
  if (parentsMap[row.id]) {
    onChangeLogic += \\\`if(val){\\\`;
    for (const parent of parentsMap[row.id]) {
      const setVarParent = \\\`set\\\${parent.charAt(0).toUpperCase() + parent.slice(1)}Active\\\`;
      onChangeLogic += \\\`\\\${setVarParent}(!0);\\\`;
    }
    onChangeLogic += \\\`}\\\`;
  }
  onChangeLogic += \\\`}\\\`;`;

fs.writeFileSync('generate_markup.js', code.replace(oldLogic, newLogic));
console.log('Successfully updated onChangeLogic to clear costs');
