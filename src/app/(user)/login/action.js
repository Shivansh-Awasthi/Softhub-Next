'use server';

import { cookies } from 'next/headers';

export async function loginUser(formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        // Use the server-side API URL
        const response = await fetch(`${process.env.API_URL}/api/user/signin`, {
            method: 'POST',
            headers: {
                'X-Auth-Token': 'my-secret-token-123',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
            cache: 'no-store',
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: 'Login failed. Please check your credentials.' };
        }

        // Set cookies for authentication data
        const cookieStore = cookies();

        // Set secure HTTP-only cookies for sensitive data
        cookieStore.set('token', data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        // Set cookies for client-side access
        cookieStore.set('name', data.user.username, {
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        cookieStore.set('role', data.user.role, {
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        cookieStore.set('userId', data.user.userId, {
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        // For purchased games, we need to stringify the array
        cookieStore.set('gData', JSON.stringify(data.user.purchasedGames), {
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        return {
            success: true,
            message: `Welcome back, ${data.user.username}!`,
            userData: {
                token: data.token, // Include token for localStorage
                name: data.user.username,
                role: data.user.role,
                userId: data.user.userId,
                purchasedGames: data.user.purchasedGames || []
            }
        };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Something went wrong. Please try again.' };
    }
}

