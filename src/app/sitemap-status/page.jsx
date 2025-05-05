'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SitemapStatusPage() {
  const [sitemapStatus, setSitemapStatus] = useState({
    loading: true,
    error: null,
    staticUrls: 0,
    dynamicUrls: 0,
    backendUrls: 0,
    totalUrls: 0,
    lastChecked: null
  });

  useEffect(() => {
    const checkSitemap = async () => {
      try {
        setSitemapStatus(prev => ({ ...prev, loading: true }));

        // Fetch the sitemap index
        const indexResponse = await fetch('/sitemap-index.xml');
        if (!indexResponse.ok) {
          throw new Error(`Failed to fetch sitemap index: ${indexResponse.status}`);
        }

        const indexXml = await indexResponse.text();

        // Count sitemaps in the index
        const sitemapMatches = indexXml.match(/<sitemap>/g);
        const sitemapCount = sitemapMatches ? sitemapMatches.length : 0;

        console.log(`Found ${sitemapCount} sitemaps in the index`);

        // Fetch the static sitemap
        const staticResponse = await fetch('/static-sitemap.xml');
        if (!staticResponse.ok) {
          throw new Error(`Failed to fetch static sitemap: ${staticResponse.status}`);
        }

        const staticXml = await staticResponse.text();

        // Count static URLs
        const staticUrlMatches = staticXml.match(/<url>/g);
        const staticUrls = staticUrlMatches ? staticUrlMatches.length : 0;

        console.log(`Found ${staticUrls} URLs in the static sitemap`);

        // Get backend sitemap URL from the index
        const backendUrlMatch = indexXml.match(/<loc>https:\/\/backend\.toxicgames\.in\/sitemap\.xml<\/loc>/);
        const backendUrl = backendUrlMatch ? 'https://backend.toxicgames.in/sitemap.xml' : null;

        let backendUrls = 0;
        let backendError = null;

        // Try to fetch the backend sitemap
        if (backendUrl) {
          try {
            const backendResponse = await fetch(backendUrl, {
              mode: 'no-cors' // This is needed for cross-origin requests
            });

            // Note: With no-cors, we can't actually read the response
            // So we'll just indicate that we found the backend sitemap
            backendUrls = '(Available on backend)';

            console.log('Backend sitemap is available');
          } catch (backendErr) {
            console.error('Error fetching backend sitemap:', backendErr);
            backendError = backendErr.message;
            backendUrls = '(Error fetching)';
          }
        }

        // Calculate total URLs
        const totalUrls = staticUrls + (typeof backendUrls === 'number' ? backendUrls : 0);

        setSitemapStatus({
          loading: false,
          error: null,
          staticUrls,
          dynamicUrls: 0, // We're not counting these directly anymore
          backendUrls,
          backendError,
          totalUrls,
          lastChecked: new Date().toLocaleString()
        });
      } catch (error) {
        console.error('Error checking sitemap:', error);
        setSitemapStatus(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    };

    checkSitemap();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Sitemap Status</h1>

      {sitemapStatus.loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : sitemapStatus.error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error: {sitemapStatus.error}</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <h2 className="text-lg font-semibold text-gray-300 mb-2">Static URLs</h2>
              <p className="text-3xl font-bold text-blue-400">{sitemapStatus.staticUrls}</p>
              <p className="text-xs text-gray-400 mt-2">From static-sitemap.xml</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <h2 className="text-lg font-semibold text-gray-300 mb-2">Backend URLs</h2>
              <p className="text-3xl font-bold text-green-400">{sitemapStatus.backendUrls}</p>
              <p className="text-xs text-gray-400 mt-2">From backend.toxicgames.in</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <h2 className="text-lg font-semibold text-gray-300 mb-2">Total URLs</h2>
              <p className="text-3xl font-bold text-purple-400">{sitemapStatus.totalUrls}</p>
              <p className="text-xs text-gray-400 mt-2">Combined from all sitemaps</p>
            </div>
          </div>

          <div className="text-gray-300 mb-6">
            <p>Last checked: {sitemapStatus.lastChecked}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/sitemap-index.xml"
              target="_blank"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              View Sitemap Index
            </Link>
            <Link
              href="/static-sitemap.xml"
              target="_blank"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              View Static Sitemap
            </Link>
            <Link
              href="https://backend.toxicgames.in/sitemap.xml"
              target="_blank"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              View Backend Sitemap
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Refresh Status
            </button>
            <Link
              href="https://search.google.com/search-console"
              target="_blank"
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            >
              Google Search Console
            </Link>
          </div>
        </div>
      )}

      <div className="mt-8 bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-white">Sitemap Information</h2>
        <div className="text-gray-300 space-y-4">
          <p>
            Your sitemap implementation uses a sitemap index that references two separate sitemaps:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Backend Sitemap</strong>: Contains all your game and app pages (from backend.toxicgames.in)</li>
            <li><strong>Static Sitemap</strong>: Contains your static pages (category pages, login, etc.)</li>
          </ul>

          <p className="mt-4">
            The static sitemap includes:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Home page</li>
            <li>Category pages (PC, Mac, Android, PlayStation)</li>
            <li>User pages (login, signup)</li>
            <li>Search page</li>
            <li>Sitemap utility pages</li>
          </ul>

          <p className="mt-4">
            The backend sitemap includes:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>All individual game and app pages</li>
          </ul>

          <p className="mt-4">
            To submit your sitemap to search engines, use this URL:
          </p>
          <div className="bg-gray-700 p-3 rounded-lg mt-2 font-mono text-sm">
            https://toxicgames.in/sitemap-index.xml
          </div>

          <p className="mt-4">
            Submit to search engines:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Google Search Console
              </a>
              : Add your sitemap index at https://toxicgames.in/sitemap-index.xml
            </li>
            <li>
              <a
                href="https://www.bing.com/webmasters/home"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Bing Webmaster Tools
              </a>
              : Add your sitemap index at https://toxicgames.in/sitemap-index.xml
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
