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

const AddTask = async (newTask) => {
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

const DeleteTask = async (taskId) => {
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

const DeleteSubtask = async (subtaskId) => {
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

const AddSubSubtask = async (subtaskId, newSubSubtask) => {
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

const DeleteSubSubtask = async (subSubtaskId) => {
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

const CompleteTask = async (taskId) => {
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

const UpdateItem = async (itemId, itemType, newDescription) => {
  const token = sessionStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/api/tasks/update`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: itemId,
      type: itemType,
      description: newDescription
    })
  });
  if (!response.ok) {
    throw new Error('Failed to update item');
  }
  return await response.json();
};

export default { fetchTasks, AddTask, AddSubSubtask, DeleteSubSubtask, DeleteTask, DeleteSubtask, CompleteTask, UpdateItem };
