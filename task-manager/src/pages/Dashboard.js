import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, TextField, Button, InputAdornment, Grid, IconButton, Tooltip } from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskModal from '../components/TaskModal';
import TaskUpdateModal from '../components/TaskUpdateModal';  // Import TaskUpdateModal
import TaskDetailsModal from '../components/TaskDetailsModal';  // Import TaskDetailsModal
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);  // State for update modal
  const [selectedTask, setSelectedTask] = useState(null);  // State to manage the selected task
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTasks(); // Fetch tasks when component mounts
  }, [token]);

  useEffect(() => {
    // Filter tasks when searchTerm changes
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      const newFilteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(lowercasedFilter) ||
        task.description.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredTasks(newFilteredTasks);
    } else {
      setFilteredTasks([]);
    }
  }, [searchTerm, tasks]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  const handleAddTask = () => {
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    fetchTasks(); // Refresh tasks list when modal is closed
  };

  const handleCloseUpdateModal = () => {
    setSelectedTask(null);
    setIsUpdateModalOpen(false);  // Close update modal
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);  // Set the selected task for updating
    setIsUpdateModalOpen(true);  // Open the update modal
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks(); // Refresh the list after deletion
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  const handleViewDetails = (task) => {
    setSelectedTask(task);  // Set the selected task to be viewed
  };

  const handleCloseTaskDetailsModal = () => {
    setSelectedTask(null);  // Clear the selected task and close the modal
  };

  const handleDragEnd = async (result) => {
    console.log('Drag result:', result); // Confirm this is logged
    const { destination, source, draggableId } = result;
  
    if (!destination) {
      console.log('No destination found');
      return;
    }
  
    const task = tasks.find(task => task._id === draggableId);
    if (!task) {
      console.error('Task not found:', draggableId);
      return;
    }
  
    const updatedTask = {
      ...task,
      column: destination.droppableId
    };
  
    console.log('Updating Task:', updatedTask);
  
    try {
      // Update the task on the server
      const response = await axios.put(`http://localhost:5000/api/tasks/${updatedTask._id}`, updatedTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Task updated successfully:', response.data);
  
      fetchTasks();
  
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };  
  
  const columns = {
    Todo: [],
    'In Progress': [],
    Done: [],
  };

  tasks.forEach((task) => {
    columns[task.column].push(task);
  });

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4, paddingBottom: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <TextField
            label="New Task"
            variant="outlined"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleAddTask}>
            Add Task
          </Button>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            label="Search Tasks"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              endAdornment: <InputAdornment position="end">🔍</InputAdornment>,
            }}
          />
          {/* Render filtered tasks */}
          {filteredTasks.length > 0 && (
            <Box sx={{ marginTop: 2 }}>
              {filteredTasks.map(task => (
                <Box
                  key={task._id}
                  sx={{ padding: 2, marginBottom: 2, backgroundColor: '#fff', borderRadius: 2, boxShadow: 1, cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedTask(task);
                  }}
                >
                  <Typography variant="body1" component="h3" gutterBottom>
                    {task.title}
                  </Typography>
                  <Typography variant="body2" component="h4" gutterBottom>
                    Status: {task.column}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Grid container spacing={3}>
            {['Todo', 'In Progress', 'Done'].map((columnKey) => (
              <Grid item xs={12} sm={4} key={columnKey}>
                <Droppable droppableId={columnKey}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        padding: 2,
                        minHeight: 'calc(100vh - 150px)', // Ensure the height is sufficient
                        maxHeight: 'calc(100vh - 150px)', // Prevent overflow
                        overflowY: 'auto',
                        backgroundColor: columnKey === 'Todo' ? '#f0f0f0' : columnKey === 'In Progress' ? '#e0f7fa' : '#c8e6c9',
                        borderRadius: 2,
                        position: 'relative', // Ensure proper positioning for visual feedback
                      }}
                    >
                      <Typography variant="h6" component="h3" gutterBottom>
                        {columnKey}
                      </Typography>
                      {columns[columnKey].map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                padding: 2,
                                marginBottom: 2,
                                backgroundColor: '#fff',
                                borderRadius: 2,
                                boxShadow: 1,
                              }}
                            >
                              <Typography variant="body1" fontWeight="bold">{task.title}</Typography>
                              <Typography variant="body2">{task.description}</Typography>
                              <Typography variant="body1" fontWeight="bold">Due Date: {new Date(task.dueDate).toLocaleDateString()} {new Date(task.dueDate).toLocaleTimeString()}</Typography>
                              <Typography variant="body2" sx={{ fontSize: '0.6rem' }}>CreatedAt: {new Date(task.createdAt).toLocaleDateString()} {new Date(task.createdAt).toLocaleTimeString()}</Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 1 }}>
                                <Tooltip title="Edit" arrow>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEditTask(task)}
                                    sx={{ fontSize: '1rem' }}
                                  >
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete" arrow>
                                  <IconButton
                                    size="small"
                                    color="secondary"
                                    onClick={() => handleDeleteTask(task._id)}
                                    sx={{ fontSize: '1rem' }}
                                  >
                                    <Delete />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="View" arrow>
                                  <IconButton
                                    size="small"
                                    color="default"
                                    onClick={() => handleViewDetails(task)}
                                    sx={{ fontSize: '1rem' }}
                                  >
                                    <Visibility />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Grid>
            ))}
          </Grid>
        </DragDropContext>

        <TaskModal open={isTaskModalOpen} handleClose={handleCloseTaskModal} fetchTasks={fetchTasks} />
        {/* Task Update Modal */}
        {selectedTask && (
          <TaskUpdateModal
            task={selectedTask}
            open={isUpdateModalOpen}
            handleClose={handleCloseUpdateModal}
            fetchTasks={fetchTasks}
          />
        )}
        {/* Task Details Modal */}
        {selectedTask && !isUpdateModalOpen && (
          <TaskDetailsModal
            task={selectedTask}
            open={Boolean(selectedTask)}
            handleClose={handleCloseTaskDetailsModal}
          />
        )}
      </Paper>
    </Container>
  );
}

export default Dashboard;
