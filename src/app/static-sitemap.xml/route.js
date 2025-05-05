import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://toxicgames.in';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Start building XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add static routes
  const staticRoutes = [
    { path: '', freq: 'daily', priority: '1.0' },
    { path: '/category/pc/games', freq: 'weekly', priority: '0.8' },
    { path: '/category/mac/games', freq: 'weekly', priority: '0.8' },
    { path: '/category/android/games', freq: 'weekly', priority: '0.8' },
    { path: '/category/ps2/iso', freq: 'weekly', priority: '0.8' },
    { path: '/category/ps3/iso', freq: 'weekly', priority: '0.8' },
    { path: '/category/ps4/iso', freq: 'weekly', priority: '0.8' },
    { path: '/category/ppsspp/iso', freq: 'weekly', priority: '0.8' },
    { path: '/category/pc/softwares', freq: 'weekly', priority: '0.8' },
    { path: '/category/mac/softwares', freq: 'weekly', priority: '0.8' },
    { path: '/category/android/softwares', freq: 'weekly', priority: '0.8' },
    { path: '/user/login', freq: 'monthly', priority: '0.5' },
    { path: '/user/signup', freq: 'monthly', priority: '0.5' },
    { path: '/search', freq: 'weekly', priority: '0.7' },
    { path: '/sitemap-status', freq: 'monthly', priority: '0.3' },
    { path: '/sitemap-generator', freq: 'monthly', priority: '0.3' },
  ];
  
  for (const route of staticRoutes) {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${route.path}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${route.freq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  }
  
  xml += '</urlset>';
  
  // Return XML with proper content type
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
