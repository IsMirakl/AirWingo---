const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flight.controller');

router.get('/search', [
    query('origin').isLength({ min: 3, max: 3 }).withMessage('Origin must be 3-letter IATA code.'),
    query('destination').isLength({ min: 3, max: 3 }).withMessage('Destination must be 3-letter IATA code.'),
    query('date').isISO8601().toDate().withMessage('Date must be in YYYY-MM-DD format.'),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    flightController.searchFlights(req, res, next);
});

module.exports = router;