import authApi from '../../src/api/authApi';

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
    expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:5000/auth/register', expect.any(Object));
  });

  it('should throw an error when signup fails', async () => {
    const mockUserData = { username: 'testuser', email: 'test@example.com', password: 'password' };
    const mockErrorMessage = 'Something went wrong';
    
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: mockErrorMessage }),
    });

    await expect(authApi.SignupUser(mockUserData)).rejects.toThrow(mockErrorMessage);
  });
});
