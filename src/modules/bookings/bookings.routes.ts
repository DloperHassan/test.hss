import { Router } from 'express';
import { BookingsController } from './bookings.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const bookingsController = new BookingsController();

router.post('/', authenticate, bookingsController.createBooking);
router.get('/', authenticate, bookingsController.getAllBookings);
router.put('/:bookingId', authenticate, bookingsController.updateBooking);

export default router;
