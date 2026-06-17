const fs = require('fs');

try {
  const content = fs.readFileSync('index.html', 'utf8');

  // Extract Museum base64 image
  const museumMatch = content.match(/src="(data:image\/jpeg;base64,[^"]+)"/);
  if (museumMatch) {
    const data = museumMatch[1].split(',')[1];
    fs.writeFileSync('museum_original.jpg', Buffer.from(data, 'base64'));
    console.log("Saved museum_original.jpg");
  }

  // Extract Ministry base64 image
  const ministryMatch = content.match(/src="(data:image\/png;base64,[^"]+)"/);
  if (ministryMatch) {
    const data = ministryMatch[1].split(',')[1];
    fs.writeFileSync('ministry_original.png', Buffer.from(data, 'base64'));
    console.log("Saved ministry_original.png");
  }

  // Extract Ebzim base64 image (the original one from the html)
  // Let's find it by matching the one containing the Ebzim class or name.
  const ibzimMatch = content.match(/class="carved-logo-img" style="height: 56px;"[^>]*src="([^"]+)"/);
  if (ibzimMatch) {
    console.log("Current Ebzim src in HTML:", ibzimMatch[1]);
  }
} catch (e) {
  console.error(e);
}
