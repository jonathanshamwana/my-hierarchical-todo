import React, { useEffect, useState } from 'react';
import tasksApi from '../api/tasksApi';
import '../styles/CompletedTasks/CompletedTasks.css'; 

/**
 * CompletedTasks component displays all the tasks, subtasks and subsubtasks completed by the user
 * The user can choose to group the tasks by date or not
 * 
 * @component
 * @example
 * // Usage
 * <CompletedTasks />
 * 
 * @returns {JSX.Element} A list of horizontal cards for completed tasks
 */
const CompletedTasks = () => {
    const [completedTasks, setCompletedTasks] = useState([]);
    const [groupByDate, setGroupByDate] = useState(false);

    // Fetches completed tasks from the API and stores them by date 
    useEffect(() => {
      tasksApi.GetCompletedTasks()
        .then((data) => {
          const sortedData = data.sort(
            (a, b) => new Date(b.completion_date) - new Date(a.completion_date)
          );
          setCompletedTasks(sortedData);
        })
        .catch((error) => console.error('Error fetching completed tasks:', error));
    }, []);

    const toggleGroupByDate = () => {
      setGroupByDate(!groupByDate);
    };

    // Groups tasks by completion date if groupByDate is true, otherwise provides an ungrouped list
    const groupedTasks = groupByDate
      ? completedTasks.reduce((groups, task) => {
          const date = new Date(task.completion_date).toLocaleDateString();
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(task);
          return groups;
        }, {})
      : { All: completedTasks };

    return (
      <div className="completed-tasks-container">
        <div className="animated-background"></div>
        <h2 className="completed-tasks-heading">Completed Tasks</h2>
        {/* Button to toggle between grouped by date and ungrouped view */}
        <button className="group-by-date-button" onClick={toggleGroupByDate}>
          {groupByDate ? 'Ungroup' : 'Group by Date'}
        </button>
        
        <div>
          {/* Render tasks, either grouped by date or ungrouped */}
          {Object.entries(groupedTasks).map(([date, tasks]) => (
            <div key={date} className="date-group">
              {/* Show date as a heading if tasks are grouped by date */}
              {groupByDate && <h3 className="group-date">{date}</h3>}

              {/* Loop through tasks and render each completed task */}
              {tasks.map((task) => (
                <div key={task.id} className="completed-task-item">
                  <h3 className="task-title">{task.description}</h3>
                  <p className="completion-date">
                    Completed on: {new Date(task.completion_date).toLocaleString()}
                  </p>

                  {/* Render subtasks if available */}
                  <ul className="subtask-list">
                    {task?.subtasks.length > 0 ? (
                      task.subtasks.map((subtask) => (
                        <li key={subtask.id} className="subtask-item">
                          {subtask.description}

                           {/* Render sub-subtasks if available */}
                          {subtask.subsubtasks.length > 0 && (
                            <ul className="subsubtask-list">
                              {subtask.subsubtasks.map((subsubtask, index) => (
                                <li key={index} className="subsubtask-item">{subsubtask}</li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))
                    ) : (
                      <li className="subtask-item">No subtasks</li> // Display if no subtasks are available
                    )}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
};

export default CompletedTasks;

