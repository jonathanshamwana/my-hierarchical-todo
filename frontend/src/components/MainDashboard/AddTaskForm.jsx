import React, { useState } from 'react';
import '../../styles/AddTaskForm.css';

const AddTaskForm = ({ categories, onAddTask, formType = 'task' }) => {
  const [taskName, setTaskName] = useState('');
  const [subtasks, setSubtasks] = useState([{ id: 1, name: '' }]);
  const [subSubtasks, setSubSubtasks] = useState([{ id: 1, name: '' }]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSubtaskChange = (index, value) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index].name = value;
    setSubtasks(newSubtasks);
  };

  const handleSubSubtaskChange = (index, value) => {
    const newSubSubtasks = [...subSubtasks];
    newSubSubtasks[index].name = value;
    setSubSubtasks(newSubSubtasks);
  };

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { id: subtasks.length + 1, name: '' }]);
  };

  const handleAddSubSubtask = () => {
    setSubSubtasks([...subSubtasks, { id: subSubtasks.length + 1, name: '' }]);
  };

  const handleRemoveSubtask = (index) => {
    const newSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(newSubtasks);
  };

  const handleRemoveSubSubtask = (index) => {
    const newSubSubtasks = subSubtasks.filter((_, i) => i !== index);
    setSubSubtasks(newSubSubtasks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formType === 'subtask' && subtasks.length > 0) {
      subtasks.forEach((subtask) => {
        const newSubtask = {
          description: subtask.name,
          subtasks: []
        };
        onAddTask(newSubtask)
      })
    }
    else if (formType === 'subsubtask' && subSubtasks.length > 0) {
      // Create a task object for each of the subtasks the user inputrted
      subSubtasks.forEach((subSubtask) => {
        const newSubSubtask = {
          description: subSubtask.name,
          subtasks: [],
          subSubtasks: [],
        };
        // Add the subtask to the database
        onAddTask(newSubSubtask);
      })

      // Reset the subtasks array to be used in a future form
      setSubSubtasks([{ id: 1, name: '' }]);
    } else if (taskName.trim() !== '' && (formType !== 'task' || selectedCategory !== '')) {
      
      // Create an object for the new task and its details 
      const newTask = {
        description: taskName,
        subtasks,
        subSubtasks: [],
        category: selectedCategory,
      };

      // Add the task object (which optionally contains its subtasks)
      onAddTask(newTask);

      // Reset form fields for tasks
      setTaskName('');
      setSubtasks([{ id: 1, name: '' }]);
      setSelectedCategory('');
    } else {
      console.log("Form data invalid.")
    }

  };
  

  return (
    <div className="add-task-form">
      <h2>
        {formType === 'task'
          ? 'Add New Task'
          : formType === 'subtask'
          ? 'Add New Subtask'
          : 'Add New Sub-Subtask'}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Show task name input only for the task form */}
        {formType === 'task' && (
          <div>
            <input
              placeholder="Task name"
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
            {subtasks.map((subtask, index) => (
              <div key={subtask.id} className="subtask-row">
                <input
                  type="text"
                  value={subtask.name}
                  onChange={(e) => handleSubtaskChange(index, e.target.value)}
                  placeholder={`Subtask ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSubtask(index)}
                  className="remove-subtask-button"
                >
                  &times;
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddSubtask} className="add-subtask-button">
              Add Subtask
            </button>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={'category-selector'}
              required
            >
              <option value="">Task Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Show subtasks for 'subtask' form type */}
        {formType === 'subtask' && (
          <div>
            {subtasks.map((subtask, index) => (
              <div key={subtask.id} className="subtask-row">
                <input
                  type="text"
                  value={subtask.name}
                  onChange={(e) => handleSubtaskChange(index, e.target.value)}
                  placeholder={`Subtask ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSubtask(index)}
                  className="remove-subtask-button"
                >
                  &times;
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddSubtask} className="add-subtask-button">
              Add Subtask
            </button>
          </div>
        )}

        {/* Show sub-subtasks for 'subsubtask' form type */}
        {formType === 'subsubtask' && (
          <div>
            {subSubtasks.map((subSubtask, index) => (
              <div key={subSubtask.id} className="subtask-row">
                <input
                  type="text"
                  value={subSubtask.name}
                  onChange={(e) => handleSubSubtaskChange(index, e.target.value)}
                  placeholder={`Sub-Subtask ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSubSubtask(index)}
                  className="remove-subtask-button"
                >
                  &times;
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddSubSubtask} className="add-subtask-button">
              Add Sub-Subtask
            </button>
          </div>
        )}

        <button type="submit">
          Add {formType === 'task' ? 'Task' : formType === 'subtask' ? 'Subtasks' : 'Sub-Subtasks'}
        </button>
      </form>
    </div>
  );
};

export default AddTaskForm;

