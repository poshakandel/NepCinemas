import express from 'express';
import { createBooking, getUserBookings, getAllBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/user/my-bookings', protect, getUserBookings);
router.get('/', protect, adminOnly, getAllBookings);
router.put('/:id', protect, adminOnly, updateBookingStatus);
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const Booking = (await import('../models/Booking.js')).default;
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
