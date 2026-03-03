const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');

const templates = [
  'plumber',
  'garage',
  'electrician',
  'builder',
  'landscaper',
  'carpenter',
  'cleaner',
  'massage',
  'mobile-detailing',
  'detailing',
  'plumber2',
  'removals',
];

const BASE_URL = 'http://localhost:8989';
const OUT_DIR = path.join(__dirname, '../src/img/templates');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1280, height: 900 });

  // Redirect Google Fonts to Bunny Fonts (same API, accessible in this environment)
  await page.route('**://fonts.googleapis.com/**', async (route) => {
    const url = route.request().url().replace('fonts.googleapis.com', 'fonts.bunny.net');
    await route.continue({ url });
  });

  for (const slug of templates) {
    const url = `${BASE_URL}/templates/${slug}/`;
    console.log(`Screenshotting ${slug}...`);

    // 'load' instead of 'networkidle' — avoids hanging on video streams
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });

    // Wait for fonts to finish loading
    await page.evaluate(() => document.fonts.ready);

    // Give background images and CSS animations time to settle
    await page.waitForTimeout(1500);

    const outPath = path.join(OUT_DIR, `${slug}.jpg`);
    await page.screenshot({
      path: outPath,
      type: 'jpeg',
      quality: 85,
      clip: { x: 0, y: 0, width: 1280, height: 900 },
    });

    console.log(`  → saved ${slug}.jpg`);
  }

  await browser.close();
  console.log('Done.');
})();
