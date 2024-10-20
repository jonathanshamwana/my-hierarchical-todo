const API_BASE_URL = 'http://127.0.0.1:5000';

export const signupUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  if (response.ok) {
    sessionStorage.setItem('token', data.token); 
    window.location.href = '/dashboard';
  } else {
    console.error('Login failed:', data.message);
  }

  return data;
};