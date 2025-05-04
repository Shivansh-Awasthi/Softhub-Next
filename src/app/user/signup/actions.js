'use server';

export async function signupUser(formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    // Use the server-side API URL
    const response = await fetch(`${process.env.API_URL}/api/user/signup`, {
      method: 'POST',
      headers: {
        'X-Auth-Token': 'my-secret-token-123',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
      cache: 'no-store',
    });

    // Parse the response
    const responseData = await response.json();

    if (!response.ok) {
      if (response.status === 409) {
        return { success: false, message: 'User already exists!' };
      }
      // Use the error message from the API if available
      return {
        success: false,
        message: responseData.message || 'Something went wrong. Please try again.'
      };
    }

    return { success: true, message: 'User created successfully!' };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}
