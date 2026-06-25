const fs = require('fs');
const markup = require('./eap_modal_markup.js');

let stack = [];
for (let i = 0; i < markup.length; i++) {
  const char = markup[i];
  if (char === '(' || char === '[' || char === '{') {
    stack.push({ char, index: i });
  } else if (char === ')' || char === ']' || char === '}') {
    if (stack.length === 0) {
      console.log('Unmatched closing char:', char, 'at index:', i);
      console.log(markup.substring(Math.max(0, i - 50), i + 50));
      process.exit(1);
    }
    const last = stack.pop();
    const isMatch = (last.char === '(' && char === ')') ||
                    (last.char === '[' && char === ']') ||
                    (last.char === '{' && char === '}');
    if (!isMatch) {
      console.log('Mismatch:', last.char, 'and', char, 'at index:', i);
      console.log('Opening was at:', last.index);
      console.log('Context around opening:');
      console.log(markup.substring(Math.max(0, last.index - 50), last.index + 50));
      console.log('Context around closing:');
      console.log(markup.substring(Math.max(0, i - 50), i + 50));
      process.exit(1);
    }
  }
}

if (stack.length > 0) {
  console.log('Unclosed opening chars:', stack);
} else {
  console.log('Brackets match perfectly!');
}
