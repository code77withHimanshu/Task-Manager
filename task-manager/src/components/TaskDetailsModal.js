import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

function TaskDetailsModal({ task, open, handleClose }) {
  if (!task) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ width: 400, padding: 4, backgroundColor: '#fff', margin: 'auto', marginTop: '10%', borderRadius: 2 }}>
        <Typography variant="h6" component="h2">
          {task.title}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          Description: {task.description}
        </Typography>
        <Typography variant="body2" sx={{ marginTop: 1 }}>
          Created At: {new Date(task.createdAt).toLocaleDateString()} {new Date(task.createdAt).toLocaleTimeString()}
        </Typography>
        <Typography variant="body2" sx={{ marginTop: 1 }}>
          Due Date: {new Date(task.dueDate).toLocaleDateString()} {new Date(task.dueDate).toLocaleTimeString()}
        </Typography>
        <Typography variant="body2" sx={{ marginTop: 1 }}>
          Reminder: {task.reminder}
        </Typography>
        <Box sx={{ marginTop: 3, textAlign: 'right' }}>
          <Button onClick={handleClose} variant="contained" color="primary">
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default TaskDetailsModal;
