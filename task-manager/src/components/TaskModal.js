import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const TaskModal = ({ open, handleClose, fetchTasks }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const navigate = useNavigate(); // Use navigate hook

  const handleSubmit = async () => {
    if (title.trim()) {
      try {
        const newTask = { title, description, dueDate, column: 'Todo' };
        await axios.post('http://localhost:5000/api/tasks', newTask, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTasks();
        handleClose();
      } catch (error) {
        console.error('Failed to add task', error);
      }
    }
  };

  const handleCloseAndNavigate = () => {
    handleClose();
    navigate('/dashboard'); // Navigate to Dashboard
  };

  return (
    <Modal open={open} onClose={handleCloseAndNavigate}>
      <Box sx={{ ...style, width: 400 }}>
        <Typography variant="h6" component="h2">
          Add New Task
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
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Add Task
        </Button>
      </Box>
    </Modal>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default TaskModal;
