import React, { useState } from 'react';
import { Input, Popconfirm, message } from 'antd';
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import SubSubtask from './SubSubtask';
import tasksApi from '../../api/tasksApi';

const Subtask = ({ subtask, index, onAddSubSubtask, onDelete, category, refreshTasks }) => {
  const [showSubSubtasks, setShowSubSubtasks] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(subtask.description);

  const toggleSubSubtasks = () => setShowSubSubtasks(!showSubSubtasks);

  const startEditing = () => {
    setIsEditing(true);
  };

  const saveEdit = async () => {
    try {
      await tasksApi.UpdateItem(subtask.id, 'subtask', editValue);
      setIsEditing(false);
      refreshTasks();
      message.success("Subtask updated successfully");
    } catch (e) {
      console.error("Failed to update subtask");
      message.error("Failed to update subtask");
    }
  };

  return (
    <div>
      <Draggable draggableId={`subtask-${subtask.id}`} index={index}>
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
            {isEditing ? (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={saveEdit}
                onPressEnter={saveEdit}
              />
            ) : (
              <span onClick={toggleSubSubtasks}>{subtask.description}</span>
            )}
            <EditOutlined onClick={startEditing} style={{ marginLeft: '10px', cursor: 'pointer' }} />
            <PlusOutlined onClick={() => onAddSubSubtask(subtask)} style={{ color: '#52c41a', cursor: 'pointer', marginLeft: '5px' }} />
            <Popconfirm
              title="Are you sure to delete this subtask?"
              onConfirm={() => onDelete(subtask.id, category, 'subtask')}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined style={{ color: 'red', marginLeft: '10px', cursor: 'pointer' }} />
            </Popconfirm>
          </div>
        )}
      </Draggable>

      {showSubSubtasks && subtask.subsubtasks && (
        <Droppable droppableId={`subsubtasks-${subtask.id}`} type="subsubtask">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="subsubtasks-container">
              {subtask.subsubtasks.map((subsubtask, subsubIndex) => (
                <SubSubtask
                  key={subsubtask.id}
                  subsubtask={subsubtask}
                  index={subsubIndex}
                  category={category}
                  onDelete={onDelete}
                  refreshTasks={refreshTasks}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
};

export default Subtask;
