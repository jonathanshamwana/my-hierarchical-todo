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

const DeleteSubtask = (subtaskId) => {
  const token = sessionStorage.getItem('token'); 

  fetch(`${API_BASE_URL}/api/tasks/subtasks/${subtaskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to delete subtask');
    }
    return response;
  });
};

const AddSubSubtask = (subtaskId, newSubSubtask) => {
  const token = sessionStorage.getItem('token'); 

  return fetch(`${API_BASE_URL}/api/tasks/subtasks/${subtaskId}/subsubtasks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newSubSubtask),
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to add sub-subtask');
    }
    return response.json();
  });
};

const DeleteSubSubtask = (subSubtaskId) => {
  const token = sessionStorage.getItem('token'); 

  console.log(`ENDPOINT: ${`${API_BASE_URL}/api/tasks/subsubtasks/${subSubtaskId}`}`)
  return fetch(`${API_BASE_URL}/api/tasks/subsubtasks/${subSubtaskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to delete sub-subtask');
    }
    return response;
  });
};

const CompleteTask = (taskId) => {
  const token = sessionStorage.getItem('token'); 
  
  return fetch(`${API_BASE_URL}/api/tasks/complete/${taskId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json', 
    }
  })
  .then((response) => {
    if (!response.ok) {
      return response.json().then(err => {
        throw new Error(err.message || 'Failed to complete task');
      });
    }
    return response.json();
  })
  .catch((error) => {
    console.error('Error completing task:', error);
    throw error; 
  });
};

export default { fetchTasks, AddTask, AddSubSubtask, DeleteSubSubtask, DeleteTask, DeleteSubtask, CompleteTask };
