// Quick script to clear corrupted localStorage for development
console.log('Clearing corrupted localStorage...');

// Check what's in localStorage
console.log('Current localStorage:');
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    console.log(`- ${key}: ${localStorage.getItem(key)}`);
}

// Clear auth-related items
localStorage.removeItem('token');
localStorage.removeItem('user');
localStorage.removeItem('dashboardTheme');
localStorage.removeItem('navbarColor');
localStorage.removeItem('navbarType');

console.log('✅ localStorage cleared. Please refresh the page and try logging in again.');
