'use client';

import React from 'react';

const LiveSearchResults = ({ results, query, loading, totalResults, createSlug }) => {
    // Simple loading state
    if (loading) {
        return (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#262626] border border-gray-700 rounded-lg shadow-lg z-[100] max-h-96 overflow-y-auto">
                <div className="p-4 text-center text-gray-400">Loading...</div>
            </div>
        );
    }

    // No results
    if (!query || results.length === 0) {
        return null;
    }

    return (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#262626] border border-gray-700 rounded-lg shadow-lg z-[100]">
            <div className="p-2">
                <ul>
                    {results.map((item) => (
                        <li key={item._id} className="py-1">
                            <a
                                href={`/download/${createSlug(item.platform)}/${createSlug(item.title)}/${item._id}`}
                                className="flex items-center px-2 py-1 hover:bg-[#2E2E2E] rounded-lg"
                                target="_self"
                            >
                                <div className="flex-shrink-0">
                                    <img
                                        className="w-10 h-10 rounded-lg object-cover"
                                        src={item.thumbnail && item.thumbnail[0] ? item.thumbnail[0] : item.coverImg}
                                        alt={item.title}
                                    />
                                </div>
                                <div className="flex-1 min-w-0 ms-3">
                                    <p className="text-sm font-medium truncate text-white">
                                        {item.title}
                                    </p>
                                    <p className="text-xs truncate text-gray-500">
                                        {item.platform}
                                    </p>
                                </div>
                                <div className="text-right text-xs text-gray-500 ml-2">
                                    {item.size}
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>

                {totalResults > 9 && (
                    <div className="mt-2 text-center border-t border-gray-700 pt-2">
                        <a
                            href={`/search?query=${encodeURIComponent(query)}`}
                            className="text-blue-500 hover:text-blue-400 text-sm font-medium"
                            target="_self"
                        >
                            <div className='m-2'>See all {totalResults} results</div>
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveSearchResults;
