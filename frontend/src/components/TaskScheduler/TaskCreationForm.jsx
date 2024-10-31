import React, { useState } from 'react';
import { Form, Input, Checkbox, Button, message } from 'antd';
import SmartSchedulingModal from './SmartSchedulingModal';

/**
 * EventCreationForm component - Provides a form to create tasks, with an optional
 * smart scheduling feature that suggests optimal time slots.
 *
 * @param {function} onCreateTask - Callback function to create a task with or without scheduling suggestions.
 *
 * @component
 * @example
 * <EventCreationForm onCreateTask={handleEventCreation} />
 *
 * @returns {JSX.Element} A task creation form component with smart scheduling modal.
 */
const EventCreationForm = ({ onCreateTask }) => {
  const [form] = Form.useForm();
  const [smartSchedulingEnabled, setSmartSchedulingEnabled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  /**
   * Handles form submission. If smart scheduling is enabled, fetches suggested times from the backend.
   * Otherwise, directly calls onCreateTask to create the task without scheduling.
   */
  const onFinish = async (values) => {
    if (smartSchedulingEnabled) {
      try {
        const response = await fetch('/api/schedule-task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        const data = await response.json();
        setSuggestions(data.suggestions); // Set suggestions for modal display
        setIsModalVisible(true); // Open modal with time suggestions
      } catch (error) {
        message.error('Failed to fetch time suggestions.');
      }
    } else {
      onCreateTask(values); // Create task normally if smart scheduling is not enabled
    }
  };

  /**
   * Accepts a scheduling suggestion from the modal and confirms the task with selected start and end times.
   * Notifies the parent component about the created task.
   */
  const handleAcceptSuggestion = async (suggestion) => {
    try {
      const taskData = { ...form.getFieldsValue(), startDateTime: suggestion.start, endDateTime: suggestion.end };
      await fetch('/api/confirm-task-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      message.success('Task scheduled successfully!');
      setIsModalVisible(false); // Close modal after scheduling
      onCreateTask(taskData); // Notify parent about the successfully created task
    } catch (error) {
      message.error('Failed to schedule the task.');
    }
  };

  return (
    <>
      <Form form={form} onFinish={onFinish} layout="vertical">
        {/* Task title input field */}
        <Form.Item name="title" label="Task Title" rules={[{ required: true, message: 'Please input the task title!' }]}>
          <Input placeholder="Enter task title" />
        </Form.Item>

        {/* Duration input field */}
        <Form.Item name="duration" label="Duration (minutes)" rules={[{ required: true, message: 'Please specify the duration!' }]}>
          <Input type="number" placeholder="Enter task duration" />
        </Form.Item>

        {/* Checkbox to enable smart scheduling */}
        <Form.Item>
          <Checkbox onChange={(e) => setSmartSchedulingEnabled(e.target.checked)}>
            Enable Smart Scheduling
          </Checkbox>
        </Form.Item>

        {/* Submit button to create the task */}
        <Button type="primary" htmlType="submit">Create Task</Button>
      </Form>

      {/* Modal displaying scheduling suggestions if smart scheduling is enabled */}
      <SmartSchedulingModal
        isVisible={isModalVisible}
        suggestions={suggestions}
        onAccept={handleAcceptSuggestion}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
};

export default EventCreationForm;
