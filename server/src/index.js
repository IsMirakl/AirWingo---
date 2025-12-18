require('dotenv').config();
const express = require('express');
const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({message: 'Flight Booking Backend API is running!'});
});


app.listen(PORT, () => {
    console.log(`Server start ${PORT}`);
})