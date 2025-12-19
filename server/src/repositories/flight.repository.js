const db = require('../config/db.config');


async function searchFlights(originIata, destinationIata, date){
    const sql = `
      SELECT
        s.id AS schedule_id,
        s.scheduled_departure,
        s.scheduled_arrival,
        r.flight_number,
        a_orig.iata_code AS origin_iata,
        a_dest.iata_code AS destination_iata,
        al.name AS airline_name,
        ac.model AS aircraft_model
    FROM
        schedules s
    JOIN
        routes r ON s.route_id = r.id
    JOIN
        airports a_orig ON r.origin_airport_id = a_orig.id
    JOIN
        airports a_dest ON r.end_airport_id = a_dest.id
    JOIN
        airlines al ON r.airline_id = al.id
    JOIN
        aircrafts ac ON s.aircraft_id = ac.id
    WHERE
        a_orig.iata_code = $1 AND
        a_dest.iata_code = $2 AND
        DATE(s.scheduled_departure) = $3
    ORDER BY
        s.scheduled_departure;
  `;

  const {rows} = await db.query(sql, [originIata, destinationIata, date]);

}

module.exports = {
    searchFlights,
}