'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signupUser } from './actions';

const SignupForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: ''
    });
    const formRef = useRef(null);
    const router = useRouter();

    // Validate email format
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Handle form submission with server action
    const handleFormSubmit = async (formData) => {
        // Reset errors
        setErrors({
            username: '',
            email: '',
            password: ''
        });

        // Validate form inputs
        let isValid = true;
        let newErrors = {
            username: '',
            email: '',
            password: ''
        };

        // Validate username
        if (!username.trim()) {
            newErrors.username = 'Username is required';
            isValid = false;
        } else if (username.trim().length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
            isValid = false;
        }

        // Validate email
        if (!email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Validate password - CRITICAL CHECK
        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
            isValid = false;
        }

        // Double-check password length as an extra precaution
        const passwordInput = formData.get('password');
        if (passwordInput.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
            isValid = false;
        }

        // Update errors state
        setErrors(newErrors);

        // If validation fails, don't submit
        if (!isValid) {
            // Show error toast for validation issues
            toast.error('Please fix the form errors before submitting', {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Call the server action
            const result = await signupUser(formData);

            if (result.success) {
                // Clear form
                formRef.current.reset();
                setUsername('');
                setEmail('');
                setPassword('');

                // Show success toast
                toast.success(`${result.message} Redirecting to login...`, {
                    position: "top-right",
                    autoClose: 2000, // 2 seconds
                });

                // Redirect to login after 2 seconds
                setTimeout(() => {
                    router.push('/user/login');
                }, 2000);
            } else {
                // Show general error toast
                toast.error(result.message, {
                    position: "top-right",
                    autoClose: 3000, // 3 seconds
                });
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Signup error:', error);
            toast.error('Something went wrong. Please try again.', {
                position: "top-right",
                autoClose: 3000, // 3 seconds
            });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-xl h-full mx-auto">
            <div className="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm p-6 sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <form ref={formRef} onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleFormSubmit(formData);
                }} className="space-y-6">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign Up</h3>

                    <div>
                        <label className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`bg-gray-50 border ${errors.username ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                            required
                        />
                        {errors.username && (
                            <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                            required
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password (min. 8 characters)"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                // Clear password error if it meets the minimum length
                                if (e.target.value.length >= 8) {
                                    setErrors(prev => ({ ...prev, password: '' }));
                                } else if (e.target.value.length > 0) {
                                    // Show error if password is too short
                                    setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters' }));
                                }
                            }}
                            className={`bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                            required
                            minLength={8}
                            pattern=".{8,}"
                            title="Password must be at least 8 characters long"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
                        onClick={() => setIsSubmitting(true)}
                    >
                        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                    </button>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                        Already have an account? <Link href="/user/login" className="text-blue-700 hover:underline dark:text-blue-500">Sign in</Link>
                    </div>
                </form>
            </div>
            {/* Toast Container for displaying toasts */}
            <ToastContainer />
        </div>
    );
};

export default SignupForm;
