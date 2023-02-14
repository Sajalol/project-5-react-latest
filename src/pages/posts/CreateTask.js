import React, { useState, useContext } from 'react';
import styles from '../../styles/CreateTask.module.css';
import btnStyles from "../../styles/Button.module.css";

import { Form, Button, Select, Input, DatePicker, Checkbox } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';

const { Option } = Select;

const CreateTask = () => {
  const currentUser = useContext(CurrentUserContext);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    due_date: moment(),
    created_by: currentUser?.id,
    assigned_to: '',
    attachements: '',
    category: '',
    priority: 5,
    completed: false,
  });

  const onFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const onDueDateChange = (date, dateString) => {
    setFormData({
      ...formData,
      due_date: moment(date).format("dd,MM,YYYY"),
    });
  };

  const onCategoryChange = (value) => {
    setFormData({ ...formData, category: value });
  };

  const onPriorityChange = (value) => {
    setFormData({ ...formData, priority: value });
  };

  const onCompletedChange = (event) => {
    setFormData({ ...formData, completed: event.target.checked });
  };
// TODO: Add logic to send formData to Django API endpoint
  const onFormSubmit = (event) => {
    console.log('form submitted')
    event.preventDefault();
    axios.post('https://rest-api-project5.herokuapp.com/todo/task-create/', formData)
        .then(res => {
            console.log(res.data);
        })
        .catch(error => {
            console.error(error);
        });
  };

  return (
    <div className={styles.formContainer}>
    <form onSubmit={onFormSubmit}>
      <Form.Item label="Title">
        <Input
          name="title"
          value={formData.title}
          onChange={(event) => setFormData({ ...formData, [event.target.name]: event.target.value })}
          required
        />
      </Form.Item>
      <Form.Item label="Content">
        <Input.TextArea
          name="content"
          value={formData.content}
          onChange={(event) => setFormData({ ...formData, [event.target.name]: event.target.value })}
        />
      </Form.Item>
      <Form.Item label="Due Date">
        <DatePicker
          name="due_date"
          value={moment(formData.due_date)}
          onChange={onDueDateChange}
        />
      </Form.Item>
      <Form.Item label="Created By">
        <Input
          name="created_by"
          value={formData.created_by}
          disabled
        />
      </Form.Item>
      <Form.Item label="Assigned To">
        <Input
          name="assigned_to"
          value={formData.assigned_to}
          onChange={(event) => setFormData({ ...formData, [event.target.name]: event.target.value })}
        />
      </Form.Item>
      <Form.Item label="Attachements">
        <Input
          name="attachements"
          value={formData.attachements}
          onChange={(event) => setFormData({ ...formData, [event.target.name]: event.target.value })}
        />
      </Form.Item>
      <Form.Item label="Category">
        <Select
          name="category"
          value={formData.category}
          onChange={onCategoryChange}
        >
            <Option value="0">Backend</Option>
            <Option value="1">Frontend</Option>
            <Option value="2">Database</Option>
            <Option value="3">Python</Option>
            <Option value="4">Javascript</Option>
            </Select>
            </Form.Item>
            <Form.Item label="Priority">
        <Select
          name="priority"
          value={formData.priority}
          onChange={onPriorityChange}
        >
          <Option value={1}>1</Option>
          <Option value={2}>2</Option>
          <Option value={3}>3</Option>
          <Option value={4}>4</Option>
          <Option value={5}>5</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Completed">
        <Checkbox
          name="completed"
          checked={formData.completed}
          onChange={onCompletedChange}
        />
      </Form.Item>
      <Form.Item>
            {/* <Button type="submit" className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}>
            Submit
            </Button> */}
            <input type="submit" value="Submit" />
      </Form.Item>
    </form>
   </div>
  );
}

export default CreateTask;