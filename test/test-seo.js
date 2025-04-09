// E2E test script for Nile Dose Cafe website SEO
// This script tests SEO elements and metadata

// Import required libraries
const puppeteer = require('puppeteer');
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
async function runSEOTests() {
  console.log('Starting Nile Dose Cafe website SEO tests...');
  
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
        await testPageSEO(browser, pageConfig, lang);
      }
    }
    
    // Test sitemap and robots.txt
    await testSitemapAndRobots(browser);
    
    console.log('\nAll SEO tests completed!');
  } catch (error) {
    console.error('SEO test failed:', error);
  } finally {
    // Close browser
    await browser.close();
  }
}

// Test SEO for a specific page
async function testPageSEO(browser, pageConfig, lang) {
  const pagePath = lang === 'en' ? `/en${pageConfig.path}` : pageConfig.path;
  console.log(`- Testing ${pageConfig.name} page (${pagePath})...`);
  
  const page = await browser.newPage();
  
  try {
    // Navigate to page
    await page.goto(`${config.baseUrl}${pagePath}`);
    await page.waitForSelector('body');
    
    // Check title
    const title = await page.title();
    expect(title).to.not.be.empty;
    expect(title.length).to.be.at.most(70, 'Title should be at most 70 characters');
    
    // Check meta description
    const metaDescription = await page.$eval('meta[name="description"]', el => el.getAttribute('content'));
    expect(metaDescription).to.not.be.empty;
    expect(metaDescription.length).to.be.at.most(160, 'Meta description should be at most 160 characters');
    
    // Check canonical URL
    const canonicalUrl = await page.$eval('link[rel="canonical"]', el => el.getAttribute('href'));
    expect(canonicalUrl).to.include(pagePath);
    
    // Check alternate language links
    const hasArLink = await page.evaluate(() => {
      return !!document.querySelector('link[rel="alternate"][hreflang="ar"]');
    });
    
    const hasEnLink = await page.evaluate(() => {
      return !!document.querySelector('link[rel="alternate"][hreflang="en"]');
    });
    
    expect(hasArLink).to.be.true;
    expect(hasEnLink).to.be.true;
    
    // Check Open Graph tags
    const ogTitle = await page.$eval('meta[property="og:title"]', el => el.getAttribute('content'));
    const ogDescription = await page.$eval('meta[property="og:description"]', el => el.getAttribute('content'));
    const ogImage = await page.$eval('meta[property="og:image"]', el => el.getAttribute('content'));
    const ogUrl = await page.$eval('meta[property="og:url"]', el => el.getAttribute('content'));
    
    expect(ogTitle).to.not.be.empty;
    expect(ogDescription).to.not.be.empty;
    expect(ogImage).to.not.be.empty;
    expect(ogUrl).to.not.be.empty;
    
    // Check Twitter tags
    const twitterCard = await page.$eval('meta[name="twitter:card"]', el => el.getAttribute('content'));
    const twitterTitle = await page.$eval('meta[name="twitter:title"]', el => el.getAttribute('content'));
    const twitterDescription = await page.$eval('meta[name="twitter:description"]', el => el.getAttribute('content'));
    
    expect(twitterCard).to.not.be.empty;
    expect(twitterTitle).to.not.be.empty;
    expect(twitterDescription).to.not.be.empty;
    
    // Check structured data
    const structuredData = await page.evaluate(() => {
      const script = document.querySelector('script[type="application/ld+json"]');
      return script ? JSON.parse(script.textContent) : null;
    });
    
    expect(structuredData).to.not.be.null;
    expect(structuredData['@context']).to.equal('https://schema.org');
    
    // Check heading structure
    const h1Count = await page.$$eval('h1', elements => elements.length);
    expect(h1Count).to.be.at.most(1, 'Page should have at most one H1 tag');
    
    // Check image alt attributes
    const imagesWithoutAlt = await page.$$eval('img:not([alt])', images => images.length);
    expect(imagesWithoutAlt).to.equal(0, 'All images should have alt attributes');
    
    console.log(`  ✓ ${pageConfig.name} page (${pagePath}) passed SEO tests`);
  } catch (error) {
    console.error(`Error testing ${pagePath}:`, error);
  } finally {
    await page.close();
  }
}

// Test sitemap and robots.txt
async function testSitemapAndRobots(browser) {
  console.log('\nTesting sitemap.xml and robots.txt...');
  
  const page = await browser.newPage();
  
  try {
    // Test robots.txt
    await page.goto(`${config.baseUrl}/robots.txt`);
    const robotsContent = await page.evaluate(() => document.body.textContent);
    
    expect(robotsContent).to.include('User-agent');
    expect(robotsContent).to.include('Sitemap');
    
    // Test sitemap.xml
    await page.goto(`${config.baseUrl}/sitemap.xml`);
    const sitemapContent = await page.evaluate(() => document.body.textContent);
    
    expect(sitemapContent).to.include('<?xml');
    expect(sitemapContent).to.include('<urlset');
    expect(sitemapContent).to.include('<url>');
    expect(sitemapContent).to.include('<loc>');
    
    console.log('  ✓ sitemap.xml and robots.txt passed tests');
  } catch (error) {
    console.error('Error testing sitemap and robots:', error);
  } finally {
    await page.close();
  }
}

// Run tests
runSEOTests().catch(console.error);
