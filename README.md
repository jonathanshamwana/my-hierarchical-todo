# 26Club Task Management for Runners

This web app enables runners to create hierarchical todolists to track Running, Gym, Nutrition, Recovery activities. It's hierarchical in that users can create tasks, subtasks, and sub-subtasks, and decide when to obscure or show a level of the hierarchy. Users can create tasks, edit them, drag them to other lists, and then drop them in the 'Completion Dropzone'. Completed Tasks can be viewed, grouped by date, on a separate page.

Lastly, users can enable smart scheduling mode, which integrates with with external APIs (Strava, Google Calendar, and OpenAI) to determine appropriate slots for tasks in their calendar, then create calendar events for them if the user accepts the suggestion.

## Features

### Core Features

1. **Task Management**:

   - Users can create tasks in one of four lists: Running, Gym, Nutrition, and Recovery.
   - Tasks can contain multiple layers of nested subtasks and sub-subtasks.
   - Each task can be dragged and dropped into another list.

2. **API Integrations**:

   - **Strava**: Fetches workout data and passes it to OpenAI alongside the new task data to find an appropriate calendar slot
   - **Google Calendar**: Passes upcoming calendar events to OpenAI for 'smart scheduling' and then creates calendar events for new tasks
   - **OpenAI**: Generates suggestions for tasks based on recent activity data from Strava and Google Calendar.

3. **Smart Scheduling**:

   - Users can enable Smart Scheduling, allowing the app to recommend optimal times for tasks based on user schedule data.
   - When Smart Schedling is enabled, an API request is made to OpenAI to fetch calendar suggestions, and then a modal opens with the list of suggestions that a user can accept.
   - Upon accepting, a new calender event is created.

4. **Authorization and Authentication**:

   - JWT-based authentication ensures that users can securely access and manage only their own data.

5. **Completed Tasks Tracking**:
   - To complete a top-level task, users can drag the task into the Completion Dropzone.
   - A dedicated page for completed tasks allows users to track what they've accomplished.

### Structure Overview

| Directory                  | Description                                                              |
| -------------------------- | ------------------------------------------------------------------------ |
| `backend/`                 | Contains all backend services, including routes and models.              |
| `backend/app.py`           | Initializes the Flask application, config, and key services.             |
| `backend/models/models.py` | Contains the ORM models (User, Task, Subtask, etc.)                      |
| `backend/services/`        | Holds integrations with external APIs (Strava, Google Calendar, OpenAI). |
| `frontend/`                | Holds the React-based frontend code, including components and pages.     |
| `frontend/src/pages/`      | Contains individual React pages (e.g., Dashboard, Login, Signup).        |
| `frontend/src/components/` | Shared components (e.g., Header, Footer, TaskItem, Subtask).             |
| `frontend/src/styles/`     | Stores CSS for each component and page, following modular styles.        |

### Key Components

1. **Dashboard** (`Dashboard.jsx`): Displays four todo lists, one for ewach category (e.g., Running, Gym) and allows users to add, edit, delete, and organize tasks.
2. **Task and Subtask Components** (`TaskItem.js`, `Subtask.js`, `SubSubtask.js`): Modular components that support hierarchical task displays.
3. **Authentication**:
   - **`Login.jss`, `Signup.jss`**: Handle user login and registration, including JWT storage.
   - **`ProtectedRoute.jss`**: Ensures routes are accessible only to authenticated users.
4. **Modals / Forms**:
   - **AddTaskFrom** (`AddTaskForm.jsx`) A form that pops up whenever a user wants to add a task, subtask, or subsubtask to a list.
   - **SmartSchedulingModal** (`SmartSchedulingModal.jsx`) A modals that renders the smart calendar suggestions, formatted in the `TaskCreationForm` component.

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/jonathanshamwana/my-hierarchichal-todo.git
   cd my-hierarchical-todo
   ```

2. **Backend Setup**

   - Navigate to the `backend/` folder:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Set up database migrations:
     ```bash
     flask db init
     flask db migrate -m "Initial migration"
     flask db upgrade
     ```
   - Run the backend:
     ```bash
     flask run
     ```

3. **Frontend Setup**
   - Navigate to the `frontend/` folder:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Run the frontend:
     ```bash
     npm start
     ```

## Future Improvements

1. **Draggable Subtasks and Sub-Subtasks**:

   - Allow users to rearrange subtasks and sub-subtasks within their respective categories.

2. **Editable Sub-Lists**:

   - Enable users to edit the names of the todo lists, as opposed to limiting it to "Running", "Recovery", and so on.

3. **Multiple Boards**:

   - Expand the project to support multiple boards, allowing users to create daily or weekly task lists. This would require a `boards` table in the database and UI components to switch between boards.

4. **Automated Task Suggestions**:

   - Set up a cron job to fetch data from Strava and Google Calendar each morning and pass it to OpenAI, which can generate a list of suggested tasks for the day. This is another layer of abstraction, where the user doesn't have to explicitly state which tasks to add

5. **Comprehensive Testing**:
   - Due to time constraints, I implemented unit tests for the backend functions and the main apis and functional components on the frontend.
   - However, the repo could benefit for more comprehensive unit testing on the frontend, as well as integration tests for the end-to-end flow.

## Running Tests

- **Backend**: do this
- **Frontend**: do this

## Dependencies

- **Backend**: Flask, Flask-RESTful, Flask-JWT-Extended, Flask-Migrate, SQLAlchemy, Google API Client, OpenAI API Client
- **Frontend**: React, Ant Design, react-beautiful-dnd, axios
