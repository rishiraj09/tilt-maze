import axios from 'axios';

// Replace with your computer's IP address and backend port
const API_URL = 'http://192.168.1.59:3001/api/v1'; 

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export default api;