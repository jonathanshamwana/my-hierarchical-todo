import React, { useState } from 'react';
import { Popconfirm, Input, message } from 'antd';
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import SubSubtask from './SubSubtask';
import tasksApi from '../../api/tasksApi';
import '../../styles/TaskItem.css';

const TaskItem = ({ task, index, onDelete, onAddSubtask, onAddSubSubtask, category, refreshTasks }) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [showSubSubtasks, setShowSubSubtasks] = useState({});
  const [isEditing, setIsEditing] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleToggleSubtasks = () => {
    setShowSubtasks(!showSubtasks);
  };

  const handleToggleSubSubtasks = (subtaskId) => {
    setShowSubSubtasks((prevState) => ({
      ...prevState,
      [subtaskId]: !prevState[subtaskId],
    }));
  };

  const startEditing = (item, type) => {
    setIsEditing({ id: item.id, type });
    setEditValue(item.description);
  };

  const saveEdit = async () => {
    try {
      await tasksApi.UpdateItem(isEditing.id, isEditing.type, editValue);
      setIsEditing(null);
      await refreshTasks();
      message.success("Task updated successfully")
    } catch (e) {
      console.error("Failed to update task")
      message.error("Failed to update task")
    } 
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
            {isEditing && isEditing.id === task.id && isEditing.type === 'task' ? (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={saveEdit}
                onPressEnter={saveEdit}
              />
            ) : (
              <span className="task-description" onClick={handleToggleSubtasks}>
                {task.description}
              </span>
            )}
            <PlusOutlined onClick={() => onAddSubtask(task)} style={{ color: '#52c41a', cursor: 'pointer', marginLeft: '5px' }}/>
            <EditOutlined onClick={() => startEditing(task, 'task')} style={{ marginLeft: '10px', cursor: 'pointer' }} />
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
                            {isEditing && isEditing.id === subtask.id && isEditing.type === 'subtask' ? (
                              <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={saveEdit}
                                onPressEnter={saveEdit}
                              />
                            ) : (
                              <span onClick={() => handleToggleSubSubtasks(subtask.id)}>
                                {subtask.description}
                              </span>
                            )}
                            <EditOutlined onClick={() => startEditing(subtask, 'subtask')} style={{ marginLeft: '10px', cursor: 'pointer' }} />
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <PlusOutlined
                                onClick={() => onAddSubSubtask(subtask)}
                                style={{ color: '#52c41a', cursor: 'pointer', marginLeft: '5px' }}
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
                        {subtask.subsubtasks.map((subsubtask) => {
                          console.log(subsubtask.description);
                          return (
                            <SubSubtask
                              key={subsubtask.id}
                              subsubtask={subsubtask}
                              category={category}
                              onDelete={onDelete}
                              refreshTasks={refreshTasks}
                            />
                          );
                        })}
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

