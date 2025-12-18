const express = require('express');
const router = express.Router();
const airportController = require('../controllers/airport.controller');


router.get('/', airportController.getAirports);

router.get('/:identifier', airportController.getAirpoByIdentifier);

module.exports = router;