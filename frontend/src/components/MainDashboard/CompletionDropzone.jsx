import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import '../../styles/MainDashboard/CompletedDropzone.css';

/**
 * CompletedDropzone component provides a target for tasks to be dragged
 * and marked as completed. It changes style when a task is dragged over it.
 *
 * @component
 * @example
 * <CompletedDropzone />
 *
 * @returns {JSX.Element} A droppable area for marking tasks as complete.
 */
const CompletedDropzone = () => {
  return (
    <Droppable droppableId="completed">
      {(provided, snapshot) => (
        <div
          className="completed-dropzone"
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            backgroundColor: snapshot.isDraggingOver ? '#93b0a5' : 'white',
            transition: 'background-color 1s ease',
          }}
        >
          <h3 className="todo-list-title patrick-hand-regular">Completed</h3>
          <p>Drag here to complete tasks</p>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default CompletedDropzone;
