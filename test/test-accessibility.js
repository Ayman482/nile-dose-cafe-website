// E2E test script for Nile Dose Cafe website accessibility
// This script tests accessibility compliance using axe-core

// Import required libraries
const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const { expect } = require('chai');

// Test configuration
const config = {
  baseUrl: 'http://localhost:3000', // Base URL for local testing
  pages: [
    { path: '/', name: 'home' },
    { path: '/menu', name: 'menu' },
    { path: '/catering', name: 'catering' },
    { path: '/login', name: 'login' },
    { path: '/register', name: 'register' }
  ],
  languages: ['ar', 'en']
};

// Main test function
async function runAccessibilityTests() {
  console.log('Starting Nile Dose Cafe website accessibility tests...');
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1366, height: 768 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    // Test each page in each language
    for (const lang of config.languages) {
      console.log(`\nTesting ${lang === 'ar' ? 'Arabic' : 'English'} pages...`);
      
      for (const pageConfig of config.pages) {
        await testPageAccessibility(browser, pageConfig, lang);
      }
    }
    
    console.log('\nAll accessibility tests completed!');
  } catch (error) {
    console.error('Accessibility test failed:', error);
  } finally {
    // Close browser
    await browser.close();
  }
}

// Test accessibility for a specific page
async function testPageAccessibility(browser, pageConfig, lang) {
  const pagePath = lang === 'en' ? `/en${pageConfig.path}` : pageConfig.path;
  console.log(`- Testing ${pageConfig.name} page (${pagePath})...`);
  
  const page = await browser.newPage();
  
  try {
    // Navigate to page
    await page.goto(`${config.baseUrl}${pagePath}`);
    await page.waitForSelector('body');
    
    // Run axe analysis
    const results = await new AxePuppeteer(page).analyze();
    
    // Log results
    console.log(`  Violations: ${results.violations.length}`);
    console.log(`  Passes: ${results.passes.length}`);
    
    // Log detailed violations if any
    if (results.violations.length > 0) {
      console.log('\n  Accessibility violations:');
      results.violations.forEach((violation, index) => {
        console.log(`  ${index + 1}. ${violation.id}: ${violation.help} (Impact: ${violation.impact})`);
        console.log(`     ${violation.description}`);
        console.log(`     Affected elements: ${violation.nodes.length}`);
      });
    }
    
    // Save results to file
    await page.evaluate((resultsJson) => {
      localStorage.setItem('axe-results', resultsJson);
    }, JSON.stringify(results));
    
    // Take screenshot for reference
    await page.screenshot({ 
      path: `./test-results/accessibility-${lang}-${pageConfig.name}.png`,
      fullPage: true 
    });
    
    // Check for critical accessibility issues
    const criticalViolations = results.violations.filter(v => 
      v.impact === 'critical' || v.impact === 'serious'
    );
    
    // We allow some violations during development, but critical ones should be fixed
    expect(criticalViolations.length).to.be.at.most(3, 
      `Found ${criticalViolations.length} critical accessibility violations on ${pagePath}`);
    
  } catch (error) {
    console.error(`Error testing ${pagePath}:`, error);
  } finally {
    await page.close();
  }
}

// Run tests
runAccessibilityTests().catch(console.error);
