/**
 * RESTORE BC DIGITAL FROM BACKUP
 * Extrai os scripts funcionais do backup e substitui no projeto atual.
 * Preserva mudanças do FAST/Kanban que nao pertencem ao BC Digital.
 */
const fs = require('fs');

const BACKUP  = 'C:/Users/user2/Downloads/EngV1/backup/business-case.html';
const CURRENT = 'C:/Users/user2/Downloads/EngV1/Eng25_06/Eng22_06/business-case.html';
const OUT     = 'C:/Users/user2/Downloads/EngV1/Eng25_06/Eng22_06/OUT/business-case.html';

const backup  = fs.readFileSync(BACKUP,  'utf8');
let   current = fs.readFileSync(CURRENT, 'utf8');

// ─── Helper: extract a script block by searching for a unique string inside it ───
function extractScriptBlock(html, uniqueContent) {
    var idx = html.indexOf(uniqueContent);
    if (idx === -1) { console.error('NOT FOUND:', uniqueContent); return null; }
    var start = html.lastIndexOf('<script', idx);
    var end   = html.indexOf('</script>', idx) + '</script>'.length;
    return html.substring(start, end);
}

// ─── Helper: extract a script by its id attribute ───
function extractScriptById(html, id) {
    var idStr = 'id="' + id + '"';
    var idx = html.indexOf(idStr);
    if (idx === -1) { console.error('NOT FOUND id:', id); return null; }
    var start = html.lastIndexOf('<script', idx);
    var end   = html.indexOf('</script>', idx) + '</script>'.length;
    return html.substring(start, end);
}

// ─── Extract key scripts from BACKUP ───
var script_adv_editor  = extractScriptBlock(backup, 'BC Advanced Editor Enhancement v2.0');
var script_inert_guard = extractScriptById(backup, 'bc-inert-guard');
var script_adv_edit    = extractScriptById(backup, 'bc-adv-edit-script');

// Also extract the TinyMCE init scripts (BC-specific)
// There are 3 TinyMCE init scripts in backup (scripts 31, 32, 33)
// Find them by looking for "BC1 Final inject loa" and "BC Final inject load"
var script_tiny1 = extractScriptBlock(backup, "[TinyMCE] BC1 Final inject loa");
// Script 32 is the second occurrence of same marker - need special handling
var tiny2start = backup.indexOf("[TinyMCE] BC1 Final inject loa", backup.indexOf("[TinyMCE] BC1 Final inject loa") + 100);
var script_tiny2 = null;
if (tiny2start !== -1) {
    var s2 = backup.lastIndexOf('<script', tiny2start);
    var e2 = backup.indexOf('</script>', tiny2start) + '</script>'.length;
    script_tiny2 = backup.substring(s2, e2);
}
var script_tiny3 = extractScriptBlock(backup, "[TinyMCE] BC Final inject load");

// ─── Also extract HTML elements ───
// Extract bc-table-bar element
function extractDivById(html, id) {
    var idStr = 'id="' + id + '"';
    var idx = html.indexOf(idStr);
    if (idx === -1) { console.log('HTML element not found:', id); return null; }
    var divStart = html.lastIndexOf('<div', idx);
    // Find matching closing div by counting depth
    var i = divStart;
    var depth = 0;
    var found = false;
    while (i < html.length) {
        if (html[i] === '<') {
            if (html.substring(i, i+4) === '<div') {
                // check if self-closing
                var tagEnd = html.indexOf('>', i);
                if (html[tagEnd-1] !== '/') depth++;
                i = tagEnd;
            } else if (html.substring(i, i+6) === '</div>') {
                depth--;
                if (depth <= 0) { found = true; i += 6; break; }
                i += 6;
            } else {
                i++;
            }
        } else {
            i++;
        }
    }
    return found ? html.substring(divStart, i) : null;
}

var elem_table_bar  = extractDivById(backup, 'bc-table-bar');
var elem_img_bar    = extractDivById(backup, 'bc-img-bar');
var elem_adv_styles = extractScriptById(backup, 'bc-adv-edit-styles');

console.log('=== EXTRACTED FROM BACKUP ===');
console.log('BC Advanced Editor Enhancement:', script_adv_editor ? Math.round(script_adv_editor.length/1024)+'kb' : 'FAIL');
console.log('bc-inert-guard script:', script_inert_guard ? Math.round(script_inert_guard.length/1024)+'kb' : 'FAIL');
console.log('bc-adv-edit-script:', script_adv_edit ? Math.round(script_adv_edit.length/1024)+'kb' : 'FAIL');
console.log('TinyMCE init script1:', script_tiny1 ? Math.round(script_tiny1.length/1024)+'kb' : 'FAIL');
console.log('TinyMCE init script2:', script_tiny2 ? Math.round(script_tiny2.length/1024)+'kb' : 'FAIL');
console.log('TinyMCE init script3:', script_tiny3 ? Math.round(script_tiny3.length/1024)+'kb' : 'FAIL');
console.log('bc-table-bar HTML:', elem_table_bar ? Math.round(elem_table_bar.length/1024)+'kb' : 'FAIL');
console.log('bc-img-bar HTML:', elem_img_bar ? Math.round(elem_img_bar.length/1024)+'kb' : 'FAIL');
console.log('bc-adv-edit-styles:', elem_adv_styles ? Math.round(elem_adv_styles.length/1024)+'kb' : 'FAIL');

// ─── Now inject into CURRENT ───
// Step 1: Remove all broken table scripts we added
current = current.replace(/<script id="bc-table-(?:controls-v\d+|final)"[\s\S]*?<\/script>\s*/g, '');
current = current.replace(/<script id="bc-table-fix\d*"[\s\S]*?<\/script>\s*/g, '');

// Step 2: If backup scripts are not already present, inject them before </body>
var bodyClose = current.lastIndexOf('</body>');
if (bodyClose === -1) { console.error('No </body> found!'); process.exit(1); }

var toInject = '\n';

// Only inject scripts that aren't already there
if (current.indexOf('BC Advanced Editor Enhancement') === -1 && script_adv_editor) {
    toInject += '\n' + script_adv_editor + '\n';
}
if (current.indexOf('bc-inert-guard') === -1 && script_inert_guard) {
    toInject += '\n' + script_inert_guard + '\n';
}
if (current.indexOf('bc-adv-edit-script') === -1 && script_adv_edit) {
    toInject += '\n' + script_adv_edit + '\n';
}

// For HTML elements (bc-table-bar, bc-img-bar): inject before </body>
if (current.indexOf('id="bc-table-bar"') === -1 && elem_table_bar) {
    toInject += '\n' + elem_table_bar + '\n';
}
if (current.indexOf('id="bc-img-bar"') === -1 && elem_img_bar) {
    toInject += '\n' + elem_img_bar + '\n';
}

// For adv-edit-styles
if (current.indexOf('bc-adv-edit-styles') === -1 && elem_adv_styles) {
    toInject += '\n' + elem_adv_styles + '\n';
}

// For TinyMCE init scripts
// The current file may already have TinyMCE init scripts - check
var hasTiny1 = current.indexOf('[TinyMCE] BC1 Final inject loa') !== -1;
var hasTiny3 = current.indexOf('[TinyMCE] BC Final inject load') !== -1;
if (!hasTiny1 && script_tiny1) toInject += '\n' + script_tiny1 + '\n';
if (!hasTiny1 && script_tiny2) toInject += '\n' + script_tiny2 + '\n';
if (!hasTiny3 && script_tiny3) toInject += '\n' + script_tiny3 + '\n';

// Inject
current = current.substring(0, bodyClose) + toInject + '\n</body>' + current.substring(bodyClose + 7);

// Step 3: Fix any remaining broken calls
current = current.replace(/window\.bcRenderTableControls\s*&&\s*window\.bcRenderTableControls\([^)]+\)/g, '/* removed */');
current = current.replace(/window\.bcRenderTableControls\([^)]+\)/g, '/* removed */');
current = current.replace(/window\.bcRemoveTableControls\s*&&\s*window\.bcRemoveTableControls\(\)/g, '/* removed */');
current = current.replace(/window\.bcRemoveTableControls\(\)/g, '/* removed */');

fs.writeFileSync(CURRENT, current);
fs.writeFileSync(OUT, current);

console.log('\n=== DONE ===');
console.log('New business-case.html:', Math.round(current.length/1024)+'kb');
console.log('Has BC Advanced Editor:', current.indexOf('BC Advanced Editor Enhancement')!==-1);
console.log('Has bc-inert-guard:', current.indexOf('bc-inert-guard')!==-1);
console.log('Has bc-adv-edit-script:', current.indexOf('bc-adv-edit-script')!==-1);
console.log('Has bc-table-bar:', current.indexOf('bc-table-bar')!==-1);
console.log('Has bcDeleteTable:', current.indexOf('bcDeleteTable')!==-1);
console.log('Has positionTableBar:', current.indexOf('positionTableBar')!==-1);
