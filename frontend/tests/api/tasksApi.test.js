import tasksApi from '../../src/api/tasksApi';

describe('tasksApi - fetchTasks', () => {
  let token = 'mockToken'; // Define a mock token

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
    global.fetch = jest.fn(); // Mock fetch
    global.sessionStorage.setItem('token', token); // Set token in sessionStorage
  });

  afterEach(() => {
    jest.resetAllMocks(); // Reset mocks after each test
    global.sessionStorage.clear(); // Clear sessionStorage
  });

  it('should fetch tasks successfully', async () => {
    const mockTasksData = [{ id: 1, description: 'Test Task' }];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasksData,
    });

    // Pass token explicitly to fetchTasks
    const data = await tasksApi.fetchTasks(token);
    expect(data).toEqual(mockTasksData);

    // Check if fetch was called with correct arguments
    expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:5000/api/tasks/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  });

  it('should throw an error when fetching tasks fails', async () => {
    const mockErrorMessage = 'Failed to fetch tasks';

    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: mockErrorMessage }),
    });

    // Expect fetchTasks to throw the mock error message
    await expect(tasksApi.fetchTasks(token)).rejects.toThrow(mockErrorMessage);
  });
});
