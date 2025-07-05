const puppeteer = require('puppeteer');

describe('Login Flow', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should login successfully and redirect to the dashboard', async () => {
    await page.goto('http://localhost:3000/#/login');
    await page.type('input[name="email"]', 'admin@flatlogic.com');
    await page.type('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    expect(page.url()).toBe('http://localhost:3000/#/app/dashboard');
  });
});