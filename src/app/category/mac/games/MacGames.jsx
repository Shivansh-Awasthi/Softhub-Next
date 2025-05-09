'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useLoading } from '@/app/context/LoadingContext';

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

export default function MacGames({ serverData, initialPage = 1 }) {
    // Configuration
    const ITEMS_PER_PAGE = 48;

    // Hooks for URL and navigation
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Get the current page from URL or initialPage prop
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);

    // Extract data from server response
    const extractData = (data) => {
        if (data?.apps && Array.isArray(data.apps)) {
            return {
                games: data.apps,
                total: data.total || 0
            };
        }
        if (data?.data && Array.isArray(data.data)) {
            return {
                games: data.data,
                total: data.total || 0
            };
        }
        return {
            games: [],
            total: 0
        };
    };

    const { games, total } = extractData(serverData);

    // State
    const [data, setData] = useState(games);
    const [totalApps, setTotalApps] = useState(total);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [isPageTransitioning, setIsPageTransitioning] = useState(false);
    const [error, setError] = useState(serverData?.error || null);
    const [purchasedGames, setPurchasedGames] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    // Update state when props or URL changes
    useEffect(() => {
        // Update data and total from server data
        const { games, total } = extractData(serverData);
        setData(games);
        setTotalApps(total);

        // Update current page from URL
        const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
        if (pageFromUrl !== currentPage) {
            setCurrentPage(pageFromUrl);
        }

        // Reset page transition state
        const timer = setTimeout(() => {
            setIsPageTransitioning(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [serverData, searchParams]);

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

    // Get loading context
    const { showSkeleton } = useLoading();

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage === currentPage || newPage < 1 || newPage > totalPages || isPageTransitioning) {
            return; // Don't do anything if invalid page or already transitioning
        }

        // Set transition state
        setIsPageTransitioning(true);

        // Show skeleton while loading
        showSkeleton('Mac');

        // Update URL - this will trigger a new server-side render
        router.push(`${pathname}?page=${newPage}`);

        // Scroll to top
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

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

    // Game card component with prefetching
    const GameCard = ({ game = {} }) => {
        const isPurchased = purchasedGames.includes(game._id);
        const isUnlocked = isAdmin || !game.isPaid || isPurchased;
        const downloadUrl = isUnlocked
            ? `/download/${createSlug(game.platform)}/${createSlug(game.title)}/${game._id}`
            : '#';

        // Prefetch function to start loading the download page data when hovering
        const prefetchDownloadPage = () => {
            if (isUnlocked) {
                // This triggers Next.js to prefetch the page
                router.prefetch(downloadUrl);
            }
        };

        return (
            <div
                className={`relative flex flex-col rounded-2xl h-52 overflow-hidden transition duration-300 ease-in-out ring-0 ${isUnlocked ? 'hover:ring-2 hover:ring-[#8E8E8E] hover:ring-opacity-95' : 'opacity-90 cursor-not-allowed'
                    }`}
                onMouseEnter={prefetchDownloadPage} // Start prefetching on hover
            >

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
                    prefetch={isUnlocked} // Enable Next.js prefetching
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

    // We don't need a separate loading state since we're using SSG

    // Error state
    if (error && !data.length) {
        return (
            <div className="container mx-auto p-2 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={() => router.refresh()}
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
