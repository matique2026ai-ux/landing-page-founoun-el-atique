const fs = require('fs');

try {
  let content = fs.readFileSync('index.html', 'utf8');

  // 1. Replace the CSS block for republic-banner
  const oldBannerCss = `    .republic-banner {
      background: linear-gradient(180deg, #180a04, #261108);
      text-align: center;
      padding: 10px 16px;
      border-bottom: 1px solid rgba(201, 151, 42, .35);
      position: relative;
      z-index: 4;
    }

    .republic-banner h1 {
      font-family: 'Amiri', serif;
      font-size: clamp(15px, 2.5vw, 22px);
      font-weight: 700;
      color: rgba(255, 248, 235, .95);
      margin: 0;
      letter-spacing: 1.5px;
      line-height: 1.6;
      text-shadow: 0 1px 6px rgba(201, 151, 42, .3);
    }`;

  const newBannerCss = `    .republic-banner {
      background: linear-gradient(180deg, #180a04, #261108);
      text-align: center;
      padding: 12px 16px;
      border-bottom: 1px solid rgba(201, 151, 42, .35);
      position: relative;
      z-index: 4;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .rep-title {
      font-family: 'Amiri', serif;
      font-size: clamp(16px, 2.2vw, 20px);
      font-weight: 700;
      color: rgba(255, 248, 235, .98);
      margin: 0;
      letter-spacing: 1.2px;
      line-height: 1.4;
      text-shadow: 0 1px 6px rgba(201, 151, 42, .35);
    }

    .rep-sub {
      font-family: 'Tajawal', sans-serif;
      font-size: clamp(11px, 1.6vw, 13.5px);
      font-weight: 500;
      color: rgba(255, 248, 235, 0.75);
      letter-spacing: 0.5px;
      line-height: 1.3;
    }`;

  if (content.includes(oldBannerCss)) {
    content = content.replace(oldBannerCss, newBannerCss);
    console.log("Updated republic banner CSS style successfully.");
  } else {
    // Attempt match using regex
    const bannerRegex = /\.republic-banner\s*\{[\s\S]*?\}\s*\.republic-banner\s+h1\s*\{[\s\S]*?\}/;
    if (bannerRegex.test(content)) {
      content = content.replace(bannerRegex, newBannerCss);
      console.log("Updated republic banner CSS using regex.");
    }
  }

  // 2. Replace the HTML block
  const oldBannerHtml = `    <div class="republic-banner">
      <h1>الجمهورية الجزائرية الديمقراطية الشعبية</h1>
    </div>`;

  const newBannerHtml = `    <div class="republic-banner">
      <div class="rep-title">الجمهورية الجزائرية الديمقراطية الشعبية</div>
      <div class="rep-sub">وزارة الثقافة والفنون &nbsp;·&nbsp; ولاية سطيف</div>
    </div>`;

  if (content.includes(oldBannerHtml)) {
    content = content.replace(oldBannerHtml, newBannerHtml);
    console.log("Updated republic banner HTML content successfully.");
  } else {
    const htmlRegex = /<div class="republic-banner">\s*<h1>الجمهورية الجزائرية الديمقراطية الشعبية<\/h1>\s*<\/div>/;
    if (htmlRegex.test(content)) {
      content = content.replace(htmlRegex, newBannerHtml);
      console.log("Updated republic banner HTML using regex.");
    }
  }

  fs.writeFileSync('index.html', content, 'utf8');
  console.log("Done!");
} catch (e) {
  console.error(e);
}
