const flightService = require('../services/flight.service');

async function searchFlights(req, res) {
  const { origin, destination, date } = req.query;

  if (!origin || !destination || !date) {
    return res.status(400).json({ message: 'Missing required query parameters: origin, destination, and date.' });
  }

  try {
    const flights = await flightService.findFlights(origin.toUpperCase(), destination.toUpperCase(), date);
    res.status(200).json({
      count: flights.length,
      flights: flights,
    });
  } catch (error) {
    if (error.message.includes('Invalid')) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Error searching flights:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  searchFlights,
};