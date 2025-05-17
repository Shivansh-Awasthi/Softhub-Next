import { Suspense } from 'react';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Sitemap - ToxicGames',
  description: 'Sitemap for ToxicGames website',
};

// This component will redirect to the backend sitemap
export default function SitemapPage() {
  // Redirect to the backend sitemap
  redirect('https://backend.toxicgames.in/sitemap.xml');
  
  // This part won't execute due to the redirect, but is here as a fallback
  return (
    <Suspense fallback={<div>Loading sitemap...</div>}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Sitemap</h1>
        <p className="mb-4">
          Redirecting to the sitemap...
        </p>
      </div>
    </Suspense>
  );
}
