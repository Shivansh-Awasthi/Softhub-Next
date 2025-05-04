import LogoutComponent from './LogoutComponent';

export const metadata = {
  title: 'Logout - ToxicGames',
  description: 'Logging out from ToxicGames',
};

export default function LogoutPage() {
  return (
    <div className="py-8">
      <LogoutComponent />
    </div>
  );
}
