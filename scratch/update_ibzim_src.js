const fs = require('fs');

try {
  let content = fs.readFileSync('index.html', 'utf8');

  // Replace ibzim-logo.jpeg with ibzim_logo_transparent.png
  if (content.includes('ibzim-logo.jpeg')) {
    content = content.replace('ibzim-logo.jpeg', 'ibzim_logo_transparent.png');
    console.log("Replaced ibzim-logo.jpeg with ibzim_logo_transparent.png successfully!");
  } else {
    console.log("Could not find ibzim-logo.jpeg in index.html");
  }

  fs.writeFileSync('index.html', content, 'utf8');
} catch (e) {
  console.error(e);
}
