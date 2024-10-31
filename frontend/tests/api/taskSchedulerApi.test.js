import taskSchedulerApi from '../../src/api/taskSchedulerApi';

describe('taskSchedulerApi - getTimeSuggestions', () => {
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

  it('should get time suggestions successfully', async () => {
    const mockTaskData = { description: 'New Task', duration: 30 };
    const mockSuggestionsData = [{ date: '2024-11-06', time: '10:00 AM', justification: 'Best time' }];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ suggestions: mockSuggestionsData }),
    });

    const data = await taskSchedulerApi.getTimeSuggestions(mockTaskData);
    expect(data).toEqual(mockSuggestionsData);
    expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:5000/api/scheduler/schedule-task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer mockToken`,
      },
      body: JSON.stringify(mockTaskData),
    });
  });

  it('should throw an error when getting time suggestions fails', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Failed to fetch time suggestions' }),
    });

    await expect(taskSchedulerApi.getTimeSuggestions({ description: 'Task', duration: 30 }))
      .rejects.toThrow('Failed to fetch time suggestions');
  });
});
