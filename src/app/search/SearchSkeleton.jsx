'use client';

import React from 'react';

const SearchSkeleton = ({ itemCount = 10 }) => {
  // Create an array of the specified length to map over
  const items = Array.from({ length: itemCount }, (_, i) => i);

  return (
    <div className="animate-pulse">
      {/* Header section */}
      <div className="cover mb-6">
        <div className="flex items-center">
          <div className="h-8 bg-gray-700 rounded w-48"></div>
          <div className="h-8 bg-gray-700 rounded w-12 ml-2"></div>
        </div>
      </div>

      {/* Search results list */}
      <div className="w-full md:w-full pt-3 pb-3 border border-gray-200 border-opacity-5 bg-[#262626] rounded-lg shadow">
        <div className="flow-root">
          <ul role="list" className="divide-y divide-gray-700">
            {items.map((index) => (
              <li key={index} className="py-2 sm:py-2 p-8 relative hover:bg-[#2E2E2E]">
                <div className="flex items-center justify-between w-full">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gray-700"></div>
                  </div>

                  {/* Title and platform */}
                  <div className="flex-1 min-w-0 ms-4">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>

                  {/* Size */}
                  <div className="flex-1 flex justify-center hidden sm:block">
                    <div className="h-4 bg-gray-700 rounded w-16"></div>
                  </div>

                  {/* Date */}
                  <div className="text-right hidden md:block">
                    <div className="h-4 bg-gray-700 rounded w-24"></div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pagination skeleton - Improved Design */}
      <div className="flex justify-center mt-8">
        <div className="inline-flex items-center">
          {/* Previous Button Skeleton */}
          <div className="h-10 w-10 bg-gray-700 rounded-l-md"></div>

          {/* Page Numbers Skeleton - Desktop */}
          <div className="hidden sm:flex">
            <div className="h-10 w-10 bg-gray-700"></div>
            <div className="h-10 w-10 bg-gray-700"></div>
            <div className="h-10 w-10 bg-blue-600"></div>
            <div className="h-10 w-10 bg-gray-700"></div>
            <div className="h-10 w-10 bg-gray-700"></div>
          </div>

          {/* Mobile Pagination Skeleton */}
          <div className="flex sm:hidden">
            <div className="h-10 w-20 bg-blue-600"></div>
          </div>

          {/* Next Button Skeleton */}
          <div className="h-10 w-10 bg-gray-700 rounded-r-md"></div>
        </div>
      </div>
    </div>
  );
};

export default SearchSkeleton;
