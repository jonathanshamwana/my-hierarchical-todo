import React, { useState } from 'react';
import '../styles/TaskItem.css';

const TaskItem = ({ task }) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [showSubSubtasks, setShowSubSubtasks] = useState({});

  const handleToggleSubtasks = () => {
    setShowSubtasks(!showSubtasks); // Toggle subtasks visibility
  };

  const handleToggleSubSubtasks = (subtaskId) => {
    setShowSubSubtasks((prevState) => ({
      ...prevState,
      [subtaskId]: !prevState[subtaskId], // Toggle sub-subtasks visibility
    }));
  };

  return (
    <div>
      <div className="task-item" onClick={handleToggleSubtasks}>
        <p>{task.description}</p>
      </div>
      {showSubtasks && task.subtasks && (
        <div className="subtasks-container">
          {task.subtasks.map((subtask, index) => (
            <div key={index}>
              <div
                className="subtask-item"
                onClick={() => handleToggleSubSubtasks(subtask.id)}
              >
                <p>{subtask.description}</p>
              </div>
              {/* Show sub-subtasks when their parent subtask is clicked */}
              {showSubSubtasks[subtask.id] && subtask.subtasks && (
                <div className="subtasks-container">
                  {subtask.subtasks.map((subsubtask, subIndex) => (
                    <div key={subIndex} className="subtask-item sub-subtask">
                      <p>{subsubtask.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskItem;
