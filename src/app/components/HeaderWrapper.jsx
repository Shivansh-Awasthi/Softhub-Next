'use client';

import React from 'react';
import Header from './Header';

// This wrapper is needed because Header is a client component
// and we need to include it in the server-side layout
const HeaderWrapper = () => {
  return <Header showSearchBar={true} />;
};

export default HeaderWrapper;
