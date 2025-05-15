import { Suspense } from 'react';
import Faq from './Faq';

export const metadata = {
  title: 'FAQ - ToxicGames',
  description: 'Frequently Asked Questions about ToxicGames',
};

export default function FaqPage() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <div className="container mx-auto px-4 py-8">
        <Faq />
      </div>
    </Suspense>
  );
}
