const puppeteer = require('puppeteer');

test('Adds two numbers', () => {
  const sum = 1 + 2;

  expect(sum).toEqual(3);
})

test('we can lauch a browser', async () => {
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await browser.close();
})
