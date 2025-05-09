// app/mac/games/page.jsx

import { Suspense } from 'react';
import MacGames from "./MacGames";
import CategorySkeleton from "@/app/components/CategorySkeleton";

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
    title: 'Mac Games - ToxicGames',
    description: 'Download free Mac games and apps',
};

// This component fetches data and renders the MacGames component
async function MacGamesLoader({ currentPage, itemsPerPage }) {
    try {
        // This fetch happens at build time and during revalidation
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/apps/category/mac?page=${currentPage}&limit=${itemsPerPage}`,
            {
                headers: {
                    'X-Auth-Token': 'my-secret-token-123',
                },
                // Use next.js cache with revalidation
                next: { revalidate: 3600 }
            }
        );

        if (!res.ok) {
            console.error(`API error: ${res.status} ${res.statusText}`);
            throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        return <MacGames serverData={data} initialPage={currentPage} />;
    } catch (error) {
        console.error("Error fetching data:", error);
        // Return component with error state
        return <MacGames serverData={{ apps: [], total: 0, error: error.message }} initialPage={currentPage} />;
    }
}

export default function MacGamesPage({ params, searchParams }) {
    // Get page from params (for static generation) or searchParams (for client navigation)
    const pageFromParams = params?.page;
    const pageFromSearch = searchParams?.page;
    const currentPage = parseInt(pageFromParams || pageFromSearch || '1', 10);
    const itemsPerPage = 48;

    return (
        <Suspense fallback={<CategorySkeleton itemCount={16} platform="Mac" />}>
            <MacGamesLoader currentPage={currentPage} itemsPerPage={itemsPerPage} />
        </Suspense>
    );
}
