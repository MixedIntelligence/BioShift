// Quick test of applications endpoint
const axios = require('axios');

const API_BASE = 'http://localhost:8080/api';

async function testApplicationsEndpoint() {
  try {
    // Login as lab
    const labLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'lab69@lab69.com',
      password: 'lab69@lab69.com'
    });
    
    const labToken = labLogin.data.token;
    console.log('✅ Lab login successful');
    
    // Test applications endpoint
    const response = await axios.get(`${API_BASE}/gigs/7/applications`, {
      headers: { Authorization: `Bearer ${labToken}` }
    });
    
    console.log('✅ Applications endpoint working!');
    console.log('Applications found:', response.data.length);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testApplicationsEndpoint();
