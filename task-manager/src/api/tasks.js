import axios from 'axios';

export const getTasks = async () => {
  return await axios.get('/api/tasks');
};

export const createTask = async (taskData) => {
  return await axios.post('/api/tasks', taskData);
};

export const updateTask = async (id, taskData) => {
  return await axios.put(`/api/tasks/${id}`, taskData);
};

export const deleteTask = async (id) => {
  return await axios.delete(`/api/tasks/${id}`);
};
