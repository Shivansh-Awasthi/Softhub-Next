import LoginForm from './LoginForm';

export const metadata = {
  title: 'Login - ToxicGames',
  description: 'Sign in to your ToxicGames account',
};

export default function LoginPage() {
  return (
    <div className="py-8">
      <LoginForm />
    </div>
  );
}
