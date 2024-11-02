# 26Club - Task Management for Runners

26Club enables runners to create todo lists for their Running, Gym, Nutrition, and Recovery tasks. Users can create nested tasks, i.e., tasks that have subtasks and sub-subtasks. And by simply dragging and dropping, users can move tasks between todo lists or into the completion zone, after which they can see completed tasks on a separate page.

## Features

### Core Features

1. **Task Management**:

   - Users can create tasks in one of four lists: Running, Gym, Nutrition, and Recovery.
   - Tasks can contain multiple layers of nested subtasks and sub-subtasks.
   - Each task can be dragged and dropped into another list.
   - Dropping a task in the 'Completion Zone' marks a task as 'completed', moving it from a todo-list to the Completed Tasks page.

2. **API Integrations**:

   - **Strava**: Fetches workout data and passes it to OpenAI alongside the new task data to find an appropriate calendar slot
   - **Google Calendar**: Passes upcoming calendar events to OpenAI for 'smart scheduling' and then creates calendar events for new tasks
   - **OpenAI**: Generates suggestions for tasks based on recent activity data from Strava and Google Calendar.

3. **Smart Scheduling**:

   - This is currently only available for the super-admin, otherwise the API costs would be too high.
   - When the "Smart Scheduling" switch is toggled, the user will get a pop up every time they add a task, containing suggestions for when to schedule it on their calendar.
   - This is executed with three external APIs:
     - **_Strava API:_** Fetches the user's most recent running activities from their Strava profile.
     - **_Google Calendar API:_** Fetches the ten upcoming events on the users calendar, and allows for calendar events to be automatically created.
     - **_OpenAI API:_** Receives the user's Strava and calendar data, and the task they just added, then finds an optimal time to create a calendar event for the new task.

4. **Authorization and Authentication**:

   - JWT-based authentication ensures that users can securely access and manage only their own data.

5. **Completed Tasks Tracking**:
   - To complete a top-level task, users can drag the task into the Completion Dropzone.
   - A dedicated page for completed tasks allows users to track what they've accomplished.

### Structure Overview

| Directory                  | Description                                                                     |
| -------------------------- | ------------------------------------------------------------------------------- |
| `backend/`                 | Contains all backend services, including routes and models.                     |
| `backend/app.py`           | Initializes the Flask application, config, and key services.                    |
| `backend/models.py`        | Contains the ORM models for User, Task, Subtask, etc.                           |
| `backend/tasks.py`         | Contains all API endpoints for task-related operations, like adding a new task. |
| `backend/services/`        | Holds integrations with external APIs (Strava, Google Calendar, OpenAI).        |
| `frontend/`                | Holds the React-based frontend code, including components and pages.            |
| `frontend/src/pages/`      | Contains individual React pages (e.g., Dashboard, Login, Signup).               |
| `frontend/src/components/` | Contains reusable components, like Footer, Header, Task, or TodoList.           |
| `frontend/src/api/`        | Apis for interfacing with the Flask backend                                     |
| `frontend/src/context/`    | Contains the AuthContext that manages user tokens and signin                    |
| `frontend/src/styles/`     | Stores CSS for each component and page, following modular styles.               |

### Installation

1. **Unzip the Provided Folder**

   After downloading the provided zipped folder, unzip it to your desired location. This folder contains both the backend and frontend files, as well as a pre-configured database file that you’ll use directly.

2. **Backend Setup**

   - Open a terminal and navigate to the `backend` folder inside the unzipped project:
     ```bash
     cd path/to/unzipped-folder/backend
     ```
   - Install the necessary Python dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - **Important:** Skip database initialization steps, as the pre-configured database file in this folder will be used.

   - Run the backend server:
     ```bash
     flask run
     ```
     The backend should now be accessible at `http://127.0.0.1:5000`.

3. **Frontend Setup**

   - Open a new terminal window and navigate to the `frontend` folder:
     ```bash
     cd path/to/unzipped-folder/frontend
     ```
   - Install the necessary Node.js dependencies:
     ```bash
     npm install
     ```
   - Run the frontend server:
     ```bash
     npm start
     ```
     The frontend should now be accessible at `http://localhost:3000`.

## Future Improvements

1. **Draggable Subtasks and Sub-Subtasks**:

   - Allow users to move subtasks and subsubtasks between top-level tasks or between lists.

2. **Editable Sub-Lists**:

   - Enable users to edit the names of the todo lists, as opposed to limiting it to "Running", "Recovery", etc.

3. **Multiple Boards**:

   - Expand the project to support multiple boards, allowing users to create daily or weekly dashboards.
   - This would require a `boards` table in the database, and a UI component that allows users to select one of their boards, and an API that fetches and interacts with the correct board from the database.

4. **Automated Task Suggestions**:

   - Set up a cron job to fetch data from Strava and Google Calendar each morning and pass it to OpenAI, which can generate a list of suggested tasks for the day. This is another layer of abstraction, where the user doesn't even have to explicitly state which tasks to add.

5. **Comprehensive Testing**:
   - Due to time constraints, I implemented unit tests for the backend functions and the main apis and functional components on the frontend.
   - However, the repo could benefit for more comprehensive unit testing on the frontend, as well as integration tests for the end-to-end flow.

## Running Tests

- **Backend**: do this
- **Frontend**: do this

## Dependencies

- **Backend**: Flask, Flask-RESTful, Flask-JWT-Extended, Flask-Migrate, SQLAlchemy, Google API Client, OpenAI API Client
- **Frontend**: React, Ant Design, react-beautiful-dnd, axios
