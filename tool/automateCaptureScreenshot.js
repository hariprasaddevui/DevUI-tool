const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const config = require('../config/settings.json');
const { ensureDirectoryExists, generateFilename } = require('../utils/helpers.js');

(async () => {
  let browser;
  try {
    // Ensure output directory exists
    ensureDirectoryExists(config.outputDir);

    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--auto-open-devtools-for-tabs']
    });

    const page = await browser.newPage();
    const client = await page.target().createCDPSession();
    
    await client.send('Network.enable');
    await client.send('Page.enable');

    console.log(`Navigating to url`);
    await page.goto(config.url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    for (const viewport of config.viewports) {
      console.log(`Setting viewport to ${viewport.width}x${viewport.height}`);
      await page.setViewport({
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 3
      });

      // await page.waitForTimeout(1000);

      const filename = generateFilename(viewport, config.screenshotOptions.type);
      const filepath = path.join(config.outputDir, filename);

      console.log(`Capturing screenshot for ${viewport.name} viewport`);
      await page.screenshot({
        ...config.screenshotOptions,
        path: filepath
      });

      console.log(`Screenshot saved to ${filepath}`);
    }

    console.log('All screenshots captured successfully!');
  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();