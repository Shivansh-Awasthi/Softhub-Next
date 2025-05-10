import SignupForm from './SignupForm';

export const metadata = {
  title: 'Sign Up - Toxic Games',
  description: 'Create a new account on Toxic Games to access exclusive games and software.',
};

export default function SignupPage() {
  return (
    <div className="container mx-auto py-10">
      <SignupForm />
    </div>
  );
}
