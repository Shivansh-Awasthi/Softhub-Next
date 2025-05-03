// app/android/software/page.jsx

import AndroidSoftwares from "./AndroidSoftwares";

export default async function AndroidSoftwaresPage({ searchParams }) {
    // Convert searchParams to a regular object and await it
    const params = await Promise.resolve(searchParams);
    const currentPage = params?.page || 1;
    const itemsPerPage = 48;

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/apps/category/sandroid?page=${currentPage}&limit=${itemsPerPage}`,
            {
                headers: {
                    'X-Auth-Token': 'my-secret-token-123',
                },
                cache: 'no-store',
            }
        );

        if (!res.ok) {
            console.error(`API error: ${res.status} ${res.statusText}`);
            throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        console.log("Server data received:", data); // Debug log
        return <AndroidSoftwares serverData={data} />;
    } catch (error) {
        console.error("Error fetching data:", error);
        // Return component with error state
        return <AndroidSoftwares serverData={{ apps: [], total: 0, error: error.message }} />;
    }
}
