'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import GiscusComments from './GiscusComments';
import GameAnnouncement from './GameAnnouncement';
import DownloadSection from './DownloadSection';
import DescriptionTabs from './DescriptionTabs';
import AdsComponent from '../../../../../components/Ads/AdsComponent';

const SingleApp = ({ appData }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [data, setData] = useState(appData); // Use the provided data
    const [showMore, setShowMore] = useState(false);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [error, setError] = useState(null); // State to handle errors
    const [userData, setUserData] = useState(null); // Store user data
    const [hasAccess, setHasAccess] = useState(null); // Start with null instead of true
    const [activeTab, setActiveTab] = useState('description');
    const pathname = usePathname();

    // Load user data from localStorage on client side
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Get purchased games from localStorage
            const storedGames = localStorage.getItem("gData");
            const purchasedGames = storedGames ? JSON.parse(storedGames) : [];

            // Check if user is admin
            const isAdmin = localStorage.getItem("role") === 'ADMIN';

            setUserData({
                purchasedGames,
                isAdmin
            });

            // Check access
            if (data) {
                checkAccess(data, purchasedGames, isAdmin);
            }
        }
    }, [data]);

    // Check if user has access to the app
    const checkAccess = (appData, purchasedGames, isAdmin) => {
        if (!appData) return;

        if (isAdmin) {
            setHasAccess(true);
        } else {
            // If the user is not an admin, check if app is free or they purchased it
            setHasAccess(!appData.isPaid || purchasedGames.includes(appData._id));
        }
    };

    // Slide handling functions
    const nextSlide = () => {
        if (data?.thumbnail && data.thumbnail.length > 1) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % (data.thumbnail.length - 1));
        }
    };

    const prevSlide = () => {
        if (data?.thumbnail && data.thumbnail.length > 1) {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + (data.thumbnail.length - 1)) % (data.thumbnail.length - 1));
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}.${month}.${year}`;
    };

    const toggleShowMore = () => {
        setShowMore((prev) => !prev);
    };

    // Function to handle body scroll locking
    const lockScroll = () => {
        if (typeof document !== 'undefined') {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '15px'; // Prevent layout shift
        }
    };

    const unlockScroll = () => {
        if (typeof document !== 'undefined') {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
    };

    const handleDownloadClick = () => {
        setShowModal(true); // Show the modal when the button is clicked
        lockScroll(); // Lock scrolling
    };

    const closeModal = () => {
        setShowModal(false); // Hide the modal
        unlockScroll(); // Unlock scrolling
    };

    // Clean up scroll lock when component unmounts
    useEffect(() => {
        return () => {
            unlockScroll();
        };
    }, []);

    // If there's an error, show an error message
    if (error) {
        return (
            <div className="flex justify-center items-center h-[40rem] ">
                <h1 className="text-2xl text-red-500">{error}</h1>
            </div>
        );
    }

    // Show "Loading..." when app data or user data is still being loaded
    if (!data) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h1 className="text-2xl text-gray-500">Loading...</h1>
            </div>
        );
    }

    // If the app is paid and the user doesn't have access, show "You don't have access"
    if (data.isPaid && hasAccess === false) {
        return (
            <div className="flex justify-center items-center h-[40rem] ">
                <h1 className="text-2xl text-red-500">You don't have access to this app</h1>
            </div>
        );
    }

    return (
        <div className='z-20 relative'>
            <div>
                <AdsComponent refreshKey={pathname} />
            </div>
            <div className='flex flex-wrap flex-col xl:flex-row px-2 justify-center items-center'>
                {/* Left Content */}
                <div className="flex-1">
                    {/* Card */}
                    <div className="flex p-2 sm:p-4 flex-grow flex-col rounded-lg shadow-sm">
                        <div className="flex items-center gap-4 text-slate-800 gap-3 sm:gap-5">
                            <img
                                src={data.thumbnail && data.thumbnail[0] ? data.thumbnail[0] : "https://via.placeholder.com/58"}
                                alt={data.title}
                                className="relative inline-block h-[48px] w-[48px] sm:h-[58px] sm:w-[58px] rounded-lg object-cover object-center"
                            />
                            <div className="flex w-full flex-col overflow-hidden">
                                <div className="w-full flex items-center justify-between overflow-hidden">
                                    <h1 className="text-white text-base sm:text-xl md:text-xl lg:text-3xl font-medium overflow-hidden text-ellipsis truncate max-w-full whitespace-normal md:whitespace-nowrap">
                                        {data.title}
                                    </h1>
                                </div>
                                <p className="text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] text-blue-500 uppercase font-light mt-0.5">
                                    {data.platform}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Slider Logic */}
                    {data.thumbnail && data.thumbnail.length > 1 && (
                        <div id="default-carousel" className="flex relative w-full max-w-full">
                            <div className="relative bg-[#262626] w-full h-[13rem] sm:h-[19rem] md:h-[20rem] lg:h-[26rem] overflow-hidden rounded-lg">
                                {data.thumbnail.slice(1).map((image, index) => (
                                    <div key={index} className={`transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'block' : 'hidden'} h-full`}>
                                        <img
                                            src={image}
                                            className="block w-full h-full object-cover"
                                            alt={`Slide ${index + 2}`}
                                        />
                                    </div>
                                ))}
                            </div>
                            {/* Slider indicators */}
                            <div className="absolute flex -translate-x-1/2 bottom-2 sm:bottom-3 lg:bottom-5 left-1/2 space-x-1 sm:space-x-2 overflow-hidden max-w-full justify-center">
                                {data.thumbnail.slice(1).map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`w-4 h-1 sm:w-8 sm:h-1 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-500'}`}
                                        aria-current={index === currentIndex}
                                        aria-label={`Slide ${index + 2}`}
                                        onClick={() => setCurrentIndex(index)}
                                    />
                                ))}
                            </div>

                            {/* Slider controls */}
                            <button
                                type="button"
                                className="absolute top-0 left-0 flex items-center justify-center h-full px-2 sm:px-4 cursor-pointer group focus:outline-none"
                                onClick={prevSlide}
                                aria-label="Previous slide"
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
                                    className="text-lg sm:text-xl text-white"
                                >
                                    <path d="m15 18-6-6 6-6" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                className="absolute top-0 right-0 flex items-center justify-center h-full px-2 sm:px-4 cursor-pointer group focus:outline-none"
                                onClick={nextSlide}
                                aria-label="Next slide"
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
                                    className="text-lg sm:text-xl text-white"
                                >
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Card */}
                <div className="w-full max-w-[22rem] md:ml-4 lg:ml-4 h-full p-8 bg-[#262626] rounded-lg shadow-md mt-6 xl:mt-[5.7rem] ring-1 ring-[#3E3E3E]">
                    <h2 className="text-xs font-semibold text-[#8E8E8E] ">Platform</h2>
                    <p className="text-sm text-[#fff] mb-6">{data.platform}</p>
                    <h2 className="text-xs font-semibold text-[#8E8E8E]">Interface language</h2>
                    <p className="text-sm text-[#fff] mb-6">English , Russian , German , Chinese...</p>
                    <h2 className="text-xs font-semibold text-[#8E8E8E]">Tested</h2>
                    <p className="text-sm text-[#fff] mb-6">
                        {data.platform === "Mac" && "Mac Air M1"}
                        {data.platform === "PC" && "PC"}
                        {data.platform === "Android" && "Android device"}
                        {data.platform === "Playstation" && "PC (Emulator)"}
                    </p>
                    <h2 className="text-xs font-semibold text-[#8E8E8E]">Size</h2>
                    <p className="text-sm text-[#fff] mb-6">{data.size}</p>
                    <h2 className="text-xs font-semibold text-[#8E8E8E]">Updated at</h2>
                    <p className="text-sm text-[#fff] mb-6">{formatDate(data.updatedAt)}</p>
                    <div className='py-[2px]'>
                        <button
                            className='bg-[#00AA01] hover:bg-[#28C328] text-white h-12 w-full text-center py-2 rounded-lg text-s'
                            onClick={handleDownloadClick} // Handle click to show modal
                        >
                            Free Download ({data.size})
                        </button>
                    </div>
                </div>
            </div>

            {/* Description/Installation Section */}
            <DescriptionTabs data={data} />

            {/* Modal for Download Instructions */}
            {showModal && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black backdrop-blur-sm bg-opacity-50 z-50 overflow-hidden"
                    onClick={(e) => {
                        // Close modal when clicking outside of modal content
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div className="bg-[#262626] px-6 sm:px-12 lg:px-24 py-6 sm:py-8 rounded-lg w-full max-w-4xl mx-auto text-center relative my-auto max-h-[90vh] overflow-y-auto">
                        {/* Close Icon */}
                        <div className="absolute top-4 right-4 cursor-pointer" onClick={closeModal}>
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
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-normal">Installation Instructions</h3>

                        {/* For MAC games*/}
                        {data.category?.name === 'mac' && (
                            <div>
                                <div>
                                    <h2 className="mt-3 text-[#8E8E8E] hover:underline text-lg sm:text-xl">MAC</h2>
                                    <p className="mt-1 text-sm sm:text-base">Run the downloaded image and drag the application to the Applications folder shortcut.</p>
                                    <p className="text-sm sm:text-base">Once copying is complete, the application can be launched via Launchpad.</p>
                                    <p className='text-green-500 text-sm'>If the application shows <span className='text-yellow-500'>"The app is damaged and can't be opened. You should move it to the bin"</span> then visit our <a className='text-blue-500 text-base' href="https://toxicgames.in/faq">FAQ </a>page and refer that video.</p>
                                </div>

                                {/* Check if announcement is not empty and has enough data */}
                                {data?.announcement && <GameAnnouncement announcements={data.announcement} />}

                                <div className='flex flex-wrap justify-center text-center mt-2 text-sm'> How To Download? How to Install?&nbsp; <a href="https://vimeo.com/1030290869?share=copy" target='_blank' className=' text-blue-600 hover:underline'> click here</a></div>
                            </div>
                        )}

                        {/* For Software MAC */}
                        {data.category?.name === 'smac' && (
                            <div>
                                <div>
                                    <h2 className="mt-3 text-[#8E8E8E] hover:underline text-lg sm:text-xl">Software MAC</h2>
                                    <p className="mt-1 text-sm sm:text-base">Follow the instructions to mount the image, then drag the application to the Applications folder.</p>
                                    <p className="text-sm sm:text-base">This version may require additional configurations for certain users.</p>
                                </div>

                                {/* Check if announcement is not empty */}
                                {data?.announcement && <GameAnnouncement announcements={data.announcement} />}
                            </div>
                        )}

                        {/* For PC */}
                        {data.category?.name === 'pc' && (
                            <div>
                                <div>
                                    <h2 className="mt-3 text-[#8E8E8E] hover:underline text-lg sm:text-xl">PC</h2>
                                    <p className="mt-1 text-sm sm:text-base">Game is pre-installed / portable, therefore you do not need to install the game.</p>
                                    <p className='text-green-500 text-base'>Just extract the <span className='text-yellow-500'>rar / zip file</span> and lauch the game directly from it's  <span className='text-yellow-500'>exe</span>.</p>
                                </div>

                                {/* Check if announcement is not empty */}
                                {data?.announcement && <GameAnnouncement announcements={data.announcement} />}
                            </div>
                        )}

                        {/* For Software PC */}
                        {data.category?.name === 'spc' && (
                            <>
                                <h2 className="mt-3 text-[#8E8E8E] hover:underline text-lg sm:text-xl">Software PC</h2>
                                <p className="mt-1 text-sm sm:text-base">Run the installer and follow the setup process. It might need additional configurations for software compatibility.</p>
                                <p className="text-sm sm:text-base">After installation, the software will be ready to use.</p>
                            </>
                        )}

                        {/* For Android */}
                        {data.category?.name === 'android' && (
                            <div>
                                <div>
                                    <h2 className="mt-3 text-[#8E8E8E] hover:underline text-lg sm:text-xl">Android</h2>
                                    <p className="mt-1 text-sm sm:text-base">Install the APK directly on your Android device.</p>
                                    <p className="text-sm sm:text-base">Ensure that you have enabled installation from unknown sources in your device settings.</p>
                                </div>

                                {/* Check if announcement is not empty */}
                                {data?.announcement && <GameAnnouncement announcements={data.announcement} />}
                            </div>
                        )}

                        {/* For Android Softwares */}
                        {data.category?.name === 'sandroid' && (
                            <>
                                <h2 className="mt-3 text-[#8E8E8E] hover:underline text-lg sm:text-xl">Android</h2>
                                <p className="mt-1 text-sm sm:text-base">Install the APK directly on your Android device.</p>
                                <p className="text-sm sm:text-base">Ensure that you have enabled installation from unknown sources in your device settings.</p>
                            </>
                        )}

                        {/* For PlayStation (ps2, ps3, ps4, ppsspp) */}
                        {['Playstation'].includes(data.platform) && (
                            <div>
                                <div>
                                    <h2 className="mt-3 text-[#8E8E8E] hover:underline text-lg sm:text-xl">PlayStation</h2>
                                    <p className="mt-1 text-sm sm:text-base">For PlayStation, follow the platform-specific instructions to install or load the game on your console.</p>
                                    <p className="text-sm sm:text-base text-yellow-300">To run these on PC, download the appropriate versions of Emulators <a className='text-blue-600 hover:underline' href='https://www.ppsspp.org/download/' target='_blank'>PPSSPP</a>, <a className='text-blue-600 hover:underline' href='https://pcsx2.net/' target='_blank'>PCSX2</a>, or <a className='text-blue-600 hover:underline' href='https://rpcs3.net/download' target='_blank'>RPCS3</a>, and enjoy your gameplay!</p>
                                </div>
                                {/* Check if announcement is not empty */}
                                {data?.announcement && <GameAnnouncement announcements={data.announcement} />}
                            </div>
                        )}

                        <DownloadSection
                            platform={data.platform}
                            downloadLinks={data.downloadLink}
                        />

                        {/* Troubleshooting Section */}
                        <p className="mt-4 text-sm sm:text-base">Doesn't download? Broken file? Doesn't work? Gives an error? How to update?</p>
                        <p className="text-sm sm:text-base">We have collected all the answers on our <a href="https://t.me/downloadmacgames" target='_blank' className='text-cyan-600 text-base hover:underline'>Telegram Group</a>.</p>
                    </div>
                </div>
            )}

            {/* Background gradient with game image */}
            <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(to top right, rgba(0, 0, 0, 1)50%, rgba(0, 0, 0, 0) 100%), url('${data.thumbnail?.[2] || ''})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.5,
                    zIndex: -1,
                    pointerEvents: 'none', // Allows interaction with elements above this
                }}
            >
            </div>

            {/* Comment box */}
            <div className='ring-2 ring-[#2E2E2E] rounded-lg flex flex-col items-center mt-8'>
                <h2 className='pt-4 mb-8 text-2xl sm:text-3xl font-normal text-[#8E8E8E] hover:text-[#fff]'>Comments</h2>
                <div className='flex justify-center w-full'>
                    <GiscusComments objectId={data._id} />
                </div>
            </div>
        </div>
    );
};

export default SingleApp;
