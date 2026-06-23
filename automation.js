/**
 * Jones Automation - Exercise
 * Automates the lead form on https://test.netlify.app/ using the Playwright library.
 *
 * Run:
 *   node automation.js                  # headless
 *   $env:HEADED=1; node automation.js   # show the browser
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://test.netlify.app/';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const SCREENSHOT_PATH = path.join(SCREENSHOT_DIR, 'before-request-callback.png');

// Test data.
const FORM_DATA = {
  name: 'Ronen Melihov',
  email: 'ronenmelihov@gmail.com',
  phone: '+972547430794',
  company: 'Test Company',
  website: 'https://www.testcompany.example',
  employees: '51-500',
};

async function main() {
  const headed = process.env.HEADED === '1';
  const browser = await chromium.launch({
    headless: !headed,
    slowMo: headed ? 300 : 0,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Open the page
    console.log(`-> Opening ${SITE_URL}`);
    await page.goto(SITE_URL, { waitUntil: 'domcontentloaded' });

    // Fill the fields (user-facing locators = stable and readable)
    console.log('-> Filling: Name, Email, Phone, Company, Website');
    await page.getByLabel('Name').fill(FORM_DATA.name);
    await page.getByLabel('Email').fill(FORM_DATA.email);
    await page.getByLabel('Phone').fill(FORM_DATA.phone);
    await page.getByLabel('Company').fill(FORM_DATA.company);
    await page.getByLabel('Website').fill(FORM_DATA.website);

    // Change the number of employees, then verify the change took effect
    console.log(`-> Changing "Number of Employees" to "${FORM_DATA.employees}"`);
    const employees = page.getByLabel('Number of Employees');
    await employees.selectOption(FORM_DATA.employees);
    const selectedValue = await employees.inputValue();
    if (selectedValue !== FORM_DATA.employees) {
      throw new Error(
        `Employees not set correctly: expected "${FORM_DATA.employees}", got "${selectedValue}"`
      );
    }

    // Screenshot before the click
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    await page.screenshot({ path: SCREENSHOT_PATH, fullPage: true });
    console.log(`-> Saved pre-submit screenshot: ${SCREENSHOT_PATH}`);

    // Click the "Request a call back" button
    console.log('-> Clicking "Request a call back"');
    await page.getByRole('button', { name: 'Request a call back' }).click();

    // Verify we reached the Thank You page, then log
    await page.waitForURL(/thank-you\.html/i, { timeout: 15000 });
    await page
      .getByRole('heading', { name: /thank you/i })
      .waitFor({ state: 'visible', timeout: 10000 });

    console.log('==========================================================');
    console.log('SUCCESS: Reached the Thank You page - form submitted!');
    console.log(`  URL:   ${page.url()}`);
    console.log(`  Title: ${await page.title()}`);
    console.log('==========================================================');
  } catch (err) {
    console.error('FAILED:', err.message);
    process.exitCode = 1; // non-zero exit code on failure
  } finally {
    await browser.close();
  }
}

main();
