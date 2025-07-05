const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to registration page...');
    await page.goto('http://localhost:3000/#/register/worker', { waitUntil: 'networkidle2' });
    
    console.log('Filling out registration form...');
    await page.type('input[name="email"]', 'testuser@example.com');
    await page.type('input[name="password"]', 'password123');
    await page.type('input[name="confirmPassword"]', 'password123');
    
    console.log('Submitting registration form...');
    await page.click('button[type="submit"]');
    
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for registration to complete
    
    console.log('Navigating to login page...');
    await page.goto('http://localhost:3000/#/login', { waitUntil: 'networkidle2' });
    
    console.log('Filling out login form...');
    await page.type('input[name="email"]', 'testuser@example.com');
    await page.type('input[name="password"]', 'password123');
    
    console.log('Submitting login form...');
    await page.click('button[type="submit"]');
    
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for login to complete

    console.log('Test completed successfully.');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
})();