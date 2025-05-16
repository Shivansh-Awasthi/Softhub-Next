// src/app/components/GlobalHeader/page.jsx
import { headers } from 'next/headers';
import { Suspense } from 'react';
import Header from '../../header-ssr/Header';



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

  return (
    <Suspense fallback={<div>Loading header...</div>}>
      <Header initialQuery={query} />
    </Suspense>
  );
}
