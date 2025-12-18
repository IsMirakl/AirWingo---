require('dotenv').config();
const express = require('express');
const app = express()
const PORT = process.env.PORT || 3000;


const airportRoutes = require('./routes/airport.routes');

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({message: 'Flight Booking Backend API is running!'});
});

app.use('/api/v1/airports', airportRoutes);

// processing errors
app.use((err, req, res, next) => {
    res.status(404).json({ message: 'Resource not found'});
});


// global processing errors for express
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: 'Something went wrong!'});
}); 

app.listen(PORT, () => {
    console.log(`Server start ${PORT}`);
})