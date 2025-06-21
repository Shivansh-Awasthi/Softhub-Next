'use client';

import React, { Suspense } from 'react'
import { useState, useEffect } from 'react';


const Donate = () => {

    const [donationGoal, setDonationGoal] = useState(1200); // ₹1,200 goal
    const [currentAmount, setCurrentAmount] = useState(750); // Current amount ₹750
    const [donationAmount, setDonationAmount] = useState(50);
    const [showThankYou, setShowThankYou] = useState(false);

    // Simulate loading current donation amount from backend
    useEffect(() => {
        // In a real app, you would fetch this from your backend
        // fetch('/api/donations/total').then(...)
    }, []);

    const handleDonate = () => {
        // In a real app, you would send this to your backend
        // fetch('/api/donations', { method: 'POST', body: ... })
        setCurrentAmount(prev => prev + donationAmount);
        setShowThankYou(true);
        setTimeout(() => setShowThankYou(false), 3000);
    };

    const progressPercentage = Math.min((currentAmount / donationGoal) * 100, 100);

    return (

        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Coming Soon Game Section */}
            <section className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Support the Project</h1>
                <div className="p-8 rounded-lg border-2 border-dashed border-gray-300 bg-[#1a1a1a] shadow-lg">
                    <img className='mx-auto mb-8 rounded-lg shadow-md max-w-full h-auto' src="https://i.postimg.cc/8CKCtDWs/4y35ygtayile1.png" alt="Project Banner" />
                    <div>
                        <h2 className='text-xl font-bold text-red-500 mb-4'>For Public Release</h2>
                    </div>
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            <span className="font-medium text-white">Raised: <span className="text-green-400">₹{currentAmount.toLocaleString()}</span></span>
                            <span className="font-medium text-white">Goal: <span className="text-blue-400">₹{donationGoal.toLocaleString()}</span></span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-5 p-0.5">
                            <div
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-4 rounded-full transition-all duration-500 relative"
                                style={{ width: `${progressPercentage}%` }}
                            >
                                {progressPercentage > 10 && (
                                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                                        {Math.round(progressPercentage)}%
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-300 mb-4">
                        We're working hard to bring you an amazing gaming experience.
                        Your support helps us make it even better!
                    </p>
                    <div className="animate-pulse text-indigo-400 font-medium">You can request programs and games in the comments.</div>
                </div>
            </section>

            {/* Donation Section */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-center">Support Our Development</h2>



                {/* UPI Section */}
                <div className="bg-gradient-to-br from-[#1e1e1e] to-[#262626] p-6 rounded-lg shadow-xl border border-purple-500/20 text-center mt-8 transform transition-all duration-300 hover:shadow-purple-500/10">
                    <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">UPI Payment (Ask in Telegram)</h3>
                    <p className="text-gray-300 mb-4 break-all">
                        PhonePe, Paytm, Google Pay, etc.
                    </p>

                    <div className="mt-4">
                        <div className="border border-purple-500/20 rounded-lg p-5 bg-black/30 backdrop-blur-sm">
                            <div className="flex justify-center mb-4">
                                <div className="bg-white border-4 border-purple-500/20 rounded-lg shadow-lg overflow-hidden">
                                    <img
                                        src="https://i.postimg.cc/zD71FFgv/Screenshot-2025-03-26-at-1-33-37-AM.png"
                                        alt="Telegram QR Code"
                                        className="w-40 h-40 object-cover"
                                    />
                                </div>
                            </div>
                            <div className="bg-black/50 p-3 rounded-lg text-sm break-all font-mono text-center text-gray-300 border border-blue-500/20">
                                <span className="text-blue-400 font-semibold">Telegram:</span> DM in this account for UPI details
                            </div>
                        </div>
                    </div>
                </div>

                {/* Crypto Donation Options */}
                {/* USDT Tron Section */}
                <div className="bg-gradient-to-br from-[#1e1e1e] to-[#262626] p-6 rounded-lg shadow-xl border border-red-500/20 text-center mt-8 transform transition-all duration-300 hover:shadow-red-500/10">
                    <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">USDT Tron (TRC20)</h3>
                    <p className="text-gray-300 mb-4 break-all bg-black/30 p-3 rounded-lg border border-red-500/10">
                        <span className="text-red-400 font-semibold">Address:</span> TFq2xVb7ibR7q5Mb1pkWiiCT34BmS3y2gi
                    </p>

                    <div className="mt-4">
                        <div className="border border-red-500/20 rounded-lg p-5 bg-black/30 backdrop-blur-sm">
                            <h4 className="font-medium mb-4 text-center text-red-400">TRX (TRX-20)</h4>
                            <div className="flex justify-center mb-4">
                                <div className="bg-white border-4 border-red-500/20 rounded-lg shadow-lg overflow-hidden">
                                    <img
                                        src="https://i.postimg.cc/0yJ4QC5Q/Screenshot-2025-03-26-at-1-09-34-AM.png"
                                        alt="USDT Tron QR Code"
                                        className="w-40 h-40 object-cover"
                                    />
                                </div>
                            </div>
                            <div className="bg-black/50 p-3 rounded-lg text-sm break-all font-mono text-center text-gray-300 border border-red-500/20">
                                <span className="text-red-400 font-semibold">Address:</span> TFq2xVb7ibR7q5Mb1pkWiiCT34BmS3y2gi
                            </div>
                        </div>
                    </div>
                </div>
                {/* USDT BSC Section */}
                <div className="bg-gradient-to-br from-[#1e1e1e] to-[#262626] p-6 rounded-lg shadow-xl border border-yellow-500/20 text-center mt-8 transform transition-all duration-300 hover:shadow-yellow-500/10">
                    <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400">USDT BSC (BNB Smart Chain)</h3>
                    <p className="text-gray-300 mb-4 break-all bg-black/30 p-3 rounded-lg border border-yellow-500/10">
                        <span className="text-yellow-400 font-semibold">Address:</span> 0x291dce3bd01fceec0665b9d6b9734946e335954b
                    </p>

                    <div className="mt-4">
                        <div className="border border-yellow-500/20 rounded-lg p-5 bg-black/30 backdrop-blur-sm">
                            <h4 className="font-medium mb-4 text-center text-yellow-400">BSC (BEP20)</h4>
                            <div className="flex justify-center mb-4">
                                <div className="bg-white border-4 border-yellow-500/20 rounded-lg shadow-lg overflow-hidden">
                                    <img
                                        src="https://i.postimg.cc/wMChbLCf/Screenshot-2025-03-26-at-1-20-22-AM.png"
                                        alt="USDT BSC QR Code"
                                        className="w-40 h-40 object-cover"
                                    />
                                </div>
                            </div>
                            <div className="bg-black/50 p-3 rounded-lg text-sm break-all font-mono text-center text-gray-300 border border-yellow-500/20">
                                <span className="text-yellow-400 font-semibold">Address:</span> 0x291dce3bd01fceec0665b9d6b9734946e335954b
                            </div>
                        </div>
                    </div>
                </div>

                {/* Other Cryptocurrencies Section */}
                <div className="bg-gradient-to-br from-[#1e1e1e] to-[#262626] p-6 rounded-lg shadow-xl border border-blue-500/20 text-center mt-8 transform transition-all duration-300 hover:shadow-blue-500/10">
                    <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Other Cryptocurrencies</h2>

                    {/* Bitcoin */}
                    <div className="mb-8 p-4 bg-black/30 rounded-lg border border-orange-500/20">
                        <h3 className="text-xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                            <span className="inline-flex items-center">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z" fill="#F7931A" />
                                </svg>
                                BTC (Bitcoin)
                            </span>
                        </h3>
                        <div className="bg-black/50 p-3 rounded-lg text-sm break-all font-mono text-center text-gray-300 border border-orange-500/20">
                            <span className="text-orange-400 font-semibold">Address:</span> 1DLfx6a4CU7G9Abj9fedxpdY21srPPstbX
                        </div>
                    </div>

                    {/* Ethereum */}
                    <div className="mb-8 p-4 bg-black/30 rounded-lg border border-indigo-500/20">
                        <h3 className="text-xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                            <span className="inline-flex items-center">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" fill="#6B7FD7" />
                                </svg>
                                ETH (Ethereum)
                            </span>
                        </h3>
                        <div className="bg-black/50 p-3 rounded-lg text-sm break-all font-mono text-center text-gray-300 border border-indigo-500/20">
                            <span className="text-indigo-400 font-semibold">Address:</span> 0x291dce3bd01fceec0665b9d6b9734946e335954b
                        </div>
                    </div>

                    {/* Pi Network */}
                    <div className="p-4 bg-black/30 rounded-lg border border-purple-500/20">
                        <h3 className="text-xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            <span className="inline-flex items-center">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="12" fill="#6B4CE6" />
                                    <path d="M9 8.5h6M9 12h6M9 15.5h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                PI (Pi Network)
                            </span>
                        </h3>
                        <div className="bg-black/50 p-3 rounded-lg text-sm break-all font-mono text-center text-gray-300 border border-purple-500/20">
                            <span className="text-purple-400 font-semibold">Address:</span> MDFNWH6ZFJVHJDLBMNOUT35X4EEKQVJAO3ZDL4NL7VQJLC4PJOQFWAAAAAASEZWSRDSZI
                        </div>
                    </div>
                </div>
            </section>



            {/* Coming Soon Section */}
            <div>
                <section className="mb-12 text-center">
                    <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Coming Soon...</h1>
                    <div className="p-8 rounded-lg border-2 border-dashed border-red-500/30 bg-[#1a1a1a] shadow-lg relative overflow-hidden">
                        {/* Background glow effects */}
                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-red-600 opacity-10 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-orange-600 opacity-10 rounded-full blur-xl"></div>

                        {/* Game banner with enhanced styling */}
                        <div className="relative mb-8 rounded-lg overflow-hidden shadow-2xl border border-red-500/20">
                            <img
                                className='w-full h-auto'
                                src="https://i.postimg.cc/WzF6znR8/God-of-war-ragnarok-banner-black-background-2-817x320.jpg"
                                alt="God of War Ragnarok"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        </div>

                        <div className="mb-6">
                            <h2 className='text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-3'>Upcoming Game</h2>
                        </div>

                        <div className="animate-pulse text-red-400 font-medium p-3 bg-black/30 rounded-lg border border-red-500/20">
                            After the completion of Red Dead Redemption 2, then the other games will be posted.
                        </div>

                        {/* Coming soon badge */}
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 px-3 py-1.5 rounded-full shadow-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs font-bold text-white">COMING SOON</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Donate