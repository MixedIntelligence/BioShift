// Debug script to test login functionality
// Run this in your browser console to test the login process

async function debugLogin() {
  console.log('🔍 Starting login debug...');
  
  // Step 1: Check localStorage
  console.log('📦 Current localStorage:');
  console.log('  - token:', localStorage.getItem('token'));
  console.log('  - user:', localStorage.getItem('user'));
  
  // Step 2: Test backend connectivity
  console.log('🌐 Testing backend connectivity...');
  try {
    const response = await fetch('/api/health');
    console.log('✅ Backend health check:', response.status);
  } catch (error) {
    console.log('❌ Backend health check failed:', error.message);
  }
  
  // Step 3: Test login endpoint
  console.log('🔐 Testing login endpoint...');
  try {
    const loginResponse = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123'
      })
    });
    
    console.log('📡 Login response status:', loginResponse.status);
    const responseData = await loginResponse.json();
    console.log('📡 Login response data:', responseData);
    
    if (loginResponse.ok && responseData.token) {
      console.log('✅ Login endpoint is working!');
      console.log('🎫 Token received:', responseData.token.substring(0, 20) + '...');
    } else {
      console.log('❌ Login endpoint returned error:', responseData);
    }
    
  } catch (error) {
    console.log('❌ Login endpoint test failed:', error.message);
  }
  
  // Step 4: Check if there are any existing users
  console.log('👥 Checking for existing users...');
  try {
    const usersResponse = await fetch('/api/users');
    if (usersResponse.ok) {
      const users = await usersResponse.json();
      console.log('👥 Users found:', users.length);
    } else {
      console.log('❌ Cannot fetch users:', usersResponse.status);
    }
  } catch (error) {
    console.log('❌ Users check failed:', error.message);
  }
  
  console.log('🔍 Debug complete!');
}

// Run the debug
debugLogin();
