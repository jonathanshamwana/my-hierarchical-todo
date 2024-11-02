import React, { useState } from 'react';
import '../../styles/MainDashboard/AddTaskForm.css';

/**
 * AddTaskForm component - Renders a form for adding tasks, subtasks, and sub-subtasks.
 * @param {array} categories - Task categories (e.g., 'Running', 'Nutrition').
 * @param {function} onAddTask - Handler function for adding tasks.
 * @param {string} formType - Specifies the form type: 'task', 'subtask', or 'subsubtask'.
 *
 * @returns {JSX.Element} A form with fields relevant to the form type for task addition.
 */
const AddTaskForm = ({ categories, onAddTask, formType = 'task' }) => {
  const [taskName, setTaskName] = useState('');
  const [subtasks, setSubtasks] = useState([{ id: 1, name: '' }]);
  const [subSubtasks, setSubSubtasks] = useState([{ id: 1, name: '' }]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Updates the state of subtasks when a subtask field changes
  const handleSubtaskChange = (index, value) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index].name = value;
    setSubtasks(newSubtasks);
  };

  // Updates the state of sub-subtasks when a sub-subtask field changes
  const handleSubSubtaskChange = (index, value) => {
    const newSubSubtasks = [...subSubtasks];
    newSubSubtasks[index].name = value;
    setSubSubtasks(newSubSubtasks);
  };

  // Adds a new empty subtask to the form
  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { id: subtasks.length + 1, name: '' }]);
  };

  // Adds a new empty sub-subtask to the form
  const handleAddSubSubtask = () => {
    setSubSubtasks([...subSubtasks, { id: subSubtasks.length + 1, name: '' }]);
  };

  // Removes a specified subtask by index
  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  // Removes a specified sub-subtask by index
  const handleRemoveSubSubtask = (index) => {
    setSubSubtasks(subSubtasks.filter((_, i) => i !== index));
  };

  // Handles form submission based on form type and resets form fields
  const handleSubmit = (e) => {
    e.preventDefault();

    if (formType === 'task' && (!taskName.trim() || !selectedCategory)) {
      console.log("Form data invalid.");
      return; 
    }

    if (formType === 'subtask' && subtasks.length > 0) {
      subtasks.forEach((subtask) => {
        onAddTask({ description: subtask.name, subtasks: [] });
      });
    } else if (formType === 'subsubtask' && subSubtasks.length > 0) {
      subSubtasks.forEach((subSubtask) => {
        onAddTask({ description: subSubtask.name, subtasks: [], subSubtasks: [] });
      });
      setSubSubtasks([{ id: 1, name: '' }]);
    } else if (taskName.trim() && (formType !== 'task' || selectedCategory)) {
      onAddTask({
        description: taskName,
        subtasks,
        subSubtasks: [],
        category: selectedCategory,
      });
      setTaskName('');
      setSubtasks([{ id: 1, name: '' }]);
      setSelectedCategory('');
    } else {
      console.log("Form data invalid.");
    }
  };

  return (
    <div className="add-task-form">
      <h2>
        {formType === 'task' ? 'Add New Task' : formType === 'subtask' ? 'Add New Subtask' : 'Add New Sub-Subtask'}
      </h2>
      <form onSubmit={handleSubmit}>
        
        {/* Main task name and category selection for 'task' form type */}
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

        {/* Subtasks form for 'subtask' type */}
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

        {/* Sub-subtasks form for 'subsubtask' type */}
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



