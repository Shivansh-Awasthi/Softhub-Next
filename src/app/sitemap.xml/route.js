import { NextResponse } from 'next/server';

// Helper function to slugify text
const slugify = (text = '') => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

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
  ];

  for (const route of staticRoutes) {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${route.path}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${route.freq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  // Fetch dynamic routes from API
  try {
    // IMPORTANT: Use hardcoded URL for testing to ensure it works
    const apiUrl = 'https://backend.toxicgames.in';
    console.log(`Fetching games from: ${apiUrl}/api/apps/all?page=1&limit=10000`);

    // Add a timeout to ensure the fetch doesn't hang
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(`${apiUrl}/api/apps/all?page=1&limit=10000`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      // Log the response headers and status
      console.log('API Response Status:', response.status);
      console.log('API Response Type:', response.headers.get('content-type'));

      // Get the response text first to debug
      const responseText = await response.text();
      console.log('API Response Length:', responseText.length);

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse API response as JSON:', parseError);
        console.log('Response preview:', responseText.substring(0, 200) + '...');
        throw new Error('Invalid JSON response from API');
      }

      // Check if data has the expected structure
      if (data && data.apps && Array.isArray(data.apps)) {
        console.log(`Successfully fetched ${data.apps.length} games for sitemap`);

        // Add a sample of games to the sitemap for debugging
        console.log('Sample game:', data.apps[0]);

        // Add all games to the sitemap
        for (const game of data.apps) {
          if (!game.platform || !game.title || !game._id) {
            console.log('Skipping game with missing data:', game);
            continue;
          }

          const platform = slugify(game.platform);
          const title = slugify(game.title);
          const lastmod = game.updatedAt
            ? new Date(game.updatedAt).toISOString().split('T')[0]
            : currentDate;

          xml += '  <url>\n';
          xml += `    <loc>${baseUrl}/download/${platform}/${title}/${game._id}</loc>\n`;
          xml += `    <lastmod>${lastmod}</lastmod>\n`;
          xml += '    <changefreq>monthly</changefreq>\n';
          xml += '    <priority>0.7</priority>\n';
          xml += '  </url>\n';
        }

        console.log(`Added ${data.apps.length} game URLs to sitemap`);
      } else {
        console.error('Invalid data structure received from API:', data);

        // Add some hardcoded game URLs for testing
        console.log('Adding hardcoded game URLs for testing');

        // Add 5 sample game URLs
        for (let i = 1; i <= 5; i++) {
          xml += '  <url>\n';
          xml += `    <loc>${baseUrl}/download/pc/sample-game-${i}/sample-id-${i}</loc>\n`;
          xml += `    <lastmod>${currentDate}</lastmod>\n`;
          xml += '    <changefreq>monthly</changefreq>\n';
          xml += '    <priority>0.7</priority>\n';
          xml += '  </url>\n';
        }
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  }
  catch (error) {
    console.error('Error fetching games for sitemap:', error);
  }

  // Close XML
  xml += '</urlset>';

  // Return XML with proper content type
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}