import authApi from '../../src/api/authApi';

const API_BASE_URL = 'http://127.0.0.1:5000';

describe('authApi - SignupUser', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should sign up a user successfully', async () => {
    const mockUserData = { username: 'testuser', email: 'test@example.com', password: 'password' };
    const mockResponseData = { message: 'User registered successfully' };
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponseData,
    });

    const data = await authApi.SignupUser(mockUserData);
    expect(data).toEqual(mockResponseData);
    expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/auth/register`, expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockUserData),
    }));
  });

  it('should throw an error with the correct message when signup fails', async () => {
    const mockUserData = { username: 'testuser', email: 'test@example.com', password: 'password' };
    const mockErrorMessage = 'User already exists';

    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: mockErrorMessage }),
    });

    await expect(authApi.SignupUser(mockUserData)).rejects.toThrow(mockErrorMessage);
  });

  it('should throw a generic error when the error message is not provided', async () => {
    const mockUserData = { username: 'testuser', email: 'test@example.com', password: 'password' };

    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),  // No error message provided in response
    });

    await expect(authApi.SignupUser(mockUserData)).rejects.toThrow('Something went wrong');
  });

  it('should handle network errors gracefully', async () => {
    const mockUserData = { username: 'testuser', email: 'test@example.com', password: 'password' };
    const networkError = new Error('Network Error');
    
    global.fetch.mockRejectedValueOnce(networkError);

    await expect(authApi.SignupUser(mockUserData)).rejects.toThrow('Network Error');
  });
});
