const axios = require('axios');

async function testUserApplications() {
  try {
    // Login as worker
    const loginResponse = await axios.post('http://localhost:8080/api/auth/login', {
      email: 'test_worker@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✓ Worker login successful');
    console.log('Token:', token);
    
    // Get user applications
    const applicationsResponse = await axios.get('http://localhost:8080/api/users/me/applications', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✓ User applications endpoint working');
    console.log('Applications:', JSON.stringify(applicationsResponse.data, null, 2));
    
  } catch (error) {
    console.error('✗ Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Request URL:', error.config?.url);
  }
}

testUserApplications();
