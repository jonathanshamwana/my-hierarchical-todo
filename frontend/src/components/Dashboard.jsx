import React, { useState, useEffect } from 'react';
import TodoList from './TodoList';
import AddTaskForm from './AddTaskForm';
import { Modal, message } from 'antd';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState({ running: [], gym: [], nutrition: [], recovery: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/tasks/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const categorizedTasks = {
          running: data.filter(task => task.category === 'Running'),
          gym: data.filter(task => task.category === 'Gym'),
          nutrition: data.filter(task => task.category === 'Nutrition'),
          recovery: data.filter(task => task.category === 'Recovery'),
        };
        setTasks(categorizedTasks);
        console.log(`Tasks: ${tasks}`)
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching tasks');
        setLoading(false);
      });
  }, []);

  const handleAddTask = (newTask) => {
    fetch('http://127.0.0.1:5000/api/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data received from backend:", data); 
        const category = data.category;
    
        setTasks((prevTasks) => {
          if (prevTasks[category]) {
            return {
              ...prevTasks,
              [category]: [...prevTasks[category], data], 
            };
          } else {
            console.error(`Category ${data.category} not found in tasks`);
            return prevTasks;
          }
        });
      })
      .catch((error) => {
        setError(`Error adding new task: ${error}`);
      });
  }
  

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="dashboard">
      <div className="lists-container">
        <TodoList title="Running" tasks={tasks.running} />
        <TodoList title="Gym" tasks={tasks.gym} />
        <TodoList title="Nutrition" tasks={tasks.nutrition} />
        <TodoList title="Recovery" tasks={tasks.recovery} />
      </div>

      {error && <div className="error-message">{error}</div>}

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
          categories={['Running', 'Gym', 'Nutrition', 'Recovery']}
          onAddTask={handleAddTask}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
