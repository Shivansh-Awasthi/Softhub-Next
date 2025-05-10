// app/pc/software/page.jsx

import { Suspense } from 'react';
import PcSoftwares from "./PcSoftwares";
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
    title: 'PC Software - ToxicGames',
    description: 'Download free PC software and applications',
};

// This component fetches data with a timeout to prevent long waits
async function PcSoftwaresLoader({ currentPage, itemsPerPage }) {
    try {
        // Create a promise that rejects after 5 seconds
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out')), 5000);
        });

        // Create the fetch promise
        const fetchPromise = fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/apps/category/spc?page=${currentPage}&limit=${itemsPerPage}`,
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
        return <PcSoftwares serverData={data} initialPage={currentPage} />;
    } catch (error) {
        console.error("Error fetching data:", error);
        // Return component with error state
        return <PcSoftwares serverData={{ apps: [], total: 0, error: error.message }} initialPage={currentPage} />;
    }
}

export default async function PcSoftwaresPage({ params, searchParams }) {
    // Properly await params and searchParams before accessing their properties
    const paramsData = await params;
    const searchParamsData = await searchParams;

    // Get page from params (for static generation) or searchParams (for client navigation)
    const pageFromParams = paramsData?.page;
    const pageFromSearch = searchParamsData?.page;
    const currentPage = parseInt(pageFromParams || pageFromSearch || '1', 10);
    const itemsPerPage = 48;

    return (
        <Suspense fallback={<CategorySkeleton itemCount={16} platform="PC" />}>
            <PcSoftwaresLoader currentPage={currentPage} itemsPerPage={itemsPerPage} />
        </Suspense>
    );
}
