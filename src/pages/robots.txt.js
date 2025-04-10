import { generateRobotsTxt } from '../lib/seo';

// Generate robots.txt content
export async function GET() {
  const robotsTxt = generateRobotsTxt();
  
  // Return text response
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}
