# React Task Manager

### A Task Manager application built with a Django REST API backend and a React frontend. The application allows users to create, view, update, and delete tasks, as well as view the details of individual tasks.

### This is another variant of Project example idea 3: productivity app. I changed this to a task manager app instead. 

<br>

## Table of Contents

1. [Landing Page](#landing-page)
2. [Navbar](#navbar)
3. [Sign in page](#sign-in-page)
4. [My to do list](#my-to-do-list)
5. [Search User Tasks](#search-user-tasks)
6. [Create Task](#create-task)
7. [Page not found](#page-not-found)
8. [Testing](#testing)
9. [Bugs and optimizations](#bugs--optimizations)
10. [Wireframes](#wireframes)
11. [Deployment](#deployment)
12. [Prerequisites](#prerequisites)
13. [Installation and Setup](#installation-and-setup)
14. [Technologies Used](#technologies-used)
15. [Contributing](#contributing)
16. [Deployed Project](#deployed-project) And usernames + passwords
17. [Agile](#agile-process)
18. [Credits](#credits)

<br>

## Landing Page

### The landing page for the taskmanager will show you some welcoming text, and suggest you to login to use the taskmanager.

![Task Manager Landingpage](/src/assets/welcomepage.PNG)


## Navbar

### The navbar is easy to navigate, and features all three pages and the sign up, sign in and logout if you're logged in. And the navbar is fully responsive. The navbar is alike on all the pages.

### After you sign in, your navbar will look like this. 

![Task Manager Navbar](/src/assets/navbar.PNG)

- My To Do List will take you to your to do list. 
- Search User Tasks will take you to a list of all the tasks on all the available users.
- Create Task will take you to the page where you create tasks
- Sign in / Sign out will either sign you out or send you to the login page

<br>

## Sign in page

![Task Manager Signin](/src/assets/signin.PNG)

### To sign in, you will need a username and password provided by an administrator. The username and password must be created in the API.

<br>

## My to do list

![Task Manager Todolist](/src/assets/readme1.PNG)

### In your todolist you will get a list of all your task. With the search and sort function you can search for tasks, order them by date / priority etc. You are also able to:
- Update your progression 
- Delete your task
- Change priority
- Change category
- Reassign task
- When filling out the progression bar to 100%, it will show as completed

### In each task you see this info:
- Title
- Description
- Due Date
- Assigned to
- Category
- Priority
- Attachments
- Progression
- If completed yes / no
- Option to delete task

<br>

## Search User Tasks

![Task Manager Search User Tasks](/src/assets/usertasklist.PNG)

### In the Search User tasks you are able to search for tasks assigned between all users. You are also able to:
- Search by letters in all tasks
- Sort by Priority, Assigned to, Due Date and Category
- Sort order Descending / Ascending
- View and download attachments

<br>

## Create Task

![Task Manager CreateTask](/src/assets/createtask.PNG)

### This page is where you create tasks. In it you are able to:
- Give the task a Title
- Content / Description of the task
- Set a due date
- Created by is locked to the signed in user
- Assign it to any created user
- Upload attachments to the task
- Set category between: Backend, Frontend, Python, Javascript and Database
- Set priority between 1-5
- Set progression between 0-100% if some of the task is already done
- Mark the task as completed

## Page not found

### If you try to type wrong link you will get "Page not found!" error

<br>

# Testing

## CreateTask form test

- The whole form needs to be filled out, except attachment and completed.
- You will get a error message saying "Please fill out all the fields" when they are not filled out.
- Tested with leaving one and one field out. Working as intended
- You can test the form by seeing a new task in the Rest Api or in the search user task / my to do list 

<br>

## My To do list form test

- Comparing all tasks to API and on the page
- Testing search functions working as intended
- Testing sort functions working as intended
- Testing filtering working as intended
- Testing delete button deletes task in view and api
- Testing attachment view and download working as intended
- Testing assigned to, category and priority changes also affects api and works after refresh
- Fixed pagination only to 10 per page
- When filling out the progression bar to 100%, it will show as completed

<br>

## Search user task test

- Comparing all tasks to API and on the page
- Testing search functions working as intended
- Testing sort functions working as intended
- Testing filtering working as intended
- Testing attachment view and download working as intended
- Fixed pagination only to 10 per page

<br>

## Sign in and out test

- Sign in and out works as indended from the nav bar
- The sign in text should change to "Sign out" when you are logged in, and when you arent signed in, it should say "Sign out"


<br>

## Testing on multiple devices

- Tested the web page on different devices with no issues.. The webpage is responsive from desktop, to small mobile phones and tablets. 
- Testing using the inspect in chrome, with devices options there. Devices are responsive and navbar + tasks etc works as intended. 

<br>


# Bugs / optimizations

## Current known bugs:
- No known issues.

## Optimizations:
- The pagination won't pull 10 tasks per page during search and filtering. They will stay on the page they originaly are on. This is for "my to do list" and "search user tasks"
- Can move more hooks to own files

<br>

# Wireframes

## Homepage

![Task manage homepage](/src/assets/homepage.wire.PNG)

## My to do list

![Task manager myodolist](/src/assets/mytodolist.wire.PNG)

## Search to do list

![Task manager searchtodolist](/src/assets/searchtodolist.wire.PNG)

## Create task

![Task manager Createtask](/src/assets/createtask.wire.PNG)


# Deployment

This project is deployed using Heroku for both the Django backend and the React frontend.

## Frontend Deployment

1. Create a new Heroku app.
2. Update the `API_URL` environment variable in your React app to point to the deployed Django API.
3. Commit your changes and push the project to a new GitHub repository.
4. Connect your Heroku app to your GitHub repository and enable automatic deploys.
5. Deploy your app by triggering a manual deploy or pushing new changes to your GitHub repository.

## Additional Deployment Notes

- Make sure to set the environment variables for both the backend and frontend deployments, such as the `SECRET_KEY`, `API_URL`, and any other necessary variables.
- Remember to run `collectstatic` for the Django app to serve static files in production.
- Configure CORS settings in the Django backend to allow requests from the React frontend.
- In package.json in Frontend deployment scripts text is needed to be changed to:
- "scripts": {
    "start": "react-scripts start",
    "prod": "serve -s build",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
- Else the deployment will fail

<br>

# Prerequisites

Ensure that you have the following software installed on your local machine before proceeding:

- Python 3.8 or higher
- Node.js 14 or higher
- npm 7 or higher
- Git

<br>

# Installation and Setup

0. Set up the backend repository:

- Before setting up the frontend, you need to have the backend API up and running. Follow the instructions in the [backend repository](https://github.com/Sajalol/rest_api_5) to clone, install dependencies, and start the backend server.

Once the backend server is running, proceed to set up the frontend:

1. Clone the repository:

- git clone https://github.com/Sajalol/project-5-react-latest.git

2. Install frontend dependencies:

- npm install

3. Start the server from the terminal

- npm start

4. The application should now be running at `http://localhost:3000`.

- Remember you need to the API backend for this frontend to work!

<br>

# Technologies Used

- React
- Redux
- Axios
- Bootstrap
- Django
- Django REST Framework
- PostgreSQL

<br>

# Deployed Project

- Heroku Frontend deployed: https://project-5-react.herokuapp.com/ 
- Heroku Backend deployed: https://rest-api-project5.herokuapp.com/
- To be able to log into the backend, add "admin" back of the link (https://rest-api-project5.herokuapp.com/admin)

<br>

# Username and passwords to test the taskmanager with

- User 1:  Username: User1   / Password: Project5Test
- User 2:  Username: User2   / Password: Project5Test
- User 3:  Username: User3   / Password: Project5Test

<br>

# Agile Process

1. User Stories and Epics
We maintain a list of user stories and epics in this README file. Each user story includes a clear description and acceptance criteria. User stories are grouped under their corresponding epics.

2. Prioritization
User stories are prioritized based on their importance and complexity. High-priority user stories are listed at the top of each epic section.

3. Progress Tracking

- To track the progress of user stories, we use the following status labels:

[ ] To Do
[ ] In Progress
[ ] In Review
[ ] Done
- Update the status of a user story by checking or unchecking the corresponding checkbox.

## User Stories and Epics

## Epic 1: User Authentication

### User Story 1.1: As a user, I want to register for an account

- [x] Done
* Acceptance Criteria:
- Users can provide their email, username, and password to create an account

### User Story 1.2: As a user, I want to log in to my account

- [x] Done
* Acceptance Criteria:
- Users can log in using their email/username and password
- Users are redirected to the dashboard after successful login

## Epic 2: Task Management

### User Story 2.1: As a user, I want to create a task

- [x] Done
* Acceptance Criteria:
- Users can provide a title, description, due date, category, priority, and assignee to create a task
- Users can attach files to the task

### User Story 2.2: As a user, I want to view my tasks

- [x] Done
* Acceptance Criteria:
- Users can view a list of their tasks
- Users can filter and sort tasks by different criteria

### User Story 2.3: As a user, I want to update my tasks

- [x] Done
* Acceptance Criteria:
- Users can update the category, priority, assignee, and progress of a task
- Users can mark a task as completed

### User Story 2.4: As a user, I want to delete my tasks

- [x] Done
* Acceptance Criteria:
- Users can delete a task from their task list

## Epic 3: User Interface

### User Story 3.1: As a user, I want a visually appealing sign-in form

- [x] To Do
* Acceptance Criteria:
  - The sign-in form is well-designed and easy to use
  - Users can easily input their username and password to sign in

### User Story 3.2: As a user, I want clear error messages when sign-in fails

- [x] To Do
* Acceptance Criteria:
  - Users are shown a clear error message when they enter incorrect credentials
  - Error messages are styled consistently with the rest of the application

## Epic 4: Task Searching

### User Story 4.1: As a user, I want to search tasks by user

- [x] To Do
* Acceptance Criteria:
  - Users can search tasks by entering another user's username
  - Users can view a list of tasks assigned to the specified user

## Epic 5: Navigation

### User Story 5.1: As a user, I want an intuitive navigation menu

- [x] To Do
* Acceptance Criteria:
  - Users can easily navigate through the application using the navigation menu
  - The navigation menu adapts to display relevant options based on whether the user is logged in or not

## Epic 6: Form Validation and Error Handling

### User Story 6.1: As a user, I want to receive an error message when trying to create a task without filling out all required fields

- [x] To Do
* Acceptance Criteria:
  - Users receive a clear error message when they attempt to create a task without filling out all required fields
  - The error message is styled consistently with the rest of the application


# Credits

* Code Institute for training.
* Various articles and youtubers for ideas. 
* Code Institute Slack and Tutoring assistance. 