require('dotenv').config();
require('./config/passport.config');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const authRoutes = require('./routes/auth.routes');
const airportRoutes = require('./routes/airport.routes');
const flightRoutes = require('./routes/flight.routes');

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Flight Booking Backend API is running!' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/airports', airportRoutes);
app.use('/api/v1/flights', flightRoutes);

// processing errors
app.use((err, req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

// global processing errors for express
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    message: message,
  });
});

app.listen(PORT, () => {
  console.log(`Server start ${PORT}`);
});
