import React from 'react';
import TaskItem from './TaskItem'; 
import '../../styles/TodoList.css';
import { Droppable } from 'react-beautiful-dnd';

const TodoList = ({ title, tasks, onDelete, onAddSubSubtask }) => {
  return (
    <Droppable droppableId={title.toLowerCase()}>
      {(provided, snapshot) => (
        <div
          className="todo-list"
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            backgroundColor: snapshot.isDraggingOver ? 'lightblue' : 'white',
            transition: 'background-color 0.2s ease',
          }}
        >
          <h2 className="todo-list-title patrick-hand-regular">{title}</h2>
          <div className="title-divider"></div>
          
          <div className="todo-list-tasks">
            {tasks.map((task, index) => (
              <TaskItem key={task.id} task={task} index={index} onDelete={onDelete} category={title} onAddSubSubtask={onAddSubSubtask} />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default TodoList;

