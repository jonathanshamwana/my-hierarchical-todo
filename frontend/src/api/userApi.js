const API_BASE_URL = 'http://127.0.0.1:5000';

/**
 * Fetches the authenticated user's details using their token.
 * @async
 * @function
 * @param {string} token - The JWT token for the authenticated user.
 * @returns {Object} The response data containing user information if successful.
 * @throws {Error} An error if the request fails.
 */
const getUserDetails = async (token) => {
    console.log("GETTING USER...")
    try {
        const response = await fetch(`${API_BASE_URL}/auth/user`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
        });

        const data = await response.json();
        console.log("DATA: ", data)

        if (!response.ok) {
        throw new Error(data.message || 'Something went wrong fetching user details');
        }

        return data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};

export default { getUserDetails };
