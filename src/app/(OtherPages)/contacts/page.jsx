import { Suspense } from 'react';
import Contact from './contact';

export const metadata = {
  title: 'Contacts - ToxicGames',
  description: 'Contact information and support for ToxicGames',
};

export default function ContactsPage() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Contact />
      </div>
    </Suspense>
  );
}
