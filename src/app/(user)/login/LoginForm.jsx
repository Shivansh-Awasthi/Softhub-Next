'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/user/signin`,
                { email, password },
                {
                    headers: {
                        'X-Auth-Token': 'my-secret-token-123',
                        'Content-Type': 'application/json'
                    }
                }
            );

            setEmail("");
            setPassword("");

            const token = response.data.token;
            const name = response.data.user.username;
            const role = response.data.user.role;
            const purchasedGames = response.data.user.purchasedGames;
            const userId = response.data.user.userId;

            // Store user data in localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', token);
                localStorage.setItem('name', name);
                localStorage.setItem('gData', JSON.stringify(purchasedGames));
                localStorage.setItem('role', role);
                localStorage.setItem('userId', userId);
            }

            // Show success toast notification
            toast.success(`Welcome back, ${name}! Redirecting to home...`, {
                position: 'top-right',
                autoClose: 2000, // 2 seconds delay
            });

            // Redirect to home page after 2 seconds
            setTimeout(() => {
                router.push('/');
            }, 2000);

        } catch (error) {
            // Show error toast notification
            toast.error('Login failed. Please check your credentials.', {
                position: 'top-right',
                autoClose: 3000, // 3 seconds delay
            });

            console.log(error);
        }
    };

    return (
        <div className="max-w-xl h-full mx-auto">
            <div className="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm p-4 sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3>

                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Your email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="email@company.com"
                            value={email}
                            onChange={handleEmail}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Your password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="••••••••"
                            value={password}
                            onChange={handlePassword}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Login to your account
                    </button>

                    <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                        Not registered? <Link href="/user/signup" className="text-blue-700 hover:underline dark:text-blue-500">Create account</Link>
                    </div>
                </form>
            </div>
            {/* Toast Container for displaying toasts */}
            <ToastContainer />
        </div>
    );
};

export default LoginForm;
