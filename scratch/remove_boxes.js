const fs = require('fs');

try {
  let content = fs.readFileSync('index.html', 'utf8');

  // Replace .carved-logo-container, .carved-logo-container.column, and .carved-logo-container:hover
  const oldContainerCss = `.carved-logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(201, 151, 42, 0.15);
      box-shadow: 
        inset 1px 1px 3px rgba(0, 0, 0, 0.12),
        inset -1px -1px 3px rgba(255, 255, 255, 0.5),
        0 4px 12px rgba(0, 0, 0, 0.03);
      transition: var(--transition);
      position: relative;
      overflow: hidden;
    }

    .carved-logo-container.column {
      flex-direction: column;
      gap: 6px;
      padding: 10px 18px;
    }

    .carved-logo-container:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(201, 151, 42, 0.3);
      box-shadow: 
        inset 1.5px 1.5px 4px rgba(0, 0, 0, 0.18),
        inset -1.5px -1.5px 4px rgba(255, 255, 255, 0.6);
    }`;

  const newContainerCss = `.carved-logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 4px 12px;
      background: none;
      border: none;
      box-shadow: none;
      transition: var(--transition);
      position: relative;
    }

    .carved-logo-container.column {
      flex-direction: column;
      gap: 6px;
      padding: 4px 12px;
    }

    .carved-logo-container:hover {
      background: none;
      border-color: transparent;
      box-shadow: none;
      transform: translateY(-2px);
    }`;

  if (content.includes(oldContainerCss)) {
    content = content.replace(oldContainerCss, newContainerCss);
    console.log("Updated .carved-logo-container CSS to remove background boxes.");
  } else {
    // Attempt matching using regex
    const containerRegex = /\.carved-logo-container\s*\{[\s\S]*?\}\s*\.carved-logo-container\.column\s*\{[\s\S]*?\}\s*\.carved-logo-container:hover\s*\{[\s\S]*?\}/;
    if (containerRegex.test(content)) {
      content = content.replace(containerRegex, newContainerCss);
      console.log("Updated .carved-logo-container CSS using regex.");
    }
  }

  // Also update .lb-center background and border
  const oldCenterCss = `/* ministry center */
    .lb-center {
      display: flex;
      align-items: center;
      gap: 11px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(201, 151, 42, 0.15);
      border-radius: 16px;
      padding: 10px 18px;
    }`;

  const newCenterCss = `/* ministry center */
    .lb-center {
      display: flex;
      align-items: center;
      gap: 11px;
      background: none;
      border: none;
      padding: 4px 12px;
    }`;

  if (content.includes(oldCenterCss)) {
    content = content.replace(oldCenterCss, newCenterCss);
    console.log("Updated .lb-center CSS.");
  } else {
    const centerRegex = /\/\* ministry center \*\/[\s\S]*?\.lb-center\s*\{[\s\S]*?\}/;
    if (centerRegex.test(content)) {
      content = content.replace(centerRegex, newCenterCss);
      console.log("Updated .lb-center CSS using regex.");
    }
  }

  fs.writeFileSync('index.html', content, 'utf8');
  console.log("Completed updates.");
} catch (e) {
  console.error(e);
}
