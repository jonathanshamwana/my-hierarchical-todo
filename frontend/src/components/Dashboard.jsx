import React, { useState } from 'react';
import TodoList from './TodoList';
import AddTaskForm from './AddTaskForm';
import { Modal } from 'antd';
import tasksData from '../data/tasksData';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState(tasksData);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAddTask = (newTask) => {
    const updatedTasks = tasks.map((list) => {
      if (list.title === newTask.category) {
        return {
          ...list,
          tasks: [...list.tasks, { id: Math.random(), name: newTask.taskName, subtasks: newTask.subtasks }],
        };
      }
      return list;
    });
    setTasks(updatedTasks);
    setIsModalVisible(false); // Close the modal after adding the task
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="dashboard">
      
      <div className="lists-container">
        {tasks.map((list, index) => (
          <TodoList key={index} title={list.title} tasks={list.tasks} />
        ))}
      </div>

      <div className="add-task-button-wrapper">
        <button className="add-task-button" onClick={showModal}>
          Add Task
        </button>
      </div>

      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <AddTaskForm
          categories={tasks.map((list) => list.title)}
          onAddTask={handleAddTask}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;


