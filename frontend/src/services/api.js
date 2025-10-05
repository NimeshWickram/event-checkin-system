import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ticketAPI = {
  checkIn: (referenceNumber) => {
    return api.post('/tickets/checkin', { referenceNumber });
  },
  
  getAllTickets: () => {
    return api.get('/tickets');
  },
  
  getStats: () => {
    return api.get('/tickets/stats');
  },
  
  getFinanceStats: () => {
    return api.get('/tickets/finance');
  },
};

export default api;