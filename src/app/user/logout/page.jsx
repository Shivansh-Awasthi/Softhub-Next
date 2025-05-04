import LogoutComponent from './LogoutComponent';

export const metadata = {
  title: 'Logout - ToxicGames',
  description: 'Logging out from ToxicGames',
};

export default async function LogoutPage() {
  // This is a server component that passes control to the client component
  // No API calls needed on initial load for logout page

  return (
    <div className="py-8">
      <LogoutComponent />
    </div>
  );
}
