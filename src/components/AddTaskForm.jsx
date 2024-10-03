import React, { useState } from 'react';
import '../styles/AddTaskForm.css';

const AddTaskForm = ({ categories, onAddTask }) => {
  const [taskName, setTaskName] = useState('');
  const [subtasks, setSubtasks] = useState([{ id: 1, name: '' }]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSubtaskChange = (index, value) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index].name = value;
    setSubtasks(newSubtasks);
  };

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { id: subtasks.length + 1, name: '' }]);
  };

  const handleRemoveSubtask = (index) => {
    const newSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(newSubtasks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskName.trim() !== '' && selectedCategory !== '') {
      onAddTask({ taskName, subtasks, category: selectedCategory });
      setTaskName('');
      setSubtasks([{ id: 1, name: '' }]);
      setSelectedCategory('');
    }
  };

  return (
    <div className="add-task-form">
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder='Task name'
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </div>
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
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default AddTaskForm;

