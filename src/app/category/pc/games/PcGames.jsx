'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PcGames({ serverData, initialPage = 1 }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get current page from URL or props
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);

    // Initialize with server data or handle error from server
    const [data, setData] = useState(serverData.apps || []);
    const [error, setError] = useState(serverData.error || null);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalItems, setTotalItems] = useState(serverData.total || 0);

    const itemsPerPage = 48;
    const totalPages = Math.max(Math.ceil(totalItems / itemsPerPage), 1); // Ensure at least 1 page

    // Update state when props change (for static site generation)
    useEffect(() => {
        setData(serverData.apps || []);
        setTotalItems(serverData.total || 0);
        setError(serverData.error || null);
    }, [serverData]);

    // Update current page when URL changes
    useEffect(() => {
        if (pageFromUrl !== currentPage) {
            setCurrentPage(pageFromUrl);
        }
    }, [pageFromUrl, currentPage]);

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

            {error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : data.length === 0 ? (
                <p className="text-center">No PC games found.</p>
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
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-2 bg-gray-700 text-white rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 mx-2 bg-gray-700 text-white rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
