import React, { useEffect } from 'react';
import api from './services/api';

function TestConnection() {
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get('/auth/test');
        console.log('Connection successful:', response.data);
      } catch (error) {
        console.error('Connection failed:', error);
      }
    };
    testConnection();
  }, []);

  return <div>Testing connection to backend...</div>;
}

export default TestConnection;