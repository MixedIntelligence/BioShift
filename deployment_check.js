// Railway Deployment Health Check Script
// Run this to verify the backend is working after Railway rebuild

const axios = require('axios');

const BACKEND_URL = 'https://bioshift-production.up.railway.app';

async function checkDeployment() {
    console.log('🔍 Checking Railway deployment status...\n');
    
    const checks = [
        { name: 'Health Check', url: `${BACKEND_URL}/api/health` },
        { name: 'Database Connection', url: `${BACKEND_URL}/api/labs` },
        { name: 'Gigs Endpoint', url: `${BACKEND_URL}/api/gigs` },
        { name: 'Users Endpoint', url: `${BACKEND_URL}/api/users/test` }
    ];
    
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
}

checkDeployment().catch(console.error);
