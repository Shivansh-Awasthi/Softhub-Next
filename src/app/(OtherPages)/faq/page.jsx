import Faq from './Faq';

export const metadata = {
  title: 'FAQ - ToxicGames',
  description: 'Frequently Asked Questions about ToxicGames',
};

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Faq />
    </div>
  );
}
