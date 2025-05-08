// app/category/android/games/page.jsx

import Android from "./Android";

// Set revalidation time to 1 hour (3600 seconds)
export const revalidate = 3600;

// Generate static pages for the first 5 pages
export async function generateStaticParams() {
    return [
        { page: '1' },
        { page: '2' },
        { page: '3' },
        { page: '4' },
        { page: '5' },
    ];
}

export const metadata = {
    title: 'Android Games - ToxicGames',
    description: 'Download free Android games and apps',
};

export default async function AndroidGamesPage({ params, searchParams }) {
    // Get page from params (for static generation) or searchParams (for client navigation)
    const pageFromParams = params?.page;
    const pageFromSearch = searchParams?.page;
    const currentPage = parseInt(pageFromParams || pageFromSearch || '1', 10);
    const itemsPerPage = 48;

    try {
        // This fetch happens at build time and during revalidation
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/apps/category/android?page=${currentPage}&limit=${itemsPerPage}`,
            {
                headers: {
                    'X-Auth-Token': 'my-secret-token-123',
                },
                // Use next.js cache with revalidation
                next: { revalidate: 3600 }
            }
        );

        if (!response.ok) {
            console.error(`API error: ${response.status} ${response.statusText}`);
            throw new Error(`API error: ${response.status}`);
        }

        const responseData = await response.json();

        // Format the data to match what the component expects
        const formattedData = {
            apps: responseData.apps || [],
            total: responseData.total || 0
        };

        // Pass the data and current page to the client component
        return <Android initialData={formattedData} initialPage={currentPage} />;
    } catch (error) {
        console.error("Error fetching Android games data:", error);
        // Return component with error state
        return <Android initialData={{ apps: [], total: 0 }} initialPage={currentPage} />;
    }
}
