import React, { useState } from 'react';
import useDebounce from '../../contexts/useDebounce';
import useTasks from '../../contexts/useTasks';
import styles from '../../styles/SearchToDoList.module.css';

const SearchToDoList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [priorityFilter, setPriorityFilter] = useState(0);
  const [assignedToFilter, setAssignedToFilter] = useState(0);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortField, setSortField] = useState('priority');
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);

  const { tasks, error, users, totalPages, currentPage, changePage } = useTasks(debouncedSearchTerm);

  const CATEGORIES_DICT = {
    0: 'Backend',
    1: 'Frontend',
    2: 'Database',
    3: 'Python',
    4: 'Javascript',
  };

  const filterAndSortTasks = (taskList) => {
    let filteredTasks = showCompletedTasks ? taskList : taskList.filter(task => !task.completed);

    if (priorityFilter > 0) {
      filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
    }

    if (assignedToFilter > 0) {
      filteredTasks = filteredTasks.filter(task => task.assigned_to === assignedToFilter);
    }

    return filteredTasks.sort((a, b) => {
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
  };

  const getAttachmentNameFromUrl = (url) => {
    if (!url) return null;
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  };

  const sortedTasks = filterAndSortTasks(tasks);

  if (error) return <p>{error}</p>;

    return (
      
      <div className={styles.todoList}>
        <h1>Users Task List</h1>
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
          <div className={styles.filter}>
            <label htmlFor="showCompletedTasks">Show completed tasks:</label>
            <input type="checkbox" id="showCompletedTasks" checked={showCompletedTasks} onChange={event => setShowCompletedTasks(event.target.checked)} />
          </div>
        </div>
        <div className={styles.paginationControls}>
          <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.id}>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Category</th>
              <th>Assigned To</th>
              <th>Attachments</th>
              <th>Completed Percentage</th>
              <th>Task Completed</th>
            </tr>
          </thead>
        <tbody>
              {sortedTasks
                .filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(task => (
                  <tr key={task.id}>
                    <td className={styles.id}>{task.id}</td>
                    <td className={styles.title}>{task.title}</td>
                    <td className={styles.content}>{task.content}</td>
                    <td className={styles.priority}>{task.priority}</td>
                    <td className={styles.dueDate}>{task.due_date}</td>
                    <td className={styles.category}>{CATEGORIES_DICT[task.category]}</td>
                    <td className={styles.assignedTo}>{users[task.assigned_to]?.username || 'Unassigned'}</td>
                    <td className={styles.taskAttachment}>
                    {task.attachments ? (
                      <div className={styles.taskAttachment}>
                        <p>{getAttachmentNameFromUrl(task.attachments) || 'No name'}</p>
                        <a href={task.attachments} target="_blank" rel="noopener noreferrer">
                            View
                        </a>
                      </div>
                    ) : (
                      <p>No attachment</p>
                    )}
                  </td>
                    <td className={styles.completedPercentage}>{task.completed_percentage}%</td>
                    <td className={styles.completed}>{task.completed ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
            </tbody>
      </table>
      <div className={styles.paginationControls}>
          <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
    </div>
  );
};
export default SearchToDoList;