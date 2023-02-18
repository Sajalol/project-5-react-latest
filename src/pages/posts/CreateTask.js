import React, { useState, useContext, useEffect } from 'react';
import styles from '../../styles/CreateTask.module.css';
import btnStyles from "../../styles/Button.module.css";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

import { Select, Input, Checkbox, DatePicker } from 'antd';
import axios from 'axios';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import moment from 'moment';


const { Option } = Select;

const CreateTask = () => {
  const currentUser = useContext(CurrentUserContext);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    due_date: '',
    created_by: currentUser?.pk,
    assigned_to: '',
    category: '',
    priority: '',
    completed: false,
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('https://rest-api-project5.herokuapp.com/todo/users/')
      .then(res => {
        setUsers(res.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const onFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const onDueDateChange = (date, dateString) => {
    setFormData({
      ...formData,
      due_date: dateString,
    });
  };

  const onCategoryChange = (value) => {
    setFormData({ ...formData, category: value });
  };

  const onPriorityChange = (value) => {
    setFormData({ ...formData, priority: value });
  };

  const onAssignedToChange = (value) => {
    setFormData({ ...formData, assigned_to: value });
  };

  const onCompletedChange = (event) => {
    setFormData({ ...formData, completed: event.target.checked });
  };

   // Validation fields to confirm all fields are filled out 
  const validateFields = () => {
    const { title, content, assigned_to, category, priority, due_date } = formData;
  
    if (!title || !content || !assigned_to || !category || !priority || !due_date) {
      return false;
    }
  
    return true;
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
    
    if (!validateFields()) {
    // show error message
    Swal.fire({
    title: 'Error!',
    text: 'Please fill out all the fields.',
    icon: 'error',
    confirmButtonColor: '#222635',
    confirmButtonText: 'OK',
    });
    return;
    }
    
    axios.post('https://rest-api-project5.herokuapp.com/todo/task-create/', formData)
    .then((result) => {
    Swal.fire({
    title: 'Submitted successfully!',
    icon: 'success',
    confirmButtonColor: '#222635',
    confirmButtonText: 'OK',
    });
    // reset the form data
    setFormData({
    title: '',
    content: '',
    due_date: '',
    created_by: currentUser?.pk,
    assigned_to: '',
    category: '',
    priority: '',
    completed: false,
    });
    })
    .catch((error) => {
    console.error('Error creating task:', error);
    // show error message
    Swal.fire({
    title: 'Error!',
    text: 'An error occurred while submitting the task. Please try again later.',
    icon: 'error',
    confirmButtonColor: '#222635',
    confirmButtonText: 'OK',
    });
    });
    };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={onFormSubmit}>
        <label>Title:</label>
        <Input
          name="title"
          value={formData.title}
          onChange={onFormChange}
          required
        />

        <label>Content:</label>
        <Input.TextArea
          name="content"
          value={formData.content}
          onChange={onFormChange}
          required
        />

        <label>Due Date:</label>
        <DatePicker
          onChange={onDueDateChange}
          disabledDate={(current) => {
            return current && current < moment().startOf('day');
          }}
          required
        />

        <label>Created By:</label>
          <Input
            name="created_by"
            value={currentUser?.username}
            disabled
          />

          <label>Assigned To:</label>
          <Select
            name="assigned_to"
            value={formData.assigned_to}
            onChange={onAssignedToChange}
            required
          >
            {users.map(user => (
              <Option key={user.id} value={user.id}>{user.username}</Option>
            ))}
          </Select>


          {/* <label>Attachements:</label>
          <Input
            name="attachements"
            value={formData.attachements}
            onChange={onFormChange}
          />  */}

          <label>Category:</label>
          <Select
            name="category"
            value={formData.category}
            onChange={onCategoryChange}
            required
          >
            <Option value="" disabled>
              -- Select a category --
            </Option>
            <Option value="0">Backend</Option>
            <Option value="1">Frontend</Option>
            <Option value="2">Database</Option>
            <Option value="3">Python</Option>
            <Option value="4">Javascript</Option>
          </Select>

          <label>Priority:</label>
          <Select
            name="priority"
            value={formData.priority}
            onChange={onPriorityChange}
            required
          >
            <Option value="" disabled>
              -- Select a Priority --
              </Option>
            <Option value={1}>1</Option>
            <Option value={2}>2</Option>
            <Option value={3}>3</Option>
            <Option value={4}>4</Option>
            <Option value={5}>5</Option>
          </Select>

          <label>Completed:</label>
          <Checkbox
            name="completed"
            checked={formData.completed}
            onChange={onCompletedChange}
          />

          <input type="submit" value="Submit" className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`} />

            </form>
          </div>
          );
        };
        
        export default CreateTask;