const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

// Test data for different roles
const testUsers = [
  {
    email: 'test_lab@example.com',
    password: 'password123',
    role: 'Lab'
  },
  {
    email: 'test_worker@example.com',
    password: 'password123',
    role: 'Worker'
  },
  {
    email: 'test_provider@example.com',
    password: 'password123',
    role: 'Provider',
    companyName: 'Test Company',
    website: 'https://test-company.com'
  }
];

async function testEndpoints() {
  console.log('🚀 Testing Auth Endpoints...\n');

  // Test health check first
  try {
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health check:', healthResponse.data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    console.log('Make sure the server is running on port 8080');
    return;
  }

  for (const testUser of testUsers) {
    console.log(`\n🧪 Testing ${testUser.role} role...`);
    
    try {
      // Test registration
      console.log('📝 Testing registration...');
      const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
      console.log('✅ Registration successful:', { token: registerResponse.data.token ? 'Token received' : 'No token' });
      
      const token = registerResponse.data.token;
      
      // Test login
      console.log('🔐 Testing login...');
      const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ Login successful:', { token: loginResponse.data.token ? 'Token received' : 'No token' });
      
      // Test /api/auth/me
      console.log('👤 Testing /api/auth/me...');
      const authMeResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ /api/auth/me successful:', authMeResponse.data);
      
      // Test /api/users/me
      console.log('👤 Testing /api/users/me...');
      const usersMeResponse = await axios.get(`${BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ /api/users/me successful:', usersMeResponse.data);
      
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('⚠️  User already exists, testing login only...');
        
        try {
          // Test login for existing user
          const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: testUser.email,
            password: testUser.password
          });
          console.log('✅ Login successful:', { token: loginResponse.data.token ? 'Token received' : 'No token' });
          
          const token = loginResponse.data.token;
          
          // Test authenticated endpoints
          const authMeResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('✅ /api/auth/me successful:', authMeResponse.data);
          
          const usersMeResponse = await axios.get(`${BASE_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('✅ /api/users/me successful:', usersMeResponse.data);
          
        } catch (loginError) {
          console.error('❌ Login failed:', loginError.response?.data || loginError.message);
        }
      } else {
        console.error('❌ Error:', error.response?.data || error.message);
      }
    }
  }

  console.log('\n🧪 Testing error cases...');
  
  // Test duplicate email
  try {
    await axios.post(`${BASE_URL}/api/auth/register`, testUsers[0]);
    console.log('❌ Duplicate email should have failed');
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('✅ Duplicate email properly rejected');
    } else {
      console.log('❌ Unexpected error for duplicate email:', error.response?.data);
    }
  }

  // Test invalid credentials
  try {
    await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'nonexistent@example.com',
      password: 'wrongpassword'
    });
    console.log('❌ Invalid credentials should have failed');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Invalid credentials properly rejected');
    } else {
      console.log('❌ Unexpected error for invalid credentials:', error.response?.data);
    }
  }

  // Test missing token
  try {
    await axios.get(`${BASE_URL}/api/auth/me`);
    console.log('❌ Missing token should have failed');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Missing token properly rejected');
    } else {
      console.log('❌ Unexpected error for missing token:', error.response?.data);
    }
  }

  console.log('\n🎉 Auth endpoint testing complete!');
}

// Handle axios installation
async function ensureAxios() {
  try {
    require('axios');
    return true;
  } catch (error) {
    console.log('Installing axios...');
    const { execSync } = require('child_process');
    execSync('npm install axios', { stdio: 'inherit' });
    return true;
  }
}

// Run tests
ensureAxios().then(() => {
  testEndpoints().catch(console.error);
});
