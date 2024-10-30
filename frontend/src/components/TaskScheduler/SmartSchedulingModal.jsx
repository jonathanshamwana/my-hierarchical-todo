import React from 'react';
import { Modal, Button, List } from 'antd';
import '../../styles/SmartScheduling/SmartSchedulingModal.css';

const SmartSchedulingModal = ({ isVisible, suggestions, onAccept, onClose, taskDescription }) => {
  return (
    <Modal
      title="Smart Scheduling Suggestions"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      className="modal-container"
    >
      <h3 className="modal-task-description">Add task "{taskDescription}" to Google Calendar</h3>
      <List
        bordered
        dataSource={suggestions}
        renderItem={(suggestion) => (
          <List.Item className="suggestion-item">
            <div className="suggestion-details">
              <div className="suggestion-date">Date: {suggestion.date}</div>
              <div className="suggestion-time">Time: {suggestion.time}</div>
              <div className="suggestion-justification">
                <strong>Justification:</strong> {suggestion.justification}
              </div>
            </div>
            <Button 
              type="primary" 
              onClick={() => onAccept(suggestion)} 
              className="accept-button"
            >
              Accept
            </Button>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default SmartSchedulingModal;
