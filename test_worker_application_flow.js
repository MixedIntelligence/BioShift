// Test script for Worker Application Flow
// Run this with: node test_worker_application_flow.js

const axios = require('axios');

const API_BASE = 'http://localhost:8080/api';

// Test credentials
const WORKER_EMAIL = 'work@work.com';
const WORKER_PASSWORD = 'work@work.com';
const LAB_EMAIL = 'lab69@lab69.com';
const LAB_PASSWORD = 'lab69@lab69.com';

let workerToken = '';
let labToken = '';
let testGigId = '';

// Test functions
async function loginWorker() {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: WORKER_EMAIL,
      password: WORKER_PASSWORD
    });
    workerToken = response.data.token;
    console.log('✅ Worker login successful');
    return true;
  } catch (error) {
    console.log('❌ Worker login failed:', error.response?.data?.error || error.message);
    return false;
  }
}

async function loginLab() {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: LAB_EMAIL,
      password: LAB_PASSWORD
    });
    labToken = response.data.token;
    console.log('✅ Lab login successful');
    return true;
  } catch (error) {
    console.log('❌ Lab login failed:', error.response?.data?.error || error.message);
    return false;
  }
}

async function getFirstGig() {
  try {
    const response = await axios.get(`${API_BASE}/gigs`, {
      headers: { Authorization: `Bearer ${workerToken}` }
    });
    if (response.data.length > 0) {
      testGigId = response.data[0].id;
      console.log(`✅ Found test gig: ${response.data[0].title} (ID: ${testGigId})`);
      return true;
    } else {
      console.log('❌ No gigs found');
      return false;
    }
  } catch (error) {
    console.log('❌ Failed to get gigs:', error.response?.data?.error || error.message);
    return false;
  }
}

async function checkApplicationStatus() {
  try {
    const response = await axios.get(`${API_BASE}/gigs/${testGigId}/application-status`, {
      headers: { Authorization: `Bearer ${workerToken}` }
    });
    console.log(`✅ Application status check: ${response.data.hasApplied ? 'Already applied' : 'Not applied yet'}`);
    return response.data.hasApplied;
  } catch (error) {
    console.log('❌ Failed to check application status:', error.response?.data?.error || error.message);
    return false;
  }
}

async function applyToGig() {
  try {
    const response = await axios.post(`${API_BASE}/gigs/${testGigId}/apply`, {}, {
      headers: { Authorization: `Bearer ${workerToken}` }
    });
    console.log('✅ Successfully applied to gig');
    return true;
  } catch (error) {
    console.log('❌ Failed to apply to gig:', error.response?.data?.error || error.message);
    return false;
  }
}

async function getGigApplications() {
  try {
    const response = await axios.get(`${API_BASE}/gigs/${testGigId}/applications`, {
      headers: { Authorization: `Bearer ${labToken}` }
    });
    console.log(`✅ Lab can see ${response.data.length} applications`);
    return response.data;
  } catch (error) {
    console.log('❌ Failed to get applications:', error.response?.data?.error || error.message);
    return [];
  }
}

async function acceptApplication(applicationId) {
  try {
    const response = await axios.post(`${API_BASE}/applications/${applicationId}/accept`, {}, {
      headers: { Authorization: `Bearer ${labToken}` }
    });
    console.log('✅ Successfully accepted application');
    return true;
  } catch (error) {
    console.log('❌ Failed to accept application:', error.response?.data?.error || error.message);
    return false;
  }
}

// Main test flow
async function runTests() {
  console.log('🧪 Testing Worker Application Flow...\n');
  
  // Step 1: Login as worker
  console.log('1. Testing Worker Login...');
  if (!(await loginWorker())) return;
  
  // Step 2: Login as lab
  console.log('\n2. Testing Lab Login...');
  if (!(await loginLab())) return;
  
  // Step 3: Get a gig to test with
  console.log('\n3. Getting test gig...');
  if (!(await getFirstGig())) return;
  
  // Step 4: Check application status
  console.log('\n4. Checking application status...');
  const alreadyApplied = await checkApplicationStatus();
  
  // Step 5: Apply to gig (if not already applied)
  if (!alreadyApplied) {
    console.log('\n5. Applying to gig...');
    if (!(await applyToGig())) return;
  } else {
    console.log('\n5. Skipping application (already applied)');
  }
  
  // Step 6: Check application status again
  console.log('\n6. Checking application status after applying...');
  await checkApplicationStatus();
  
  // Step 7: Lab views applications
  console.log('\n7. Lab viewing applications...');
  const applications = await getGigApplications();
  
  // Step 8: Accept first application (if any)
  if (applications.length > 0) {
    console.log('\n8. Accepting first application...');
    await acceptApplication(applications[0].id);
  }
  
  console.log('\n🎉 Worker Application Flow Test Complete!');
}

// Run the tests
runTests().catch(console.error);
