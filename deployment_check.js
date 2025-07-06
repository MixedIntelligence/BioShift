// Railway and Vercel Deployment Health Check Script
// Run this to verify both deployments are working

const axios = require('axios');

const BACKEND_URL = 'https://bioshift-production.up.railway.app';
const FRONTEND_URL = 'https://bioshift-seven.vercel.app';

async function checkDeployment() {
    console.log('🔍 Checking deployment status...\n');
    
    // Check Frontend (Vercel)
    console.log('🌐 FRONTEND (Vercel) CHECKS:');
    try {
        const frontendResponse = await axios.get(FRONTEND_URL, {
            timeout: 10000,
            validateStatus: function (status) {
                return status < 500;
            }
        });
        console.log(`✅ Frontend: ${frontendResponse.status} - ${frontendResponse.statusText}`);
    } catch (error) {
        console.log(`❌ Frontend: ${error.message}`);
    }
    console.log('');
    
    // Check Backend (Railway)
    console.log('🚂 BACKEND (Railway) CHECKS:');
    const checks = [
        { name: 'Health Check', url: `${BACKEND_URL}/api/health` },
        { name: 'Database Connection', url: `${BACKEND_URL}/api/labs` },
        { name: 'Gigs Endpoint', url: `${BACKEND_URL}/api/gigs` },
        { name: 'Users Endpoint', url: `${BACKEND_URL}/api/users/test` }
    ];
    
    // Test authentication endpoint
    console.log('🔐 AUTHENTICATION TEST:');
    try {
        const authResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
            email: 'test@bioshift.com',
            password: 'test123'
        }, {
            timeout: 10000,
            validateStatus: function (status) {
                return status < 500;
            }
        });
        console.log(`✅ Login Test: ${authResponse.status} - ${authResponse.statusText}`);
        if (authResponse.data && authResponse.data.token) {
            console.log(`✅ Token received: ${authResponse.data.token.substring(0, 20)}...`);
        }
    } catch (error) {
        console.log(`❌ Login Test: ${error.message}`);
    }
    console.log('');
    
    for (const check of checks) {
        try {
            console.log(`Testing ${check.name}...`);
            const response = await axios.get(check.url, {
                timeout: 10000,
                validateStatus: function (status) {
                    return status < 500; // Accept any status code under 500
                }
            });
            console.log(`✅ ${check.name}: ${response.status} - ${response.statusText}`);
        } catch (error) {
            if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
                console.log(`🔄 ${check.name}: Server not ready yet (${error.code})`);
            } else {
                console.log(`❌ ${check.name}: ${error.message}`);
            }
        }
        console.log('');
    }
    
    console.log('🎯 Next steps:');
    console.log('1. If all green: Proceed with beta testing');
    console.log('2. If issues: Check Railway logs for details');
    console.log('3. Test frontend-backend integration');
    console.log('');
    console.log('🔗 Live URLs:');
    console.log(`Frontend: ${FRONTEND_URL}`);
    console.log(`Backend: ${BACKEND_URL}`);
}

checkDeployment().catch(console.error);
