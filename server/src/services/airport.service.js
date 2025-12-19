const airportRepository = require('../repositories/airport.repository');
const ApiError = require('../utils/ApiError');

async function getAllAirports(){
    const airports = await airportRepository.findAll();
    return airports;
}

async function getAirportDetails(identifier) {
  let airport;

  if (typeof identifier === 'number' || /^\d+$/.test(identifier)) {
    airport = await airportRepository.findById(parseInt(identifier));
  } else if (typeof identifier === 'string' && identifier.length === 3) {
    airport = await airportRepository.findByIataCode(identifier.toUpperCase());
  } else {
    throw new Error('Invalid airport identifier. Must be ID or 3-letter IATA code.');
  } 

  if (!airport) {
    throw new ApiError(404, 'Airport not found');
  }

  return {
    id: airport.id,
    name: airport.name,
    code: airport.iata_code,
    cityId: airport.city_id,
    timezone: airport.timezone,
  };
}

module.exports = {
    getAllAirports,
    getAirportDetails
}
