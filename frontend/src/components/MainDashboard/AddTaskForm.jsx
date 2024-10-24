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
    if (taskName.trim() !== '' && (selectedCategory !== '' || formType !== 'task')) {
      const newTask = {
        description: taskName,
        subtasks: formType === 'task' ? subtasks : [],
        subSubtasks: formType === 'subsubtask' ? subSubtasks : [],
      };

      if (formType === 'task') {
        newTask.category = selectedCategory;
      }

      onAddTask(newTask);

      setTaskName('');
      setSubtasks([{ id: 1, name: '' }]);
      setSubSubtasks([{ id: 1, name: '' }]);
      setSelectedCategory('');
    }
  };

  return (
    <div className="add-task-form">
      <h2>{formType === 'task' ? 'Add New Task' : 'Add New Sub-Subtask'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder={formType === 'task' ? 'Task name' : 'Sub-Subtask 1'}
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </div>

        {formType === 'task' && (
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

        {formType === 'subsubtask' && (
          <div>
            {subSubtasks.map((subSubtask, index) => (
              <div key={subSubtask.id} className="subtask-row">
                <input
                  type="text"
                  value={subSubtask.name}
                  onChange={(e) => handleSubSubtaskChange(index, e.target.value)}
                  placeholder={`Sub-Subtask ${index + 2}`}
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

        {formType === 'task' && (
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
        )}

        <button type="submit">
          Add {formType === 'task' ? 'Task' : formType === 'subtask' ? 'Subtask' : 'Sub-Subtask'}
        </button>
      </form>
    </div>
  );
};

export default AddTaskForm;

