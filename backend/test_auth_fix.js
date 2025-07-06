#!/usr/bin/env node

// Test script to verify authentication system after fixes
const axios = require('axios');

const baseURL = process.env.RAILWAY_URL || 'http://localhost:8080';

async function testAuthentication() {
    console.log('🧪 Testing BioShift Authentication System');
    console.log('📍 Base URL:', baseURL);
    
    try {
        // Test 1: Health check
        console.log('\n1. Testing health endpoint...');
        const healthResponse = await axios.get(`${baseURL}/api/health`);
        console.log('✅ Health check:', healthResponse.data.message);
        
        // Test 2: Login with test credentials
        console.log('\n2. Testing login with test credentials...');
        const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
            email: 'test@example.com',
            password: 'password123'
        });
        
        console.log('✅ Login successful!');
        console.log('Token received:', loginResponse.data.token.substring(0, 50) + '...');
        
        // Test 3: Validate token format
        console.log('\n3. Validating token format...');
        const token = loginResponse.data.token;
        const tokenParts = token.split('.');
        
        if (tokenParts.length === 3) {
            console.log('✅ Token has correct JWT format (3 parts)');
            
            // Decode payload
            let base64 = tokenParts[1];
            while (base64.length % 4) {
                base64 += '=';
            }
            const payload = JSON.parse(Buffer.from(base64, 'base64').toString());
            console.log('✅ Token payload:', payload);
        } else {
            console.log('❌ Token format invalid:', tokenParts.length, 'parts');
        }
        
        // Test 4: Use token to access protected endpoint
        console.log('\n4. Testing protected endpoint with token...');
        const meResponse = await axios.get(`${baseURL}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('✅ Protected endpoint accessed successfully!');
        console.log('User data:', meResponse.data);
        
        console.log('\n🎉 All authentication tests passed!');
        console.log('✅ The authentication system is working correctly.');
        
    } catch (error) {
        console.error('\n❌ Authentication test failed:');
        console.error('Error:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
        
        if (error.response?.status === 401) {
            console.error('💡 Suggestion: Check if test users are seeded in the database');
        } else if (error.response?.status === 500) {
            console.error('💡 Suggestion: Check if database is initialized properly');
        }
    }
}

// Run the test
testAuthentication();
