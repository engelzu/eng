const fs = require('fs');
const file = 'c:/Users/user2/Downloads/Eng0906/Eng0206/Eng0206/_next/static/chunks/507-1cbb4e1ae80f89d3.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  console.log('Includes SALVAR BUSINESS CASE:', content.includes('SALVAR BUSINESS CASE'));
  console.log('Includes ModalLibrary_507:', content.includes('ModalLibrary_507'));
  console.log('Includes showBcModal:', content.includes('showBcModal'));
} else {
  console.log('File not found');
}
