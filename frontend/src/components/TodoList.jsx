import React from 'react';
import TaskItem from './TaskItem'; 
import '../styles/TodoList.css';

const TodoList = ({ title, tasks }) => {
  return (
    <div className="todo-list">
      <h2 className="todo-list-title">{title}</h2>
      <div className="todo-list-items">
        {tasks.map((task, index) => (
          <TaskItem key={index} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TodoList;
