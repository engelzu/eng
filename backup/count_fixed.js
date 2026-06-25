const fs = require('fs');

const t = fs.readFileSync('table_markup_fixed.txt', 'utf8');

let o = 0, c = 0;
for(let i=0; i<t.length; i++) {
  if(t[i]==='[') o++;
  if(t[i]===']') c++;
}
console.log('[', o, c);

o = 0; c = 0;
for(let i=0; i<t.length; i++) {
  if(t[i]==='{') o++;
  if(t[i]==='}') c++;
}
console.log('{', o, c);

o = 0; c = 0;
for(let i=0; i<t.length; i++) {
  if(t[i]==='(') o++;
  if(t[i]===')') c++;
}
console.log('(', o, c);
