import React, { useState, useEffect, useContext } from 'react';
import TodoList from '../components/MainDashboard/TodoList';
import CompletedDropzone from '../components/MainDashboard/CompletionDropzone';
import { AuthContext } from '../context/AuthContext';
import SmartSchedulingModal from '../components/TaskScheduler/SmartSchedulingModal';
import { Modal, message } from 'antd';
import { Switch, FormControlLabel } from '@mui/material';
import { DragDropContext } from 'react-beautiful-dnd'; 
import mockSuggestions from '../data/mockData';
import Confetti from 'react-confetti';
import '../styles/MainDashboard/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddTaskForm from '../components/MainDashboard/AddTaskForm';
import tasksApi from '../api/tasksApi';
import useTaskSchedulerApi from '../api/taskSchedulerApi';

/**
 * Dashboard component displays the four todo lists that will hold the users tasks
 * This page is the primary players where users will engage with the product
 * Users can add tasks, subtasks, and subtasks, and move top-level tasks between lists
 * Additional features include auto-scheduling tasks and drag-to-complete
 * 
 * @component
 * @example
 * // Usage
 * <Dashboard />
 * 
 * @returns {JSX.Element} A dashboard of hierarchical todo lists 
 */
const Dashboard = () => {
  const { token, user } = useContext(AuthContext);
  const isSuperAdmin = user && user.email === 'jonathanshamwana@gmail.com';

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSchedulerModalVisible, setIsSchedulerModalVisible] = useState(false);
  const [formType, setFormType] = useState('task');
  const [smartSchedulingEnabled, setSmartSchedulingEnabled] = useState(false);
  const [timeSuggestions, setTimeSuggestions] = useState(null);
  const [smartSchedulingTask, setSmartSchedulingTask] = useState(null);
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState({
    running: [],
    gym: [],
    nutrition: [],
    recovery: []
  });
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false)

  const { confirmTaskSchedule, getTimeSuggestions } = useTaskSchedulerApi();

  // fetches all of the user's tasks from the database by calling the tasksApi
  const fetchTasks = async () => {
    try {
      if (token) {
        const data = await tasksApi.fetchTasks(token);
        const categorizedTasks = {
          running: data.filter(task => task.category === 'Running'),
          gym: data.filter(task => task.category === 'Gym'),
          nutrition: data.filter(task => task.category === 'Nutrition'),
          recovery: data.filter(task => task.category === 'Recovery'),
        };
        setTasks(categorizedTasks);
      }
    } catch (error) {
      setError('Error fetching tasks');
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);
  
  // Add a new task to the database by calling the tasksApi
  const handleAddTask = async (newTask) => {
    try {
      const data = await tasksApi.AddTask(newTask, token);
      const category = data.category
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
      await fetchTasks(); // Fetch the tasks again from the db so the updates task lists render
      setIsModalVisible(false);
      message.success('Task added successfully');

      // If the user enabled smart scheduling, fetch their calendar suggestions 
      if (smartSchedulingEnabled) {
        setSmartSchedulingTask(newTask);
        setTimeout(() => handleGetTaskSuggestions(), 6000); // Mock a 3-second delay instead of calling the OpenAI API (change in production)
      };

    } catch (error) {
      setError(`Error adding new task: ${error.message}`);
    }
  };
  
  // Delete a task, subtask or subsubtask from the database by calling the tasksApi
  const handleDeleteTask = async (taskId, category, taskType = 'task') => {
    try {

      // Use the hierarchy level of the task to call the appropriate method in the API
      if (taskType === 'task') {
        await tasksApi.DeleteTask(taskId, token);
      } else if (taskType === 'subtask') {
        await tasksApi.DeleteSubtask(taskId, token);
      } else if (taskType === 'subsubtask') {
        await tasksApi.DeleteSubSubtask(taskId, token);
      }
  
      // Update the new tasks list, removing the task of interest
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
      
      await fetchTasks(); // fetch tasks again so the updated lists render
      message.success(taskType === 'subtask' ? 'Subtask deleted' : 'Task deleted');
    } catch (error) {
      message.error(`Error deleting ${taskType === 'subtask' ? 'subtask' : 'task'}: ${error.message}`);
    }
  };

  // Add a new subtask to the database by calling the tasksApi
  const handleAddSubtask = async (taskId, newSubtask) => {
    try {
      const data = await tasksApi.AddSubtask(taskId, newSubtask, token);
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
      await fetchTasks(); // fetch tasks again so the updated todo lists are rendered
      setIsModalVisible(false);
      message.success('Subtasks added successfully');

      // If the user enables smart suggestions, fetch the calendar suggestions for the subtask
      if (smartSchedulingEnabled) {
        setSmartSchedulingTask(newSubtask);
        setTimeout(() => handleGetTaskSuggestions(), 6000);
      };

    } catch (error) {
      message.error(`Error adding subtask: ${error.message}`);
    }
  };

  // Add a new sub-subtask to the database by calling the tasksApi
  const handleAddSubSubtask = async (subtaskId, newSubSubtask) => {
    try {
      const data = await tasksApi.AddSubSubtask(subtaskId, newSubSubtask, token);
      
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
      await fetchTasks(); // fetch tasks again so the updated todo lists are rendered
      setIsModalVisible(false);
      message.success('Sub-Subtasks added successfully');
      
      // If the user enables smart suggestions, fetch the calendar suggestions for the sub-subtask
      if (smartSchedulingEnabled) {
        setSmartSchedulingTask(newSubSubtask);
        setTimeout(() => handleGetTaskSuggestions(), 10000);
      };

    } catch (error) {
      console.error('Error adding sub-subtask:', error);
      message.error(`Error adding sub-subtask: ${error.message}`);
    }
  };

  // when a task is dropped in the completion zone, remove it from its list and add it to completed tasks by calling the tasksApi
  const handleCompleteTask = async (itemId, itemType, category) => {
    try {

      // Use the task hierarchy to determine which method in the API to call
      if (itemType === 'task') {
        await tasksApi.CompleteTask(itemId, token);
        setTasks(prevTasks => ({
          ...prevTasks,
          [category]: prevTasks[category].filter(task => task.id !== itemId),
        }));
      } else if (itemType === 'subtask') {
        await tasksApi.CompleteSubtask(itemId, token);
      } else if (itemType === 'subsubtask') {
        await tasksApi.CompleteSubSubtask(itemId, token);
      }

      message.success(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} completed successfully! 🎉`);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000); // Let the confetti fall for 6 seconds
      await fetchTasks();
    } catch (error) {
      message.error(`Error completing ${itemType}: ${error.message}`);
    }
  };

  // Open the appropriate modal (add task, add subtask, add subsubtask) containing the respective form
  const showModal = (modalType = 'task', task = null, subtask = null) => {
    setFormType(modalType);
    setSelectedTask(task)
    setSelectedSubtask(subtask);
    setIsModalVisible(true);
  };

  // When the user clicks the 'x' in the top-right of the modal, close the modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setIsSchedulerModalVisible(false);
    setFormType('task')
  };

  // Ensure the necessary changes occur when a task is correctly dropped into one of the lists or the completion zone
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Ensure the task was dropped onto a valid destination (todolist or completion zone)
    if (!destination) return;
  

    // Process tasks that were dropped into the completion zone in a particular way
    const [itemType, itemId] = draggableId.split('-');
    const isCompletedDropzone = destination.droppableId === 'completed';
    if (isCompletedDropzone) {
      handleCompleteTask(parseInt(itemId, 10), itemType, source.droppableId);
      return;
    }
  
    // Process top-level tasks that were taken from one list to a different list in a particular way 
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
  
      // Update the new tasks object, with this task in the array of a different category/key
      setTasks((prevTasks) => ({
        ...prevTasks,
        [source.droppableId]: newSourceTasks,
        [destination.droppableId]: newDestinationTasks,
      }));
      
      // Update the task's category in the database
      tasksApi.updateTaskCategory(draggedTask.id, destination.droppableId, token).catch((error) =>
        message.error('Error moving task')
      );
    }
  };

  const handleSchedulerToggle = () => {
    setSmartSchedulingEnabled(!smartSchedulingEnabled)
  }

  // Call the taskSchedulerApi which interfaces with Google Calendar and OpenAI.
  // Commented out to save money. Uncomment in production. 
  // 
  // const handleGetTaskSuggestions = async () => {
  //   try {
  //     const suggestions = await taskSchedulerApi.getTimeSuggestions(mockTaskData);
  //     setTimeSuggestions(suggestions);
  //     setIsSchedulerModalVisible(true);
  //   } catch (error) {
  //     message.error("Failed to fetch time suggestions");
  //   }
  // };

  // Use the mock data to simulate fetching smart calendar suggestions and displaying them to the user on a modal
  const handleGetTaskSuggestions = () => {
    setTimeSuggestions(mockSuggestions);
    setIsSchedulerModalVisible(true);
  };

  // When a user accepts a calendar suggestion, call the GCalendar API to create an event
  const handleAcceptSuggestion = async (suggestion) => {
  
    // Prepare the event data to send to the backend
    const scheduleData = {
      description: "Scheduled from Smart Suggestions",
      summary: suggestion.event_data.summary,
      startDateTime: suggestion.event_data.start.dateTime,
      endDateTime: suggestion.event_data.end.dateTime,
    };
  
    try {
      const response = await confirmTaskSchedule(scheduleData);
      if (response.status === 'Event created') {
        message.success("Event added to Google Calendar!");
      } else {
        message.error("Failed to add event to Google Calendar.");
      }
    } catch (error) {
      console.error("Error adding event to Google Calendar:", error);
      message.error("Error adding event to Google Calendar.");
    } finally {
      setIsSchedulerModalVisible(false);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="dashboard">
        <div className="animated-background"></div>
        {showConfetti && <Confetti />}
        <div className="smart-scheduler-container">

        {/* Switch component that allows users to toggle between smart scheduling mode and regular mode */}
        { isSuperAdmin && (
          <FormControlLabel
          control={
            <Switch
              checked={smartSchedulingEnabled}
              onChange={handleSchedulerToggle}
              sx={{
                width: 90,
                height: 40,
                '.MuiSwitch-thumb': {
                  width: 24,
                  height: 24,
                  color: '#1E3E62',
                  transition: 'transform 0.3s ease', 
                  transform: smartSchedulingEnabled ? 'translateX(34px)' : 'translateX(0px)',
                },
                '.MuiSwitch-track': {
                  borderRadius: 20,
                  backgroundColor: smartSchedulingEnabled ? '#FF6500' : '#DFF2EB',
                  opacity: 1,
                },
              }}
              inputProps={{ 'aria-label': 'Smart Scheduler Switch' }}
            />
          }
          label="Smart Task Scheduling"
          labelPlacement="end"
          sx={{
            fontSize: '1.2rem',
            color: '#1E3E62',
            display: 'flex',
            alignItems: 'center',
          }}
          />
        )}
        </div>
        <div className="lists-container">
          
          {/* Render the four todo lists that the user can add, remove, and edit tasks with */}
          <TodoList 
            title="Running" 
            tasks={tasks.running || []} 
            onDelete={handleDeleteTask} 
            onAddSubtask={(task) => 
            showModal('subtask', task)}
            onAddSubSubtask={(subtask) => showModal('subsubtask', null, subtask)} 
            refreshTasks={fetchTasks} 
          />
          <TodoList 
            title="Gym" 
            tasks={tasks.gym || []} 
            onDelete={handleDeleteTask} 
            onAddSubtask={(task) => showModal('subtask', task)} 
            onAddSubSubtask={(subtask) => showModal('subsubtask', null, subtask)} 
            refreshTasks={fetchTasks} 
          />
          <TodoList 
            title="Nutrition" 
            tasks={tasks.nutrition || []} 
            onDelete={handleDeleteTask} 
            onAddSubtask={(task) => showModal('subtask', task)} 
            onAddSubSubtask={(subtask) => showModal('subsubtask', null, subtask)} 
            refreshTasks={fetchTasks} 
          />
          <TodoList 
            title="Recovery" 
            tasks={tasks.recovery || []} 
            onDelete={handleDeleteTask} 
            onAddSubtask={(task) => showModal('subtask', task)} 
            onAddSubSubtask={(subtask) => showModal('subsubtask', null, subtask)} 
            refreshTasks={fetchTasks} 
          />
          
          {/* Completed Dropzone, adjacent to the Todo lists*/}
          <CompletedDropzone />
        </div>

        {error && <div className="error-message">{error}</div>}
        
        {/* Button that, when clicked, opens the Add Task Form modal */}
        <div className="add-task-button-wrapper">
          <button className="add-task-button" onClick={() => showModal('task')}>
            Add Task
          </button>
        </div>
        
        {/* Modal that renders forms for Adding a task, subtask or subsubtask respectively */}
        <Modal
          open={isModalVisible}
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

        {/* Modal that opens automatically after adding a task/subtask/subsubtask when user is on smart-scheduling mode */}
        <SmartSchedulingModal
          visible={isSchedulerModalVisible}
          suggestions={timeSuggestions}
          onAccept={handleAcceptSuggestion} 
          onClose={() => setIsSchedulerModalVisible(false)}
          taskDescription={smartSchedulingTask ? smartSchedulingTask.description : ''}
        />
      </div>
    </DragDropContext>
  );
};

export default Dashboard;
