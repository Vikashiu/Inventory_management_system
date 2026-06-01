import axios from 'axios';

const API_BASE_URL = `https://inventory-management-system-1-6byy.onrender.com`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    'Content-Type': 'application/json' 
  },
});

export default api;
