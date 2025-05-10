import LoginForm from './LoginForm';

export const metadata = {
  title: 'Login - Toxic Games',
  description: 'Sign in to your Toxic Games account to access your purchased games and more.',
};

export default function LoginPage() {
  return (
    <div className="container mx-auto py-10">
      <LoginForm />
    </div>
  );
}
