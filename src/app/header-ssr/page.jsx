// src/app/header-ssr/page.jsx

import Header from './Header';

export const metadata = {
  title: 'SSR Header Example - ToxicGames',
  description: 'Server-side rendered header component example',
};

export default async function HeaderSSRPage({ searchParams }) {
  const query = searchParams.query || '';

  // Fetch search results on the server
  const searchResults = await fetchSearchResults(query);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Server-Side Rendered Header Example</h1>
        <p className="text-gray-400 mb-6">
          This page demonstrates a server-side rendered header with search functionality.
        </p>
      </div>

      <Header initialQuery={query} initialResults={searchResults} />
    </div>
  );
}

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
