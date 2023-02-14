import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/ToDoList.module.css';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const currentUser = useCurrentUser();

    useEffect(() => {
        if (currentUser) {
            axios.get('https://rest-api-project5.herokuapp.com/todo/task-list/')
                .then(res => {
                    console.log(res.data);
                    setTasks(res.data.results);
                })
                .catch(error => {
                    console.error(error);
                    setError('Could not fetch tasks');
                });
        }
    }, [currentUser]);



    if (error) return <p>{error}</p>;

    return tasks.length > 0
        ? (
            <ul className={styles.taskList}>
                {
                    tasks.map(task => {
                        return (
                            <li key={task.id} className={styles.task}>
                                <h3 className={styles.taskTitle}>{task.title}</h3>
                                <p className={styles.taskDueDate}>Due Date: {task.due_date}</p>
                                <p className={styles.taskAssignedTo}>Assigned to: {task.assigned_to}</p>
                                <p className={styles.taskCategory}>Category: {task.category}</p>
                                <p className={styles.taskPriority}>Priority: {task.priority}</p>
                                <p className={styles.taskCompleted}>Completed: {task.completed ? 'Yes' : 'No'}</p>
                            </li>
                        )
                    })
                }
            </ul>
        )
        : <p>No tasks to show</p>;
};

export default TodoList;