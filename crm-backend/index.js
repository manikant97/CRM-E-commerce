const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing form data

// Connect to MongoDB (optional for development)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.warn("⚠️ MongoDB Connection Warning:", err.message));

// Continue even if MongoDB connection fails
process.on('unhandledRejection', (reason, promise) => {
  console.warn('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Routes
const customerRoutes = require('./routes/customers');
const analyticsRoutes = require('./routes/analytics');
const leadRoutes = require('./routes/leads');
app.use('/api/products', require('./routes/productRoutes'));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/leads', leadRoutes);


// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!'
    });
});

app.get('/', (req, res) => {
  res.send('🚀 CRM Backend Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`);
});