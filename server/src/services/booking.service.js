// src/services/booking.service.js
const bookingRepository = require('../repositories/booking.repository');
const scheduleRepository = require('../repositories/schedule.repository');
const ApiError = require('../utils/ApiError');

class BookingService {
  async createBooking(bookingData) {
    this.validateBookingData(bookingData);

    const schedule = await scheduleRepository.findById(bookingData.scheduleId);

    if (!schedule) {
      throw new ApiError(404, 'Flight schedule not found');
    }

    if (new Date(schedule.scheduled_departure) < new Date()) {
      throw new ApiError(400, 'Cannot book a flight that has already departed');
    }

    try {
      const result = await bookingRepository.createBookingWithTickets(bookingData);

      return {
        success: true,
        bookingReference: result.booking.booking_reference,
        bookingId: result.booking.id,
        tickets: result.tickets,
        totalAmount: result.booking.total_amount,
        status: result.booking.status,
      };
    } catch (error) {
      if (error.message.includes('Not enough seats available')) {
        throw new ApiError(400, 'Not enough seats available on this flight');
      }

      console.error('Booking creation failed:', error);
      throw new ApiError(500, 'Failed to create booking');
    }
  }

  async cancelBooking(bookingId, userId) {
    try {
      const result = await bookingRepository.cancelBooking(bookingId, userId);

      return result;
    } catch (error) {
      if (error.message.includes('Booking not found')) {
        throw new ApiError(404, 'Booking not found or access denied');
      }

      throw new ApiError(500, 'Failed to cancel booking');
    }
  }

  async getBookingHistory(userId) {
    const sql = `
      SELECT 
        b.id,
        b.booking_reference,
        b.total_amount,
        b.status,
        b.payment_status,
        b.created_at,
        b.cancelled_at,
        s.scheduled_departure,
        s.scheduled_arrival,
        a_orig.name as origin_airport,
        a_dest.name as destination_airport,
        al.name as airline_name,
        COUNT(t.id) as ticket_count
      FROM bookings b
      JOIN schedules s ON b.schedule_id = s.id
      JOIN routes r ON s.route_id = r.id
      JOIN airports a_orig ON r.origin_airport_id = a_orig.id
      JOIN airports a_dest ON r.end_airport_id = a_dest.id
      JOIN airlines al ON r.airline_id = al.id
      LEFT JOIN tickets t ON b.id = t.booking_id
      WHERE b.user_id = $1
      GROUP BY b.id, s.id, a_orig.name, a_dest.name, al.name
      ORDER BY b.created_at DESC
    `;

    const { rows } = await db.query(sql, [userId]);
    return rows;
  }

  /**
   * Валидация данных бронирования
   * @param {Object} bookingData - Данные бронирования
   */
  validateBookingData(bookingData) {
    if (!bookingData.userId) {
      throw new ApiError(400, 'User ID is required');
    }

    if (!bookingData.scheduleId) {
      throw new ApiError(400, 'Schedule ID is required');
    }

    if (
      !bookingData.passengers ||
      !Array.isArray(bookingData.passengers) ||
      bookingData.passengers.length === 0
    ) {
      throw new ApiError(400, 'At least one passenger is required');
    }

    if (!bookingData.totalAmount || bookingData.totalAmount <= 0) {
      throw new ApiError(400, 'Valid total amount is required');
    }

    for (const passenger of bookingData.passengers) {
      if (!passenger.firstName || !passenger.lastName) {
        throw new ApiError(400, 'Passenger first and last name are required');
      }

      if (!passenger.passportNumber) {
        throw new ApiError(400, 'Passport number is required for all passengers');
      }
    }
  }
}

module.exports = new BookingService();
