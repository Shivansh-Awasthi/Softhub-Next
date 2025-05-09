// app/category/ppsspp/iso/page.jsx

import { Suspense } from 'react';
import PpssppIso from "./PpssppIso";
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
    title: 'PPSSPP ISO Games - ToxicGames',
    description: 'Download free PSP ISO games for PPSSPP emulator',
};

// This component fetches data with a timeout to prevent long waits
async function PpssppIsoLoader({ currentPage, itemsPerPage }) {
    try {
        // Create a promise that rejects after 5 seconds
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out')), 5000);
        });

        // Create the fetch promise
        const fetchPromise = fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/apps/category/ppsspp?page=${currentPage}&limit=${itemsPerPage}`,
            {
                headers: {
                    'X-Auth-Token': 'my-secret-token-123',
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
        return <PpssppIso serverData={data} initialPage={currentPage} />;
    } catch (error) {
        console.error("Error fetching data:", error);
        // Return component with error state
        return <PpssppIso serverData={{ apps: [], total: 0, error: error.message }} initialPage={currentPage} />;
    }
}

export default function PpssppIsoPage({ params, searchParams }) {
    // Get page from params (for static generation) or searchParams (for client navigation)
    const pageFromParams = params?.page;
    const pageFromSearch = searchParams?.page;
    const currentPage = parseInt(pageFromParams || pageFromSearch || '1', 10);
    const itemsPerPage = 48;

    return (
        <Suspense fallback={<CategorySkeleton itemCount={16} platform="PlayStation" />}>
            <PpssppIsoLoader currentPage={currentPage} itemsPerPage={itemsPerPage} />
        </Suspense>
    );
}
