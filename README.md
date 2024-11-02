# 26Club - Task Management for Runners

[Demo Video](https://www.loom.com/share/5b6416d0daa6413285bcf722a4b6d022?sid=4fca358f-0ac3-40cf-a1c5-c9e508d78b15)

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

### Backend

To run backend tests with `unittest`, run:

```bash
# Navigate to the backend directory
cd backend

# Run tests with unittest
python -m unittest discover -s tests
```

### Frontend

To run the frontend tests with `jest`, run:

```bash
# Navigate to the frontend directory
cd frontend

# Run Jest tests
npm test

# Run a specific test file
npm test -- <test-file-name>.test.js
```

## Notable HC/LO Applications

### #cs162-separationofconcerns & #cs16_abstraction

- #### Modular Components and APIs

  - Components: I created modular UI components like `<TaskItem/>`, `<Subtask/>`, and`<SubSubtask/>` to separate functionality of the different Dashboard elements. This allows me to extend the functionality of one component without significant changes elsewhere Additionally, by nesting these components within others, pages like the `Dashboard` become more concise and easy to maintain.
    - In a previous iteration of the app, there were no `<Subtask/>` and `<SubSubtask>` components. I mereley iterated over a Task's subtasks and subsubtasks and rendered a (styled) div for each one. This made the code file verbose and diagnosing issues was challenging.
  - API Structure: Instead of having long fetch statements within UI component files, I abstracted API calls into reusable functions stored in the `src/api/` directory. This makes the code more readable and intuitive as api calls are made with simple statements like `tasksApi.addTask()`

- #### Stylesheets and Color Variables

  - Page-Specific Stylesheets: I organized the CSS by creating a dedicated stylesheet for each page, with some components even having their own stylesheets. This structure makes identifying and modifying styles simple and intuitive.
  - CSS Variables: Defining root CSS variables (e.g., `var(--primary-color)` and `var(--border-radius)`) instead of relying on hex codes keeps the styling consistent and manageable, especially as the project grows.

- #### Smart Scheduling Abstraction

  - User Interface Simplification: I chose to omit the `IntegrationsDashboard`, which you can find at `src/pages/IntegrationsDashboard`. This dashboard made the external integrations explicit to the user, and allowed them to veiw their data for each one.
  - However, I decided that there was little utility in just showing the user their data, and they'd derive more value from interfacing with a smart scheduling modal that leverages each integration under the hood. Users can suggestions without being exposed to unnecessary configuration details.
  - Future Improvements: In the "Future Improvements" section, I suggest how we could leverage the smart scheduler to further simplify task creation. Instead of manually recalling tasks, users could accept AI-generated task suggestions based on their data.

### #designthinking

- By using my initial Kanban board from class as a foundation, I could iterate on my todo app over the span of 6 weeks, receiving feedback from my peers and friends.
- While in a breakout with Carl Kho, he expressed that due to how many todo-list apps exist, he'd probably only switch to another one if it was more niche or specialized, like one for developers or students. This motivated me to design specifically for runners.
- I interviewed to of my friends, Juliane Walther and Justin Stoddart, who are avid runners to gain insight their biggest painpoints. To mitigate social desirability bias, I didn't tell them that it was for a product I was building, and I made the questions user-centric, not feature-centric.
  - These interviews inspired the smart-scheduling feature, since Justin and Juliane both live and die by their calendars, but still find it difficult to make time for all of their running-related activities.
- Through continuous iterations, motivated by user feedback, I was able to build a product that's more likely to solve a problem for a specific audience.
