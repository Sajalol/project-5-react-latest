import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/ToDoList.module.css';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

const SearchToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState({});
  const [priorityFilter, setPriorityFilter] = useState(0); // default to no filter
  const [assignedToFilter, setAssignedToFilter] = useState(0); // default to no filter
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

  // apply assigned to filter if set
  const filteredTasksByUser = assignedToFilter > 0
    ? filteredTasks.filter(task => task.assigned_to === assignedToFilter)
    : filteredTasks;

  // apply sort order and field if set
const sortedFilteredTasks = filteredTasksByUser.sort((a, b) => {
  const fieldToSortBy = sortField === 'category'
    ? task => CATEGORIES_DICT[task.category]
    : task => task[sortField];

  const valA = fieldToSortBy(a);
  const valB = fieldToSortBy(b);

  if (valA > valB) {
    return sortOrder === 'asc' ? 1 : -1;
  } else if (valB > valA) {
    return sortOrder === 'asc' ? -1 : 1;
  } else {
    return 0;
  }
});

// determine which field to sort by
let fieldToSortBy;
if (sortField === 'category') {
fieldToSortBy = task => task.category;
} else if (sortField === 'assigned_to') {
fieldToSortBy = task => users[task.assigned_to]?.username;
} else {
fieldToSortBy = task => task[sortField];
}

// sort tasks based on sort order and field
const sortedTasks = sortOrder === 'asc'
  ? sortedFilteredTasks.sort((a, b) => fieldToSortBy(a) > fieldToSortBy(b) ? 1 : -1)
  : sortedFilteredTasks.sort((a, b) => fieldToSortBy(a) < fieldToSortBy(b) ? 1 : -1);

return (
<div className={styles.todoList}>
<h1>Todo List</h1>
<div className={styles.filters}>
<div className={styles.filter}>
<label htmlFor="search">Search:</label>
<input type="text" id="search" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} />
</div>
<div className={styles.filter}>
<label htmlFor="priority">Priority:</label>
<select id="priority" value={priorityFilter} onChange={event => setPriorityFilter(Number(event.target.value))}>
<option value="0">No filter</option>
{[1, 2, 3].map(priority => (
<option key={priority} value={priority}>{priority}</option>
))}
</select>
</div>
<div className={styles.filter}>
<label htmlFor="assignedTo">Assigned to:</label>
<select id="assignedTo" value={assignedToFilter} onChange={event => setAssignedToFilter(Number(event.target.value))}>
<option value="0">No filter</option>
{Object.values(users).map(user => (
<option key={user.id} value={user.id}>{user.username}</option>
))}
</select>
</div>
<div className={styles.filter}>
<label htmlFor="sortField">Sort by:</label>
<select id="sortField" value={sortField} onChange={event => setSortField(event.target.value)}>
<option value="priority">Priority</option>
<option value="due_date">Due Date</option>
<option value="category">Category</option>
<option value="assigned_to">Assigned To</option>
</select>
</div>
<div className={styles.filter}>
<label htmlFor="sortOrder">Sort order:</label>
<select id="sortOrder" value={sortOrder} onChange={event => setSortOrder(event.target.value)}>
<option value="asc">Ascending</option>
<option value="desc">Descending</option>
</select>
</div>
</div>
<table>
<thead>
<tr>
<th>ID</th>
<th>Title</th>
<th>Description</th>
<th>Priority</th>
<th>Due Date</th>
<th>Category</th>
<th>Assigned To</th>
<th>Completed Percentage</th>
</tr>
</thead>
<tbody>
{sortedTasks
.filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()))
.map(task => (
<tr key={task.id}>
<td>{task.id}</td>

<td>{task.title}</td>
<td>{task.description}</td>
<td>{task.priority}</td>
<td>{task.due_date}</td>
<td>{CATEGORIES_DICT[task.category]}</td>
<td>{users[task.assigned_to]?.username || 'Unassigned'}</td>
<td>
  <input type="number" min="0" max="100" value={task.completed_percentage} onChange={event => updateTask(task.id, event.target.value)} />
</td>
</tr>
))}
</tbody>
</table>
</div>
);
};
export default SearchToDoList;