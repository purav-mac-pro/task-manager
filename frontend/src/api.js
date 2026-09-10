import axios from 'axios';

const api = axios.create({
  baseURL: 'https://task-manager-server-mcxj.onrender.com',
  withCredentials: true, 
});

export default api;