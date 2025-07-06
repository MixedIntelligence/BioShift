// Quick test of applications endpoint
const axios = require('axios');

const API_BASE = 'http://localhost:8080/api';

async function testApplicationsEndpoint() {
  try {
    // Login as worker
    const workerLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'work@work.com',
      password: 'password123'
    });
    
    const workerToken = workerLogin.data.token;
    console.log('✅ Worker login successful');
    
    // Test user applications endpoint
    const response = await axios.get(`${API_BASE}/users/me/applications`, {
      headers: { Authorization: `Bearer ${workerToken}` }
    });
    
    console.log('✅ User applications endpoint working!');
    console.log('Applications found:', response.data.length);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testApplicationsEndpoint();
