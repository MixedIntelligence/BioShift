// Debug script to run in browser console
// This will help identify what's re-adding the corrupted token

console.log('🔍 Starting localStorage debug...');

// 1. Check current localStorage contents
console.log('📋 Current localStorage contents:');
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`  ${key}: ${value?.substring(0, 100)}${value?.length > 100 ? '...' : ''}`);
}

// 2. Clear everything
console.log('🧹 Clearing all localStorage...');
localStorage.clear();

// 3. Clear sessionStorage too
console.log('🧹 Clearing all sessionStorage...');
sessionStorage.clear();

// 4. Clear any auth headers
if (window.axios && window.axios.defaults) {
    delete window.axios.defaults.headers.common['Authorization'];
    console.log('🧹 Cleared axios auth headers');
}

// 5. Check for any scripts that might be re-adding tokens
console.log('🔍 Checking for token restoration scripts...');

// 6. Override localStorage.setItem to track what's setting tokens
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
    if (key === 'token' || key === 'user') {
        console.log('🚨 ALERT: Something is trying to set ' + key + ':', value);
        console.trace('Call stack:');
    }
    return originalSetItem.call(this, key, value);
};

console.log('✅ Debug setup complete. Now refresh the page and watch the console.');
console.log('🎯 Try logging in and see what happens in the console.');
