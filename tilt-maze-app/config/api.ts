import axios from 'axios';

// Replace with your computer's IP address and backend port
const server = "164.90.227.121";
const local = "192.168.1.59"
const API_URL = `http://${server}/api/v1`; 

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export default api;