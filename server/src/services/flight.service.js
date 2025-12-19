const flightRepository = require('../repositories/flight.repository');

async function findFlights(origin, destination, date) {
  if (!/^[A-Z]{3}$/.test(origin) || !/^[A-Z]{3}$/.test(destination)) {
    throw new Error('Invalid IATA codes. Must be 3 uppercase letters.');
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Invalid date format. Must be YYYY-MM-DD.');
  }

  const flights = await flightRepository.searchFlights(origin, destination, date);

  const flightsWithDetails = flights.map(flight => ({
    ...flight,
    available_seats: Math.floor(Math.random() * 150) + 50, 
    base_price: (Math.random() * 500 + 100).toFixed(2),
  }));

  return flightsWithDetails;
}

module.exports = {
  findFlights,
};