import Contact from './contact';

export const metadata = {
  title: 'Contacts - ToxicGames',
  description: 'Contact information and support for ToxicGames',
};

export default function ContactsPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <Contact />
    </div>
  );
}
