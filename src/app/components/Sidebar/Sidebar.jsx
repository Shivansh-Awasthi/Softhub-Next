'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLoading } from '@/app/context/LoadingContext';
import { FaPlaystation } from "react-icons/fa";

const Sidebar = () => {
  const [logo, setLogo] = useState("https://res.cloudinary.com/dkp1pshuw/image/upload/v1729024140/Screenshot_2024-10-16_at_1.54.35_AM_cow9by.png");
  const [selected, setSelected] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const pathname = usePathname();
  const { showSkeleton } = useLoading();

  const handleClick = (item) => {
    setSelected(item);
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
    <div className='bg-[#1E1E1E] z-99'>
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
        className={`sidebar md:sticky top-0 z-20 flex flex-col w-full h-screen px-6 py-6
                ${isMobileView ? 'fixed w-full bg-[#121212] transition-transform duration-300' : 'w-64'}
                ${isSidebarVisible || !isMobileView ? 'transform-none' : '-translate-x-full overflow-y-auto scrollbar-hide'}`}
        style={{
          overflowY: isSidebarVisible ? 'auto' : 'hidden',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(180deg, rgba(30,30,30,1) 0%, rgba(18,18,18,1) 100%)'
        }}
      >
        <Link
          href="/"
          className='flex items-center mb-8 px-2 py-1 rounded-lg transition-all duration-300 hover:bg-white/5'
          onClick={() => {
            handleClick();
            closeSidebar();
            showSkeleton('Home');
          }}
          onMouseEnter={() => setLogo("https://res.cloudinary.com/dkp1pshuw/image/upload/v1729024140/Screenshot_2024-10-16_at_1.54.39_AM_gzfxsu.png")}
          onMouseLeave={() => setLogo("https://res.cloudinary.com/dkp1pshuw/image/upload/v1729024140/Screenshot_2024-10-16_at_1.54.35_AM_cow9by.png")}
        >
          <img className="h-11 w-11 mr-2 mt-6 rotate-[-5deg]" src={logo} alt="Logo" />
          <img className='h-14 w-28 rotate-[-5deg]' src="https://res.cloudinary.com/dkp1pshuw/image/upload/v1729674759/ToxicGames-Logo_f13goa.png" alt="logo" />
        </Link>

        <div className="flex flex-col justify-between flex-1">
          <nav className="space-y-6">
            {/* Games */}
            <div className="space-y-1">
              <label className="px-3 text-xs font-medium text-gray-400 uppercase block tracking-wider" style={{ marginBottom: '10px' }}>Games</label>
              <Link
                href="/category/pc/games"
                className={`flex items-center px-3 py-2.5 transition-all duration-200 transform rounded-lg ${selected === 'pcGames' || pathname === '/category/pc/games'
                  ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                  }`}
                onClick={() => {
                  handleClick('pcGames');
                  closeSidebar();
                  showSkeleton('PC');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="8" x="5" y="2" rx="2" />
                  <rect width="20" height="8" x="2" y="14" rx="2" />
                  <path d="M6 18h2" />
                  <path d="M12 18h6" />
                </svg>
                <span className="mx-2 text-sm font-medium">PC</span>
              </Link>
              <Link
                href="/category/mac/games"
                className={`flex items-center px-3 py-2.5 transition-all duration-200 transform rounded-lg ${selected === 'macGames' || pathname === '/category/mac/games'
                  ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                  }`}
                onClick={() => {
                  handleClick('macGames');
                  closeSidebar();
                  showSkeleton('Mac');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="M6 8h.01" />
                  <path d="M10 8h.01" />
                  <path d="M14 8h.01" />
                </svg>
                <span className="mx-2 text-sm font-medium">Mac</span>
              </Link>
              <Link
                href="/category/android/games"
                className={`flex items-center px-3 py-2.5 transition-all duration-200 transform rounded-lg ${selected === 'androidGames' || pathname === '/category/android/games'
                  ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                  }`}
                onClick={() => {
                  handleClick('androidGames');
                  closeSidebar();
                  showSkeleton('Android');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                  <path d="M12 18h.01" />
                </svg>
                <span className="mx-2 text-sm font-medium">Android</span>
              </Link>
            </div>

            {/* Softwares */}
            <div className="space-y-1">
              <label className="px-3 text-xs font-medium text-gray-400 uppercase block tracking-wider" style={{ marginBottom: '10px' }}>Softwares</label>
              <Link
                href="/category/pc/softwares"
                className={`flex items-center px-3 py-2.5 transition-all duration-200 transform rounded-lg ${selected === 'pcSoftwares' || pathname === '/category/pc/softwares'
                  ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                  }`}
                onClick={() => {
                  handleClick('pcSoftwares');
                  closeSidebar();
                  showSkeleton('PC');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="8" x="5" y="2" rx="2" />
                  <rect width="20" height="8" x="2" y="14" rx="2" />
                  <path d="M6 18h2" />
                  <path d="M12 18h6" />
                </svg>
                <span className="mx-2 text-sm font-medium">PC</span>
              </Link>
              <Link
                href="/category/mac/softwares"
                className={`flex items-center px-3 py-2.5 transition-all duration-200 transform rounded-lg ${selected === 'macSoftwares' || pathname === '/category/mac/softwares'
                  ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                  }`}
                onClick={() => {
                  handleClick('macSoftwares');
                  closeSidebar();
                  showSkeleton('Mac');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="M6 8h.01" />
                  <path d="M10 8h.01" />
                  <path d="M14 8h.01" />
                </svg>
                <span className="mx-2 text-sm font-medium">Mac</span>
              </Link>
              <Link
                href="/category/android/softwares"
                className={`flex items-center px-3 py-2.5 transition-all duration-200 transform rounded-lg ${selected === 'androidSoftwares' || pathname === '/category/android/softwares'
                  ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                  }`}
                onClick={() => {
                  handleClick('androidSoftwares');
                  closeSidebar();
                  showSkeleton('Android');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                  <path d="M12 18h.01" />
                </svg>
                <span className="mx-2 text-sm font-medium">Android</span>
              </Link>
            </div>

            {/* PlayStation ISO's */}
            <div className="space-y-1">
              <label className="px-3 text-xs font-medium text-gray-400 uppercase block tracking-wider" style={{ marginBottom: '10px' }}>Playstation ISO's</label>
              <Link
                href="/category/ppsspp/iso"
                className={`flex items-center px-3 py-2.5 transition-all duration-200 transform rounded-lg ${selected === 'ppsspp' || pathname === '/category/ppsspp/iso'
                  ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                  }`}
                onClick={() => {
                  handleClick('ppsspp');
                  closeSidebar();
                  showSkeleton('PPSSPP');
                }}
              >
                <FaPlaystation size={18} />
                <span className="mx-2 text-sm font-medium">PPSSPP</span>
              </Link>
              <Link
                href="/category/ps2/iso"
                className={`flex items-center px-3 py-2.5 transition-all duration-200 transform rounded-lg ${selected === 'ps2' || pathname === '/category/ps2/iso'
                  ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                  }`}
                onClick={() => {
                  handleClick('ps2');
                  closeSidebar();
                  showSkeleton('PS2');
                }}
              >
                <FaPlaystation size={18} />
                <span className="mx-2 text-sm font-medium">PS2</span>
              </Link>
              <Link
                href="/category/ps3/iso"
                className={`flex items-center px-3 py-2.5 transition-all duration-200 transform rounded-lg ${selected === 'ps3' || pathname === '/category/ps3/iso'
                  ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                  }`}
                onClick={() => {
                  handleClick('ps3');
                  closeSidebar();
                  showSkeleton('PS3');
                }}
              >
                <FaPlaystation size={18} />
                <span className="mx-2 text-sm font-medium">PS3</span>
              </Link>
              {/* <Link
                href="/category/ps4/iso"
                className={`flex items-center px-3 py-2.5 transition-all duration-200 transform rounded-lg ${selected === 'ps4' || pathname === '/category/ps4/iso'
                  ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                  }`}
                onClick={() => {
                  handleClick('ps4');
                  closeSidebar();
                  showSkeleton('PS4');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 11h4M8 9v4M15 12h.01M18 10h.01M17.5 15h.01" />
                  <rect width="20" height="12" x="2" y="6" rx="2" />
                </svg>
                <span className="mx-2 text-sm font-medium">PS4</span>
              </Link> */}
            </div>
          </nav>
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 text-gray-400 text-xs space-y-1.5 w-full">
          <div className="flex flex-wrap gap-x-2">
            <Link href="/copyright-holders" className="hover:text-gray-200 transition-colors">Copyright Holders</Link>
            <span className="text-gray-600">•</span>
            <Link href="/policy" className="hover:text-gray-200 transition-colors">Privacy</Link>
            <span className="text-gray-600">•</span>
            <Link href="/donate" className="hover:text-gray-200 transition-colors">Donate</Link>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <Link href="#" className="hover:text-gray-200 transition-colors">Reviews</Link>
            <span className="text-gray-600">•</span>
            <Link href="/faq" className="hover:text-gray-200 transition-colors">FAQ</Link>
            <span className="text-gray-600">•</span>
            <Link href="/contacts" className="hover:text-gray-200 transition-colors">Contacts</Link>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;