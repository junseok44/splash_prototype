let currentPixelIndex = 0;
const chunkSize = 1000; // Number of pixels to process per chunk

function processPixelsChunk() {
  for (
    let i = 0;
    i < chunkSize && currentPixelIndex < pg.pixels.length;
    i += 4
  ) {
    let r = pg.pixels[currentPixelIndex];
    let g = pg.pixels[currentPixelIndex + 1];
    let b = pg.pixels[currentPixelIndex + 2];
    let a = pg.pixels[currentPixelIndex + 3];

    // Increase inkedPixels if it is a specific color (rgb(255,78,202))
    if (colorMatch(r, g, b, a, 255, 78, 202, 255, 100)) {
      inkedPixels++;
    }

    currentPixelIndex += 4;
  }

  // Update the pixels incrementally
  pg.updatePixels();

  // Check if there are more pixels to process
  if (currentPixelIndex < pg.pixels.length) {
    // Process the next chunk asynchronously
    requestAnimationFrame(processPixelsChunk);
  } else {
    // All pixels processed, calculate the ink area ratio
    const inkAreaRatio = Math.min(
      (inkedPixels / (pg.pixels.length / 4)) * 100,
      100
    );
    const finalInkAreaRatio = Math.max(inkAreaRatio, 0);
    console.log(finalInkAreaRatio); // Output the result
  }
}

function calculateInkAreaRatioAsync() {
  currentPixelIndex = 0;
  inkedPixels = 0;
  pg.loadPixels();

  // Start processing pixels asynchronously
  requestAnimationFrame(processPixelsChunk);
}
