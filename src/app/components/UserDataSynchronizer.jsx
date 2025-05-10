'use client';

import { useEffect } from 'react';
import { fetchUserData } from '../actions/fetchUserData';

/**
 * Component that synchronizes user data between server and client
 * It fetches data on the server and updates localStorage on the client
 */
const UserDataSynchronizer = () => {
  useEffect(() => {
    // Only run on the client side
    if (typeof window === 'undefined') return;

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) return;

    // Function to sync data
    const syncUserData = async () => {
      try {
        // Call the server action to fetch user data
        const result = await fetchUserData();

        if (result.success && result.userData) {
          // Update localStorage with the data from the server
          localStorage.setItem('name', result.userData.username);
          localStorage.setItem('role', result.userData.role);
          localStorage.setItem('userId', result.userData.userId);
          localStorage.setItem('gData', JSON.stringify(result.userData.purchasedGames || []));


        } else {
          console.error('Failed to synchronize user data:', result.message);
        }
      } catch (error) {
        console.error('Error synchronizing user data:', error);
      }
    };

    // Sync data when the component mounts
    syncUserData();

    // Also sync data when the page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && localStorage.getItem('token')) {
        syncUserData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Clean up event listener
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default UserDataSynchronizer;
