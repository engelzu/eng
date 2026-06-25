const fs = require('fs');
const html = fs.readFileSync('business-case.html', 'utf8');
const i = html.indexOf('_bcSave');
const s = html.lastIndexOf('<script>', i);
const e = html.indexOf('</script>', i) + 9;
const block = html.substring(s, e);

const js = block.replace('</script>', '').replace('<script>', '').trim();

try {
  new Function(js);
  console.log('SYNTAX OK');
} catch(err) {
  console.log('SYNTAX ERROR:', err.message);
  const lines = js.split('\n');
  const match = err.message.match(/line (\d+)/);
  if (match) {
    const lineNum = parseInt(match[1]);
    for (let l = Math.max(0, lineNum - 3); l < Math.min(lines.length, lineNum + 2); l++) {
      console.log((l+1) + ': ' + lines[l]);
    }
  }
}
