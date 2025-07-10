const path = require('path');
// ...existing code...
// Serve React app for all other routes (after API routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});
// ...existing code...
