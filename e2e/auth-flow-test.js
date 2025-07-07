const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Ensure the screenshots directory exists
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const appUrl = 'https://biomvp-v9-production.up.railway.app';

  try {
    // 1. Test User Registration
    console.log('Navigating to registration page...');
    await page.goto(`${appUrl}/register`, { waitUntil: 'networkidle2' });
    console.log('Registration page loaded. Taking screenshot...');
    await page.screenshot({ path: path.join(screenshotsDir, '01-register-page.png') });

    console.log('Waiting for registration form to be visible...');
    await page.waitForSelector('input[name="email"]', { timeout: 10000 });
    console.log('Registration form is visible.');

    // Add a small delay to ensure the page is fully interactive
    await page.waitForTimeout(1000);

    console.log('Filling out registration form...');
    await page.type('input[name="email"]', 'testuser@example.com');
    await page.type('input[name="password"]', 'password123');
    await page.type('input[name="confirmPassword"]', 'password123');
    await page.screenshot({ path: path.join(screenshotsDir, '02-register-form-filled.png') });

    console.log('Submitting registration form...');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);
    await page.screenshot({ path: path.join(screenshotsDir, '03-after-registration.png') });
    console.log('Registration submitted. Current URL:', page.url());

    // 2. Test User Login
    console.log('Navigating to login page...');
    await page.goto(`${appUrl}/login`, { waitUntil: 'networkidle2' });
    await page.screenshot({ path: path.join(screenshotsDir, '04-login-page.png') });

    console.log('Waiting for login form to be visible...');
    await page.waitForSelector('input[name="email"]', { timeout: 10000 });
    console.log('Login form is visible.');
    
    await page.waitForTimeout(1000);

    console.log('Filling out login form...');
    await page.type('input[name="email"]', 'testuser@example.com');
    await page.type('input[name="password"]', 'password123');
    await page.screenshot({ path: path.join(screenshotsDir, '05-login-form-filled.png') });

    console.log('Submitting login form...');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);
    await page.screenshot({ path: path.join(screenshotsDir, '06-after-login.png') });
    console.log('Login submitted. Current URL:', page.url());

    if (page.url().includes('dashboard')) {
      console.log('✅ Login successful!');
    } else {
      console.error('❌ Login failed. Redirected to:', page.url());
    }

  } catch (error) {
    console.error('An error occurred during the test:', error);
    await page.screenshot({ path: path.join(screenshotsDir, '99-error.png') });
  } finally {
    await browser.close();
  }
})();