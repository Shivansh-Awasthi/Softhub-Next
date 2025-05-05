import { NextResponse } from 'next/server';

export async function GET() {
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Create sitemap index XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add backend sitemap (contains all games)
  xml += '  <sitemap>\n';
  xml += '    <loc>https://backend.toxicgames.in/sitemap.xml</loc>\n';
  xml += `    <lastmod>${currentDate}</lastmod>\n`;
  xml += '  </sitemap>\n';
  
  // Add frontend sitemap (contains static routes)
  xml += '  <sitemap>\n';
  xml += '    <loc>https://toxicgames.in/static-sitemap.xml</loc>\n';
  xml += `    <lastmod>${currentDate}</lastmod>\n`;
  xml += '  </sitemap>\n';
  
  xml += '</sitemapindex>';
  
  // Return XML with proper content type
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
