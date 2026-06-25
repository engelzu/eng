const fs = require('fs');
const { execSync } = require('child_process');

// 1. Revert first to get original stack
execSync('node revert_507.js');
const file = 'c:/Users/user2/Downloads/Eng0906/Eng0206/Eng0206/_next/static/chunks/507-1cbb4e1ae80f89d3.js';

function getStackAtManagerArea() {
  const content = fs.readFileSync(file, 'utf8');
  const startIdx = content.indexOf('name:"title"');
  const targetIdx = content.indexOf('name:"managerArea"');
  if (startIdx === -1 || targetIdx === -1) return null;
  
  let stack = [];
  let slice = content.slice(startIdx, targetIdx);
  for (let i = 0; i < slice.length; i++) {
    const c = slice[i];
    if (c === '(' || c === '{' || c === '[') {
      stack.push(c);
    } else if (c === ')' || c === '}' || c === ']') {
      const last = stack[stack.length - 1];
      if (
        (c === ')' && last === '(') ||
        (c === '}' && last === '{') ||
        (c === ']' && last === '[')
      ) {
        stack.pop();
      } else {
        stack.push(c);
      }
    }
  }
  return stack.join('');
}

const originalStack = getStackAtManagerArea();
console.log('Original stack at managerArea:', JSON.stringify(originalStack));

// 2. Apply patch
execSync('node patch_507_fixed.js');

const patchedStack = getStackAtManagerArea();
console.log('Patched stack at managerArea: ', JSON.stringify(patchedStack));

if (originalStack === patchedStack) {
  console.log('SUCCESS: Brackets are perfectly balanced!');
} else {
  console.log('ERROR: Bracket stack mismatch detected!');
}
