import React, { useEffect, useState } from 'react';
import ParticlesBackground from '../components/General/ParticlesBackground';
import tasksApi from '../api/tasksApi';
import '../styles/CompletedTasks.css'; 

const CompletedTasks = () => {
    const [completedTasks, setCompletedTasks] = useState([]);
  
    useEffect(() => {
      tasksApi.GetCompletedTasks()
        .then((data) => setCompletedTasks(data))
        .catch((error) => console.error('Error fetching completed tasks:', error));
    }, []);
  
    return (
      <div className="completed-tasks-container">
        <div className="animated-background"></div>
        <ParticlesBackground />
        <h2 className="completed-tasks-heading ">Completed Tasks</h2>
        <div>
          {completedTasks.map((task) => (
            <div key={task.id} className="completed-task-item">
              <h3 className="task-title">{task.description}</h3>
              <p className="completion-date">Completed on: {new Date(task.completion_date).toLocaleString()}</p>
              <ul className="subtask-list">
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