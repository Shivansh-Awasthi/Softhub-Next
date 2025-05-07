'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const [logo, setLogo] = useState("https://res.cloudinary.com/dkp1pshuw/image/upload/v1729024140/Screenshot_2024-10-16_at_1.54.35_AM_cow9by.png");
  const [selected, setSelected] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const pathname = usePathname();

  const handleClick = (item) => {
    setSelected(item);
  };

  const handleLogoClick = () => {
    setSelected('');
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 767) {
        setIsMobileView(true);
        setIsSidebarVisible(false);
      } else {
        setIsMobileView(false);
        setIsSidebarVisible(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isSidebarVisible && isMobileView) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isSidebarVisible, isMobileView]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const closeSidebar = () => {
    if (isMobileView) {
      setIsSidebarVisible(false);
    }
  };

  return (
    <div className='bg-[#1E1E1E] z-10'>
      {/* Hamburger / Close menu icon */}
      {isMobileView && (
        <button
          onClick={toggleSidebar}
          className="p-3 fixed bottom-4 left-4 z-30 text-white rounded-lg bg-blue-500 shadow-md"
        >
          {isSidebarVisible ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          )}
        </button>
      )}

      {/* Overlay */}
      {isMobileView && isSidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar md:sticky top-0 z-20 flex flex-col w-full h-screen px-8 py-8 border-r border-white border-opacity-5 
                ${isMobileView ? 'fixed w-full bg-[#1E1E1E] transition-transform duration-300' : 'w-60'} 
                ${isSidebarVisible || !isMobileView ? 'transform-none' : '-translate-x-full overflow-y-auto scrollbar-hide'}`}
        style={{ overflowY: isSidebarVisible ? 'auto' : 'hidden' }}
      >
        <Link
          href="/"
          className='flex items-center mb-6'
          onClick={() => {
            handleClick();
            closeSidebar();
          }}
          onMouseEnter={() => setLogo("https://res.cloudinary.com/dkp1pshuw/image/upload/v1729024140/Screenshot_2024-10-16_at_1.54.39_AM_gzfxsu.png")}
          onMouseLeave={() => setLogo("https://res.cloudinary.com/dkp1pshuw/image/upload/v1729024140/Screenshot_2024-10-16_at_1.54.35_AM_cow9by.png")}
        >
          <img className="h-11 w-11 mr-2 mt-6 rotate-[-5deg]" src={logo} alt="Logo" />
          <img className='h-14 w-28 rotate-[-5deg]' src="https://res.cloudinary.com/dkp1pshuw/image/upload/v1729674759/ToxicGames-Logo_f13goa.png" alt="logo" />
        </Link>

        <div className="flex flex-col justify-between flex-1">
          <nav className="-mx-3 space-y-5">
            {/* Games */}
            <div className="space-y-2">
              <label className="px-3 text-xs text-gray-500 uppercase">Games</label>
              <Link
                href="/category/pc/games"
                className={`flex items-center px-3 py-2 transition-colors duration-300 transform rounded-lg ${selected === 'pcGames' || pathname === '/category/pc/games' ? 'bg-gray-600 text-white' : 'text-gray-600 hover:bg-gray-500'} dark:text-gray-200`}
                onClick={() => {
                  handleClick('pcGames');
                  closeSidebar();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="8" x="5" y="2" rx="2" />
                  <rect width="20" height="8" x="2" y="14" rx="2" />
                  <path d="M6 18h2" />
                  <path d="M12 18h6" />
                </svg>
                <span className="mx-2 text-sm font-medium">PC</span>
              </Link>
              <Link
                href="/category/mac/games"
                className={`flex items-center px-3 py-2 transition-colors duration-300 transform rounded-lg ${selected === 'macGames' || pathname === '/category/mac/games' ? 'bg-gray-600 text-white' : 'text-gray-600 hover:bg-gray-500'} dark:text-gray-200`}
                onClick={() => {
                  handleClick('macGames');
                  closeSidebar();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="M6 8h.01" />
                  <path d="M10 8h.01" />
                  <path d="M14 8h.01" />
                </svg>
                <span className="mx-2 text-sm font-medium">Mac</span>
              </Link>
              <Link
                href="/category/android/games"
                className={`flex items-center px-3 py-2 transition-colors duration-300 transform rounded-lg ${selected === 'androidGames' || pathname === '/category/android/games' ? 'bg-gray-600 text-white' : 'text-gray-600 hover:bg-gray-500'} dark:text-gray-200`}
                onClick={() => {
                  handleClick('androidGames');
                  closeSidebar();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                  <path d="M12 18h.01" />
                </svg>
                <span className="mx-2 text-sm font-medium">Android</span>
              </Link>
            </div>

            {/* Softwares */}
            <div className="space-y-2">
              <label className="px-3 text-xs text-gray-500 uppercase">Softwares</label>
              <Link
                href="/category/pc/softwares"
                className={`flex items-center px-3 py-2 transition-colors duration-300 transform rounded-lg ${selected === 'pcSoftwares' || pathname === '/category/pc/softwares' ? 'bg-gray-600 text-white' : 'text-gray-600 hover:bg-gray-500'} dark:text-gray-200`}
                onClick={() => {
                  handleClick('pcSoftwares');
                  closeSidebar();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="8" x="5" y="2" rx="2" />
                  <rect width="20" height="8" x="2" y="14" rx="2" />
                  <path d="M6 18h2" />
                  <path d="M12 18h6" />
                </svg>
                <span className="mx-2 text-sm font-medium">PC</span>
              </Link>
              <Link
                href="/category/mac/softwares"
                className={`flex items-center px-3 py-2 transition-colors duration-300 transform rounded-lg ${selected === 'macSoftwares' || pathname === '/category/mac/softwares' ? 'bg-gray-600 text-white' : 'text-gray-600 hover:bg-gray-500'} dark:text-gray-200`}
                onClick={() => {
                  handleClick('macSoftwares');
                  closeSidebar();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="M6 8h.01" />
                  <path d="M10 8h.01" />
                  <path d="M14 8h.01" />
                </svg>
                <span className="mx-2 text-sm font-medium">Mac</span>
              </Link>
              <Link
                href="/category/android/softwares"
                className={`flex items-center px-3 py-2 transition-colors duration-300 transform rounded-lg ${selected === 'androidSoftwares' || pathname === '/category/android/softwares' ? 'bg-gray-600 text-white' : 'text-gray-600 hover:bg-gray-500'} dark:text-gray-200`}
                onClick={() => {
                  handleClick('androidSoftwares');
                  closeSidebar();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                  <path d="M12 18h.01" />
                </svg>
                <span className="mx-2 text-sm font-medium">Android</span>
              </Link>
            </div>

            {/* PlayStation ISO's */}
            <div className="space-y-2">
              <label className="px-3 text-xs text-gray-500 uppercase">Playstation ISO's</label>
              <Link
                href="/category/ppsspp/iso"
                className={`flex items-center px-3 py-2 transition-colors duration-300 transform rounded-lg ${selected === 'ppsspp' || pathname === '/category/ppsspp/iso' ? 'bg-gray-600 text-white' : 'text-gray-600 hover:bg-gray-500'} dark:text-gray-200`}
                onClick={() => {
                  handleClick('ppsspp');
                  closeSidebar();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 11h4M8 9v4M15 12h.01M18 10h.01M17.5 15h.01" />
                  <rect width="20" height="12" x="2" y="6" rx="2" />
                </svg>
                <span className="mx-2 text-sm font-medium">PPSSPP</span>
              </Link>
              <Link
                href="/category/ps2/iso"
                className={`flex items-center px-3 py-2 transition-colors duration-300 transform rounded-lg ${selected === 'ps2' || pathname === '/category/ps2/iso' ? 'bg-gray-600 text-white' : 'text-gray-600 hover:bg-gray-500'} dark:text-gray-200`}
                onClick={() => {
                  handleClick('ps2');
                  closeSidebar();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 11h4M8 9v4M15 12h.01M18 10h.01M17.5 15h.01" />
                  <rect width="20" height="12" x="2" y="6" rx="2" />
                </svg>
                <span className="mx-2 text-sm font-medium">PS2</span>
              </Link>
              <Link
                href="/category/ps3/iso"
                className={`flex items-center px-3 py-2 transition-colors duration-300 transform rounded-lg ${selected === 'ps3' || pathname === '/category/ps3/iso' ? 'bg-gray-600 text-white' : 'text-gray-600 hover:bg-gray-500'} dark:text-gray-200`}
                onClick={() => {
                  handleClick('ps3');
                  closeSidebar();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 11h4M8 9v4M15 12h.01M18 10h.01M17.5 15h.01" />
                  <rect width="20" height="12" x="2" y="6" rx="2" />
                </svg>
                <span className="mx-2 text-sm font-medium">PS3</span>
              </Link>
            </div>
          </nav>
        </div>

        <div className="mt-auto text-[#8E8E8E] text-xs space-y-0.5 w-full xs:flex">
          <div>
            <Link href="/copyright-holders" className="hover:underline">Copyright Holders (DMCA)</Link>
            <span className="mx-1"> , </span>
          </div>
          <Link href="/policy" className="hover:underline"> Privacy </Link>
          <span className="mx-1"> , </span>
          <Link href="/donate" className="hover:underline"> Donate</Link>
          <span className="mx-1">,</span>
          <Link href="#" className="hover:underline">Reviews</Link>
          <span className="mx-1">,</span>
          <div>
            <Link href="/faq" className="hover:underline">FAQ</Link>
            <span className="mx-1">,</span>
            <Link href="/contacts" className="no-underline hover:underline">Contacts</Link>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;