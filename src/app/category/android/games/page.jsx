// app/category/android/games/page.jsx

import Android from "./Android";

export const metadata = {
  title: 'Android Games - ToxicGames',
  description: 'Download free Android games and apps',
};

export default async function AndroidGamesPage({ searchParams }) {
    // Get the current page from the URL
    const currentPage = parseInt(searchParams?.page || '1', 10);
    const itemsPerPage = 48;

    try {
        // Server-side data fetching
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/apps/category/android?page=${currentPage}&limit=${itemsPerPage}`,
            {
                headers: {
                    'X-Auth-Token': 'my-secret-token-123',
                },
                cache: 'no-store', // Ensure fresh data
            }
        );

        if (!response.ok) {
            console.error(`API error: ${response.status} ${response.statusText}`);
            throw new Error(`API error: ${response.status}`);
        }

        const responseData = await response.json();
        
        // Log the response data for debugging
        console.log("Android games API response:", {
            responseDataKeys: Object.keys(responseData),
            appsLength: responseData.apps ? responseData.apps.length : 0,
            total: responseData.total || 0
        });

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
