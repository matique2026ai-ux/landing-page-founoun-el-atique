const fs = require('fs');

try {
  let content = fs.readFileSync('index.html', 'utf8');

  // 1. Construct the new CSS for footer and remove the old frame-related styles
  const newFooterCss = `
    footer {
      background: linear-gradient(180deg, rgba(20, 11, 4, 0.95), rgba(10, 5, 1, 0.98));
      border-top: 1px solid var(--border-gold);
      padding: 35px 16px;
      text-align: center;
      position: relative;
      z-index: 3;
    }

    footer strong {
      color: var(--gold-light);
      font-weight: 700;
    }

    .footer-decoration {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      margin-bottom: 20px;
      opacity: 0.65;
    }

    .footer-decoration .line {
      width: clamp(60px, 15vw, 150px);
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--border-gold), transparent);
    }

    .footer-organized-text {
      font-family: 'Amiri', serif;
      font-size: clamp(17px, 2.5vw, 22px);
      line-height: 1.8;
      color: rgba(255, 248, 235, 0.85);
      max-width: 850px;
      margin: 0 auto;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
    }
  `;

  // We replace from footer { down to the end of .footer-bottom }
  const cssRegex = /footer\s*\{[\s\S]*?\}\s*footer strong\s*\{[\s\S]*?\}\s*\.footer-frame\s*\{[\s\S]*?\}\s*\.footer-frame::before\s*\{[\s\S]*?\}\s*\.footer-col\s*\{[\s\S]*?\}\s*\.footer-title\s*\{[\s\S]*?\}\s*\.footer-sub\s*\{[\s\S]*?\}\s*\.footer-bottom\s*\{[\s\S]*?\}/;
  
  if (cssRegex.test(content)) {
    content = content.replace(cssRegex, newFooterCss.trim());
    console.log("Updated footer CSS style successfully.");
  } else {
    // Attempt match with a simple regex for the whole block
    const cssRegexAlt = /footer\s*\{[\s\S]*?\.footer-bottom\s*\{[\s\S]*?\}/;
    if (cssRegexAlt.test(content)) {
      content = content.replace(cssRegexAlt, newFooterCss.trim());
      console.log("Updated footer CSS style using relaxed regex.");
    }
  }

  // 2. Replace the HTML footer content
  const newFooterHtml = `
  <footer>
    <div class="footer-decoration">
      <span class="line"></span>
      <i data-lucide="star" style="width:14px;height:14px;color:var(--gold);fill:var(--gold);"></i>
      <span class="line"></span>
    </div>
    <div class="footer-organized-text">
      من تنظيم <strong>جمعية إبزيم للثقافة والمواطنة</strong> بالشراكة مع <strong>المتحف العمومي لولاية سطيف</strong>
    </div>
  </footer>
  `;

  const htmlRegex = /<footer>[\s\S]*?<\/footer>/;
  if (htmlRegex.test(content)) {
    content = content.replace(htmlRegex, newFooterHtml.trim());
    console.log("Updated footer HTML content successfully.");
  } else {
    console.error("Could not match the footer HTML block.");
  }

  fs.writeFileSync('index.html', content, 'utf8');
  console.log("Completed footer updates.");
} catch (e) {
  console.error(e);
}
