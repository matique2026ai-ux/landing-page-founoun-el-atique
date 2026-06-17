const fs = require('fs');

try {
  let content = fs.readFileSync('index.html', 'utf8');

  // 1. Update .slide CSS filters for better color integration and readability
  const oldSlideCss = `.slide {
      position: absolute;
      inset: 0;
      opacity: 0;
      transform: scale(1.06);
      transition: opacity 2.6s ease, transform 20s ease;
      background-size: cover;
      background-position: center;
    }

    .slide.active {
      opacity: 1;
      transform: scale(1);
    }

    .slide::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(170deg, rgba(10, 6, 2, .30) 0%, rgba(10, 6, 2, .70) 100%);
    }`;

  const newSlideCss = `.slide {
      position: absolute;
      inset: 0;
      opacity: 0;
      transform: scale(1.06);
      transition: opacity 2.6s ease, transform 20s ease;
      background-size: cover;
      background-position: center;
      /* Cinematic filters: warm tint, lower saturation, soft blur to pop the medallion */
      filter: sepia(0.25) saturate(0.85) brightness(0.65) blur(1.2px);
    }

    .slide.active {
      opacity: 1;
      transform: scale(1);
    }

    .slide::after {
      content: '';
      position: absolute;
      inset: 0;
      /* Deep radial vignette for better contrast and text readability */
      background: radial-gradient(circle at center, rgba(14, 8, 3, 0.35) 0%, rgba(10, 5, 2, 0.88) 100%);
      z-index: 1;
    }`;

  if (content.includes(oldSlideCss)) {
    content = content.replace(oldSlideCss, newSlideCss);
    console.log("Updated slide CSS to enhance integration.");
  } else {
    // Attempt match with regex
    const slideRegex = /\.slide\s*\{[\s\S]*?\}\s*\.slide\.active\s*\{[\s\S]*?\}\s*\.slide::after\s*\{[\s\S]*?\}/;
    if (slideRegex.test(content)) {
      content = content.replace(slideRegex, newSlideCss);
      console.log("Updated slide CSS using regex.");
    }
  }

  fs.writeFileSync('index.html', content, 'utf8');
  console.log("Completed carousel integration updates.");
} catch (e) {
  console.error(e);
}
