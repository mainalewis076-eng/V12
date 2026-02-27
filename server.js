const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(__dirname));

// For SPA - redirect all routes to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
