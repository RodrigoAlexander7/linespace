import axios from 'axios';

/**
 * Axios instance for API calls
 * 
 * In production, all requests go through /api/proxy which forwards to the backend.
 * This allows httpOnly cookies to work across different domains (Vercel + Render)
 * by keeping all requests same-origin from the browser's perspective.
 * 
 * In development, can optionally point directly to localhost backend.
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_USE_PROXY === 'false' 
    ? (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000')
    : '/api/proxy',
  withCredentials: true,
});
