import Showtime from '../models/Showtime.js';

export const getShowtimes = async (req, res) => {
  try {
    const showtimes = await Showtime.find().populate('movieId');
    res.json(showtimes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getShowtimesByMovie = async (req, res) => {
  try {
    const showtimes = await Showtime.find({ movieId: req.params.movieId }).populate('movieId');
    res.json(showtimes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.create(req.body);
    res.status(201).json(showtime);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteShowtime = async (req, res) => {
  try {
    await Showtime.findByIdAndDelete(req.params.id);
    res.json({ message: 'Showtime deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
