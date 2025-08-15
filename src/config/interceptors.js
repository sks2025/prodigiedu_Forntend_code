import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.prodigiedu.com',
  prepareHeaders: (headers, { getState }) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    // Add common headers
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    
    return headers;
  },
});

export const responseHandler = async (response) => {
  if (response.error) {
    // Handle specific error cases
    if (response.error.status === 401) {
      // Handle unauthorized access
      // You might want to redirect to login or refresh token
    }
    
    // You can add more specific error handling here
    return Promise.reject(response.error);
  }
  
  return response;
};

export const requestHandler = async (args, api, extraOptions) => {
  // You can modify the request here before it's sent
  // For example, add timestamps, modify headers, etc.
  return args;
}; 