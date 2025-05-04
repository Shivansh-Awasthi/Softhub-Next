'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logoutUser() {
  // Clear all cookies
  const cookieStore = cookies();
  
  // Get all cookies
  const allCookies = cookieStore.getAll();
  
  // Clear each cookie
  allCookies.forEach(cookie => {
    cookieStore.delete(cookie.name);
  });
  
  // Specifically clear auth cookies
  cookieStore.delete('token');
  cookieStore.delete('name');
  cookieStore.delete('role');
  cookieStore.delete('userId');
  cookieStore.delete('gData');
  
  return { success: true, message: 'Logged out successfully!' };
}
