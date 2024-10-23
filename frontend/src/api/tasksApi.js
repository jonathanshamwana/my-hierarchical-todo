const API_BASE_URL = 'http://127.0.0.1:5000';

const fetchTasks = async () => {
  const token = sessionStorage.getItem('token'); 
  console.log('Token:', token);
  
  return fetch(`${API_BASE_URL}/api/tasks/`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      }
  })
  .then((response) => {
      if (!response.ok) {
          throw new Error('Failed to fetch tasks');
      }
      return response.json();
  });
};

const AddTask = (newTask) => {
  const token = sessionStorage.getItem('token'); 
  console.log('Token:', token);
  console.log('New Task Data:', newTask);
  console.log(`${API_BASE_URL}/api/tasks/`)

  return fetch(`${API_BASE_URL}/api/tasks/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
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
  const token = sessionStorage.getItem('token'); 

  return fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
    return response;
  });
};

const CompleteTask = (taskId) => {
  const token = sessionStorage.getItem('token'); 

  return fetch(`${API_BASE_URL}/api/tasks/complete/${taskId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to complete task');
    }
    return response;
  });
};

export default { fetchTasks, AddTask, DeleteTask, CompleteTask };
