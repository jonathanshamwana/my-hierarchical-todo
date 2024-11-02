import React, { useState, useContext } from 'react';
import { Popconfirm, Input, message } from 'antd';
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Subtask from './Subtask';
import tasksApi from '../../api/tasksApi';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/MainDashboard/TaskItem.css';

/**
 * TaskItem component - Renders an individual task with options to add/edit subtasks,
 * toggle subtask visibility, and delete the task. 
 * Subtasks can be further expanded to display nested sub-subtasks.
 *
 * @param {object} task - Task data, including any associated subtasks.
 * @param {number} index - Position of the task within the list for drag-and-drop ordering.
 * @param {function} onDelete - Callback to delete the task or its nested items.
 * @param {function} onAddSubtask - Callback to add a new subtask to this task.
 * @param {function} onAddSubSubtask - Callback to add a sub-subtask under a subtask.
 * @param {string} category - The category to which this task belongs.
 * @param {function} refreshTasks - Function to refresh the list of tasks after updates.
 * 
 * @component
 * @example
 * <TaskItem 
 *   task={taskData} 
 *   index={0} 
 *   onDelete={handleDelete} 
 *   onAddSubtask={handleAddSubtask} 
 *   onAddSubSubtask={handleAddSubSubtask} 
 *   category="Running" 
 *   refreshTasks={fetchTasks} 
 * />
 */
const TaskItem = ({ task, index, onDelete, onAddSubtask, onAddSubSubtask, category, refreshTasks }) => {
  const [showSubtasks, setShowSubtasks] = useState(false); 
  const [isEditing, setIsEditing] = useState(null); 
  const [editValue, setEditValue] = useState(''); 
  const { token } = useContext(AuthContext);

  // Toggles the visibility of subtasks within this task
  const handleToggleSubtasks = () => setShowSubtasks(!showSubtasks);

  // Initiates edit mode for a task or subtask
  const startEditing = (item, type) => {
    setIsEditing({ id: item.id, type });
    setEditValue(item.description);
  };

  // Saves edits to the task or subtask description
  const saveEdit = async () => {
    try {
      await tasksApi.UpdateItem(isEditing.id, isEditing.type, editValue, token);
      setIsEditing(null); 
      await refreshTasks();
      message.success("Task updated successfully");
    } catch (e) {
      console.error("Failed to update task");
      message.error("Failed to update task");
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
            <PlusOutlined onClick={() => onAddSubtask(task)} style={{ color: '#52c41a', cursor: 'pointer', marginLeft: '5px' }} />
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

          {/* Render nested subtasks if expanded */}
          {showSubtasks && task.subtasks && (
            <Droppable droppableId={`subtasks-${task.id}`} type="subtask">
              {(provided) => (
                <div className="subtasks-container" ref={provided.innerRef} {...provided.droppableProps}>
                  {task.subtasks.map((subtask, subIndex) => (
                    <Subtask
                      key={subtask.id}
                      subtask={subtask}
                      index={subIndex}
                      onAddSubSubtask={onAddSubSubtask}
                      onDelete={onDelete}
                      category={category}
                      refreshTasks={refreshTasks}
                    />
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
