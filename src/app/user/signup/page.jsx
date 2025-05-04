import SignupForm from './SignupForm';

export const metadata = {
  title: 'Sign Up - ToxicGames',
  description: 'Create a new account on ToxicGames',
};

// This is a server component that renders the signup form
export default async function SignupPage() {
  return (
    <div className="py-8">
      <SignupForm />
    </div>
  );
}
