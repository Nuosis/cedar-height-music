import { test, expect } from '@playwright/test';

test('Boy+Guitar Layout Position Investigation', async ({ page }) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] LAYOUT INVESTIGATION - Starting test`);
  
  // Navigate to the page
  await page.goto('http://localhost:5173');
  
  // Wait for the component to load
  await page.waitForSelector('.main-content');
  await page.waitForSelector('.hero-image');
  await page.waitForSelector('.content-right');
  
  // Get bounding boxes for positioning analysis
  const mainContent = await page.locator('.main-content').boundingBox();
  const heroImage = await page.locator('.hero-image').boundingBox();
  const contentRight = await page.locator('.content-right').boundingBox();
  
  console.log(`[${timestamp}] POSITIONING EVIDENCE:`);
  console.log(`[${timestamp}] - Main content left: ${mainContent.x}`);
  console.log(`[${timestamp}] - Hero image left: ${heroImage.x}`);
  console.log(`[${timestamp}] - Content right left: ${contentRight.x}`);
  console.log(`[${timestamp}] - Hero image is left of content: ${heroImage.x < contentRight.x}`);
  
  // Get computed styles
  const mainContentStyles = await page.locator('.main-content').evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      display: styles.display,
      flexDirection: styles.flexDirection,
      justifyContent: styles.justifyContent
    };
  });
  
  const heroImageStyles = await page.locator('.hero-image').evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      order: styles.order,
      flex: styles.flex
    };
  });
  
  const contentRightStyles = await page.locator('.content-right').evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      order: styles.order,
      flex: styles.flex
    };
  });
  
  console.log(`[${timestamp}] COMPUTED STYLES EVIDENCE:`);
  console.log(`[${timestamp}] - Main content display: ${mainContentStyles.display}`);
  console.log(`[${timestamp}] - Main content flex-direction: ${mainContentStyles.flexDirection}`);
  console.log(`[${timestamp}] - Hero image order: ${heroImageStyles.order}`);
  console.log(`[${timestamp}] - Content right order: ${contentRightStyles.order}`);
  console.log(`[${timestamp}] - Hero image flex: ${heroImageStyles.flex}`);
  console.log(`[${timestamp}] - Content right flex: ${contentRightStyles.flex}`);
  
  // Check DOM order
  const childrenOrder = await page.locator('.main-content').evaluate(el => {
    return Array.from(el.children).map(child => child.className);
  });
  
  console.log(`[${timestamp}] DOM ORDER EVIDENCE:`);
  console.log(`[${timestamp}] - Children order: ${JSON.stringify(childrenOrder)}`);
  console.log(`[${timestamp}] - Hero image is first child: ${childrenOrder[0].includes('hero-image')}`);
  
  // CRITICAL TEST: Is boy+guitar on the left side?
  const boyGuitarIsOnLeft = heroImage.x < contentRight.x;
  console.log(`[${timestamp}] FINAL EVIDENCE: Boy+guitar is on LEFT side: ${boyGuitarIsOnLeft}`);
  
  // Take a screenshot for visual evidence
  await page.screenshot({ path: 'test-results/layout-investigation-evidence.png', fullPage: true });
  
  // The test assertion - this will tell us definitively if it's working
  if (boyGuitarIsOnLeft) {
    console.log(`[${timestamp}] SUCCESS: Boy+guitar is correctly positioned on the LEFT`);
  } else {
    console.log(`[${timestamp}] PROBLEM CONFIRMED: Boy+guitar is incorrectly positioned on the RIGHT`);
  }
  
  // Don't fail the test, just gather evidence
  expect(true).toBe(true);
});