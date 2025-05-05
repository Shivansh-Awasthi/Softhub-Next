'use client';

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

export default function GameSitemapPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const itemsPerPage = 1000; // More reasonable limit for performance

    // Use the improved slugify function for consistent URL generation
    const slugify = (text = '') => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend.toxicgames.in';
            
            const response = await fetch(`${apiUrl}/api/apps/all?page=1&limit=${itemsPerPage}`);
            
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            
            const responseData = await response.json();
            
            if (responseData && responseData.apps) {
                setData(responseData.apps);
                console.log(`Loaded ${responseData.apps.length} games for sitemap`);
            } else {
                setError('Invalid data format received from API');
            }
        } catch (err) {
            console.error('Error fetching sitemap data:', err);
            setError(err.message || 'Failed to load games data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Generate XML sitemap content
    const generateSitemapXml = () => {
        const baseUrl = 'https://toxicgames.in';
        const today = new Date().toISOString().split('T')[0];
        
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        // Add home page
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += '    <changefreq>daily</changefreq>\n';
        xml += '    <priority>1.0</priority>\n';
        xml += '  </url>\n';
        
        // Add category pages
        const categories = [
            'pc/games', 'mac/games', 'android/games', 
            'ps2/iso', 'ps3/iso', 'ps4/iso', 'ppsspp/iso',
            'pc/softwares', 'mac/softwares', 'android/softwares'
        ];
        
        categories.forEach(category => {
            xml += '  <url>\n';
            xml += `    <loc>${baseUrl}/category/${category}</loc>\n`;
            xml += `    <lastmod>${today}</lastmod>\n`;
            xml += '    <changefreq>weekly</changefreq>\n';
            xml += '    <priority>0.8</priority>\n';
            xml += '  </url>\n';
        });
        
        // Add individual game pages
        data.forEach(game => {
            const platform = slugify(game.platform);
            const title = slugify(game.title);
            const lastmod = game.updatedAt ? new Date(game.updatedAt).toISOString().split('T')[0] : today;
            
            xml += '  <url>\n';
            xml += `    <loc>${baseUrl}/download/${platform}/${title}/${game._id}</loc>\n`;
            xml += `    <lastmod>${lastmod}</lastmod>\n`;
            xml += '    <changefreq>monthly</changefreq>\n';
            xml += '    <priority>0.7</priority>\n';
            xml += '  </url>\n';
        });
        
        xml += '</urlset>';
        return xml;
    };

    // Download sitemap function
    const downloadSitemap = () => {
        const xml = generateSitemapXml();
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Game Sitemap Generator</h1>
            
            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>Error: {error}</p>
                </div>
            ) : (
                <div className="bg-gray-800 p-6 rounded-lg">
                    <p className="mb-4 text-gray-300">
                        Loaded {data.length} games for the sitemap.
                    </p>
                    
                    <button
                        onClick={downloadSitemap}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Download Sitemap XML
                    </button>
                    
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2 text-gray-200">Preview (First 5 Games)</h2>
                        <ul className="list-disc pl-5 space-y-2 text-gray-300">
                            {data.slice(0, 5).map(game => (
                                <li key={game._id}>
                                    <a 
                                        href={`https://toxicgames.in/download/${slugify(game.platform)}/${slugify(game.title)}/${game._id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:underline"
                                    >
                                        {game.title} ({game.platform})
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            
            {/* Hidden SEO content */}
            <div style={{ display: 'none' }}>
                <Helmet>
                    {data.slice(0, 50).map((game) => (
                        <React.Fragment key={game._id}>
                            <script type="application/ld+json">
                                {JSON.stringify({
                                    "@context": "https://schema.org",
                                    "@type": "Game",
                                    "name": game.title,
                                    "platform": game.platform,
                                    "url": `https://toxicgames.in/download/${slugify(game.platform)}/${slugify(game.title)}/${game._id}`,
                                    "description": game.description,
                                    "image": game.coverImg,
                                    "downloadUrl": `https://toxicgames.in/download/${slugify(game.platform)}/${slugify(game.title)}/${game._id}`,
                                    "datePublished": game.createdAt,
                                    "size": game.size,
                                    "price": game.isPaid ? `₹${game.price}` : "Free",
                                })}
                            </script>
                        </React.Fragment>
                    ))}
                </Helmet>
            </div>
        </div>
    );
}
