import React from 'react';
import { Modal, Button, List } from 'antd';

const SmartSchedulingModal = ({ isVisible, suggestions, onAccept, onClose }) => {
  return (
    <Modal
      title="Smart Scheduling Suggestions"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <p>Select a suggested time slot for your task, or choose a custom time:</p>
      <List
        bordered
        dataSource={suggestions}
        renderItem={(suggestion) => (
          <List.Item>
            <div>
              <strong>{suggestion.start}</strong> - {suggestion.end}
            </div>
            <Button type="primary" onClick={() => onAccept(suggestion)}>
              Accept
            </Button>
          </List.Item>
        )}
      />
      <Button type="dashed" onClick={onClose} style={{ marginTop: '20px' }}>
        Choose a custom time
      </Button>
    </Modal>
  );
};

export default SmartSchedulingModal;