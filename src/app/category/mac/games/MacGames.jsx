'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

// Placeholder for toast - you'll need to install a toast library
const toast = {
    error: (msg) => console.error(msg)
};

// Slugify function (simplified version)
const slugify = (text = '') => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
};

export default function MacGames({ serverData }) {
    // Configuration
    const ITEMS_PER_PAGE = 48;

    // Hooks for URL and navigation
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Get page from URL or default to 1
    const getInitialPage = () => {
        const pageParam = searchParams.get('page');
        return pageParam ? parseInt(pageParam, 10) : 1;
    };

    // Process server data
    const processApiResponse = (responseData) => {
        let gamesData = [];
        let totalCount = 0;

        if (Array.isArray(responseData)) {
            // Case 1: Response is directly an array
            gamesData = responseData;
            totalCount = responseData.length;
        } else if (responseData?.apps && Array.isArray(responseData.apps)) {
            // Case 2: Standard { apps: [], total: number } structure
            gamesData = responseData.apps;
            totalCount = responseData.total || responseData.apps.length;
        } else if (responseData?.games && Array.isArray(responseData.games)) {
            // Case 3: Alternative { games: [], total: number } structure
            gamesData = responseData.games;
            totalCount = responseData.total || responseData.games.length;
        } else if (responseData?.data && Array.isArray(responseData.data)) {
            // Case 4: Common { data: [], total: number } structure
            gamesData = responseData.data;
            totalCount = responseData.total || responseData.data.length;
        } else if (responseData?.error) {
            // Error case
            throw new Error(responseData.error);
        } else {
            // Unknown structure
            throw new Error(`Unexpected API structure`);
        }

        return { gamesData, totalCount };
    };

    // Initialize state with server data
    const initialData = (() => {
        try {
            return processApiResponse(serverData);
        } catch (error) {
            console.error("Error processing server data:", error);
            return { gamesData: [], totalCount: 0 };
        }
    })();

    // State
    const [data, setData] = useState(initialData.gamesData || []);
    const [totalApps, setTotalApps] = useState(initialData.totalCount || 0);
    const [currentPage, setCurrentPage] = useState(getInitialPage);
    const [isLoading, setIsLoading] = useState(false);
    const [isPageTransitioning, setIsPageTransitioning] = useState(false);
    const [error, setError] = useState(serverData?.error || null);
    const [purchasedGames, setPurchasedGames] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    // Client-side navigation handler for pagination
    const handlePageNavigation = (page) => {
        setIsPageTransitioning(true);

        // Update URL directly - the server will handle data fetching
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('page', page.toString());
        router.push(`${pathname}?${newParams.toString()}`);
    };

    // Load user data from localStorage on client side
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Get purchased games from localStorage
            const storedGames = localStorage.getItem("gData");
            setPurchasedGames(storedGames ? JSON.parse(storedGames) : []);

            // Check if user is admin
            setIsAdmin(localStorage.getItem("role") === 'ADMIN');
        }
    }, []);

    // Effect to reset page transition state when component mounts or URL changes
    useEffect(() => {
        // Reset page transition state after a short delay to allow for page load
        const timer = setTimeout(() => {
            setIsPageTransitioning(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchParams]); // Depend on searchParams changes

    // Listen for URL changes (browser back/forward)
    useEffect(() => {
        const pageParam = searchParams.get('page');
        if (pageParam) {
            const newPage = parseInt(pageParam, 10);
            // Only update state if different to avoid loops
            if (newPage !== currentPage) {
                setCurrentPage(newPage);
            }
        } else {
            // If no page in URL, set to page 1
            if (currentPage !== 1) {
                setCurrentPage(1);
            }
        }
    }, [searchParams]); // Only depend on searchParams changes

    // Pagination calculations
    const totalPages = Math.max(1, Math.ceil(totalApps / ITEMS_PER_PAGE));

    const generatePageNumbers = () => {
        const pages = [];
        let start = Math.max(1, currentPage - 3);
        let end = Math.min(totalPages, start + 6);

        if (end - start < 6) {
            start = Math.max(1, end - 6);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pageNumbers = generatePageNumbers();

    // Safe slug generation
    const createSlug = (text = '') => {
        return slugify(text) || 'untitled';
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage === currentPage || newPage < 1 || newPage > totalPages || isPageTransitioning) {
            return; // Don't do anything if invalid page or already transitioning
        }

        // Set transition state first
        setIsPageTransitioning(true);

        // Update URL directly instead of changing state
        // This will trigger the URL change effect which will then update the page state
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('page', newPage.toString());
        router.push(`${pathname}?${newParams.toString()}`);

        // Scroll to top of the games section
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Game card component
    const GameCard = ({ game = {} }) => {
        const isPurchased = purchasedGames.includes(game._id);
        const isUnlocked = isAdmin || !game.isPaid || isPurchased;
        const downloadUrl = isUnlocked
            ? `/download/${createSlug(game.platform)}/${createSlug(game.title)}/${game._id}`
            : '#';

        return (
            <div className={`relative flex flex-col rounded-2xl h-52 overflow-hidden transition duration-300 ease-in-out ring-0 ${isUnlocked ? 'hover:ring-2 hover:ring-[#8E8E8E] hover:ring-opacity-95' : 'opacity-90 cursor-not-allowed'
                }`}>

                {!isUnlocked && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-10">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="34"
                            height="34"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white font-bold text-4xl mb-16"
                        >
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>
                )}

                <Link
                    href={downloadUrl}
                    className={`flex flex-col rounded-2xl h-full overflow-hidden ${!isUnlocked ? 'pointer-events-none' : ''}`}
                >
                    <figure className="flex justify-center items-center rounded-t-2xl overflow-hidden h-full">
                        <img
                            src={game.coverImg || '/default-game.png'}
                            alt={game.title || 'Game'}
                            className="w-full h-full object-cover rounded-t-2xl transition-transform duration-700 ease-in-out transform hover:scale-110"
                            onError={(e) => {
                                e.target.src = '/default-game.png';
                                e.target.alt = 'Default game image';
                            }}
                        />
                    </figure>
                    <div className="flex flex-col p-3 bg-[#262626] flex-grow">
                        <div className="text-sm font-normal text-[#ffffff] pb-2 overflow-hidden whitespace-nowrap text-ellipsis">
                            {game.title || 'Untitled Game'}
                        </div>
                        <div className="text-xs font-thin text-[#ffffff]">
                            Size: {game.size || 'N/A'}
                        </div>
                    </div>
                </Link>
            </div>
        );
    };

    // Loading state
    if (isLoading && !data.length) {
        return (
            <div className="container mx-auto p-auto flex justify-center items-center h-[500px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-4">Loading games...</span>
            </div>
        );
    }

    // Error state
    if (error && !data.length) {
        return (
            <div className="container mx-auto p-2 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={() => fetchGames(currentPage)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry Loading Games
                </button>
            </div>
        );
    }

    // Main render
    return (
        <div className="container mx-auto p-2">
            <div className="cover mb-6">
                <h1 className="font-medium text-3xl mb-4">
                    Mac Games <span className="font-medium ml-2 text-[#8E8E8E]">{totalApps}</span>
                </h1>
            </div>

            {data.length > 0 ? (
                <>
                    <div className="relative">
                        {/* Loading overlay during page transitions */}
                        {isPageTransitioning && (
                            <div className="absolute inset-0 bg-[#1a1a1a] bg-opacity-70 z-10 flex items-center justify-center rounded-lg">
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                                    <p className="text-white text-lg">Loading page {currentPage}...</p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 transition-opacity duration-300 ease-in-out">
                            {data.map((game) => (
                                <GameCard
                                    key={game?._id || `game-${Math.random().toString(36).substring(2, 9)}`}
                                    game={game}
                                />
                            ))}
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex flex-wrap justify-center mt-10">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1 || isPageTransitioning}
                                className={`px-4 py-2 mx-2 mb-2 bg-gray-700 text-white rounded transition-all duration-300 ${isPageTransitioning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'}`}
                                aria-label="Previous page"
                            >
                                {isPageTransitioning ? 'Loading...' : 'Previous'}
                            </button>

                            {pageNumbers.map((pageNumber) => (
                                <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    disabled={isPageTransitioning || currentPage === pageNumber}
                                    className={`px-4 py-2 mx-1 mb-2 rounded text-gray-300 transition-all duration-300 ${currentPage === pageNumber
                                        ? 'bg-blue-600 cursor-default'
                                        : isPageTransitioning
                                            ? 'bg-[#2c2c2c] opacity-50 cursor-not-allowed'
                                            : 'bg-[#2c2c2c] hover:bg-gray-800 hover:text-white'
                                        }`}
                                    aria-label={`Go to page ${pageNumber}`}
                                    aria-current={currentPage === pageNumber ? 'page' : undefined}
                                >
                                    {pageNumber}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || isPageTransitioning}
                                className={`px-4 py-2 mx-2 mb-2 bg-gray-700 text-white rounded transition-all duration-300 ${isPageTransitioning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'}`}
                                aria-label="Next page"
                            >
                                {isPageTransitioning ? 'Loading...' : 'Next'}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-10 text-gray-400">
                    No games available at the moment
                </div>
            )}
        </div>
    );
}
