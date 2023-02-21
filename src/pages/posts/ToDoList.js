import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/ToDoList.module.css';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState({});
  const [priorityFilter, setPriorityFilter] = useState(0); // default to no filter
  const [sortOrder, setSortOrder] = useState('asc'); // default to ascending order
  const [sortField, setSortField] = useState('priority'); // default to sorting by priority
  const CATEGORIES_DICT = {
    0: 'Backend',
    1: 'Frontend',
    2: 'Database',
    3: 'Python',
    4: 'Javascript',
  };

  const updateTask = async (taskId, completedPercentage) => {
    try {
      completedPercentage = Math.max(0, Math.min(100, completedPercentage)); // Constrain completedPercentage to between 0 and 100
      const response = await axios.put(
        `https://rest-api-project5.herokuapp.com/todo/task-update/${taskId}/`,
        { completed_percentage: completedPercentage }
      );
      // Update the tasks state with the updated task
      setTasks(tasks => tasks.map(task => task.id === taskId ? response.data : task));
    } catch (error) {
      console.error(error);
      setError('Could not update task');
    }
  }
  const currentUser = useCurrentUser();

  useEffect(() => {
    const getUsers = async () => {
      const response = await axios.get('https://rest-api-project5.herokuapp.com/todo/users/');
      const usersData = response.data.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});
      setUsers(usersData);
    };
    getUsers();

    if (currentUser) {
      const getTasks = async () => {
        try {
          const results = [];
          let nextPage = 'https://rest-api-project5.herokuapp.com/todo/task-list/';

          while (nextPage) {
            const res = await axios.get(nextPage);
            results.push(...res.data.results);
            nextPage = res.data.next;
          }

          setTasks(results);
        } catch (error) {
          console.error(error);
          setError('Could not fetch tasks');
        }
      };

      getTasks();
    }
  }, [currentUser]);

  if (error) return <p>{error}</p>;

  const completedTasks = tasks.filter(task => !task.completed);

  // apply priority filter if set
  const filteredTasks = priorityFilter > 0
    ? completedTasks.filter(task => task.priority === priorityFilter)
    : completedTasks;

  // apply sort order and field if set
  const sortedFilteredTasks = filteredTasks.sort((a, b) => {
    const sortOrderMultiplier = sortOrder === 'asc' ? 1 : -1;

    if (sortField === 'priority') {
      return sortOrderMultiplier * (a.priority - b.priority);
    } else if (sortField === 'due_date') {
      return sortOrderMultiplier * (new Date(a.due_date) - new Date(b.due_date));
    }

    return 0;
  });

  // apply search term filter
  const filteredTasksByTitle = sortedFilteredTasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={event =>setSearchTerm(event.target.value)}
          />
        </div>
        <div className={styles.filtersContainer}>
        <div className={styles.priorityFilter}>
            <label>Priority filter:</label>
            <select value={priorityFilter} onChange={event => setPriorityFilter(parseInt(event.target.value))}>
              <option value={0}>No filter</option>
              {[1, 2, 3, 4, 5].map(value => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
          <div className={styles.sortOrder}>
            <label>Sort by:</label>
            <select value={sortField} onChange={event => setSortField(event.target.value)}>
              <option value="priority">Priority</option>
              <option value="due_date">Due date</option>
            </select>
          </div>
          <div className={styles.sortOrder}>
            <label>Sort date:</label>
            <select value={sortOrder} onChange={event => setSortOrder(event.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        <p>Total tasks: {filteredTasksByTitle.length}</p>
        <ul className={styles.taskList}>
          {filteredTasksByTitle.length > 0 ? (
            filteredTasksByTitle.map(task => (
              <li key={task.id} className={styles.task}>
                <h3 className={styles.taskTitle}>{task.title}</h3>
                <p className={styles.taskDueDate}>Due Date: {task.due_date}</p>
                <p className={styles.taskAssignedTo}>Assigned to: {users[task.assigned_to]?.username}</p>
                <p className={styles.taskCategory}>Category: {CATEGORIES_DICT[task.category]}</p>
                <p className={styles.taskPriority}>Priority: {task.priority}</p>
                <div className={styles.taskProgress}>
                  <div className={styles.taskProgressLabel}>Percent completed:</div>
                  <div className={styles.taskProgressBarContainer}>
                    <div
                      className={styles.taskProgressBar}
                      style={{ width: `${Math.max(task.completed_percentage, 5)}%` }}
                    />
                    <div className={styles.taskProgressValue}>{task.completed_percentage}%</div>
                    <button className={styles.taskProgressButton} onClick={() => updateTask(task.id, task.completed_percentage - 10)}>
                      -10%
                    </button>
                    <button className={styles.taskProgressButton} onClick={() => updateTask(task.id, task.completed_percentage + 10)}>
                      +10%
                    </button>
                  </div>
                </div>
                <p className={styles.taskCompleted}>Completed: {task.completed ? 'Yes' : 'No'}</p>
              </li>
            ))
          ) : (
            <p>No tasks to show</p>
          )}
        </ul>
      </div>
    );
  };

  export default TodoList;