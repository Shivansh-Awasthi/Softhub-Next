'use client';

import { useEffect } from 'react';

/**
 * A simple snow effect component that creates snowflakes on the page
 * @param {Object} props Component props
 * @param {number} props.count Number of snowflakes to create (default: 50)
 * @param {boolean} props.startAfterSidebar Whether to start the snow after the sidebar (default: true)
 * @returns {null} This component doesn't render any visible elements directly
 */
export default function SnowEffect({ count = 50, startAfterSidebar = true }) {
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Create container for snow
    const snowContainer = document.createElement('div');
    snowContainer.className = 'let-it-snow';

    // If startAfterSidebar is true, adjust the container position
    if (startAfterSidebar) {
      snowContainer.style.left = '240px'; // Sidebar width
      snowContainer.style.width = 'calc(100% - 240px)';
    }

    document.body.appendChild(snowContainer);

    // Create snowflakes
    for (let i = 0; i < count; i++) {
      createSnowflake(snowContainer);
    }

    // Cleanup function
    return () => {
      try {
        if (snowContainer && document.body.contains(snowContainer)) {
          document.body.removeChild(snowContainer);
        }
      } catch (error) {
        console.log('Error cleaning up snow effect:', error);
      }
    };
  }, [count, startAfterSidebar]);

  return null;
}

/**
 * Creates a single snowflake element and adds it to the container
 * @param {HTMLElement} container - The container to add the snowflake to
 */
function createSnowflake(container) {
  // Create snowflake element
  const snowflake = document.createElement('div');
  snowflake.className = 'snowflake';

  // Randomly choose between different snowflake characters
  const snowflakeChars = ['•', '❄', '❅', '❆', '*', '·'];
  const randomChar = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
  snowflake.innerHTML = randomChar;

  // Set random properties
  const size = Math.random() * 0.8 + 0.2; // Size between 0.2 and 1.0
  const startPositionX = Math.random() * 100; // Random horizontal position
  const fallDuration = Math.random() * 10 + 5; // Fall duration between 5-15s
  const shakeDuration = Math.random() * 5 + 2; // Shake duration between 2-7s
  const shakeDelay = Math.random() * 2; // Random delay for shake animation
  const fallDelay = Math.random() * 5; // Random delay for fall animation

  // Random shake amplitude (how far it moves side to side)
  const shakeAmplitude = Math.random() * 50 + 30; // Between 30-80px

  // Apply custom animation for this specific snowflake
  const styleSheet = document.styleSheets[0];
  const uniqueId = `snowflake-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  snowflake.id = uniqueId;

  // Create custom shake animation for this snowflake
  try {
    const shakeRule = `
      @keyframes snowflake-shake-${uniqueId} {
        0% { transform: translateX(0px); }
        50% { transform: translateX(${shakeAmplitude}px); }
        100% { transform: translateX(0px); }
      }
    `;
    styleSheet.insertRule(shakeRule, styleSheet.cssRules.length);

    // Apply styles
    Object.assign(snowflake.style, {
      opacity: Math.random() * 0.7 + 0.3, // Opacity between 0.3 and 1.0
      fontSize: `${Math.floor(15 * size)}px`,
      left: `${startPositionX}%`,
      animationName: `snowflakes-fall, snowflake-shake-${uniqueId}`,
      animationDelay: `${fallDelay}s, ${shakeDelay}s`,
      animationDuration: `${fallDuration}s, ${shakeDuration}s`,
    });
  } catch (e) {
    // Fallback if custom animation fails
    Object.assign(snowflake.style, {
      opacity: Math.random() * 0.7 + 0.3,
      fontSize: `${Math.floor(15 * size)}px`,
      left: `${startPositionX}%`,
      animationDelay: `${fallDelay}s, ${shakeDelay}s`,
      animationDuration: `${fallDuration}s, ${shakeDuration}s`,
    });
  }

  // Add to container
  container.appendChild(snowflake);
}
