import React from 'react';
import TaskItem from './TaskItem'; 
import { Droppable } from 'react-beautiful-dnd';
import '../../styles/MainDashboard/TodoList.css';

/**
 * TodoList component - Renders a list of tasks under a specified category with drag-and-drop support.
 * Each task can have nested subtasks, and the list background changes when a task is dragged over.
 * 
 * @param {string} title - The title/category of the todo list.
 * @param {array} tasks - Array of task objects to be displayed.
 * @param {function} onDelete - Callback to delete a task or its nested items.
 * @param {function} onAddSubtask - Callback to add a subtask to a specific task.
 * @param {function} onAddSubSubtask - Callback to add a sub-subtask under a subtask.
 * @param {function} refreshTasks - Function to refresh the list of tasks after updates.
 * 
 * @component
 * @example
 * <TodoList 
 *   title="Running" 
 *   tasks={runningTasks} 
 *   onDelete={handleDelete} 
 *   onAddSubtask={handleAddSubtask} 
 *   onAddSubSubtask={handleAddSubSubtask} 
 *   refreshTasks={fetchTasks} 
 * />
 */
const TodoList = ({ title, tasks, onDelete, onAddSubtask, onAddSubSubtask, refreshTasks }) => {
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
          {/* List Title */}
          <h2 className="todo-list-title patrick-hand-regular">{title}</h2>
          <div className="title-divider"></div>
          
          {/* List of Task Items */}
          <div className="todo-list-tasks">
            {tasks.map((task, index) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                index={index} 
                onDelete={onDelete} 
                category={title} 
                onAddSubtask={onAddSubtask} 
                onAddSubSubtask={onAddSubSubtask} 
                refreshTasks={refreshTasks} 
              />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default TodoList;
