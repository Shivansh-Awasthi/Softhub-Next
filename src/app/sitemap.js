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

export default async function sitemap() {
  const baseUrl = 'https://toxicgames.in';
  const currentDate = new Date().toISOString();

  // Define static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/category/pc/games`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/mac/games`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/android/games`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/ps2/iso`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/ps3/iso`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/ps4/iso`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/ppsspp/iso`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/pc/softwares`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/mac/softwares`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/android/softwares`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/user/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/user/signup`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Fetch dynamic routes from API
  let dynamicRoutes = [];
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
        dynamicRoutes = data.apps
          .filter(game => game.platform && game.title && game._id)
          .map(game => ({
            url: `${baseUrl}/download/${slugify(game.platform)}/${slugify(game.title)}/${game._id}`,
            lastModified: game.updatedAt || game.createdAt || currentDate,
            changeFrequency: 'monthly',
            priority: 0.7,
          }));

        console.log(`Added ${dynamicRoutes.length} game URLs to sitemap`);
      } else {
        console.error('Invalid data structure received from API:', data);

        // Add some hardcoded game URLs for testing
        console.log('Adding hardcoded game URLs for testing');

        // Add 5 sample game URLs
        for (let i = 1; i <= 5; i++) {
          dynamicRoutes.push({
            url: `${baseUrl}/download/pc/sample-game-${i}/sample-id-${i}`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7,
          });
        }
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    console.error('Error fetching games for sitemap:', error);
    // Continue with static routes if API fails
  }

  console.log(`Total URLs in sitemap: ${staticRoutes.length + dynamicRoutes.length}`);

  // Combine static and dynamic routes
  return [...staticRoutes, ...dynamicRoutes];
}
