// TaskCreationForm.js
import React, { useState } from 'react';
import { Form, Input, Checkbox, Button, message } from 'antd';
import SmartSchedulingModal from './SmartSchedulingModal';

const TaskCreationForm = ({ onCreateTask }) => {
  const [form] = Form.useForm();
  const [smartSchedulingEnabled, setSmartSchedulingEnabled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Handle form submission
  const onFinish = async (values) => {
    if (smartSchedulingEnabled) {
      try {
        // Fetch suggestions from the backend
        const response = await fetch('/api/schedule-task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        const data = await response.json();
        setSuggestions(data.suggestions);
        setIsModalVisible(true); // Open modal with suggestions
      } catch (error) {
        message.error('Failed to fetch time suggestions.');
      }
    } else {
      // If smart scheduling is not enabled, create the task normally
      onCreateTask(values);
    }
  };

  // Handle acceptance of a suggested time
  const handleAcceptSuggestion = async (suggestion) => {
    try {
      const taskData = { ...form.getFieldsValue(), startDateTime: suggestion.start, endDateTime: suggestion.end };
      await fetch('/api/confirm-task-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      message.success('Task scheduled successfully!');
      setIsModalVisible(false); // Close modal
      onCreateTask(taskData); // Notify parent about the created task
    } catch (error) {
      message.error('Failed to schedule the task.');
    }
  };

  return (
    <>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="title" label="Task Title" rules={[{ required: true, message: 'Please input the task title!' }]}>
          <Input placeholder="Enter task title" />
        </Form.Item>
        <Form.Item name="duration" label="Duration (minutes)" rules={[{ required: true, message: 'Please specify the duration!' }]}>
          <Input type="number" placeholder="Enter task duration" />
        </Form.Item>
        <Form.Item>
          <Checkbox onChange={(e) => setSmartSchedulingEnabled(e.target.checked)}>
            Enable Smart Scheduling
          </Checkbox>
        </Form.Item>
        <Button type="primary" htmlType="submit">Create Task</Button>
      </Form>

      <SmartSchedulingModal
        isVisible={isModalVisible}
        suggestions={suggestions}
        onAccept={handleAcceptSuggestion}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
};

export default TaskCreationForm;
