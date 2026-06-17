const fs = require('fs');

try {
  const content = fs.readFileSync('index.html', 'utf8');

  // Extract Museum base64 image
  const museumMatch = content.match(/<div class="mpill">[\s\S]*?src="(data:image\/jpeg;base64,[^"]+)"/);
  const museumBase64 = museumMatch ? museumMatch[1] : null;

  // Extract Ministry base64 image
  const ministryMatch = content.match(/<div class="lb-center">[\s\S]*?src="(data:image\/png;base64,[^"]+)"/);
  const ministryBase64 = ministryMatch ? ministryMatch[1] : null;

  console.log("Museum base64 found:", !!museumBase64, museumBase64 ? museumBase64.substring(0, 50) + "..." : "");
  console.log("Ministry base64 found:", !!ministryBase64, ministryBase64 ? ministryBase64.substring(0, 50) + "..." : "");

  if (!museumBase64 || !ministryBase64) {
    console.error("Error: Could not extract base64 strings.");
    process.exit(1);
  }

  // Construct the new lbar HTML
  const newLbarHtml = `
    <div class="lbar">
      <!-- Right Side: Ebzim Logo (carved, text included in the image) -->
      <div class="carved-logo-container">
        <div class="ibzim" style="display:flex; align-items:center;">
          <img src="ibzim-logo.jpeg" alt="جمعية إبزيم للثقافة والمواطنة" class="carved-logo-img" style="height: 56px;" />
        </div>
      </div>

      <!-- Center: Ministry of Culture Logo (carved, symbol only, no text) -->
      <div class="carved-logo-container lb-center">
        <img src="${ministryBase64}" alt="وزارة الثقافة والفنون" class="carved-logo-img" style="height: 54px;" />
      </div>

      <!-- Left Side: National Museum Logo (carved, text carved underneath) -->
      <div class="carved-logo-container column">
        <div class="mpill-carved">
          <img src="${museumBase64}" alt="المتحف الوطني سطيف" class="carved-logo-img" style="height: 50px;" />
        </div>
        <div class="stext carved-text"><b>المتحف الوطني العمومي سطيف</b></div>
      </div>
    </div>
  `;

  // Construct the new CSS classes to insert
  const newCss = `
    /* ── logo bar ── */
    .lbar {
      position: relative;
      z-index: 3;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px clamp(14px, 4vw, 52px);
      border-bottom: 1px solid rgba(255, 255, 255, .07);
      gap: 12px;
      flex-wrap: wrap;
    }

    .carved-logo-container {
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
    }

    .carved-logo-img {
      filter: 
        contrast(1.1) 
        brightness(0.9) 
        drop-shadow(0px 1px 1px rgba(255, 255, 255, 0.85)) 
        drop-shadow(-0.5px -0.5px 0.5px rgba(0, 0, 0, 0.4));
      mix-blend-mode: multiply;
      opacity: 0.9;
      display: block;
      max-width: 100%;
      object-fit: contain;
    }

    .carved-text {
      text-align: center;
      color: rgba(60, 40, 20, 0.85);
      text-shadow: 0px 1px 1px rgba(255, 255, 255, 0.8), -0.5px -0.5px 0.5px rgba(0, 0, 0, 0.4);
      font-size: 11px;
      line-height: 1.4;
    }

    .carved-text b {
      font-family: 'Amiri', serif;
      font-size: 12.5px;
      font-weight: 700;
    }

    .lb-side {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* ministry center */
    .lb-center {
      display: flex;
      align-items: center;
      gap: 11px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(201, 151, 42, 0.15);
      border-radius: 16px;
      padding: 10px 18px;
    }
  `;

  // Replace CSS block
  let updatedContent = content;

  // Let's replace the original lbar CSS section.
  // We match from /* ── logo bar ── */ down to right before /* ── HERO / CAROUSEL ── */
  const cssRegex = /\/\*\s*──\s*logo bar\s*──\s*\*\/[\s\S]*?(?=\/\*\s*──\s*HERO \/ CAROUSEL\s*──\s*\*\/)/;
  if (cssRegex.test(updatedContent)) {
    updatedContent = updatedContent.replace(cssRegex, newCss.trim() + "\n\n    ");
    console.log("CSS replaced successfully!");
  } else {
    console.error("Could not match the CSS block.");
    process.exit(1);
  }

  // Replace HTML block
  const htmlRegex = /<div class="lbar">[\s\S]*?<\/div>\s*(?=<div class="hero">)/;
  if (htmlRegex.test(updatedContent)) {
    updatedContent = updatedContent.replace(htmlRegex, newLbarHtml.trim() + "\n\n    ");
    console.log("HTML replaced successfully!");
  } else {
    console.error("Could not match the HTML block.");
    process.exit(1);
  }

  fs.writeFileSync('index.html', updatedContent, 'utf8');
  console.log("Done! index.html updated successfully.");
} catch (e) {
  console.error("Exception:", e);
}
