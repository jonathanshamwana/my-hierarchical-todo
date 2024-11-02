import React from 'react';
import { Modal, Button, List } from 'antd';
import '../../styles/SmartScheduling/SmartSchedulingModal.css';

/**
 * SmartSchedulingModal component - Displays scheduling suggestions for a specific task,
 * allowing the user to add the task to Google Calendar at the suggested times.
 *
 * @param {boolean} visible - Determines if the modal is visible.
 * @param {array} suggestions - List of time suggestions with date, time, and justification.
 * @param {function} onAccept - Function to handle acceptance of a specific suggestion.
 * @param {function} onClose - Function to handle closing the modal.
 * @param {string} taskDescription - Description of the task for which suggestions are being made.
 *
 * @component
 * @example
 * <SmartSchedulingModal 
 *   open={true}
 *   suggestions={suggestionsList}
 *   onAccept={handleAccept}
 *   onClose={handleClose}
 *   taskDescription="20-Mile Marathon Training Run"
 * />
 *
 * @returns {JSX.Element} A modal displaying scheduling suggestions for a task.
 */
const SmartSchedulingModal = ({ visible, suggestions, onAccept, onClose, taskDescription }) => {
  
  return (
    <Modal
      title="Smart Scheduling Suggestions"
      open={visible}
      onCancel={onClose}
      footer={null}
      className="modal-container"
    >
      {/* Display task description for context */}
      <h3 className="modal-task-description">Add task "{taskDescription}" to Google Calendar</h3>
      
      {/* List of scheduling suggestions */}
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
            {/* Accept button for each suggestion */}
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
