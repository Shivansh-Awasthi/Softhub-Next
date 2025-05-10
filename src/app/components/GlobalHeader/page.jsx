// src/app/components/GlobalHeader/page.jsx
import { headers } from 'next/headers';
import Header from '../../header-ssr/Header';

// Server-side data fetching for search results
async function fetchSearchResults(query) {
  if (!query) {
    return { apps: [], total: 0 };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/apps/all?q=${encodeURIComponent(query.trim())}&page=1&limit=9`,
      {
        headers: {
          'X-Auth-Token': "my-secret-token-123"
        },
        cache: 'no-store' // Ensure fresh data
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.success ? { apps: data.apps, total: data.total } : { apps: [], total: 0 };
  } catch (error) {
    console.error("Error fetching search results:", error);
    return { apps: [], total: 0, error: error.message };
  }
}

export default async function GlobalHeader() {
  // Get the current URL from headers - properly awaited
  const headersList = await headers();

  // Get the current URL path and query parameters
  const currentUrl = headersList.get('x-url') || '';
  let query = '';

  try {
    if (currentUrl) {
      const url = new URL(currentUrl);

      // Only use the query parameter if we're on the search page
      if (url.pathname === '/search') {
        query = url.searchParams.get('query') || '';
        console.log('Search page detected, query:', query);
      }
    }
  } catch (error) {
    console.error('Error parsing URL:', error);
  }

  // Fetch search results on the server
  const searchResults = await fetchSearchResults(query);

  return <Header initialQuery={query} initialResults={searchResults} />;
}
