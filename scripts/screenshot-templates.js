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

  // Match the iframe dimensions used in cards
  await page.setViewportSize({ width: 1280, height: 900 });

  for (const slug of templates) {
    const url = `${BASE_URL}/templates/${slug}/`;
    console.log(`Screenshotting ${slug}...`);

    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Let any CSS animations settle
    await page.waitForTimeout(800);

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
