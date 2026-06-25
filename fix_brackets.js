const fs = require('fs');
let code = fs.readFileSync('generate_markup.js', 'utf8');

// Replace the target ending of monthsTd template
const oldStr = 'children:formatUSD(val)})})})})`';
const newStr = 'children:formatUSD(val)})]})})})})`';

if (code.includes(oldStr)) {
  code = code.replace(oldStr, newStr);
  fs.writeFileSync('generate_markup.js', code, 'utf8');
  console.log('Successfully fixed generate_markup.js');
} else {
  // Let's do a more generic replacement
  const targetPattern = 'children:formatUSD(val)})})})})';
  if (code.includes(targetPattern)) {
    code = code.replace(targetPattern, 'children:formatUSD(val)})]}))})})'); // wait, let's make sure
    fs.writeFileSync('generate_markup.js', code, 'utf8');
    console.log('Fixed using generic pattern');
  } else {
    console.log('Pattern not found!');
  }
}
