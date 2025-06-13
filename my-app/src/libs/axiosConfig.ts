import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_APIBACK}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;