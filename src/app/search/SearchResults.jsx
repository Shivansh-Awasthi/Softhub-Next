'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CiLock } from 'react-icons/ci'; // Lock Icon
import SearchSkeleton from './SearchSkeleton';

// Function to format dates consistently between server and client
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Use YYYY-MM-DD format which is consistent across server and client
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const SearchResults = ({ initialData = { apps: [], total: 0 }, initialQuery = '', initialPage = 1 }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get('query') || initialQuery;

    const [data, setData] = useState(initialData.apps || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(initialData.error || '');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalApps, setTotalApps] = useState(initialData.total || 0);
    const [itemsPerPage] = useState(48); // 48 items per page

    // User data state
    const [userData, setUserData] = useState({
        purchasedGames: [],
        isAdmin: false
    });

    // Load user data from localStorage on client side
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedGames = localStorage.getItem("gData");
            const purchasedGames = storedGames ? JSON.parse(storedGames) : [];
            const isAdmin = localStorage.getItem("role") === 'ADMIN';

            setUserData({
                purchasedGames,
                isAdmin
            });
        }
    }, []);

    const handleData = async () => {
        // Skip fetching if we're on the initial page (server has already fetched the data)
        // regardless of whether results were found or not
        if (currentPage === initialPage) {
            return;
        }

        setLoading(true);

        try {
            // If query is empty, fetch all apps
            const trimmedQuery = query ? query.trim() : '';

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/apps/all?page=${currentPage}&limit=${itemsPerPage}&q=${encodeURIComponent(trimmedQuery)}`,
                {
                    headers: {
                        'X-Auth-Token': "my-secret-token-123"
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const responseData = await response.json();

            if (responseData.success) {
                setData(responseData.apps);
                setTotalApps(responseData.total);
                setError('');
            } else {
                setError('Failed to load data. Please try again later.');
            }
        } catch (error) {
            console.log("Error fetching apps:", error);
            setError('Failed to load data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Update URL when page changes
    useEffect(() => {
        if (typeof window !== 'undefined' && query) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', currentPage.toString());

            // Update URL without full navigation
            router.replace(`/search?${params.toString()}`, { scroll: false });
        }
    }, [currentPage, query, router, searchParams]);

    // Reset currentPage to 1 whenever the query changes
    useEffect(() => {
        if (query !== initialQuery) {
            setCurrentPage(1);
        }
    }, [query, initialQuery]);

    // Fetch the data whenever the page or query changes
    useEffect(() => {
        if (query) {
            handleData();
        }
    }, [currentPage, query]);

    // Handle empty search query state
    useEffect(() => {
        if (!query || query.length < 1) {
            setError(<span style={{ fontSize: '15px' }}>⚠ Search field is empty.</span>);
            setData([]); // Clear data when no query
        }
    }, [query]);

    // Calculate total pages based on the total apps count
    const totalPages = Math.ceil(totalApps / itemsPerPage);

    // Handle Page Change
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);

        // Scroll to top
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const createSlug = (title) => {
        return title
            .toLowerCase() // Convert to lowercase
            .replace(/[^\w\s-]/g, '') // Remove non-alphanumeric characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .trim(); // Remove trailing spaces
    };

    return (
        <div>
            <div className='cover mb-6'>
                {data.length > 0 && !error && (
                    <h1 className='font-medium text-3xl mb-4'>
                        Search Results <span className='font-medium ml-2 text-[#8E8E8E]'>{totalApps}</span>
                    </h1>
                )}
            </div>

            {loading ? (
                <SearchSkeleton itemCount={12} />
            ) : error ? (
                <div>
                    <h1 className='font-medium text-3xl mb-6'>Oops! Something went wrong</h1>
                    <div className="p-6 mr-96 bg-[#2c2c2c] rounded-lg text-sm text-center border border-white border-opacity-10 shadow-lg">
                        <p>{error}</p>
                    </div>
                </div>
            ) : data.length === 0 ? (
                <div>
                    <h1 className='font-medium text-3xl mb-6'>Oops! Something went wrong</h1>
                    <div className="p-6 mr-96 bg-[#2c2c2c] rounded-lg text-sm text-center border border-white border-opacity-10 shadow-lg">
                        <p>Sorry, your search did not yield any results. Try changing or shortening your query.</p>
                    </div>
                </div>
            ) : (
                <div className="w-full md:w-full pt-3 pb-3 ring-2 ring-[#3E3E3E] bg-[#262626] rounded-lg shadow ">
                    <div className="flow-root">
                        <ul role="list" className="divide-y divide-gray-700">
                            {data.map((ele) => {
                                // Check if the game is paid and whether the user has purchased it
                                const isPurchased = userData.purchasedGames.includes(ele._id);
                                const isUnlocked = userData.isAdmin || !ele.isPaid || isPurchased;
                                const isLocked = !isUnlocked;

                                return (
                                    <li
                                        key={ele._id}
                                        className={`py-2 sm:py-2 p-8 relative hover:bg-[#2E2E2E] ${isLocked ? 'opacity-30 pointer-events-none' : ''}`}
                                    >
                                        <Link
                                            href={isLocked ? '#' : `/download/${createSlug(ele.platform)}/${createSlug(ele.title)}/${ele._id}`}
                                            className="flex items-center justify-between w-full"
                                        >
                                            <div className="flex-shrink-0">
                                                <img
                                                    className="w-12 h-12 rounded-xl object-cover hover:rounded-full"
                                                    src={ele.thumbnail[0]}
                                                    alt={ele.title}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0 ms-4">
                                                <p className="text-normal font-light truncate text-white">
                                                    {ele.title}
                                                </p>

                                                <p className={`text-sm text-blue-500 truncate ${ele.platform === 'Mac' ? 'text-blue-500' : ele.platform === 'PC' ? 'text-red-500' : ele.platform === 'Android' ? 'text-green-500' : ele.platform === 'Playstation' ? 'text-purple-500' : ''}`}>
                                                    {ele.platform}
                                                </p>
                                            </div>
                                            <div className="flex-1 flex justify-center text-sm font-semibold text-gray-500 hidden sm:block">
                                                {ele.size}
                                            </div>
                                            <div className="text-right text-sm text-gray-500 hidden md:block ">
                                                {formatDate(ele.updatedAt)}
                                            </div>
                                        </Link>

                                        {/* Lock Icon for Locked Games */}
                                        {isLocked && (
                                            <div className="absolute top-0 left-0 right-0 bottom-0 lg:right-20 flex justify-center items-center z-10 opacity-100">
                                                {/* Ensure lock icon is fully visible */}
                                                <CiLock className="text-white font-bold text-4xl" />
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            )}

            {/* Pagination Controls - Improved Design */}
            {totalApps > itemsPerPage && !loading && query && (  // Only show pagination if query is not empty and there are multiple pages
                <div className="flex justify-center mt-8 mb-8">
                    <nav aria-label="Page navigation" className="inline-flex items-center">
                        {/* Previous Button */}
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            className={`relative px-4 py-2.5 rounded-l-md text-sm font-medium transition-all duration-200
                                ${currentPage === 1
                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#2c2c2c] text-white hover:bg-gray-700 hover:text-white hover:scale-105'
                                } border-r border-gray-600 focus:z-20 focus:outline-none transform transition-transform`}
                            disabled={currentPage === 1}
                        >
                            <span className="sr-only">Previous</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {/* Page Numbers */}
                        <div className="hidden sm:flex">
                            {/* Generate pagination numbers with ellipsis for large page counts */}
                            {(() => {
                                const pageNumbers = [];
                                const maxPagesToShow = 5;

                                if (totalPages <= maxPagesToShow) {
                                    // Show all pages if there are few
                                    for (let i = 1; i <= totalPages; i++) {
                                        pageNumbers.push(i);
                                    }
                                } else {
                                    // Complex pagination with ellipsis
                                    if (currentPage <= 3) {
                                        // Near the start
                                        for (let i = 1; i <= 4; i++) {
                                            pageNumbers.push(i);
                                        }
                                        pageNumbers.push('ellipsis');
                                        pageNumbers.push(totalPages);
                                    } else if (currentPage >= totalPages - 2) {
                                        // Near the end
                                        pageNumbers.push(1);
                                        pageNumbers.push('ellipsis');
                                        for (let i = totalPages - 3; i <= totalPages; i++) {
                                            pageNumbers.push(i);
                                        }
                                    } else {
                                        // Middle
                                        pageNumbers.push(1);
                                        pageNumbers.push('ellipsis');
                                        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                                            pageNumbers.push(i);
                                        }
                                        pageNumbers.push('ellipsis');
                                        pageNumbers.push(totalPages);
                                    }
                                }

                                return pageNumbers.map((pageNumber, index) => {
                                    if (pageNumber === 'ellipsis') {
                                        return (
                                            <span
                                                key={`ellipsis-${index}`}
                                                className="relative inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-400 bg-[#2c2c2c]"
                                            >
                                                ...
                                            </span>
                                        );
                                    }

                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => paginate(pageNumber)}
                                            className={`relative inline-flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200
                                                ${currentPage === pageNumber
                                                    ? 'z-10 bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                    : 'bg-[#2c2c2c] text-white hover:bg-gray-700 hover:scale-105'
                                                } border-r border-gray-600 focus:z-20 focus:outline-none transform transition-transform`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                });
                            })()}
                        </div>

                        {/* Mobile Pagination - Just show current page */}
                        <div className="flex sm:hidden">
                            <span className="relative inline-flex items-center px-4 py-2.5 text-sm font-medium bg-blue-600 text-white border-r border-gray-600">
                                {currentPage} / {totalPages}
                            </span>
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            className={`relative px-4 py-2.5 rounded-r-md text-sm font-medium transition-all duration-200
                                ${currentPage === totalPages
                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#2c2c2c] text-white hover:bg-gray-700 hover:text-white hover:scale-105'
                                } focus:z-20 focus:outline-none transform transition-transform`}
                            disabled={currentPage === totalPages}
                        >
                            <span className="sr-only">Next</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
