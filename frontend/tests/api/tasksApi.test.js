import tasksApi from '../../src/api/tasksApi';

describe('tasksApi - fetchTasks', () => {
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
    global.fetch = jest.fn();
    global.sessionStorage.setItem('token', 'mockToken');
  });

  afterEach(() => {
    jest.resetAllMocks();
    global.sessionStorage.clear();
  });

  it('should fetch tasks successfully', async () => {
    const mockTasksData = [{ id: 1, description: 'Test Task' }];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasksData,
    });

    const data = await tasksApi.fetchTasks();
    expect(data).toEqual(mockTasksData);
    expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:5000/api/tasks/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer mockToken`,
      },
    });
  });

  it('should throw an error when fetching tasks fails', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Failed to fetch tasks' }),
    });

    await expect(tasksApi.fetchTasks()).rejects.toThrow('Failed to fetch tasks');
  });
});
