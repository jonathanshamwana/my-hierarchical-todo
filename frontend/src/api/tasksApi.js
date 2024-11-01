const API_BASE_URL = 'http://127.0.0.1:5000';

/**
 * Fetches all tasks for the authenticated user.
 * @async
 * @function
 * @param {string} token - Authentication token from AuthContext.
 * @returns {Promise<Object>} A promise that resolves to the fetched tasks.
 * @throws {Error} If the request fails.
 */
const fetchTasks = async (token) => {
  console.log("TOKEN", token)
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

/**
 * Adds a new task for the authenticated user.
 * @async
 * @function
 * @param {Object} newTask - The new task data.
 * @param {string} token - Authentication token from AuthContext.
 * @returns {Promise<Object>} A promise that resolves to the added task.
 * @throws {Error} If the request fails.
 */
const AddTask = async (newTask, token) => {
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

/**
 * Deletes a task by its ID.
 * @async
 * @function
 * @param {number} taskId - ID of the task to delete.
 * @param {string} token - Authentication token from AuthContext.
 * @returns {Promise<Response>} A promise that resolves if the task was deleted successfully.
 * @throws {Error} If the request fails.
 */
const DeleteTask = async (taskId, token) => {
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

/**
 * Adds a subtask to a specified task.
 * @async
 * @function
 * @param {number} taskId - ID of the task to add a subtask to.
 * @param {Object} newSubtask - The new subtask data.
 * @param {string} token - Authentication token from AuthContext.
 * @returns {Promise<Object>} A promise that resolves to the added subtask.
 * @throws {Error} If the request fails.
 */
const AddSubtask = async (taskId, newSubtask, token) => {
  return fetch(`${API_BASE_URL}/api/tasks/${taskId}/subtasks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newSubtask),
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to add subtask');
    }
    return response.json();
  });
}

/**
 * Deletes a specified subtask by its ID.
 * @async
 * @function
 * @param {number} subtaskId - ID of the subtask to delete.
 * @param {string} token - Authentication token from AuthContext.
 * @returns {Promise<Response>} A promise that resolves if the subtask was deleted successfully.
 * @throws {Error} If the request fails.
 */
const DeleteSubtask = async (subtaskId, token) => {
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

/**
 * Adds a sub-subtask to a specified subtask.
 * @async
 * @function
 * @param {number} subtaskId - ID of the subtask to add a sub-subtask to.
 * @param {Object} newSubSubtask - The new sub-subtask data.
 * @param {string} token - Authentication token from AuthContext.
 * @returns {Promise<Object>} A promise that resolves to the added sub-subtask.
 * @throws {Error} If the request fails.
 */
const AddSubSubtask = async (subtaskId, newSubSubtask, token) => {
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

/**
 * Deletes a specified sub-subtask by its ID.
 * @async
 * @function
 * @param {number} subSubtaskId - ID of the sub-subtask to delete.
 * @param {string} token - Authentication token from AuthContext.
 * @returns {Promise<Response>} A promise that resolves if the sub-subtask was deleted successfully.
 * @throws {Error} If the request fails.
 */
const DeleteSubSubtask = async (subSubtaskId, token) => {
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

/**
 * Marks a task as completed.
 * @async
 * @function
 * @param {number} taskId - ID of the task to mark as completed.
 * @param {string} token - Authentication token from AuthContext.
 * @returns {Promise<Object>} A promise that resolves if the task was marked completed.
 * @throws {Error} If the request fails.
 */
const CompleteTask = async (taskId, token) => {
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

/**
 * Marks a subtask as completed.
 * @async
 * @function
 * @param {number} subtaskId - ID of the subtask to mark as completed.
 * @param {string} token - Authentication token from AuthContext.
 * @returns {Promise<Object>} A promise that resolves if the subtask was marked completed.
 * @throws {Error} If the request fails.
 */
const CompleteSubtask = async (subtaskId, token) => {
  return fetch(`${API_BASE_URL}/api/tasks/subtasks/complete/${subtaskId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json', 
    }
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to complete subtask');
    }
    return response.json();
  });
};

/**
 * Marks a sub-subtask as completed.
 * @async
 * @function
 * @param {number} taskId - ID of the sub-subtask to mark as completed.
 * @param {string} token - Authentication token from AuthContext.
 * @returns {Promise<Object>} A promise that resolves if the sub-subtask was marked completed.
 * @throws {Error} If the request fails.
 */
const CompleteSubSubtask = async (subSubtaskId, token) => {
  return fetch(`${API_BASE_URL}/api/tasks/subsubtasks/complete/${subSubtaskId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json', 
    }
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to complete sub-subtask');
    }
    return response.json();
  });
};

/**
 * Updates the description of a task, subtask, or sub-subtask
 * @async
 * @function
 * @param {number} itmeId - ID of the task, subtask, or sub-subtask to mark as completed.
 * @param {string} ietmType - Whether we're updating a 'task', 'subtask', or 'subsubtask'
 * @param {string} newDescription - The new description of the item
 * @param {string} token - Authentication token from AuthContext.
 * @returns {Promise<Object>} A promise that resolves if the description was updated.
 * @throws {Error} If the request fails.
 */
const UpdateItem = async (itemId, itemType, newDescription, token) => {
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

/**
 * Fetches all of a user's completed tasks
 * @async
 * @function
 * @param {string} token - Authentication token from AuthContext.
 * @returns {Promise<Object>} A promise that resolves if the completed tasks we're fetched.
 * @throws {Error} If the request fails.
 */
const GetCompletedTasks = async (token) => {
  return fetch(`${API_BASE_URL}/api/tasks/completed`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to fetch completed tasks');
    }
    return response.json();
  });
};

/**
 * Updates the category of a top-level task (when dragged and dropped)
 * @async
 * @function
 * @param {number} taskId - ID of the task to mark as completed.
 * @param {number} newCategory - The ID of the new category of the task
 * @param {string} token - Authentication token from AuthContext.
 * @returns {Promise<Object>} A promise that resolves if the task was marked completed.
 * @throws {Error} If the request fails.
 */
const updateTaskCategory = async (taskId, newCategory, token) => {
  return fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ category: newCategory }),
  });
};

export default { 
  AddSubSubtask, 
  AddSubtask, 
  AddTask, 
  CompleteSubSubtask, 
  CompleteSubtask, 
  CompleteTask, 
  DeleteSubSubtask, 
  DeleteSubtask, 
  DeleteTask, 
  fetchTasks, 
  GetCompletedTasks, 
  UpdateItem, 
  updateTaskCategory 
};
