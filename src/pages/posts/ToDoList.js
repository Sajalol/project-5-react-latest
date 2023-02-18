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

  // apply sort order if set
  const sortedFilteredTasks = filteredTasks.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.priority - b.priority;
    } else {
      return b.priority - a.priority;
    }
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
          onChange={event => setSearchTerm(event.target.value)}
        />
      </div>
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
        <label>Sort priority:</label>
        <select value={sortOrder} onChange={event => setSortOrder(event.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <p>Total tasks: {filteredTasksByTitle.length}</p>
      <ul className={styles.taskList}>
        {filteredTasksByTitle.length > 0 ? (
          filteredTasksByTitle.map(task => (
            <li key={task.id} className={styles.task}>
              <h3 className={styles.taskTitle}>{task.title}</h3>
              <p className={styles.taskDueDate}>Due Date: {task.due_date}</p>
              <p className={styles.taskAssignedTo}>Assigned to: {users[task.assigned_to]?.username}</p>
              <p className={styles.taskCategory}>Category: {task.category}</p>
              <p className={styles.taskPriority}>Priority: {task.priority}</p>
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