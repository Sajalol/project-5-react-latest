# React Task Manager

### A Task Manager application built with a Django REST API backend and a React frontend. The application allows users to create, view, update, and delete tasks, as well as view the details of individual tasks.

<br></br>

## Landing Page

### The landing page for the taskmanager will show you some welcoming text, and suggest you to login to use the taskmanager.

![Task Manager Landingpage](/src/assets/welcomepage.PNG)


## Navbar

![Task Manager Navbar](/src/assets/navbar.PNG)

### After you sign in, your navbar will look like this. 

- My To Do List will take you to your to do list. 
- Search User Tasks will take you to a list of all the tasks on all the available users.
- Create Task will take you to the page where you create tasks
- Sign in / Sign out will either sign you out or send you to the login page

<br></br>

## Sign in page

![Task Manager Signin](/src/assets/signin.PNG)

### To sign in you will need a username and password given by an administrator

<br></br>

## My to do list

![Task Manager Todolist](/src/assets/readme1.PNG)

### In your todolist you will get a list of all your task. With the search and sort function you can search for tasks, order them by date / priority etc. You are also able to:
- Update your progression 
- Delete your task
- Change priority
- Change category
- Reassign task

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

<br></br>

## Search User Tasks

![Task Manager Search User Tasks](/src/assets/usertasklist.PNG)

### In the Search User tasks you are able to search for tasks assigned between all users. You are also able to:
- Search by letters in all tasks
- Sort by Priority, Assigned to, Due Date and Category
- Sort order Descending / Ascending 

<br></br>

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

