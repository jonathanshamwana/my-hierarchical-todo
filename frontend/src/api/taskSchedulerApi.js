// taskSchedulerApi.js

const API_BASE_URL = 'http://127.0.0.1:5000/api';  // Update this to match your backend API URL

/**
 * Fetches available time slots for smart scheduling.
 * This function will call the backend API, which interacts with Google Calendar and OpenAI
 * to suggest optimal time slots based on the user’s upcoming events.
 *
 * @param {Object} taskData - Contains task details such as title, duration, and preferred time range.
 * @returns {Promise<Object[]>} - A list of suggested time slots, with each containing start and end times.
 */
const getTimeSuggestions = async (taskData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/calendar/schedule-task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch time suggestions');
    }

    const data = await response.json();
    return data.suggestions;  // Assumes the backend response contains a "suggestions" array
  } catch (error) {
    console.error('Error fetching time suggestions:', error);
    throw error;
  }
};

/**
 * Confirms a selected time slot by scheduling the task on the user's Google Calendar.
 * This function sends the selected time and task details to the backend to finalize the event.
 *
 * @param {Object} scheduleData - Contains details such as title, startDateTime, endDateTime, and any other event info.
 * @returns {Promise<Object>} - The response from the backend confirming the event creation, including an event link.
 */
const confirmTaskSchedule = async (scheduleData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/calendar/confirm-schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scheduleData),
    });

    if (!response.ok) {
      throw new Error('Failed to confirm task schedule');
    }

    const data = await response.json();
    return data;  // Returns the confirmation details (e.g., status, event link) from the backend
  } catch (error) {
    console.error('Error confirming task schedule:', error);
    throw error;
  }
};

export default { getTimeSuggestions, confirmTaskSchedule }