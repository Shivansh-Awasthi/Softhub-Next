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
  // Get the current URL from headers
  const headersList = headers();
  const url = new URL(headersList.get('x-url') || headersList.get('referer') || 'https://toxicgames.in');
  const query = url.searchParams.get('query') || '';

  // Fetch search results on the server
  const searchResults = await fetchSearchResults(query);

  return <Header initialQuery={query} initialResults={searchResults} />;
}
