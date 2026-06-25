const fs = require('fs');

// Let's run only step 1, 2, 3 and see where it fails
try {
  require('./_next/static/chunks/507-1cbb4e1ae80f89d3.js');
} catch (e) {
  console.log(e);
}
