// app/category/ps4/iso/page.jsx

import { Suspense } from 'react';
import Ps4Iso from "./Ps4Iso";
import CategorySkeleton from "@/app/category/CategorySkeleton";

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
    title: 'PS4 ISO Games - ToxicGames',
    description: 'Download free PlayStation 4 ISO games',
};

// This component fetches data with a timeout to prevent long waits
async function Ps4IsoLoader({ currentPage, itemsPerPage }) {
    try {
        // Create a promise that rejects after 5 seconds
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out')), 5000);
        });

        // Create the fetch promise
        const fetchPromise = fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/apps/category/ps4?page=${currentPage}&limit=${itemsPerPage}`,
            {
                headers: {
                    'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN,
                },
                // Use next.js cache with revalidation
                next: { revalidate: 3600 }
            }
        );

        // Race the fetch against the timeout
        const res = await Promise.race([fetchPromise, timeoutPromise]);

        if (!res.ok) {
            console.error(`API error: ${res.status} ${res.statusText}`);
            throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        return <Ps4Iso serverData={data} initialPage={currentPage} />;
    } catch (error) {
        console.error("Error fetching data:", error);
        // Return component with error state
        return <Ps4Iso serverData={{ apps: [], total: 0, error: error.message }} initialPage={currentPage} />;
    }
}

export default function Ps4IsoPage({ params, searchParams }) {
    // Get page from params (for static generation) or searchParams (for client navigation)
    const pageFromParams = params?.page;
    const pageFromSearch = searchParams?.page;
    const currentPage = parseInt(pageFromParams || pageFromSearch || '1', 10);
    const itemsPerPage = 48;

    return (
        <Suspense fallback={<CategorySkeleton itemCount={16} platform="PS4" />}>
            <Ps4IsoLoader currentPage={currentPage} itemsPerPage={itemsPerPage} />
        </Suspense>
    );
}
