const fs = require('fs');

try {
  let content = fs.readFileSync('index.html', 'utf8');

  // 1. Update body background overlay to be much darker/richer marble (reducing white overlay)
  const oldBodyBg = `      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.45)),
        url("green_marble_bg.png");`;

  const newBodyBg = `      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15)),
        url("green_marble_bg.png");`;

  if (content.includes(oldBodyBg)) {
    content = content.replace(oldBodyBg, newBodyBg);
    console.log("Updated body background overlay successfully!");
  } else {
    const bgRegex = /background-image:\s*linear-gradient\(rgba\(255,\s*255,\s*255,\s*0\.45\),\s*rgba\(255,\s*255,\s*255,\s*0\.45\)\),\s*url\("green_marble_bg\.png"\);/;
    if (bgRegex.test(content)) {
      content = content.replace(bgRegex, newBodyBg);
      console.log("Updated body background overlay using regex.");
    }
  }

  // 2. Reduce card opacities inside :root to make them look deeply glassy (around 0.45 and 0.38)
  const oldVars = `      --surface: rgba(255, 255, 255, .66);
      --surface-warm: rgba(248, 250, 248, .70);`;

  const newVars = `      --surface: rgba(255, 255, 255, 0.38);
      --surface-warm: rgba(250, 252, 250, 0.45);`;

  if (content.includes(oldVars)) {
    content = content.replace(oldVars, newVars);
    console.log("Updated :root surface variables for strong glassmorphism.");
  } else {
    // Attempt match with regex
    const varsRegex = /--surface:\s*rgba\(255,\s*255,\s*255,\s*0?\.66\);\s*--surface-warm:\s*rgba\(248,\s*250,\s*248,\s*0?\.70\);/;
    if (varsRegex.test(content)) {
      content = content.replace(varsRegex, newVars);
      console.log("Updated :root variables using regex.");
    } else {
      // Broad replace as fallback
      content = content.replace(/--surface:\s*rgba\(255,\s*255,\s*255,\s*[^)]+\);/g, '--surface: rgba(255, 255, 255, 0.38);');
      content = content.replace(/--surface-warm:\s*rgba\(248,\s*250,\s*248,\s*[^)]+\);/g, '--surface-warm: rgba(250, 252, 250, 0.45);');
      console.log("Broad variables replacement completed.");
    }
  }

  fs.writeFileSync('index.html', content, 'utf8');
  console.log("Finalized enhanced glassmorphism.");
} catch (e) {
  console.error(e);
}
