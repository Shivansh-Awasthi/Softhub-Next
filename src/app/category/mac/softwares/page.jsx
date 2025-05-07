// app/mac/software/page.jsx

import MacSoftwares from "./MacSoftwares";

export default async function MacSoftwaresPage({ searchParams }) {
    // Convert searchParams to a regular object and await it
    const params = await Promise.resolve(searchParams);
    const currentPage = params?.page || 1;
    const itemsPerPage = 48;

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/apps/category/smac?page=${currentPage}&limit=${itemsPerPage}`,
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
        return <MacSoftwares serverData={data} />;
    } catch (error) {
        console.error("Error fetching data:", error);
        // Return component with error state
        return <MacSoftwares serverData={{ apps: [], total: 0, error: error.message }} />;
    }
}
