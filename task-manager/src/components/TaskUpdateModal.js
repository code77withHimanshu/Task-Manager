import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function TaskUpdateModal({ task, open, handleClose, fetchTasks }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [reminder, setReminder] = useState('None'); // State for reminder option
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(new Date(task.dueDate).toISOString().slice(0, 16)); // Format for datetime-local
      setReminder(task.reminder || 'None'); // Initialize reminder from task
    }
  }, [task]);

  const handleSubmit = async () => {
    if (title.trim()) {
      try {
        const updatedTask = { title, description, dueDate, reminder, column: task.column };
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
          type="datetime-local"
          fullWidth
          margin="normal"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Set Due Date Reminder</InputLabel>
          <Select
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
            label="Set Due Date Reminder"
          >
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="At time of due date">At time of due date</MenuItem>
            <MenuItem value="5 minutes before">5 minutes before</MenuItem>
            <MenuItem value="10 minutes before">10 minutes before</MenuItem>
            <MenuItem value="15 minutes before">15 minutes before</MenuItem>
            <MenuItem value="1 hour before">1 hour before</MenuItem>
            <MenuItem value="2 hours before">2 hours before</MenuItem>
            <MenuItem value="1 day before">1 day before</MenuItem>
            <MenuItem value="2 days before">2 days before</MenuItem>
          </Select>
        </FormControl>
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
