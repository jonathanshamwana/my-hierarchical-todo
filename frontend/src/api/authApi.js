const API_BASE_URL = 'http://127.0.0.1:5000';

/**
 * Registers a new user with the provided user data.
 * @async
 * @function
 * @param {Object} userData - User information for signup (username, email, and password).
 * @returns {Object} The response data from the server if signup is successful.
 * @throws {Error} An error if the signup request fails.
 * @example
 * const userData = { username: 'JohnDoe', email: 'john@example.com', password: 'securePass123' };
 * await SignupUser(userData);
 */
const SignupUser = async (userData) => {
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

/**
 * Logs in an existing user with provided credentials and updates the authentication state.
 * @async
 * @function
 * @param {Object} credentials - User's login credentials (email and password).
 * @param {Function} login - The login function from AuthContext to set the authentication token.
 * @returns {Object} The response data from the server if login is successful.
 * @throws {Error} An error if the login request fails.
 * @example
 * const credentials = { email: 'john@example.com', password: 'securePass123' };
 * await LoginUser(credentials, login);
 */
const LoginUser = async (credentials, login) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      login(data.token); // Save the user token in session storage
      window.location.href = '/dashboard'; // Redirect to dashboard after login
    } else {
      console.error('Login failed:', data.message);
    }

    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export default { LoginUser, SignupUser };
