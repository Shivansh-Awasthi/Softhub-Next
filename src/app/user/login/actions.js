'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginUser(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    // Internal API call - not exposed to client
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': 'secret-token-123',
      },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || 'Login failed' };
    }

    const data = await response.json();

    // Set secure cookies
    const cookieStore = cookies();
    cookieStore.set('auth_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return {
      success: true,
      message: `Welcome back, ${data.user.username}!`,
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Server error during login' };
  }
}