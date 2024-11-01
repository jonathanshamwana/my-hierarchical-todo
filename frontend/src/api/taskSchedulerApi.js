const API_BASE_URL = 'http://127.0.0.1:5000'; 

/**
 * Gets the calendar suggestions for a new task when in smart scheduling mode 
 * @async
 * @function
 * @param {Object} taskData - Object including details like task description
 * @param {string} token - Authentication token from AuthContext.
 * @returns {Promise<Object>} A promise that resolves to the fetched time suggestions.
 * @throws {Error} If the request fails.
 */
const getTimeSuggestions = async (taskData, token) => {
    try {
        console.log("MAKING API REQUEST TO: ", `${API_BASE_URL}/api/scheduler/schedule-task`)
        const response = await fetch(`${API_BASE_URL}/api/scheduler/schedule-task`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
        });

        if (!response.ok) {
        throw new Error('Failed to fetch time suggestions');
        }

        const data = await response.json();
        console.log("Data.suggestions: ", data.suggestions)
        return data.suggestions; 
    } catch (error) {
        console.error('Error fetching time suggestions:', error);
        throw error;
    }
};

/**
 * Creates a calendar event using the suggestion the user accepted
 * @async
 * @function
 * @param {Object} scheduleData - Info needed to schedule an event in GCalendar
 * @param {string} token - Authentication token from AuthContext.
 * @returns {Promise<Object>} A promise that resolves when the calendar event is created.
 * @throws {Error} If the request fails.
 */
const confirmTaskSchedule = async (scheduleData, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/calendar/create-event`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(scheduleData),
        });

        if (!response.ok) {
        throw new Error('Failed to confirm task schedule');
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error confirming task schedule:', error);
        throw error;
    }
};

export default { confirmTaskSchedule, getTimeSuggestions }