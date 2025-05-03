'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PcGames({ serverData }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialPage = parseInt(searchParams.get('page') || '1', 10);

    // Initialize with server data or handle error from server
    const [data, setData] = useState(serverData.apps || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(serverData.error || null);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalItems, setTotalItems] = useState(serverData.total || 0);

    const itemsPerPage = 48;
    const totalPages = Math.max(Math.ceil(totalItems / itemsPerPage), 1); // Ensure at least 1 page

    // Debug log to see what data we're receiving
    useEffect(() => {
        console.log("Client received serverData:", serverData);
    }, [serverData]);

    useEffect(() => {
        // Update current page when URL changes
        const page = parseInt(searchParams.get('page') || '1', 10);
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    }, [searchParams, currentPage]);

    useEffect(() => {
        if (currentPage === 1) return; // already have page 1 data from server

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/apps/category/pc?page=${currentPage}&limit=${itemsPerPage}`,
                    {
                        headers: { 'X-Auth-Token': 'my-secret-token-123' },
                    }
                );
                
                if (!res.ok) {
                    throw new Error(`API error: ${res.status}`);
                }
                
                const json = await res.json();
                console.log("Client fetch response:", json);
                
                // Handle API response structure
                setData(json.apps || []);
                setTotalItems(json.total || 0);
                setError(null);
            } catch (err) {
                setError('Failed to load data: ' + err.message);
                console.error("Client fetch failed:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        router.push(`/category/pc/games?page=${newPage}`);
    };

    const createSlug = (title) => {
        return title
            .toLowerCase() // Convert to lowercase
            .replace(/[^\w\s-]/g, '') // Remove non-alphanumeric characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .trim(); // Remove trailing spaces
    };

    return (
        <div className="container mx-auto p-2">
            <div className="cover mb-6">
                <h1 className="font-medium text-3xl mb-4">
                    PC Games{' '}
                    <span className="font-medium ml-2 text-[#8E8E8E]">{totalItems}</span>
                </h1>
            </div>

            {loading ? (
                <p className="text-center">Loading...</p>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                    {data.map((ele) => (
                        <Link
                            key={ele._id}
                            href={`/download/${createSlug(ele.platform)}/${createSlug(ele.title)}/${ele._id}`}
                            className="flex flex-col rounded-2xl h-52 overflow-hidden transition duration-300 ease-in-out ring-0 hover:ring-2 hover:ring-[#8E8E8E] hover:ring-opacity-75"
                        >
                            <figure className="flex justify-center items-center rounded-t-2xl overflow-hidden h-full">
                                <img
                                    src={ele.coverImg}
                                    alt={ele.title}
                                    className="w-full h-full object-cover rounded-t-2xl transition-transform duration-700 ease-in-out transform hover:scale-110"
                                />
                            </figure>
                            <div className="flex flex-col p-3 bg-[#262626] flex-grow">
                                <div className="text-sm font-normal text-[#ffffff] pb-2 overflow-hidden whitespace-nowrap text-ellipsis">
                                    {ele.title}
                                </div>
                                <div className="text-xs font-thin text-[#ffffff]">
                                    Size: {ele.size}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1 || loading}
                    className="px-4 py-2 mx-2 bg-gray-700 text-white rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages || loading}
                    className="px-4 py-2 mx-2 bg-gray-700 text-white rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
