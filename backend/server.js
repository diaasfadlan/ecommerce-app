const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

console.log('🚀 Starting server...');
console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔧 Firebase Project ID: ${process.env.FIREBASE_PROJECT_ID ? '✓ Set' : '❌ Missing'}`);

let productRoutes, adminRoutes;
try {
  productRoutes = require('./routes/products');
  adminRoutes = require('./routes/admin');
  console.log('✓ Routes loaded successfully');
} catch (err) {
  console.error('❌ Error loading routes:', err);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Simple health check (no Firebase dependency)
app.get('/health', (req, res) => {
  console.log('📍 Health check requested');
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  console.warn(`⚠️ Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message || err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`📦 API: http://localhost:${PORT}/api/products`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app;
