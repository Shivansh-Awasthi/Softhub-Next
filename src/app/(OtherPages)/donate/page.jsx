import { Suspense } from 'react';
import Donate from './Donate';

export const metadata = {
  title: 'Donate - ToxicGames',
  description: 'Support ToxicGames development and help us bring more games to you',
};

export default function DonatePage() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <div className="container mx-auto">
        <Donate />
      </div>
    </Suspense>
  );
}
