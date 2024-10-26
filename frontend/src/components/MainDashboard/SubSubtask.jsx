import React, { useState } from 'react';
import { Popconfirm, Input, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import tasksApi from '../../api/tasksApi';
import '../../styles/TaskItem.css';

const SubSubtask = ({ subsubtask, onDelete, category, refreshTasks }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(subsubtask.description)

  const startEditing = () => {
    setIsEditing(true);
  }

  const saveEdit = async () => {
    if (editValue.trim()) {
      try {
        await tasksApi.UpdateItem(subsubtask.id, 'subsubtask', editValue);
        setIsEditing(false);
        refreshTasks();
        message.success("Task updated successfully")
      } catch (error) {
        console.error("Failed to update task")
        message.error("Failed to update task");
      }
    }
  };

  return (
    <div className="subsubtask-item">
      { isEditing ? (
        <Input 
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={saveEdit}
          onPressEnter={saveEdit}
        />
      ) : (
      <span>{subsubtask.description}</span>
      )}
      <EditOutlined
        onClick={startEditing}
        style={{ marginLeft: '10px', cursor: 'pointer' }}
      />
      <Popconfirm
        title="Are you sure to delete this sub-subtask?"
        onConfirm={() => onDelete(subsubtask.id, category, 'subsubtask')}
        okText="Yes"
        cancelText="No"
      >
        <DeleteOutlined style={{ color: 'red', marginLeft: '10px' }} />
      </Popconfirm>
    </div>
  );
};

export default SubSubtask;
