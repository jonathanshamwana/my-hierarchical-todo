const API_BASE_URL = 'http://127.0.0.1:5000'; 

const getTimeSuggestions = async (taskData) => {
    const token = sessionStorage.getItem('token'); 

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

const confirmTaskSchedule = async (scheduleData) => {
    const token = sessionStorage.getItem('token'); 

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