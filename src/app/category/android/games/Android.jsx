'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import EnhancedPagination from '@/app/components/Pagination/EnhancedPagination';

export default function Android({ initialData = { apps: [], total: 0 }, initialPage = 1 }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [data, setData] = useState(initialData.apps || []);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalItems, setTotalItems] = useState(initialData.total || 0);
    const itemsPerPage = 48;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Calculate total pages
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / itemsPerPage) : 1;

    // Update state when props change
    useEffect(() => {
        setData(initialData.apps || []);
        setTotalItems(initialData.total || 0);

        // Update current page from URL if it changes
        const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
        if (pageFromUrl !== currentPage) {
            setCurrentPage(pageFromUrl);
        }
    }, [initialData, searchParams, currentPage]);

    // Handle page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);

        // Navigate to the new page
        router.push(`/category/android/games?page=${newPage}`);
    };

    const createSlug = (title) => {
        return title
            .toLowerCase() // Convert to lowercase
            .replace(/[^\w\s-]/g, '') // Remove non-alphanumeric characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .trim(); // Remove trailing spaces
    };

    return (
        <div className='container mx-auto p-2'>
            <div className='cover mb-6'>
                <h1 className='font-medium text-3xl mb-4'>
                    Android Games <span className='font-medium ml-2 text-[#8E8E8E]'>{totalItems}</span>
                </h1>
            </div>

            {loading ? (
                <p className="text-center">Loading...</p>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : data.length === 0 ? (
                <p className="text-center">No Android games found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data.map((ele) => (
                        <Link
                            key={ele._id}
                            href={`/download/${createSlug(ele.platform)}/${createSlug(ele.title)}/${ele._id}`}
                            className="flex flex-col rounded-2xl h-36 overflow-hidden transition duration-300 ease-in-out ring-1 ring-white/10 hover:ring-2 hover:ring-[#8E8E8E] hover:ring-opacity-75"
                        >
                            <div className="flex justify-center items-center h-32 bg-[#262626] pt-4">
                                <img
                                    src={ele.thumbnail[0]}
                                    alt={ele.title}
                                    className="rounded-full w-14 h-14 transition-transform duration-700 ease-in-out transform hover:scale-110 bg-[#262626]"
                                />
                            </div>
                            <div className="flex flex-col p-4 bg-[#262626]">
                                <div className="text-sm text-center font-normal overflow-hidden whitespace-nowrap text-ellipsis text-[#ffffff] bg-[#262626] pb-2">{ele.title}</div>
                                <div className="text-xs text-center font-thin text-[#8E8E8E] bg-[#262626]">Size: {ele.size}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Enhanced Pagination Controls */}
            {totalPages > 1 && (
                <EnhancedPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    isLoading={loading}
                />
            )}
        </div>
    );
}
