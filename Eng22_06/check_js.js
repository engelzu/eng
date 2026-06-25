const fs = require('fs');

function checkBrackets(text) {
    const stack = [];
    const pairs = { ')': '(', ']': '[', '}': '{' };
    let inString = false;
    let stringChar = '';
    
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (inString) {
            if (c === stringChar && text[i-1] !== '\\') {
                inString = false;
            }
            continue;
        }
        if (c === '"' || c === "'") {
            inString = true;
            stringChar = c;
            continue;
        }
        if (['(', '[', '{'].includes(c)) {
            stack.push({ char: c, index: i });
        } else if ([')', ']', '}'].includes(c)) {
            if (stack.length === 0) {
                console.log(`Unexpected ${c} at index ${i}`);
                console.log("Context:", text.substring(Math.max(0, i-50), i+50));
                return false;
            }
            const top = stack.pop();
            if (top.char !== pairs[c]) {
                console.log(`Mismatched ${c} at index ${i}, expected match for ${top.char} which was opened at ${top.index}`);
                console.log("Context:", text.substring(Math.max(0, i-50), i+50));
                return false;
            }
        }
    }
    
    if (stack.length > 0) {
        console.log(`Unmatched brackets remaining: ${stack.length}`);
        return false;
    }
    console.log("All good!");
    return true;
}

const text = fs.readFileSync('_next/static/chunks/6120-99ba76de6fd208f3.js', 'utf8');
checkBrackets(text);
