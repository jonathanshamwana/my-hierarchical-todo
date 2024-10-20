const API_BASE_URL = 'http://127.0.0.1:5000';

const fetchTasks = () => {
    return fetch(`${API_BASE_URL}/api/tasks/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      });
  };
  
const AddTask = (newTask) => {
    return fetch(`${API_BASE_URL}/api/tasks/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      return response.json();
    });
  };

const DeleteTask = (taskId) => {
    return fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'DELETE',
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      return response;
    });
  };

const CompleteTask = (taskId) => {
    return fetch(`${API_BASE_URL}/api/tasks/complete/${taskId}`, {
      method: 'POST',
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Failed to complete task');
      }
      return response;
    });
  };

  
export { fetchTasks, AddTask, DeleteTask, CompleteTask };
export default { fetchTasks, AddTask, DeleteTask, CompleteTask };