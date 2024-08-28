import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function TaskUpdateModal({ task, open, handleClose, fetchTasks }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(new Date(task.dueDate).toISOString().split('T')[0]);
    }
  }, [task]);

  const handleSubmit = async () => {
    if (title.trim()) {
      try {
        const updatedTask = { title, description, dueDate, column: task.column };
        await axios.put(`http://localhost:5000/api/tasks/${task._id}`, updatedTask, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTasks();
        handleClose();
      } catch (error) {
        console.error('Failed to update task', error);
      }
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ width: 400, padding: 4, backgroundColor: '#fff', margin: 'auto', marginTop: '10%', borderRadius: 2 }}>
        <Typography variant="h6" component="h2">
          Update Task
        </Typography>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Due Date"
          variant="outlined"
          type="date"
          fullWidth
          margin="normal"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Box sx={{ marginTop: 3, textAlign: 'right' }}>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
          <Button onClick={handleClose} variant="outlined" sx={{ marginLeft: 2 }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default TaskUpdateModal;
