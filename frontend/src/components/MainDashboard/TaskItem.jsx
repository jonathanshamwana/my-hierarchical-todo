import React, { useState } from 'react';
import { Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import '../../styles/TaskItem.css';

const TaskItem = ({ task, index, onDelete }) => {
  const [showSubtasks, setShowSubtasks] = useState(false);

  const handleToggleSubtasks = () => {
    setShowSubtasks(!showSubtasks);
  };

  return (
    <Draggable draggableId={`task-${task.id}`} index={index}>
      {(provided) => (
        <div
          className="task-item-container"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="task-item">
            <span className="task-description" onClick={handleToggleSubtasks}>
              {task.description}
            </span>
            <Popconfirm
              title="Are you sure to delete this task?"
              onConfirm={() => onDelete(task.id)}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined style={{ color: 'red', marginLeft: '10px' }} />
            </Popconfirm>
          </div>

          {showSubtasks && task.subtasks && (
            <Droppable droppableId={`subtasks-${task.id}`} type="subtask">
              {(provided) => (
                <div
                  className="subtasks-container"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {task.subtasks.map((subtask, subIndex) => (
                    <Draggable
                      key={subtask.id}
                      draggableId={`subtask-${subtask.id}`}
                      index={subIndex}
                    >
                      {(provided) => (
                        <div
                          className="subtask-item"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <span>{subtask.description}</span>
                          <Popconfirm
                            title="Are you sure to delete this subtask?"
                            onConfirm={() => onDelete(subtask.id)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <DeleteOutlined
                              style={{ color: 'red', marginLeft: '10px' }}
                            />
                          </Popconfirm>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskItem;
