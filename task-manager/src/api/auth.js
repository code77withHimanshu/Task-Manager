import axios from 'axios';

export const login = async (email, password) => {
  return await axios.post('/api/login', { email, password });
};

export const register = async (name, email, password) => {
  return await axios.post('/api/register', { name, email, password });
};
