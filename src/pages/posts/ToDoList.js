import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/ToDoList.module.css';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { Select } from 'antd';
const { Option } = Select;



const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState({});
  const [priorityFilter, setPriorityFilter] = useState(0); // default to no filter
  const [sortOrder, setSortOrder] = useState('asc'); // default to ascending order
  const [sortField, setSortField] = useState('priority'); // default to sorting by priority
  const [showCompletedTasks, setShowCompletedTasks] = useState(true); // default to showing completed tasks
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
      const completed = completedPercentage === 100 ? true : false; // Set completed to true if completedPercentage is 100, otherwise false
      const response = await axios.put(
        `https://rest-api-project5.herokuapp.com/todo/task-update/${taskId}/`,
        { completed_percentage: completedPercentage, completed: completed }
      );
      // Update the tasks state with the updated task
      setTasks(tasks => tasks.map(task => task.id === taskId ? response.data : task));
    } catch (error) {
      console.error(error);
      setError('Could not update task');
    }
  };
  
  const updateAssignedTo = async (taskId, assignedTo) => {
    try {
      const response = await axios.put(
        `https://rest-api-project5.herokuapp.com/todo/task-update/${taskId}/`,
        { assigned_to: assignedTo }
      );
      // Update the tasks state with the updated task
      setTasks(tasks => tasks.map(task => task.id === taskId ? response.data : task));
    } catch (error) {
      console.error(error);
      setError('Could not update task');
    }
  };
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
          let nextPage = `https://rest-api-project5.herokuapp.com/todo/task-list/?assigned_to=${currentUser.pk}`;
    
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

  const completedTasks = showCompletedTasks ? tasks : tasks.filter(task => !task.completed);

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
            <label>Sort:</label>
            <select value={sortOrder} onChange={event => setSortOrder(event.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          <div className={styles.filter}>
            <label htmlFor="showCompletedTasks">Show completed tasks:</label>
            <input type="checkbox" id="showCompletedTasks" checked={showCompletedTasks} onChange={event => setShowCompletedTasks(event.target.checked)} />
          </div>
        </div>
        <p>Total tasks: {filteredTasksByTitle.length}</p>
        <ul className={styles.taskList}>
          {filteredTasksByTitle.length > 0 ? (
            filteredTasksByTitle.map(task => (
              <li key={task.id} className={styles.task}>
                <h3 className={styles.taskTitle}>{task.title}</h3>
                <p className={styles.taskContent}>{task.content}</p>
                <p className={styles.taskDueDate}><strong>Due Date:</strong><br/>{task.due_date}</p>
                <div className={styles.taskAssignedTo}>
                        <label><strong>Assigned to:</strong></label>
                        <Select
                          value={task.assigned_to}
                          onChange={newAssignedTo => updateAssignedTo(task.id, newAssignedTo)}
                        >
                          {Object.values(users).map(user => (
                            <Option key={user.id} value={user.id}>{user.username}</Option>
                          ))}
                        </Select>
                      </div>
                <p className={styles.taskCategory}><strong>Category:</strong><br/>{CATEGORIES_DICT[task.category]}</p>
                <p className={styles.taskPriority}><strong>Priority:</strong><br/>{task.priority}</p>
                {task.attachments && task.attachments.length > 0 ? (
                <div className={styles.taskAttachments}>
                  {task.attachments.map(attachment => (
                    <a key={attachment.id} href={attachment.file} target="_blank" rel="noopener noreferrer">{attachment.filename}</a>
                  ))}
                </div>
              ) : (
                <p>No attachments available</p>
              )}
                <div className={styles.taskProgress}>
                  <div className={styles.taskProgressLabel}><strong>Percent completed:</strong></div>
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
                <p className={styles.taskCompleted}><strong>Completed:</strong><br/>{task.completed ? 'Yes' : 'No'}</p>
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