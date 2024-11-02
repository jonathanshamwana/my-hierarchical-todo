import userApi from '../../src/api/userApi';

describe('userApi - getUserDetails', () => {
  beforeAll(() => {
    // Mock sessionStorage globally
    Object.defineProperty(global, 'sessionStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  beforeEach(() => {
    global.fetch = jest.fn(); // Mock the fetch function
    global.sessionStorage.setItem('token', 'mockToken'); // Set mock token in sessionStorage
  });

  afterEach(() => {
    jest.resetAllMocks();
    global.sessionStorage.clear();
  });

  it('should fetch user details successfully', async () => {
    const mockUserData = { id: 1, username: 'testuser', email: 'test@example.com' };
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData,
    });

    const data = await userApi.getUserDetails('mockToken');
    expect(data).toEqual(mockUserData);
    expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:5000/auth/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer mockToken`,
        'Content-Type': 'application/json',
      },
    });
  });

  it('should throw an error when fetching user details fails', async () => {
    const mockErrorMessage = 'Failed to fetch user details';
    
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: mockErrorMessage }),
    });

    await expect(userApi.getUserDetails('mockToken')).rejects.toThrow(mockErrorMessage);
  });
});
