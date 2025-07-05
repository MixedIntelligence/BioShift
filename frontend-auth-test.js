// Frontend Authentication Test Script
// Run this in the browser console at http://localhost:3000

console.log("🧪 Testing Frontend Authentication Integration...");

// Test 1: Register a new user
const testUser = {
  email: `frontend-test-${Date.now()}@example.com`,
  password: 'testpass123',
  role: 'Worker'
};

console.log("📝 Test 1: Registration");
fetch('http://localhost:8080/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testUser)
})
.then(response => response.json())
.then(data => {
  if (data.token) {
    console.log("✅ Registration successful! Token received:", data.token.substring(0, 20) + "...");
    
    // Test 2: Login with the same user
    console.log("🔐 Test 2: Login");
    return fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
  } else {
    throw new Error('Registration failed: ' + JSON.stringify(data));
  }
})
.then(response => response.json())
.then(data => {
  if (data.token) {
    console.log("✅ Login successful! Token received:", data.token.substring(0, 20) + "...");
    
    // Test 3: Get user info
    console.log("👤 Test 3: Get User Info");
    return fetch('http://localhost:8080/api/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${data.token}`,
        'Content-Type': 'application/json',
      }
    });
  } else {
    throw new Error('Login failed: ' + JSON.stringify(data));
  }
})
.then(response => response.json())
.then(data => {
  if (data.email) {
    console.log("✅ User info retrieved successfully:", data);
    console.log("🎉 ALL TESTS PASSED! Frontend can successfully communicate with backend!");
  } else {
    throw new Error('Get user info failed: ' + JSON.stringify(data));
  }
})
.catch(error => {
  console.error("❌ Test failed:", error);
});
