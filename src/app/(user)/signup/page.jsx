import SignupForm from './SignupForm';

export const metadata = {
  title: 'Sign Up - ToxicGames',
  description: 'Create a new account on ToxicGames',
};

export default function SignupPage() {
  return (
    <div className="py-8">
      <SignupForm />
    </div>
  );
}
