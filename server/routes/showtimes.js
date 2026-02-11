import express from 'express';
import { getShowtimes, getShowtimesByMovie, createShowtime, deleteShowtime } from '../controllers/showtimeController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getShowtimes);
router.get('/movie/:movieId', getShowtimesByMovie);
router.post('/', protect, adminOnly, createShowtime);
router.delete('/:id', protect, adminOnly, deleteShowtime);

export default router;
