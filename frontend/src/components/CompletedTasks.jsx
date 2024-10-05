import React, { useEffect, useState } from 'react';
import '../styles/CompletedTasks.css'; 

const CompletedTasks = () => {
    const [completedTasks, setCompletedTasks] = useState([]);
  
    useEffect(() => {
      fetch('http://127.0.0.1:5000/api/tasks/completed')
        .then((response) => response.json())
        .then((data) => setCompletedTasks(data))
        .catch((error) => console.error('Error fetching completed tasks:', error));
    }, []);
  
    return (
      <div className="completed-tasks-container">
        <h2>Completed Tasks</h2>
        <div>
          {completedTasks.map((task) => (
            <div key={task.id} className="completed-task-item">
              <h3 className="task-title">{task.description}</h3>
              <p className="completion-date">Completed on: {new Date(task.completion_date).toLocaleString()}</p>
              <h4 className="subtasks-title">Subtasks:</h4>
              <ul className="subtask-list">
                {/* Check if task.subtasks exists and is an array before mapping */}
                {Array.isArray(task.subtasks) && task.subtasks.length > 0 ? (
                  task.subtasks.map((subtask, index) => (
                    <li key={index} className="subtask-item">{subtask}</li>
                  ))
                ) : (
                  <li className="subtask-item">No subtasks</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default CompletedTasks;