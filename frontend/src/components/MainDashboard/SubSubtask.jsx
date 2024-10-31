import React, { useState } from 'react';
import { Input, Popconfirm, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Draggable } from 'react-beautiful-dnd';
import tasksApi from '../../api/tasksApi';

/**
 * SubSubtask component - Renders an editable, draggable sub-subtask item
 * with options to edit or delete.
 * 
 * @param {object} subsubtask - The sub-subtask data to render.
 * @param {number} index - The position of this item within its list.
 * @param {function} onDelete - Callback for deleting the sub-subtask.
 * @param {string} category - The category of the parent task.
 * @param {function} refreshTasks - Refreshes the list of tasks after an update.
 * 
 * @component
 * @example
 * <SubSubtask 
 *   subsubtask={subsubtask} 
 *   index={index} 
 *   onDelete={handleDeleteSubSubtask} 
 *   category="Running" 
 *   refreshTasks={fetchTasks} 
 * />
 */
const SubSubtask = ({ subsubtask, index, onDelete, category, refreshTasks }) => {
  const [isEditing, setIsEditing] = useState(false); // Controls edit mode
  const [editValue, setEditValue] = useState(subsubtask.description); // Holds input value for editing

  // Initiates edit mode
  const startEditing = () => setIsEditing(true);

  // Saves edited description to the database
  const saveEdit = async () => {
    if (editValue.trim()) {
      try {
        await tasksApi.UpdateItem(subsubtask.id, 'subsubtask', editValue);
        setIsEditing(false); // Exit edit mode
        refreshTasks(); // Refresh the tasks to reflect changes
        message.success("Task updated successfully");
      } catch (error) {
        console.error("Failed to update task");
        message.error("Failed to update task");
      }
    }
  };

  return (
    <Draggable draggableId={`subsubtask-${subsubtask.id}`} index={index}>
      {(provided) => (
        <div
          className="subsubtask-item"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {isEditing ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={saveEdit}
              onPressEnter={saveEdit}
            />
          ) : (
            <span>{subsubtask.description}</span>
          )}
          {/* Edit icon to toggle editing mode */}
          <EditOutlined onClick={startEditing} style={{ marginLeft: '10px', cursor: 'pointer' }} />
          
          {/* Delete confirmation pop-up */}
          <Popconfirm
            title="Are you sure to delete this sub-subtask?"
            onConfirm={() => onDelete(subsubtask.id, category, 'subsubtask')}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined style={{ color: 'red', marginLeft: '10px', cursor: 'pointer' }} />
          </Popconfirm>
        </div>
      )}
    </Draggable>
  );
};

export default SubSubtask;
