'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LiveCounter } from './components/Counter/LiveCounter';
import AdsComponent from './components/Ads/AdsComponent';

const images = [
    'https://img.playbook.com/NzGgc9TjLeq_Ic9CZ4VLwiUBrK82Gigj4VqjhcTTlwE/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzIwYTYzOTJj/LWEyNWUtNDdjYy05/Y2E5LWFjMmQ2ZGQy/YmRkNw',
    'https://img.playbook.com/fEFoQgs0r1pXKzOJcJIfIevmy08UHSLlInS1-Fcp8uc/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljL2RkZGUzOTQ1/LTQwNzMtNDMxNy05/N2QyLTk3OTJkNDFi/OTBlNQ',
    'https://img.playbook.com/Z_dmnLQyanAMg7VIdnAATqzc7KTX-op4jBsdjexfxWk/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzk5NTkyOWI1/LWE3YWQtNGUyZS1h/YWJmLWFiZTU3ZDE5/YTI4Nw',
    'https://img.playbook.com/X0CxPl24l4RbK0kdRTk7NAtbQVW_5S9PYB05cE4vFZk/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzM1MThlMDAx/LTNiYWQtNGQxZS1i/OWQ0LTY1MmM5MWQx/OTU4Yw'
];

const HomeClient = ({
    macGames,
    macSoftwares,
    pcGames,
    androidGames,
    ps2Games,
    totalMacGames,
    totalMacSoft,
    totalPcGames,
    totalAndroidGames,
    totalPs2Iso
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const pathname = usePathname();

    // For count visitors accessible/visible only for the admins
    const [isAdmin, setIsAdmin] = useState(false);

    // Check the role in localStorage on component mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const role = localStorage.getItem('role');
            if (role === 'ADMIN') {
                setIsAdmin(true); // If the role is "ADMIN", set state to true
            }
        }
    }, []);

    const createSlug = (title) => {
        return title
            .toLowerCase() // Convert to lowercase
            .replace(/[^\w\s-]/g, '') // Remove non-alphanumeric characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .trim(); // Remove trailing spaces
    };

    return (
        <div className='container mx-auto p-2'>
            {/* Slider Logic */}
            <div id="default-carousel" className="relative w-full mb-10" data-carousel="slide">
                {/* Carousel Container */}
                <div className="relative h-56 sm:h-72 md:h-88 lg:h-[25rem] overflow-hidden rounded-lg">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`transition-opacity duration-700 ease-in-out absolute inset-0 ${index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        >
                            <img src={image} className="block w-full h-full object-cover" alt={`Slide ${index + 1}`} />

                            {/* Overlay text and button on the 4th image (index === 0) */}
                            {index === 3 && (
                                <div className="absolute inset-0 flex flex-col text-white p-8 ml-6 mt-4 md:p-0 md:ml-20 md:mt-28 z-0 w-full ">
                                    <h2 className="text-lg font-thin mb-4 sm:text-base md:text-lg">SOFTWARE</h2>
                                    <p className="mb-4 font-semibold sm:text-sm md:text-base overflow-hidden whitespace-nowrap text-ellipsis">Download Free Softwares On Your Mac</p>
                                    <div className='w-fill'>
                                        <Link href="/category/mac/softwares">
                                            <button className="mx-auto ml-0 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 sm:px-4 sm:py-2 md:px-6 md:py-3 overflow-hidden whitespace-nowrap text-ellipsis">
                                                Download Now
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Overlay text and button on the 4th image (index === 3) */}
                            {index === 0 && (
                                <div className="absolute inset-0 flex flex-col text-white p-8 ml-6 mt-4 md:p-0 md:ml-20 md:mt-28 z-0">
                                    <h2 className="text-lg font-base mb-4 sm:text-base md:text-lg">Exclusive Games</h2>
                                    <p className="mb-6 font-semibold sm:text-sm md:text-base overflow-hidden whitespace-nowrap text-ellipsis">To get our Exclusive Mac games Messege on my <a href="https://t.me/n0t_ur_type" className='text-cyan-500' target='_blank'>Telegram</a></p>
                                    <div className='w-fill'>
                                        <a href="https://t.me/n0t_ur_type" target='_blank' rel="noopener noreferrer">
                                            <button className="mx-auto ml-0 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 sm:px-4 sm:py-2 md:px-6 md:py-3 overflow-hidden whitespace-nowrap text-ellipsis">
                                                Send message..
                                            </button>
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Overlay text and button on the 4th image (index === 2) */}
                            {index === 1 && (
                                <div className="absolute inset-0 flex flex-col text-white p-8 ml-6 mt-4 md:p-0 md:ml-20 md:mt-28 z-0">
                                    <h2 className="text-lg font-thin mb-4 sm:text-base md:text-lg">Macbook Games</h2>
                                    <p className="mb-6 font-semibold sm:text-sm md:text-base overflow-hidden whitespace-nowrap text-ellipsis">Download Your Favourite Games for Free.</p>
                                    <div className='w-fill'>
                                        <Link href="/category/mac/games">
                                            <button className="mx-auto ml-0 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 sm:px-4 sm:py-2 md:px-6 md:py-3 overflow-hidden whitespace-nowrap text-ellipsis">
                                                Download Now..
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Overlay text and button on the 4th image (index === 3) */}
                            {index === 2 && (
                                <div className="absolute inset-0 flex flex-col text-white p-8 ml-6 mt-4 md:p-0 md:ml-20 md:mt-28 z-0">
                                    <h2 className="text-lg font-thin mb-4 sm:text-base md:text-lg">TELEGRAM CHAT</h2>
                                    <p className="mb-6 font-semibold sm:text-sm md:text-base overflow-hidden whitespace-nowrap text-ellipsis">Join Our Channel @freemacgames</p>
                                    <div className='w-fill'>
                                        <a href="https://t.me/freemacgames" target="_blank" rel="noopener noreferrer">
                                            <button className="mx-auto ml-0 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 sm:px-4 sm:py-2 md:px-6 md:py-3 overflow-hidden whitespace-nowrap text-ellipsis">
                                                Join our Telegram
                                            </button>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Pagination Dots */}
                <div className="absolute flex space-x-2 bottom-7 left-1/2 transform -translate-x-1/2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`w-8 h-1 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-500'}`}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </div>

                {/* Previous Button */}
                <button
                    type="button"
                    className="absolute top-0 left-0 flex items-center justify-center h-full px-4 z-10"
                    onClick={() => setCurrentIndex((currentIndex - 1 + images.length) % images.length)}
                >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 focus:ring-4 focus:ring-white focus:outline-none">
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
                    </span>
                </button>

                {/* Next Button */}
                <button
                    type="button"
                    className="absolute top-0 right-0 flex items-center justify-center h-full px-4 z-10"
                    onClick={() => setCurrentIndex((currentIndex + 1) % images.length)}
                >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 focus:ring-4 focus:ring-white focus:outline-none">
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
                    </span>
                </button>
            </div>

            <div>
                {/* This div will be visible based on the role */}
                <div style={{ display: isAdmin ? 'block' : 'none' }}>
                    <LiveCounter />
                </div>
            </div>

            <div>
                <AdsComponent refreshKey={pathname} />
            </div>

            {/* Mac Games Category */}
            <div className="container mx-auto p-2 mb-6">
                <div className='cover mb-5 flex justify-between items-center'>
                    <h1 className='font-medium text-2xl md:text-3xl'>
                        Mac Games <span className='font-medium ml-2 text-[#8E8E8E]'>{totalMacGames}</span>
                    </h1>
                    <Link href="/category/mac/games" className="text-blue-500 hover:underline text-xs">See All</Link>
                </div>

                {/* Conditional rendering based on data existence */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                    {Array.isArray(macGames) && macGames.length > 0 ? (
                        macGames.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).slice(0, 8).map((ele) => (
                            <Link
                                key={ele._id}
                                href={`/download/${createSlug(ele.platform)}/${createSlug(ele.title)}/${ele._id}`}
                                className="flex flex-col rounded-2xl h-52 overflow-hidden transition duration-300 ease-in-out ring-0 hover:ring-2 hover:ring-[#8E8E8E] hover:ring-opacity-75"
                            >
                                <figure className="flex justify-center items-center rounded-t-2xl overflow-hidden h-full">
                                    <img
                                        src={ele.coverImg}
                                        alt={ele.title}
                                        className="w-full h-full object-cover rounded-t-2xl transition-transform duration-700 ease-in-out transform hover:scale-110"
                                    />
                                </figure>
                                <div className="flex flex-col p-3 bg-[#262626] flex-grow">
                                    <div className="text-sm font-normal text-[#ffffff] pb-2 overflow-hidden whitespace-nowrap text-ellipsis bg-[#262626]">{ele.title}</div>
                                    <div className="text-xs font-thin text-[#ffffff] bg-[#262626]">Size: {ele.size}</div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">Loading Mac Games...</div> // Loading state
                    )}
                </div>
            </div>

            {/* Mac Softwares */}
            <div className='container mx-auto p-2 mb-6'>
                <div className='cover mb-5 flex justify-between items-center'>
                    <h1 className='font-medium text-2xl md:text-3xl'>
                        Mac Softwares <span className='font-medium ml-2 text-[#8E8E8E]'>{totalMacSoft}</span>
                    </h1>
                    <Link href="/category/mac/softwares" className="text-blue-500 hover:underline text-xs">See All</Link>
                </div>

                {/* Conditional rendering for Mac Softwares */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.isArray(macSoftwares) && macSoftwares.length > 0 ? (
                        macSoftwares.slice(0, 8).map((ele) => (
                            <Link
                                key={ele._id}
                                href={`/download/${createSlug(ele.platform)}/${createSlug(ele.title)}/${ele._id}`}
                                className="flex flex-col rounded-2xl h-36 overflow-hidden transition duration-300 ease-in-out ring-1 ring-white/10 hover:ring-2 hover:ring-[#8E8E8E] hover:ring-opacity-75"
                            >
                                <div className="flex justify-center items-center h-32 bg-[#262626] pt-4">
                                    <img
                                        src={ele.thumbnail[0]}
                                        alt={ele.title}
                                        className="rounded-lg w-14 h-14 transition-transform duration-700 ease-in-out transform hover:scale-110 bg-[#262626]"
                                    />
                                </div>
                                <div className="flex flex-col p-4 bg-[#262626]">
                                    <div className="text-sm text-center font-normal overflow-hidden whitespace-nowrap text-ellipsis text-[#ffffff] bg-[#262626] pb-2">{ele.title}</div>
                                    <div className="text-xs text-center font-thin text-[#8E8E8E] bg-[#262626]">Size: {ele.size}</div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">Loading Mac Softwares...</div> // Loading state
                    )}
                </div>
            </div>

            {/* PC Games */}
            <div className='container mx-auto p-2 mb-6'>
                <div className='cover mb-5 flex justify-between items-center'>
                    <h1 className='font-medium text-2xl md:text-3xl'>
                        Pc Games <span className='font-medium ml-2 text-[#8E8E8E]'>{totalPcGames}</span>
                    </h1>
                    <Link href="/category/pc/games" className="text-blue-500 hover:underline text-xs">See All</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                    {/* Check if pcGames is an array and has items */}
                    {Array.isArray(pcGames) && pcGames.length > 0 ? (
                        pcGames.slice(0, 8).map((ele) => (
                            <Link
                                key={ele._id}
                                href={`/download/${createSlug(ele.platform)}/${createSlug(ele.title)}/${ele._id}`}
                                className="flex flex-col rounded-2xl h-52 overflow-hidden transition duration-300 ease-in-out ring-0 hover:ring-2 hover:ring-[#8E8E8E] hover:ring-opacity-75"
                            >
                                <figure className="flex justify-center items-center rounded-t-2xl overflow-hidden h-full">
                                    <img
                                        src={ele.coverImg}
                                        alt={ele.title}
                                        className="w-full h-full object-cover rounded-t-2xl transition-transform duration-700 ease-in-out transform hover:scale-110"
                                    />
                                </figure>
                                <div className="flex flex-col p-3 bg-[#262626] flex-grow">
                                    <div className="text-sm font-normal text-[#ffffff] pb-2 overflow-hidden whitespace-nowrap text-ellipsis bg-[#262626]">{ele.title}</div>
                                    <div className="text-xs font-thin text-[#ffffff] bg-[#262626]">Size: {ele.size}</div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">Loading PC Games...</div> // Loading state
                    )}
                </div>
            </div>

            {/* Android Games */}
            <div className='container mx-auto p-2 mb-6'>
                <div className='cover mb-5 flex justify-between items-center'>
                    <h1 className='font-medium text-2xl md:text-3xl'>
                        Android Games <span className='font-medium ml-2 text-[#8E8E8E]'>{totalAndroidGames}</span>
                    </h1>
                    <Link href="/category/android/games" className="text-blue-500 hover:underline text-xs">See All</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Check if androidGames is an array and has items */}
                    {Array.isArray(androidGames) && androidGames.length > 0 ? (
                        androidGames.slice(0, 8).map((ele) => (
                            <Link
                                key={ele._id}
                                href={`/download/${createSlug(ele.platform)}/${createSlug(ele.title)}/${ele._id}`}
                                className="flex flex-col rounded-2xl h-36 overflow-hidden transition duration-300 ease-in-out ring-1 ring-white/10 hover:ring-2 hover:ring-[#8E8E8E] hover:ring-opacity-75"
                            >
                                <div className="flex justify-center items-center h-32 bg-[#262626] pt-4">
                                    <img
                                        src={ele.thumbnail[0]}
                                        alt={ele.title}
                                        className="rounded-lg w-14 h-14 transition-transform duration-700 ease-in-out transform hover:scale-110 bg-[#262626]"
                                    />
                                </div>
                                <div className="flex flex-col p-4 bg-[#262626]">
                                    <div className="text-sm text-center font-normal overflow-hidden whitespace-nowrap text-ellipsis text-[#ffffff] bg-[#262626] pb-2">{ele.title}</div>
                                    <div className="text-xs text-center font-thin text-[#8E8E8E] bg-[#262626]">Size: {ele.size}</div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">Loading Android Games...</div> // Loading state
                    )}
                </div>
            </div>

            {/* PS2 Roms */}
            <div className='container mx-auto p-2 mb-6'>
                <div className='cover mb-5 flex justify-between items-center'>
                    <h1 className='font-medium text-2xl md:text-3xl'>
                        PS2 Roms <span className='font-medium ml-2 text-[#8E8E8E]'>{totalPs2Iso}</span>
                    </h1>
                    <Link href="/category/ps2/iso" className="text-blue-500 hover:underline text-xs">See All</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Check if ps2Games is an array and has items */}
                    {Array.isArray(ps2Games) && ps2Games.length > 0 ? (
                        ps2Games.slice(0, 8).map((ele) => (
                            <Link
                                key={ele._id}
                                href={`/download/${createSlug(ele.platform)}/${createSlug(ele.title)}/${ele._id}`}
                                className="flex flex-col rounded-2xl h-36 overflow-hidden transition duration-300 ease-in-out ring-1 ring-white/10 hover:ring-2 hover:ring-[#8E8E8E] hover:ring-opacity-75"
                            >
                                <div className="flex justify-center items-center h-32 bg-[#262626] pt-4">
                                    <img
                                        src={ele.thumbnail[0]}
                                        alt={ele.title}
                                        className="rounded-lg w-14 h-14 transition-transform duration-700 ease-in-out transform hover:scale-110 bg-[#262626]"
                                    />
                                </div>
                                <div className="flex flex-col p-4 bg-[#262626]">
                                    <div className="text-sm text-center font-normal overflow-hidden whitespace-nowrap text-ellipsis text-[#ffffff] bg-[#262626] pb-2">{ele.title}</div>
                                    <div className="text-xs text-center font-thin text-[#8E8E8E] bg-[#262626]">Size: {ele.size}</div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">Loading PS2 Roms...</div> // Loading state
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomeClient;
