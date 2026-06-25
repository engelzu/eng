const fs = require('fs');

for (let file of ['fast.html', 'business-case.html']) {
  let html = fs.readFileSync(file, 'utf8');
  let patched = false;

  // Patch bc-img-size-modal
  let modalTarget = 'id="bc-img-size-modal" style="display:none;position:fixed;inset:0;z-index:2147483647;';
  if (html.includes(modalTarget) && !html.includes('pointer-events:auto')) {
    html = html.replace(modalTarget, 'id="bc-img-size-modal" style="display:none;position:fixed;inset:0;z-index:2147483647;pointer-events:auto;');
    patched = true;
  }

  // Patch bc-img-resize-handle
  let handleTarget = 'handle.style.cssText = "position: fixed; width: 14px; height: 14px; background: #4f46e5; border: 2px solid white; cursor: nwse-resize; z-index: 2147483647; border-radius: 3px; box-shadow: 0 1px 4px rgba(0,0,0,0.4);";';
  let handleReplacement = 'handle.style.cssText = "position: fixed; width: 14px; height: 14px; background: #4f46e5; border: 2px solid white; cursor: nwse-resize; z-index: 2147483647; border-radius: 3px; box-shadow: 0 1px 4px rgba(0,0,0,0.4); pointer-events: auto;";';
  if (html.includes(handleTarget)) {
    html = html.replace(handleTarget, handleReplacement);
    patched = true;
  }

  if (patched) {
    fs.writeFileSync(file, html, 'utf8');
    console.log('Patched pointer-events: auto in:', file);
  } else {
    console.log('No patch needed or already patched in:', file);
  }
}
