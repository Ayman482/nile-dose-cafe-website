require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Create Express app for frontend
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API proxy for development
if (process.env.NODE_ENV === 'development') {
  app.use('/api', createProxyMiddleware({ 
    target: 'http://localhost:5000',
    changeOrigin: true
  }));
}

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});
