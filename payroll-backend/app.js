// backend/app.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config(); // Load .env file
// Route files
const auth = require('./routes/auth'); // Add this line
const employees = require('./routes/employees');
const payroll = require('./routes/payroll');
const finance = require('./routes/finance');

// Connect to database
connectDB();

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Enable CORS
app.use(cors());

const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json());

// Mount routers
app.use('/api/auth', auth); // Add this line
app.use('/api/employees', employees);
app.use('/api/payroll', payroll);
app.use('/api/finance', finance);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;