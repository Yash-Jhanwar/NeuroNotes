import axios from 'axios';
import { env } from '@/lib/config/env';

const api = axios.create({
  baseURL: env.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default api;
