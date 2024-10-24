import React, { useState } from 'react';
import { Popconfirm } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import SubSubtask from './SubSubtask';
import '../../styles/TaskItem.css';

const TaskItem = ({ task, index, onDelete, onAddSubSubtask, category }) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [showSubSubtasks, setShowSubSubtasks] = useState({});

  const handleToggleSubtasks = () => {
    setShowSubtasks(!showSubtasks);
  };

  const handleToggleSubSubtasks = (subtaskId) => {
    setShowSubSubtasks((prevState) => ({
      ...prevState,
      [subtaskId]: !prevState[subtaskId],
    }));
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
          <div
            className="task-item"
            style={{
              border: task.subtasks && task.subtasks.length > 0 ? '4px solid #ccc' : '4px solid #ffff'
            }}
          >
            <span className="task-description" onClick={handleToggleSubtasks}>
              {task.description}
            </span>
            <Popconfirm
              title="Are you sure to delete this task?"
              onConfirm={() => onDelete(task.id, category, 'task')}
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
                    <div key={subtask.id}>
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
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              border: subtask.subsubtasks && subtask.subsubtasks.length > 0 ? '2px solid #1E3E62' : '2px solid #ffff',
                            }}
                          >
                            <span onClick={() => handleToggleSubSubtasks(subtask.id)}>
                              {subtask.description}
                            </span>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <PlusOutlined
                                onClick={() => onAddSubSubtask(subtask)}
                                style={{ color: '#52c41a', cursor: 'pointer' }}
                              />
                              <Popconfirm
                                title="Are you sure to delete this subtask?"
                                onConfirm={() => onDelete(subtask.id, category, 'subtask')}
                                okText="Yes"
                                cancelText="No"
                              >
                                <DeleteOutlined
                                  style={{ color: 'red', cursor: 'pointer' }}
                                />
                              </Popconfirm>
                            </div>
                          </div>
                        )}
                      </Draggable>
                      {showSubSubtasks[subtask.id] && subtask.subsubtasks && (
                        <div className="subsubtasks-container">
                          {subtask.subsubtasks.map((subsubtask) => (
                            <SubSubtask
                              key={subsubtask.id}
                              subsubtask={subsubtask}
                              category={category}
                              onDelete={onDelete}
                            />
                          ))}
                        </div>
                      )}
                    </div>
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

