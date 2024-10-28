import React, { useState, useEffect } from 'react';
import TodoList from '../components/MainDashboard/TodoList';
import AddTaskForm from '../components/MainDashboard/AddTaskForm';
import tasksApi from '../api/tasksApi';
import { Modal, message } from 'antd';
import { DragDropContext, Droppable } from 'react-beautiful-dnd'; 
import Confetti from 'react-confetti';
import '../styles/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formType, setFormType] = useState('task');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false)
  const [tasks, setTasks] = useState({
    running: [],
    gym: [],
    nutrition: [],
    recovery: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = 'http://127.0.0.1:5000';

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksApi.fetchTasks();

      const categorizedTasks = {
        running: data.filter(task => task.category === 'Running'),
        gym: data.filter(task => task.category === 'Gym'),
        nutrition: data.filter(task => task.category === 'Nutrition'),
        recovery: data.filter(task => task.category === 'Recovery'),
      };
      setTasks(categorizedTasks);
    } catch (error) {
      setError('Error fetching tasks');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  
  const handleAddTask = async (newTask) => {
    try {
      const data = await tasksApi.AddTask(newTask);
      const category = data.category
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
      await fetchTasks();
      message.success('Task added successfully');
      setIsModalVisible(false);
    } catch (error) {
      setError(`Error adding new task: ${error.message}`);
    }
  };
  
  const handleDeleteTask = async (taskId, category, taskType = 'task') => {
    try {
      if (taskType === 'task') {
        await tasksApi.DeleteTask(taskId);
      } else if (taskType === 'subtask') {
        await tasksApi.DeleteSubtask(taskId);
      } else if (taskType === 'subsubtask') {
        await tasksApi.DeleteSubSubtask(taskId);
      }
  
      setTasks((prevTasks) => {
        if (taskType === 'subtask') {
          const updatedTasks = prevTasks[category]?.map((task) =>
            task.subtasks ? {
              ...task,
              subtasks: task.subtasks.filter((subtask) => subtask.id !== taskId)
            } : task
          );
          return {
            ...prevTasks,
            [category]: updatedTasks,
          };
        } else {
          return {
            ...prevTasks,
            [category]: prevTasks[category]
              ? prevTasks[category].filter((task) => task.id !== taskId)
              : [],
          };
        }
      });
      
      await fetchTasks();
      message.success(taskType === 'subtask' ? 'Subtask deleted' : 'Task deleted');
    } catch (error) {
      message.error(`Error deleting ${taskType === 'subtask' ? 'subtask' : 'task'}: ${error.message}`);
    }
  };

  const handleAddSubtask = async (taskId, newSubtask) => {
    try {
      const data = await tasksApi.AddSubtask(taskId, newSubtask);
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        Object.keys(updatedTasks).forEach((category) => {
          updatedTasks[category] = updatedTasks[category].map((task) => {
            if (task.id === taskId) {
              return { ...task, subtasks: [...task.subtasks, data] };
            }
            return task;
          });
        });
        return updatedTasks;
      });
      await fetchTasks();
      message.success('Subtasks added successfully');
      setIsModalVisible(false);
    } catch (error) {
      message.error(`Error adding subtask: ${error.message}`);
    }
  };

  const handleAddSubSubtask = async (subtaskId, newSubSubtask) => {
    try {
      const data = await tasksApi.AddSubSubtask(subtaskId, newSubSubtask);
      
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
  
        Object.keys(updatedTasks).forEach((category) => {
          updatedTasks[category] = updatedTasks[category].map((task) => {
            return {
              ...task,
              subtasks: task.subtasks.map((subtask) => {
                if (subtask.id === subtaskId) {
                  return {
                    ...subtask,
                    subsubtasks: [...subtask.subsubtasks, data]
                  };
                }
                return subtask;
              })
            };
          });
        });
  
        return updatedTasks;
      });
      await fetchTasks();
      message.success('Sub-Subtasks added successfully');
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error adding sub-subtask:', error);
      message.error(`Error adding sub-subtask: ${error.message}`);
    }
  };

  const handleCompleteTask = async (itemId, itemType, category) => {
    try {
      if (itemType === 'task') {
        await tasksApi.CompleteTask(itemId);
        setTasks(prevTasks => ({
          ...prevTasks,
          [category]: prevTasks[category].filter(task => task.id !== itemId),
        }));
      } else if (itemType === 'subtask') {
        await tasksApi.CompleteSubtask(itemId);
      } else if (itemType === 'subsubtask') {
        await tasksApi.CompleteSubSubtask(itemId);
      }
      message.success(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} completed successfully! 🎉`);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000);
      await fetchTasks();
    } catch (error) {
      message.error(`Error completing ${itemType}: ${error.message}`);
    }
  };

  const showModal = (modalType = 'task', task = null, subtask = null) => {
    setFormType(modalType);
    setSelectedTask(task)
    setSelectedSubtask(subtask);
    console.log(selectedSubtask)
    console.log(subtask)
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFormType('task')
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
  
    const [itemType, itemId] = draggableId.split('-');
    const isCompletedDropzone = destination.droppableId === 'completed';
  
    if (isCompletedDropzone) {
      console.log("HANDLE COMPLETE TASK")
      handleCompleteTask(parseInt(itemId, 10), itemType, source.droppableId);
      return;
    }
  
    if (itemType === 'task' && source.droppableId !== destination.droppableId) {
      const sourceCategoryTasks = tasks[source.droppableId];
      const destinationCategoryTasks = tasks[destination.droppableId];
  
      const draggedTask = sourceCategoryTasks.find((task) => task.id.toString() === itemId);
  
      if (!draggedTask) {
        console.error(`Task ${itemId} not found in category ${source.droppableId}`);
        return;
      }
  
      const newSourceTasks = sourceCategoryTasks.filter((task) => task.id.toString() !== itemId);
      const newDestinationTasks = [...destinationCategoryTasks, draggedTask];
  
      setTasks((prevTasks) => ({
        ...prevTasks,
        [source.droppableId]: newSourceTasks,
        [destination.droppableId]: newDestinationTasks,
      }));
  
      fetch(`${API_BASE_URL}/api/tasks/${draggedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: destination.droppableId }),
      }).catch((error) => message.error('Error moving task'));
    }
  };


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="dashboard">
        <div className="animated-background"></div>
        {showConfetti && <Confetti />}
        <div className="lists-container">
          <TodoList title="Running" tasks={tasks.running || []} onDelete={handleDeleteTask} onAddSubtask={(task) => showModal('subtask', task)} onAddSubSubtask={(subtask) => showModal('subsubtask', null, subtask)} refreshTasks={fetchTasks} />
          <TodoList title="Gym" tasks={tasks.gym || []} onDelete={handleDeleteTask} onAddSubtask={(task) => showModal('subtask', task)} onAddSubSubtask={(subtask) => showModal('subsubtask', null, subtask)} refreshTasks={fetchTasks} />
          <TodoList title="Nutrition" tasks={tasks.nutrition || []} onDelete={handleDeleteTask} onAddSubtask={(task) => showModal('subtask', task)} onAddSubSubtask={(subtask) => showModal('subsubtask', null, subtask)} refreshTasks={fetchTasks} />
          <TodoList title="Recovery" tasks={tasks.recovery || []} onDelete={handleDeleteTask} onAddSubtask={(task) => showModal('subtask', task)} onAddSubSubtask={(subtask) => showModal('subsubtask', null, subtask)} refreshTasks={fetchTasks} />
          <Droppable droppableId="completed">
            {(provided, snapshot) => (
              <div
                className="completed-dropzone"
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  backgroundColor: snapshot.isDraggingOver ? '#93b0a5' : 'white',
                  transition: 'background-color 1s ease',
                }}
              >
                <h3 className="todo-list-title patrick-hand-regular">Completed</h3>
                <p>Drag here to complete tasks</p>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="add-task-button-wrapper">
          <button className="add-task-button" onClick={() => showModal('task')}>
            Add Task
          </button>
        </div>

        <Modal
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          {formType === 'task' ? (
            <AddTaskForm
              categories={['Running', 'Gym', 'Nutrition', 'Recovery']}
              formType="task"
              onAddTask={handleAddTask}
            />
          ) : formType === 'subtask' && selectedTask ? (
            <AddTaskForm 
              categories={['Running', 'Gym', 'Nutrition', 'Recovery']}
              formType='subtask'
              onAddTask={(newSubtask) => handleAddSubtask(selectedTask.id, newSubtask)}
            />
          ) : formType === 'subsubtask' && selectedSubtask ? (
            <AddTaskForm
              categories={['Running', 'Gym', 'Nutrition', 'Recovery']}
              formType="subsubtask"
              onAddTask={(newSubSubtask) => handleAddSubSubtask(selectedSubtask.id, newSubSubtask)}
            />
          ) : null}
        </Modal>
      </div>
    </DragDropContext>
  );
};

export default Dashboard;
