import LoginForm from './LoginForm';

export const metadata = {
  title: 'Login - ToxicGames',
  description: 'Sign in to your ToxicGames account',
};

// This is a server component that renders the login form
export default async function LoginPage() {
  return (
    <div className="py-8">
      <LoginForm />
    </div>
  );
}
