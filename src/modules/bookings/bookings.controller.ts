import { Request, Response } from 'express';
import { BookingsService } from './bookings.service';
import { sendSuccess, sendError } from '../../utils/response';

export class BookingsController {
  private bookingsService: BookingsService;

  constructor() {
    this.bookingsService = new BookingsService();
  }

  createBooking = async (req: Request, res: Response) => {
    try {
      const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;

      if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
        return sendError(res, 400, 'Customer ID, vehicle ID, start date, and end date are required');
      }

      const booking = await this.bookingsService.createBooking({
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date
      });

      return sendSuccess(res, 201, 'Booking created successfully', booking);
    } catch (error: any) {
      return sendError(res, 400, error.message);
    }
  };

  getAllBookings = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return sendError(res, 401, 'Authentication required');
      }

      const bookings = await this.bookingsService.getAllBookings(req.user.userId, req.user.role);

      const message = req.user.role === 'admin'
        ? 'Bookings retrieved successfully'
        : 'Your bookings retrieved successfully';

      return sendSuccess(res, 200, message, bookings);
    } catch (error: any) {
      return sendError(res, 500, error.message);
    }
  };

  updateBooking = async (req: Request, res: Response) => {
    try {
      const { bookingId } = req.params;
      const { status } = req.body;

      if (!req.user) {
        return sendError(res, 401, 'Authentication required');
      }

      if (!status) {
        return sendError(res, 400, 'Status is required');
      }

      const booking = await this.bookingsService.updateBooking(
        bookingId,
        req.user.userId,
        req.user.role,
        { status }
      );

      let message = 'Booking updated successfully';
      if (status === 'cancelled') {
        message = 'Booking cancelled successfully';
      } else if (status === 'returned') {
        message = 'Booking marked as returned. Vehicle is now available';
      }

      return sendSuccess(res, 200, message, booking);
    } catch (error: any) {
      if (error.message === 'Insufficient permissions') {
        return sendError(res, 403, error.message);
      }
      return sendError(res, 400, error.message);
    }
  };
}
