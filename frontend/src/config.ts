// Centralized API configuration for deployment support (Vercel, Localhost, etc.)
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');
