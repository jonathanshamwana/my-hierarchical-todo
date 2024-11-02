import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const API_BASE_URL = 'http://127.0.0.1:5000';

/**
 * useTaskSchedulerApi hook - Provides methods for interacting with the task scheduler API.
 * Includes functionality for fetching time suggestions for tasks and confirming task scheduling on Google Calendar.
 * 
 * @returns {Object} - An object containing the `getTimeSuggestions` and `confirmTaskSchedule` methods.
 */
const useTaskSchedulerApi = () => {
    const { token } = useContext(AuthContext);

    /**
     * Fetches time suggestions for a new task to optimize scheduling.
     * 
     * @async
     * @function getTimeSuggestions
     * @param {Object} taskData - Task details, including description and duration.
     * @returns {Promise<Array>} - A promise that resolves to an array of suggested time slots.
     * @throws {Error} - Throws an error if the fetch request fails.
     */
    const getTimeSuggestions = async (taskData) => {
        try {
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
            return data.suggestions;
        } catch (error) {
            console.error('Error fetching time suggestions:', error);
            throw error;
        }
    };

    /**
     * Confirms task scheduling by creating an event on Google Calendar.
     * 
     * @async
     * @function confirmTaskSchedule
     * @param {Object} scheduleData - Contains task summary, start time, end time, and other event details.
     * @returns {Promise<Object>} - A promise that resolves to the created event's data if successful.
     * @throws {Error} - Throws an error if the event creation fails.
     */
    const confirmTaskSchedule = async (scheduleData) => {
        console.log("SCHEDULE DATA", scheduleData)
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

    return { getTimeSuggestions, confirmTaskSchedule };
};

export default useTaskSchedulerApi;
