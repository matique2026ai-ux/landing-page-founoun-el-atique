const fs = require('fs');

try {
  let content = fs.readFileSync('index.html', 'utf8');

  // 1. Update Google Fonts in head
  const oldFontLink = '<link\n    href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Tajawal:wght@400;500;700;800&family=Aref+Ruqaa+Ink:wght@700&family=Jomhuria&family=Katibeh&family=Reem+Kufi+Fun:wght@700&family=Rakkas&display=swap"\n    rel="stylesheet">';
  const newFontLink = '<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Tajawal:wght@400;500;700;800&family=Aref+Ruqaa+Ink:wght@700&family=Jomhuria&family=Katibeh&family=Reem+Kufi+Fun:wght@700&family=Rakkas&family=El+Messiri:wght@700&display=swap" rel="stylesheet">';
  
  if (content.includes(oldFontLink)) {
    content = content.replace(oldFontLink, newFontLink);
    console.log("Updated Google Fonts link in head.");
  } else {
    // Attempt relaxed match
    const fontRegex = /<link\s+href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+"\s+rel="stylesheet">/;
    if (fontRegex.test(content)) {
      content = content.replace(fontRegex, newFontLink);
      console.log("Updated Google Fonts link in head using regex.");
    }
  }

  // 2. Update .title-main CSS (font-family El Messiri, adjust font-size and styling)
  const oldTitleMainCss = `.title-main {
      font-family: 'Aref Ruqaa Ink', serif;
      font-size: clamp(95px, 13vw, 170px);
      font-weight: normal;
      line-height: 0.95;
      letter-spacing: 0;
      background: linear-gradient(135deg, #e5b083 0%, #b05a30 40%, #7d3315 70%, #dca074 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      filter: drop-shadow(0 4px 22px rgba(0, 0, 0, .55));
      display: inline-block;
      padding: .08em .12em;
    }`;

  const newTitleMainCss = `.title-main {
      font-family: 'El Messiri', sans-serif;
      font-size: clamp(55px, 8vw, 100px);
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: 0;
      background: linear-gradient(135deg, #e5b083 0%, #b05a30 40%, #7d3315 70%, #dca074 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      filter: drop-shadow(0 4px 18px rgba(0, 0, 0, .45));
      display: inline-block;
      padding: .08em .12em;
    }`;

  if (content.includes(oldTitleMainCss)) {
    content = content.replace(oldTitleMainCss, newTitleMainCss);
    console.log("Updated .title-main CSS style.");
  } else {
    // If exact block doesn't match, let's match regex
    const titleRegex = /\.title-main\s*\{[\s\S]*?\}/;
    if (titleRegex.test(content)) {
      content = content.replace(titleRegex, newTitleMainCss);
      console.log("Updated .title-main CSS style using regex.");
    }
  }

  // 3. Update .carved-logo-img CSS to apply the SVG filter
  const oldCarvedImgCss = `.carved-logo-img {
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
    }`;

  const newCarvedImgCss = `.carved-logo-img {
      filter: url(#engrave-filter);
      opacity: 0.92;
      display: block;
      max-width: 100%;
      object-fit: contain;
    }`;

  if (content.includes(oldCarvedImgCss)) {
    content = content.replace(oldCarvedImgCss, newCarvedImgCss);
    console.log("Updated .carved-logo-img CSS filter.");
  } else {
    const imgRegex = /\.carved-logo-img\s*\{[\s\S]*?\}/;
    if (imgRegex.test(content)) {
      content = content.replace(imgRegex, newCarvedImgCss);
      console.log("Updated .carved-logo-img CSS filter using regex.");
    }
  }

  // 4. Replace HTML logo bar to use local transparent PNGs
  const newLbarHtml = `
    <div class="lbar">
      <!-- Right Side: Ebzim Logo (carved, text included in the image) -->
      <div class="carved-logo-container">
        <div class="ibzim" style="display:flex; align-items:center;">
          <img src="ibzim_transparent.png" alt="جمعية إبزيم للثقافة والمواطنة" class="carved-logo-img" style="height: 56px;" />
        </div>
      </div>

      <!-- Center: Ministry of Culture Logo (carved, symbol only, no text) -->
      <div class="carved-logo-container lb-center">
        <img src="ministry_transparent.png" alt="وزارة الثقافة والفنون" class="carved-logo-img" style="height: 54px;" />
      </div>

      <!-- Left Side: National Museum Logo (carved, text carved underneath) -->
      <div class="carved-logo-container column">
        <div class="mpill-carved">
          <img src="museum_transparent.png" alt="المتحف الوطني سطيف" class="carved-logo-img" style="height: 50px;" />
        </div>
        <div class="stext carved-text"><b>المتحف الوطني العمومي سطيف</b></div>
      </div>
    </div>
  `;

  const htmlRegex = /<div class="lbar">[\s\S]*?<\/div>\s*(?=<div class="hero">)/;
  if (htmlRegex.test(content)) {
    content = content.replace(htmlRegex, newLbarHtml.trim() + "\n\n    ");
    console.log("Updated logo bar HTML to reference local transparent PNGs.");
  }

  // 5. Inject SVG Filter right after the <body> tag
  const svgFilter = `
  <!-- SVG 3D Engraving/Carving Filter -->
  <svg style="position: absolute; width: 0; height: 0;" width="0" height="0" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <filter id="engrave-filter">
        <!-- Smooth blur of the alpha mask for depth shading -->
        <feGaussianBlur in="SourceAlpha" stdDeviation="0.6" result="blur"/>
        
        <!-- Shifts to construct chiseled edges -->
        <feOffset dx="-1" dy="-1" result="offset-shadow"/>
        <feOffset dx="1" dy="1" result="offset-light"/>
        
        <!-- White highlight color for chiseled edge reflection -->
        <feFlood flood-color="#ffffff" flood-opacity="0.9" result="light-color"/>
        <feComposite in="light-color" in2="offset-light" operator="in" result="light"/>
        
        <!-- Dark shadow color for chiseled edge shade -->
        <feFlood flood-color="#000000" flood-opacity="0.7" result="shadow-color"/>
        <feComposite in="shadow-color" in2="offset-shadow" operator="in" result="shadow"/>
        
        <!-- Combine highlight and shadow -->
        <feMerge result="bevel">
          <feMergeNode in="light"/>
          <feMergeNode in="shadow"/>
        </feMerge>
        
        <!-- Only draw bevel on the borders/edges of the glyphs -->
        <feComposite in="bevel" in2="SourceAlpha" operator="out" result="edges"/>
        
        <!-- Dark inner fill to make logo look carved down into the stone -->
        <feFlood flood-color="#142218" flood-opacity="0.8" result="recess-color"/>
        <feComposite in="recess-color" in2="SourceAlpha" operator="in" result="recess-fill"/>
        
        <!-- Blend the original colors with the recess color to keep green/gold tones but shadowed -->
        <feBlend in="SourceGraphic" in2="recess-fill" mode="multiply" result="blended-source"/>
        
        <!-- Combine everything together -->
        <feMerge>
          <feMergeNode in="blended-source"/>
          <feMergeNode in="edges"/>
        </feMerge>
      </filter>
    </defs>
  </svg>
  `;

  if (content.includes('<body>') && !content.includes('id="engrave-filter"')) {
    content = content.replace('<body>', '<body>' + svgFilter);
    console.log("Injected SVG engraving filter into body.");
  }

  fs.writeFileSync('index.html', content, 'utf8');
  console.log("Finalized index.html updates successfully!");
} catch (e) {
  console.error("Error finalising index.html:", e);
}
