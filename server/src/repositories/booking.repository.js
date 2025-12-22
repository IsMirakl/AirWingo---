const db = require('../config/db.config');

class BookingRepository {
  async checkSeatAvailability(scheduleId, requiredSeats) {
    const sql = `
      SELECT 
        s.available_seats,
        s.total_seats,
        (SELECT COUNT(*) FROM tickets t 
         WHERE t.schedule_id = s.id AND t.status = 'confirmed') AS booked_seats
      FROM schedules s
      WHERE s.id = $1
      FOR UPDATE
    `;

    const { rows } = await db.query(sql, [scheduleId]);

    if (rows.length === 0) {
      throw new Error('Schedule not found');
    }

    const schedule = rows[0];
    const availableSeats = schedule.available_seats || schedule.total_seats - schedule.booked_seats;

    return availableSeats >= requiredSeats;
  }

  async createBookingWithTickets(bookingData) {
    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      const isAvailable = await this.checkSeatAvailability(
        bookingData.scheduleId,
        bookingData.passengers.length
      );

      if (!isAvailable) {
        throw new Error('Not enough seats available');
      }

      const bookingSql = `
        INSERT INTO bookings (
          user_id, 
          schedule_id, 
          total_amount, 
          status, 
          payment_status,
          booking_reference
        ) 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, booking_reference, created_at, status, total_amount
      `;

      const bookingResult = await client.query(bookingSql, [
        bookingData.userId,
        bookingData.scheduleId,
        bookingData.totalAmount,
        'confirmed',
        bookingData.paymentStatus || 'pending',
        this.generateBookingReference(),
      ]);

      const booking = bookingResult.rows[0];

      const tickets = [];

      for (const passenger of bookingData.passengers) {
        let passengerId = passenger.id;

        if (!passengerId) {
          const passengerSql = `
            INSERT INTO passengers (
              first_name, 
              last_name,
              middle_name.
              date_of_birth, 
              passport_number,
            ) 
            VALUES ($1, $2, $3, $4)
            RETURNING id
          `;

          const passengerResult = await client.query(passengerSql, [
            passenger.firstName,
            passenger.lastName,
            passenger.dateOfBirth,
            passenger.passportNumber,
            passenger.nationality,
          ]);

          passengerId = passengerResult.rows[0].id;
        }

        const ticketSql = `
          INSERT INTO tickets (
            booking_id,
            schedule_id,
            passenger_id,
            seat_number,
            ticket_class,
            price,
            status,
            ticket_number
          ) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id, ticket_number, seat_number, ticket_class, price, status
        `;

        const ticketResult = await client.query(ticketSql, [
          booking.id,
          bookingData.scheduleId,
          passengerId,
          await this.assignSeatNumber(bookingData.scheduleId),
          passenger.ticketClass || 'economy',
          passenger.price,
          'confirmed',
          this.generateTicketNumber(),
        ]);

        tickets.push(ticketResult.rows[0]);
      }

      const updateSeatsSql = `
        UPDATE schedules 
        SET available_seats = available_seats - $1
        WHERE id = $2
      `;

      await client.query(updateSeatsSql, [bookingData.passengers.length, bookingData.scheduleId]);

      await client.query('COMMIT');

      return {
        booking,
        tickets,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Booking transaction failed:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  generateBookingReference() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `BK${result}${Date.now().toString().slice(-6)}`;
  }

  generateTicketNumber() {
    return `TKT${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }

  async assignSeatNumber(scheduleId) {
    const takenSeatsSql = `
      SELECT seat_number FROM tickets 
      WHERE schedule_id = $1 AND status != 'cancelled'
    `;

    const { rows } = await db.query(takenSeatsSql, [scheduleId]);
    const takenSeats = new Set(rows.map((row) => row.seat_number));

    let seatNumber;
    let row = 'A';
    let seat = 1;

    do {
      seatNumber = `${row}${seat}`;
      seat++;

      if (seat > 30) {
        seat = 1;
        row = String.fromCharCode(row.charCodeAt(0) + 1);
      }
    } while (takenSeats.has(seatNumber));

    return seatNumber;
  }

  async cancelBooking(bookingId, userId) {
    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      const checkSql = `
        SELECT b.*, COUNT(t.id) as ticket_count
        FROM bookings b
        LEFT JOIN tickets t ON b.id = t.booking_id
        WHERE b.id = $1 AND b.user_id = $2
        GROUP BY b.id
        FOR UPDATE
      `;

      const { rows } = await client.query(checkSql, [bookingId, userId]);

      if (rows.length === 0) {
        throw new Error('Booking not found or access denied');
      }

      const booking = rows[0];

      const updateBookingSql = `
        UPDATE bookings 
        SET status = 'cancelled', 
            cancelled_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id, booking_reference, status
      `;

      await client.query(updateBookingSql, [bookingId]);

      const updateTicketsSql = `
        UPDATE tickets 
        SET status = 'cancelled'
        WHERE booking_id = $1
        RETURNING id, ticket_number, schedule_id
      `;

      const ticketsResult = await client.query(updateTicketsSql, [bookingId]);

      await client.query('COMMIT');

      return {
        success: true,
        bookingId,
        ticketsCancelled: ticketsResult.rows.length,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Cancel booking transaction failed:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new BookingRepository();
