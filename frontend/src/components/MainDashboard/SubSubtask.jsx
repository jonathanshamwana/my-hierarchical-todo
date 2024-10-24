import React from 'react';
import { Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import '../../styles/TaskItem.css';

const SubSubtask = ({ subsubtask, onDelete, category }) => {
  return (
    <div className="subsubtask-item">
      <span>{subsubtask.description}</span>
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
