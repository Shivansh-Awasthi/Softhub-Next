import Dmca from './Dmca';

export const metadata = {
  title: 'Copyright Holders (DMCA) - ToxicGames',
  description: 'Information for copyright holders and DMCA takedown requests',
};

export default function DmcaPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Dmca />
    </div>
  );
}
