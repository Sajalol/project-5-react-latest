import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/ToDoList.module.css';
import { Select } from 'antd';

const { Option } = Select;

const UserTasksList = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState(0); // default to no filter
  const [sortOrder, setSortOrder] = useState('asc'); // default to ascending order
  const [sortField, setSortField] = useState('priority'); // default to sorting by priority
  const [filterUser, setFilterUser] = useState('');

  const CATEGORIES_DICT = {
    0: 'Backend',
    1: 'Frontend',
    2: 'Database',
    3: 'Python',
    4: 'Javascript',
  };

  // Fetch the list of tasks from the server
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        let url = `https://rest-api-project5.herokuapp.com/todo/task-list/${userId}/`;
        if (priorityFilter > 0) {
          url += `?priority=${priorityFilter}`;
        }
        const response = await axios.get(url);
        setTasks(response.data);
      } catch (error) {
        console.error(error);
        setError('Could not fetch tasks');
      }
    };

    fetchTasks();
  }, [userId, priorityFilter]);

  // Fetch the list of users from the server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://rest-api-project5.herokuapp.com/todo/users/');
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  // Handle the search term input
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle the priority filter select
  const handlePriorityFilterChange = (value) => {
    setPriorityFilter(value);
  };

  // Handle the user filter select
  const handleFilterUserChange = (value) => {
    setFilterUser(value);
  };

  // Get the list of task items to render, after applying filters
  const getFilteredTasks = () => {
    let filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterUser !== '') {
      filteredTasks = filteredTasks.filter(task => task.assigned_to === parseInt(filterUser));
    }
    return filteredTasks;
  };

  // Render the list of tasks
  const renderTaskList = () => {
    const filteredTasks = getFilteredTasks();
    if (filteredTasks.length === 0) {
      return <p>No tasks found.</p>;
    }
    return (
      <div>
        <h2>Tasks:</h2>
        <div className={styles.filters}>
          <label>Search:</label>
          <input type="text" value={searchTerm} onChange={handleSearchTermChange} />
          <label>Priority:</label>
          <Select value={priorityFilter} onChange={handlePriorityFilterChange}>
            <Option value={0}>All</Option>
            <Option value={1}>1</Option>
            <Option value={2}>2</Option>
            <Option value={3}>3</Option>
            <Option value={4}>4</Option>
            </Select>
          <label>User:</label>
          <Select value={filterUser} onChange={handleFilterUserChange}>
            <Option value="">All</Option>
            {Object.keys(users).map(key => (
              <Option key={key} value={key}>{users[key]}</Option>
            ))}
          </Select>
        </div>
        <table className={styles.taskList}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Assigned to</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{CATEGORIES_DICT[task.category]}</td>
                <td>{task.priority}</td>
                <td>{users[task.assigned_to]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={styles.userTasksList}>
      {error && <p>{error}</p>}
      {renderTaskList()}
    </div>
  );
};

export default UserTasksList;