import React, { useState, useEffect } from 'react';
import TodoList from './TodoList';
import axios from  'axios';
import AddTaskForm from './AddTaskForm';
import { Modal } from 'antd';
import tasksData from '../data/tasksData';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState(tasksData);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    axios.get('https://localhost:5000/api/tasks', {
      decsription: response
    })
      .then((response) => {
          setTasks(response.data)
          setLoading(false)
      })
      .catch((error) => {
        setError('Error fetching tasks')
        setLoading(false)
      })
  })

  const handleAddTask = (newTask) => {

    axios.post('https://localhost:500/api.tasks')
      .then((response) => {
        setTasks((prevTasks) => [...prevTasks, response.data])
      })
      .catch((error) => {
        setError('Error adding new task')
        setLoading(false)
      })
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


