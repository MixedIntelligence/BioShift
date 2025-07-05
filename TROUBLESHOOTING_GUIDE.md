# Troubleshooting Guide - BioMVP v9

## Common Issues and Solutions

### Frontend Issues

#### React App Won't Start
**Error:** `npm start` fails or shows "Missing script: start"

**Solution:**
```powershell
# Use the correct script name
npm run start:frontend

# Or run both frontend and backend
npm run dev
```

#### Authentication Errors
**Symptoms:** Login works but profile pages show authentication errors

**Common Causes:**
1. JWT token not being sent with requests
2. Token expired
3. Axios baseURL configuration issues

**Solutions:**
```javascript
// Check if token is being sent
console.log('Auth token:', localStorage.getItem('token'));

// Verify axios interceptor is working
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### Profile Page Errors
**Symptoms:** Profile tabs show errors or empty data

**Debugging Steps:**
1. Check browser console for API errors
2. Verify backend endpoints are responding
3. Check Redux state for user data

```javascript
// Debug Redux state
console.log('Current user:', store.getState().auth.currentUser);
console.log('Is authenticated:', store.getState().auth.isAuthenticated);
```

#### Component Rendering Issues
**Symptoms:** Components not rendering or showing undefined data

**Common Fixes:**
```javascript
// Always check for data before rendering
{currentUser && (
  <div>{currentUser.email}</div>
)}

// Use optional chaining
<div>{user?.profile?.name}</div>

// Provide default values
const { skills = [] } = props;
```

### Backend Issues

#### Server Won't Start
**Error:** `node index.js` fails

**Common Causes:**
1. Missing environment variables
2. Database connection issues
3. Port already in use

**Solutions:**
```powershell
# Check if port is in use
netstat -ano | findstr :3001

# Kill process using port
taskkill /PID <PID_NUMBER> /F

# Check environment variables
node -e "console.log(process.env.JWT_SECRET)"
```

#### Database Errors
**Error:** `SQLITE_ERROR: no such table`

**Solution:**
```powershell
# Run migrations
cd backend
node migrate.js

# Or create tables manually
node -e "
const db = require('./models/db');
const fs = require('fs');
const sql = fs.readFileSync('./models/000_master_migration.sql', 'utf8');
db.exec(sql);
console.log('Tables created');
"
```

#### JWT Authentication Errors
**Error:** `jwt malformed` or `invalid token`

**Debugging:**
```javascript
// Check JWT secret
console.log('JWT Secret exists:', !!process.env.JWT_SECRET);

// Verify token format
const token = req.header('Authorization');
console.log('Raw token:', token);
console.log('Cleaned token:', token?.replace('Bearer ', ''));
```

### API Issues

#### CORS Errors
**Error:** `Access to fetch blocked by CORS policy`

**Solution:**
```javascript
// In backend/index.js, ensure CORS is properly configured
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

#### 404 Errors on API Calls
**Symptoms:** API calls return 404 Not Found

**Check:**
1. Route is properly registered in backend
2. Frontend is calling correct endpoint
3. Middleware is not blocking routes

```javascript
// Debug route registration
console.log('Registered routes:');
app._router.stack.forEach(r => {
  if (r.route) console.log(r.route.path);
});
```

#### 500 Internal Server Errors
**Debugging Steps:**
1. Check server logs for error details
2. Add try-catch blocks to identify error source
3. Verify database queries are correct

```javascript
// Add error logging
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(500).json({ error: 'Internal server error' });
});
```

### Database Issues

#### Missing Tables
**Error:** `SQLITE_ERROR: no such table: user_skills`

**Solution:**
```sql
-- Create missing table manually
CREATE TABLE IF NOT EXISTS user_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    skill TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

#### Data Not Saving
**Common Causes:**
1. Missing fields in INSERT statement
2. Foreign key constraints
3. Data validation errors

**Debugging:**
```javascript
// Add detailed logging to model functions
const addUserSkill = (userId, skill) => {
  console.log('Adding skill:', { userId, skill });
  try {
    const stmt = db.prepare('INSERT INTO user_skills (user_id, skill) VALUES (?, ?)');
    const result = stmt.run(userId, skill);
    console.log('Insert result:', result);
    return result;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};
```

### Environment Issues

#### Missing Environment Variables
**Error:** Application fails to start with environment variable errors

**Solution:**
Create `.env` file in backend directory:
```
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3001
NODE_ENV=development
DB_PATH=./biomvp.sqlite
```

#### PowerShell Execution Policy
**Error:** Cannot run scripts due to execution policy

**Solution:**
```powershell
# Check current policy
Get-ExecutionPolicy

# Set policy for current user
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Performance Issues

#### Slow API Responses
**Debugging Steps:**
1. Add timing logs to identify bottlenecks
2. Check database query performance
3. Monitor memory usage

```javascript
// Add timing middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  next();
});
```

#### Memory Leaks
**Symptoms:** Application becomes slower over time

**Common Causes:**
1. Event listeners not being removed
2. Database connections not being closed
3. Large objects not being garbage collected

**Solutions:**
```javascript
// Clean up event listeners
useEffect(() => {
  const handleEvent = () => {};
  window.addEventListener('event', handleEvent);
  
  return () => {
    window.removeEventListener('event', handleEvent);
  };
}, []);
```

## Debugging Tools and Commands

### Frontend Debugging
```javascript
// React Developer Tools (browser extension)
// Redux DevTools (browser extension)

// Debug API calls
fetch('/api/test', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

### Backend Debugging
```powershell
# Start with debugging
node --inspect backend/index.js

# Check database contents
node -e "
const db = require('./backend/models/db');
console.log('Users:', db.prepare('SELECT * FROM users').all());
console.log('Skills:', db.prepare('SELECT * FROM user_skills').all());
"

# Test specific API endpoint
curl -X GET http://localhost:3001/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Database Debugging
```sql
-- Check table structure
.schema users
.schema user_skills

-- Check data
SELECT * FROM users LIMIT 5;
SELECT * FROM user_skills LIMIT 5;

-- Check foreign key constraints
PRAGMA foreign_key_check;
```

## Prevention Strategies

### Code Quality
- Use ESLint and Prettier for consistent code style
- Implement proper error boundaries in React
- Add comprehensive logging throughout the application
- Use TypeScript for better type safety

### Testing
- Write unit tests for critical functions
- Add integration tests for API endpoints
- Implement end-to-end tests for user flows
- Set up continuous integration

### Monitoring
- Add health check endpoints
- Implement application performance monitoring
- Set up error tracking (e.g., Sentry)
- Monitor database performance

### Documentation
- Keep API documentation updated
- Document environment setup steps
- Maintain troubleshooting guides
- Document known issues and workarounds

## Emergency Procedures

### Application Down
1. Check server logs for errors
2. Verify database connectivity
3. Check if dependent services are running
4. Restart application services
5. Verify all environment variables are set

### Data Loss Prevention
1. Regular database backups
2. Version control for all code changes
3. Environment configuration backups
4. Document recovery procedures

### Security Incidents
1. Change all authentication secrets
2. Check logs for suspicious activity
3. Update all dependencies
4. Review and update security measures

Remember to always test fixes in a development environment before applying to production!
