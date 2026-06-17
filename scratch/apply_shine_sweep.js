const fs = require('fs');

try {
  let content = fs.readFileSync('index.html', 'utf8');

  // 1. Update .title-main CSS to add the sweeping shimmer effect
  const oldTitleCss = `.title-main {
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

  const newTitleCss = `.title-main {
      font-family: 'El Messiri', sans-serif;
      font-size: clamp(55px, 8vw, 100px);
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: 0;
      /* Shimmer gradient overlay */
      background: linear-gradient(
        120deg, 
        #e5b083 0%, 
        #b05a30 20%, 
        #7d3315 40%, 
        #ffffff 50%, 
        #7d3315 60%, 
        #b05a30 80%, 
        #dca074 100%
      );
      background-size: 250% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      filter: drop-shadow(0 4px 18px rgba(0, 0, 0, .45));
      display: inline-block;
      padding: .08em .12em;
      animation: shimmer-text 9s linear infinite;
    }

    @keyframes shimmer-text {
      0% {
        background-position: 250% center;
      }
      100% {
        background-position: -250% center;
      }
    }`;

  if (content.includes(oldTitleCss)) {
    content = content.replace(oldTitleCss, newTitleCss);
    console.log("Updated .title-main CSS with text shimmer.");
  } else {
    const titleRegex = /\.title-main\s*\{[\s\S]*?\}/;
    if (titleRegex.test(content)) {
      content = content.replace(titleRegex, newTitleCss);
      console.log("Updated .title-main CSS using regex.");
    }
  }

  // 2. Update .medallion-container and .medallion-logo CSS to include the wrapper and sweep animation
  const oldMedallionCss = `.medallion-container {
      display: flex;
      justify-content: center;
      margin-bottom: 25px;
    }

    .medallion-logo {
      width: clamp(140px, 25vw, 240px);
      height: auto;
      filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.45));
      border-radius: 50%;
      animation: float 6s ease-in-out infinite;
    }`;

  const newMedallionCss = `.medallion-container {
      display: flex;
      justify-content: center;
      margin-bottom: 25px;
      position: relative;
    }

    .medallion-wrapper {
      position: relative;
      border-radius: 50%;
      overflow: hidden; /* Keeps the sunbeam sweep inside the circular medallion */
      display: inline-block;
    }

    .medallion-logo {
      width: clamp(140px, 25vw, 240px);
      height: auto;
      filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.45));
      border-radius: 50%;
      animation: float 6s ease-in-out infinite;
      display: block;
    }

    /* Periodic sunbeam shine sweep overlay */
    .medallion-wrapper::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -60%;
      width: 30%;
      height: 200%;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.55) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      transform: rotate(30deg);
      animation: shine-sweep 9s infinite ease-in-out;
      pointer-events: none;
      z-index: 2;
    }

    @keyframes shine-sweep {
      0% {
        left: -60%;
      }
      30% {
        left: 140%;
      }
      100% {
        left: 140%;
      }
    }`;

  if (content.includes(oldMedallionCss)) {
    content = content.replace(oldMedallionCss, newMedallionCss);
    console.log("Updated medallion CSS with sunbeam shine sweep.");
  } else {
    const medallionRegex = /\.medallion-container\s*\{[\s\S]*?\}\s*\.medallion-logo\s*\{[\s\S]*?\}/;
    if (medallionRegex.test(content)) {
      content = content.replace(medallionRegex, newMedallionCss);
      console.log("Updated medallion CSS using regex.");
    }
  }

  // 3. Update HTML to wrap the medallion in .medallion-wrapper
  const oldMedallionHtml = `<div class="medallion-container">
          <img src="ayam_founoun_logo.png" alt="أيام فنون العتيق" class="medallion-logo">
        </div>`;

  const newMedallionHtml = `<div class="medallion-container">
          <div class="medallion-wrapper">
            <img src="ayam_founoun_logo.png" alt="أيام فنون العتيق" class="medallion-logo">
          </div>
        </div>`;

  if (content.includes(oldMedallionHtml)) {
    content = content.replace(oldMedallionHtml, newMedallionHtml);
    console.log("Updated medallion HTML wrapper.");
  } else {
    // Relaxed whitespace match
    const htmlRegex = /<div class="medallion-container">\s*<img[^>]+src="ayam_founoun_logo\.png"[^>]*>\s*<\/div>/;
    if (htmlRegex.test(content)) {
      content = content.replace(htmlRegex, newMedallionHtml);
      console.log("Updated medallion HTML wrapper using regex.");
    }
  }

  fs.writeFileSync('index.html', content, 'utf8');
  console.log("Completed sweep updates successfully!");
} catch (e) {
  console.error(e);
}
