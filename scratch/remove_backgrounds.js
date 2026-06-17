const { Jimp } = require('jimp');
const path = require('path');

async function makeTransparent(inputPath, outputPath, keyColorType) {
  try {
    const image = await Jimp.read(inputPath);
    const width = image.width || image.bitmap.width;
    const height = image.height || image.bitmap.height;
    console.log(`Processing ${path.basename(inputPath)}: ${width}x${height}`);

    // Scan pixels using nested loops for robustness
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (width * y + x) * 4;
        const r = image.bitmap.data[idx + 0];
        const g = image.bitmap.data[idx + 1];
        const b = image.bitmap.data[idx + 2];
        const a = image.bitmap.data[idx + 3];

        let shouldBeTransparent = false;

        if (keyColorType === 'white') {
          if (r > 230 && g > 230 && b > 230) {
            shouldBeTransparent = true;
          }
        } else if (keyColorType === 'green-bg') {
          // Dynamic check based on the first pixel (0,0)
          const refR = image.bitmap.data[0];
          const refG = image.bitmap.data[1];
          const refB = image.bitmap.data[2];
          
          const diff = Math.sqrt(Math.pow(r - refR, 2) + Math.pow(g - refG, 2) + Math.pow(b - refB, 2));
          if (diff < 60) {
            shouldBeTransparent = true;
          }
        }

        if (shouldBeTransparent) {
          image.bitmap.data[idx + 3] = 0; // Transparent
        }
      }
    }

    await image.write(outputPath);
    console.log(`Saved transparent image to: ${outputPath}`);
  } catch (err) {
    console.error(`Error processing ${inputPath}:`, err);
  }
}

async function run() {
  await makeTransparent('ibzim-logo.jpeg', 'ibzim_transparent.png', 'white');
  await makeTransparent('museum_original.jpg', 'museum_transparent.png', 'white');
  await makeTransparent('ministry_original.png', 'ministry_transparent.png', 'green-bg');
}

run();
