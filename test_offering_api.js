// Test the offering API endpoint
const fetch = require('node-fetch');

async function testOfferingAPI() {
  try {
    // First, let's test without auth to see what happens
    const response = await fetch('http://localhost:3001/api/offerings/2');
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));
    
    const data = await response.text();
    console.log('Response body:', data);
    
    if (response.ok) {
      console.log('✓ API endpoint is working');
    } else {
      console.log('✗ API endpoint failed');
    }
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testOfferingAPI();
