const fs = require('fs');
const { execSync } = require('child_process');

// 1. Revert to clean state
execSync('node revert_507.js');

const file = 'c:/Users/user2/Downloads/Eng0906/Eng0206/Eng0206/_next/static/chunks/507-1cbb4e1ae80f89d3.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  const startIdx = content.indexOf('name:"title"');
  const targetStr = '(0,t.jsx)(eT,{fieldName:"general"})';
  const targetIdx = content.indexOf(targetStr, startIdx);
  
  if (startIdx !== -1 && targetIdx !== -1) {
    // We trace brackets from startIdx to targetIdx + targetStr.length
    let stack = [];
    let slice = content.slice(startIdx, targetIdx + targetStr.length);
    for (let i = 0; i < slice.length; i++) {
      const c = slice[i];
      if (c === '(' || c === '{' || c === '[') {
        stack.push({ char: c, pos: startIdx + i });
      } else if (c === ')' || c === '}' || c === ']') {
        const last = stack[stack.length - 1];
        if (
          (c === ')' && last && last.char === '(') ||
          (c === '}' && last && last.char === '{') ||
          (c === ']' && last && last.char === '[')
        ) {
          stack.pop();
        }
      }
    }
    
    console.log('--- Stack of open brackets at the end of (0,t.jsx)(eT,{fieldName:"general"}) ---');
    console.log(stack.map(item => item.char).join(''));
    
    // Print the next 50 characters in the original file
    const nextChars = content.slice(targetIdx + targetStr.length, targetIdx + targetStr.length + 50);
    console.log('Next characters in original file:', JSON.stringify(nextChars));
  }
}
