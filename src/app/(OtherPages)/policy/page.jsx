
import Policy from './Policy';

export const metadata = {
  title: 'Privacy Policy - ToxicGames',
  description: 'Privacy Policy and Terms of Service for ToxicGames',
};

export default function PolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Policy />
    </div>
  );
}
