const fs = require('fs');

try {
  let content = fs.readFileSync('index.html', 'utf8');

  // 1. Update Logo Heights in HTML
  content = content.replace(
    'src="ibzim_transparent.png" alt="جمعية إبزيم للثقافة والمواطنة" class="carved-logo-img" style="height: 56px;"',
    'src="ibzim_transparent.png" alt="جمعية إبزيم للثقافة والمواطنة" class="carved-logo-img" style="height: 82px;"'
  );

  content = content.replace(
    'alt="وزارة الثقافة والفنون" class="carved-logo-img" style="height: 54px;"',
    'alt="وزارة الثقافة والفنون" class="carved-logo-img" style="height: 78px;"'
  );

  content = content.replace(
    'src="museum_transparent.png" alt="المتحف الوطني سطيف" class="carved-logo-img" style="height: 50px;"',
    'src="museum_transparent.png" alt="المتحف الوطني سطيف" class="carved-logo-img" style="height: 72px;"'
  );

  console.log("Updated logo heights in HTML.");

  // 2. Update SVG filter to make the carving effect much more pronounced (larger offsets, stronger blur)
  const oldSvgFilter = `<filter id="engrave-filter">
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
      </filter>`;

  const newSvgFilter = `<filter id="engrave-filter">
        <!-- Blur alpha mask to create slope/slope shade -->
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur"/>
        
        <!-- Larger shifts for a deeper, much clearer 3D chiseled depth -->
        <feOffset dx="-2.4" dy="-2.4" result="offset-shadow"/>
        <feOffset dx="2.4" dy="2.4" result="offset-light"/>
        
        <!-- Brighter white reflection for the chiseled edge highlight -->
        <feFlood flood-color="#ffffff" flood-opacity="1.0" result="light-color"/>
        <feComposite in="light-color" in2="offset-light" operator="in" result="light"/>
        
        <!-- Darker shadow for pronounced depth inside the stone -->
        <feFlood flood-color="#000000" flood-opacity="0.9" result="shadow-color"/>
        <feComposite in="shadow-color" in2="offset-shadow" operator="in" result="shadow"/>
        
        <!-- Merge highlights and shadows -->
        <feMerge result="bevel">
          <feMergeNode in="light"/>
          <feMergeNode in="shadow"/>
        </feMerge>
        
        <!-- Render bevel solely on the outer boundary of chiseled cuts -->
        <feComposite in="bevel" in2="SourceAlpha" operator="out" result="edges"/>
        
        <!-- Dark recess tint inside the grooves -->
        <feFlood flood-color="#08110b" flood-opacity="0.85" result="recess-color"/>
        <feComposite in="recess-color" in2="SourceAlpha" operator="in" result="recess-fill"/>
        
        <!-- Blend colors with recess fill to maintain design color shades -->
        <feBlend in="SourceGraphic" in2="recess-fill" mode="multiply" result="blended-source"/>
        
        <!-- Merge all elements -->
        <feMerge>
          <feMergeNode in="blended-source"/>
          <feMergeNode in="edges"/>
        </feMerge>
      </filter>`;

  if (content.includes(oldSvgFilter)) {
    content = content.replace(oldSvgFilter, newSvgFilter);
    console.log("Updated SVG filter to enhance carving depth.");
  } else {
    // Attempt match with regex
    const filterRegex = /<filter id="engrave-filter">[\s\S]*?<\/filter>/;
    if (filterRegex.test(content)) {
      content = content.replace(filterRegex, newSvgFilter);
      console.log("Updated SVG filter to enhance carving depth using regex.");
    }
  }

  // 3. Enhance .carved-text b font-size
  const oldTextCss = `.carved-text b {
      font-family: 'Amiri', serif;
      font-size: 12.5px;
      font-weight: 700;
    }`;

  const newTextCss = `.carved-text b {
      font-family: 'Amiri', serif;
      font-size: 14.5px;
      font-weight: 700;
    }`;

  if (content.includes(oldTextCss)) {
    content = content.replace(oldTextCss, newTextCss);
    console.log("Enhanced carved text font size.");
  }

  fs.writeFileSync('index.html', content, 'utf8');
  console.log("Finalized carving enhancements.");
} catch (e) {
  console.error(e);
}
