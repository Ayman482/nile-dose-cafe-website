import { generateSitemapData } from '../lib/seo';

// Generate sitemap.xml content
export async function GET() {
  const sitemapData = generateSitemapData();
  
  // Create XML content
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapData.map(item => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  // Return XML response
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}
