import React, { useState, useEffect } from 'react';
import TodoList from './TodoList';
import AddTaskForm from './AddTaskForm';
import { Modal, message } from 'antd';
import { DragDropContext, Droppable } from 'react-beautiful-dnd'; 
import Confetti from 'react-confetti';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState({ running: [], gym: [], nutrition: [], recovery: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false)

  const fetchTasks = () => {
    fetch('http://127.0.0.1:5000/api/tasks/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) { // Ensure data is an array before applying filters
          const categorizedTasks = {
            running: data.filter(task => task.category === 'Running'),
            gym: data.filter(task => task.category === 'Gym'),
            nutrition: data.filter(task => task.category === 'Nutrition'),
            recovery: data.filter(task => task.category === 'Recovery'),
          };
          setTasks(categorizedTasks);
        } else {
          console.error("Fetched data is not an array", data);
          setError('Unexpected data format');
        }
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching tasks');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
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
        console.log("Task added:", data);
        const category = data.category;
    
        setTasks((prevTasks) => {
          console.log("Previous tasks:", prevTasks);
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

        fetchTasks()
        setIsModalVisible(false);
        message.success('Task added successfully');
      })
      .catch((error) => {
        setError(`Error adding new task: ${error}`);
      });
  }

  const handleDeleteTask = (taskId, category) => {
    fetch(`http://127.0.0.1:5000/api/tasks/${taskId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          message.success('Task deleted successfully');
          setTasks((prevTasks) => {
            if (prevTasks[category]) {
              return {
                ...prevTasks,
                [category]: prevTasks[category].filter((task) => task.id !== taskId),
              };
            } else {
              console.error(`Category ${category} not found in tasks`);
              return prevTasks;
            }
          });
          fetchTasks()
        } else {
          message.error('Failed to delete task');
        }
      })
      .catch((error) => {
        message.error(`Error deleting task: ${error}`);
      });
  };
  

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCompleteTask = (taskId, category) => {
    fetch(`http://127.0.0.1:5000/api/tasks/complete/${taskId}`, {
      method: 'POST', 
    })
      .then((response) => {
        if (response.ok) {
          message.success('Task completed! 🎉');
          setTasks((prevTasks) => ({
            ...prevTasks,
            [category]: prevTasks[category].filter((task) => task.id !== taskId),
          }));
          setCompletedTasks((prevCompleted) => [...prevCompleted, taskId]);
          fetchTasks()
          setShowConfetti(true); 
          setTimeout(() => setShowConfetti(false), 6000);
        } else {
          message.error('Failed to complete task');
        }
      })
      .catch((error) => {
        message.error(`Error completing task: ${error}`);
      });
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
  
    if (!destination) return;
  
    const sourceCategory = tasks[source.droppableId];
    const destinationCategory = tasks[destination.droppableId];
  
    if (!sourceCategory) {
      console.error(`Source category ${source.droppableId} not found`);
      return;
    }

    const taskId = draggableId.replace('task-', '');
  
    if (destination.droppableId === 'completed') {
      const sourceCategory = source.droppableId.toLowerCase();
      handleCompleteTask(taskId, sourceCategory);
    } else if (source.droppableId !== destination.droppableId) {
  
      const draggedTask = sourceCategory.find(task => task.id.toString() === taskId);
  
      if (!draggedTask) {
        console.error(`Task ${taskId} not found in category ${source.droppableId}`);
        return;
      }
  
      const newSourceTasks = sourceCategory.filter(task => `task-${task.id}` !== draggableId);
  
      const newDestinationTasks = [...destinationCategory, draggedTask];
  
      setTasks((prevTasks) => ({
        ...prevTasks,
        [source.droppableId]: newSourceTasks,
        [destination.droppableId]: newDestinationTasks,
      }));
  
      fetch(`http://127.0.0.1:5000/api/tasks/${draggedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: destination.droppableId }),
      })
      .catch((error) => message.error('Error moving task'));
    }
  };
  
  

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="dashboard">
        {showConfetti && <Confetti />}
        <div className="lists-container">
          <TodoList title="Running" tasks={tasks.running} onDelete={handleDeleteTask} />
          <TodoList title="Gym" tasks={tasks.gym} onDelete={handleDeleteTask} />
          <TodoList title="Nutrition" tasks={tasks.nutrition} onDelete={handleDeleteTask} />
          <TodoList title="Recovery" tasks={tasks.recovery} onDelete={handleDeleteTask} />
          <Droppable droppableId="completed">
            {(provided, snapshot) => (
              <div
                className="completed-dropzone"
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  backgroundColor: snapshot.isDraggingOver ? '#6A9C89' : 'lightgray',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <h3>Completed</h3>
                <p>Drag here to complete tasks</p>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
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
    </DragDropContext>
  );
};

export default Dashboard;
