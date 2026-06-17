const fs = require('fs');

try {
  let content = fs.readFileSync('index.html', 'utf8');

  // Replace variables in :root for glassmorphism
  const oldVars = `      --surface: rgba(255, 255, 255, .90);
      --surface-warm: rgba(248, 250, 248, .96);`;

  const newVars = `      --surface: rgba(255, 255, 255, .66);
      --surface-warm: rgba(248, 250, 248, .70);`;

  if (content.includes(oldVars)) {
    content = content.replace(oldVars, newVars);
    console.log("Updated :root variables to apply glassmorphism successfully!");
  } else {
    // Attempt match with regex
    const varsRegex = /--surface:\s*rgba\(255,\s*255,\s*255,\s*\.90\);\s*--surface-warm:\s*rgba\(248,\s*250,\s*248,\s*\.96\);/;
    if (varsRegex.test(content)) {
      content = content.replace(varsRegex, newVars);
      console.log("Updated :root variables using regex.");
    } else {
      console.log("Could not match variables directly. Doing a broader search.");
      // Broad search and replace
      content = content.replace(/--surface:\s*rgba\(255,\s*255,\s*255,\s*[^)]+\);/g, '--surface: rgba(255, 255, 255, .66);');
      content = content.replace(/--surface-warm:\s*rgba\(248,\s*250,\s*248,\s*[^)]+\);/g, '--surface-warm: rgba(248, 250, 248, .70);');
      console.log("Broad search replacement completed.");
    }
  }

  fs.writeFileSync('index.html', content, 'utf8');
  console.log("Finalized glassmorphism updates.");
} catch (e) {
  console.error(e);
}
