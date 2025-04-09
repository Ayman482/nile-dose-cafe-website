// Test script for Nile Dose Cafe website functionality and responsiveness
// This script will test various aspects of the website to ensure it works correctly

// Import required libraries
const puppeteer = require('puppeteer');
const { expect } = require('chai');

// Test configuration
const config = {
  baseUrl: 'http://localhost:3000', // Base URL for local testing
  viewports: [
    { width: 375, height: 667, name: 'mobile' },    // iPhone SE
    { width: 768, height: 1024, name: 'tablet' },   // iPad
    { width: 1366, height: 768, name: 'laptop' },   // Laptop
    { width: 1920, height: 1080, name: 'desktop' }  // Desktop
  ],
  languages: ['ar', 'en'],
  pages: [
    { path: '/', name: 'home' },
    { path: '/menu', name: 'menu' },
    { path: '/catering', name: 'catering' },
    { path: '/login', name: 'login' },
    { path: '/register', name: 'register' }
  ]
};

// Main test function
async function runTests() {
  console.log('Starting Nile Dose Cafe website tests...');
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    // Run responsive tests
    await testResponsiveness(browser);
    
    // Run functionality tests
    await testFunctionality(browser);
    
    // Run bilingual support tests
    await testBilingualSupport(browser);
    
    // Run performance tests
    await testPerformance(browser);
    
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Close browser
    await browser.close();
  }
}

// Test responsiveness across different viewports
async function testResponsiveness(browser) {
  console.log('\nTesting responsiveness...');
  
  for (const viewport of config.viewports) {
    console.log(`\nTesting ${viewport.name} viewport (${viewport.width}x${viewport.height})...`);
    
    const page = await browser.newPage();
    await page.setViewport(viewport);
    
    for (const pageConfig of config.pages) {
      console.log(`- Testing ${pageConfig.name} page...`);
      
      // Navigate to page
      await page.goto(`${config.baseUrl}${pageConfig.path}`);
      await page.waitForSelector('body');
      
      // Take screenshot for visual inspection
      await page.screenshot({ 
        path: `./test-results/${viewport.name}-${pageConfig.name}.png`,
        fullPage: true 
      });
      
      // Check for responsive elements
      const overflowX = await page.evaluate(() => {
        return window.getComputedStyle(document.body).overflowX;
      });
      
      // Ensure no horizontal scrolling
      expect(overflowX).to.not.equal('auto');
      expect(overflowX).to.not.equal('scroll');
      
      // Check if menu is properly displayed
      if (viewport.width < 768) {
        // Mobile menu should be present
        const mobileMenuVisible = await page.evaluate(() => {
          const mobileMenu = document.querySelector('.mobile-menu');
          return mobileMenu && window.getComputedStyle(mobileMenu).display !== 'none';
        });
        
        expect(mobileMenuVisible).to.be.true;
      } else {
        // Desktop menu should be present
        const desktopMenuVisible = await page.evaluate(() => {
          const desktopMenu = document.querySelector('.desktop-menu');
          return desktopMenu && window.getComputedStyle(desktopMenu).display !== 'none';
        });
        
        expect(desktopMenuVisible).to.be.true;
      }
    }
    
    await page.close();
  }
  
  console.log('Responsiveness tests completed successfully!');
}

// Test website functionality
async function testFunctionality(browser) {
  console.log('\nTesting functionality...');
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  
  // Test navigation
  console.log('- Testing navigation...');
  await page.goto(`${config.baseUrl}/`);
  await page.waitForSelector('nav');
  
  // Click on menu link
  await page.click('a[href="/menu"]');
  await page.waitForSelector('.menu-display');
  
  // Verify menu page loaded
  const menuTitle = await page.$eval('h1, h2', el => el.textContent);
  expect(menuTitle).to.include('Menu');
  
  // Test menu filtering
  console.log('- Testing menu filtering...');
  const categoryButtons = await page.$$('.category-button');
  if (categoryButtons.length > 0) {
    await categoryButtons[1].click();
    await page.waitForTimeout(500);
    
    // Verify category filter works
    const activeCategory = await page.$eval('.category-button.active', el => el.textContent);
    expect(activeCategory).to.not.be.empty;
  }
  
  // Test catering form
  console.log('- Testing catering form...');
  await page.goto(`${config.baseUrl}/catering`);
  await page.waitForSelector('form');
  
  // Fill out form fields
  await page.type('input[name="customerName"]', 'Test User');
  await page.type('input[name="email"]', 'test@example.com');
  await page.type('input[name="phone"]', '1234567890');
  
  // Select delivery method
  await page.click('input[name="deliveryMethod"][value="delivery"]');
  await page.type('textarea[name="deliveryAddress"]', 'Test Address, Riyadh');
  
  // Set date and time
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateString = tomorrow.toISOString().split('T')[0];
  await page.evaluate((dateString) => {
    document.querySelector('input[name="deliveryDate"]').value = dateString;
  }, dateString);
  await page.evaluate(() => {
    document.querySelector('input[name="deliveryTime"]').value = '14:00';
  });
  
  // Test authentication pages
  console.log('- Testing authentication pages...');
  await page.goto(`${config.baseUrl}/login`);
  await page.waitForSelector('form');
  
  // Verify login form
  const loginButton = await page.$('button[type="submit"]');
  expect(loginButton).to.not.be.null;
  
  // Test registration page
  await page.goto(`${config.baseUrl}/register`);
  await page.waitForSelector('form');
  
  // Verify registration form
  const registerButton = await page.$('button[type="submit"]');
  expect(registerButton).to.not.be.null;
  
  await page.close();
  console.log('Functionality tests completed successfully!');
}

// Test bilingual support
async function testBilingualSupport(browser) {
  console.log('\nTesting bilingual support...');
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  
  // Test Arabic (default)
  console.log('- Testing Arabic language...');
  await page.goto(`${config.baseUrl}/`);
  await page.waitForSelector('html[dir="rtl"]');
  
  // Verify Arabic content
  const arTitle = await page.$eval('h1, h2', el => el.textContent);
  expect(arTitle).to.not.be.empty;
  
  // Test English
  console.log('- Testing English language...');
  await page.goto(`${config.baseUrl}/en`);
  await page.waitForSelector('html[dir="ltr"]');
  
  // Verify English content
  const enTitle = await page.$eval('h1, h2', el => el.textContent);
  expect(enTitle).to.not.be.empty;
  expect(enTitle).to.not.equal(arTitle);
  
  // Test language switcher
  console.log('- Testing language switcher...');
  const languageSwitcher = await page.$('.language-switcher');
  if (languageSwitcher) {
    await languageSwitcher.click();
    await page.waitForSelector('html[dir="rtl"]');
    
    // Verify language switched to Arabic
    const htmlDir = await page.$eval('html', el => el.getAttribute('dir'));
    expect(htmlDir).to.equal('rtl');
  }
  
  await page.close();
  console.log('Bilingual support tests completed successfully!');
}

// Test performance
async function testPerformance(browser) {
  console.log('\nTesting performance...');
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  
  // Enable performance metrics
  await page.setCacheEnabled(false);
  await page.coverage.startJSCoverage();
  await page.coverage.startCSSCoverage();
  
  // Test home page performance
  console.log('- Testing home page performance...');
  const homeStart = Date.now();
  await page.goto(`${config.baseUrl}/`);
  const homeLoadTime = Date.now() - homeStart;
  console.log(`  Home page load time: ${homeLoadTime}ms`);
  
  // Test menu page performance
  console.log('- Testing menu page performance...');
  const menuStart = Date.now();
  await page.goto(`${config.baseUrl}/menu`);
  const menuLoadTime = Date.now() - menuStart;
  console.log(`  Menu page load time: ${menuLoadTime}ms`);
  
  // Get JS and CSS coverage
  const jsCoverage = await page.coverage.stopJSCoverage();
  const cssCoverage = await page.coverage.stopCSSCoverage();
  
  // Calculate JS usage
  let jsUsed = 0;
  let jsTotal = 0;
  for (const entry of jsCoverage) {
    jsTotal += entry.text.length;
    for (const range of entry.ranges) {
      jsUsed += range.end - range.start;
    }
  }
  
  // Calculate CSS usage
  let cssUsed = 0;
  let cssTotal = 0;
  for (const entry of cssCoverage) {
    cssTotal += entry.text.length;
    for (const range of entry.ranges) {
      cssUsed += range.end - range.start;
    }
  }
  
  // Log coverage results
  const jsUsage = jsUsed / jsTotal * 100 || 0;
  const cssUsage = cssUsed / cssTotal * 100 || 0;
  console.log(`  JS usage: ${jsUsed}/${jsTotal} bytes (${jsUsage.toFixed(2)}%)`);
  console.log(`  CSS usage: ${cssUsed}/${cssTotal} bytes (${cssUsage.toFixed(2)}%)`);
  
  // Performance expectations
  expect(homeLoadTime).to.be.below(3000); // Home page should load in under 3 seconds
  expect(menuLoadTime).to.be.below(3000); // Menu page should load in under 3 seconds
  expect(jsUsage).to.be.above(50); // JS usage should be above 50%
  expect(cssUsage).to.be.above(50); // CSS usage should be above 50%
  
  await page.close();
  console.log('Performance tests completed successfully!');
}

// Run tests
runTests().catch(console.error);
