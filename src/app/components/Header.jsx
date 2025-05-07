'use client';

import React, { useState, useEffect, useRef } from 'react';
// Removed unused imports
import LiveSearchResults from './LiveSearchResults';

const Header = ({ showSearchBar = true }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [liveResults, setLiveResults] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);

    // Debounce function to limit API calls
    const debounce = (func, delay) => {
        let timeoutId;
        return function (...args) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    // Function to fetch live search results
    const fetchLiveResults = async (query) => {
        if (!query || query.trim() === '') {
            setLiveResults([]);
            setTotalResults(0);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/apps/all?q=${encodeURIComponent(query.trim())}&page=1&limit=9`, {
                headers: {
                    'X-Auth-Token': "my-secret-token-123"
                }
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setLiveResults(data.apps);
                setTotalResults(data.total);
            } else {
                setLiveResults([]);
                setTotalResults(0);
            }
        } catch (error) {
            console.error("Error fetching live search results:", error);
            setLiveResults([]);
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    };

    // Create a debounced version of fetchLiveResults
    const debouncedFetchResults = useRef(
        debounce((query) => fetchLiveResults(query), 300)
    ).current;

    // Effect to fetch results when searchQuery changes
    useEffect(() => {
        debouncedFetchResults(searchQuery);

        // Show results dropdown when there's a query
        if (searchQuery.trim() !== '') {
            setShowResults(true);
        } else {
            setShowResults(false);
        }
    }, [searchQuery]);

    // Simplified click handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        if (typeof document !== 'undefined') {
            document.addEventListener('click', handleClickOutside);

            return () => {
                document.removeEventListener('click', handleClickOutside);
            };
        }
    }, []);

    // Removed handleSearch function as we're using direct form submission

    const handleClear = () => {
        setSearchQuery('');
        setLiveResults([]);
        setShowResults(false);
    };

    // Function to create URL-friendly slugs
    const createSlug = (text) => {
        if (!text) return '';
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();
    };

    return (
        <header className="flex flex-wrap items-center justify-between px-1.5 pb-6">
            {/* Removed overlay that might be causing issues */}

            {showSearchBar && (
                <div
                    ref={searchRef}
                    className="flex flex-wrap relative ring-1 ring-[#2E2E2E] rounded-lg w-full max-w-[760px]"
                >
                    <form action="/search" method="get" className="w-full flex items-center">
                        <input
                            type="text"
                            name="query"
                            placeholder="Search the site"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#242424] hover:bg-[#262626] rounded-lg text-white py-3 pl-4 pr-12 h-12 flex-grow focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-opacity-80 transition duration-200"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="absolute right-14 top-0 h-full w-4 flex items-center justify-center rounded-full"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mr-2 sm:mr-4 text-xl text-[#8E8E8E] hover:text-[#fff]"
                                >
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </button>
                        )}
                        <button type="submit" className="absolute right-1 top-0 h-full w-12 flex items-center justify-center rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-7 w-7 text-[#8e8e8e] hover:text-[#ffffff]"
                            >
                                <path d="m21 21-4.34-4.34" />
                                <circle cx="11" cy="11" r="8" />
                            </svg>
                        </button>
                    </form>

                    {/* Live Search Results Dropdown */}
                    {showResults && (
                        <LiveSearchResults
                            results={liveResults}
                            query={searchQuery}
                            loading={loading}
                            totalResults={totalResults}
                            createSlug={createSlug}
                        />
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;
