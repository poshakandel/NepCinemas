import Booking from '../models/Booking.js';
import Showtime from '../models/Showtime.js';

export const createBooking = async (req, res) => {
  try {
    const { showtimeId, seats } = req.body;
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) return res.status(404).json({ message: 'Showtime not found' });

    const totalPrice = showtime.price * seats;
    const booking = await Booking.create({
      userId: req.user.id,
      showtimeId,
      seats,
      totalPrice
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate({
        path: 'showtimeId',
        populate: {
          path: 'movieId'
        }
      });
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId')
      .populate({
        path: 'showtimeId',
        populate: {
          path: 'movieId'
        }
      });
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
