const axios = require('axios');

async function testCompleteApplicationFlow() {
  try {
    // Step 1: Login as worker
    const loginResponse = await axios.post('http://localhost:8080/api/auth/login', {
      email: 'test_worker@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✓ Worker login successful');
    
    // Step 2: Get available gigs
    const gigsResponse = await axios.get('http://localhost:8080/api/gigs', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('✓ Got gigs:', gigsResponse.data.length);
    
    if (gigsResponse.data.length > 0) {
      const firstGig = gigsResponse.data[0];
      console.log('First gig:', firstGig.title);
      
      // Step 3: Apply to first gig
      try {
        const applyResponse = await axios.post(`http://localhost:8080/api/gigs/${firstGig.id}/apply`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('✓ Applied to gig successfully');
      } catch (applyError) {
        console.log('Note: Could not apply (might already be applied):', applyError.response?.data?.error);
      }
    }
    
    // Step 4: Get user applications
    const applicationsResponse = await axios.get('http://localhost:8080/api/users/me/applications', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('✓ User applications endpoint working');
    console.log('Applications count:', applicationsResponse.data.length);
    console.log('Applications:', JSON.stringify(applicationsResponse.data, null, 2));
    
  } catch (error) {
    console.error('✗ Error:', error.response?.data || error.message);
  }
}

testCompleteApplicationFlow();
