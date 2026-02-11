import express from 'express';
import { getMovies, getMovie, createMovie, updateMovie, deleteMovie } from '../controllers/movieController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getMovies);
router.get('/:id', getMovie);
router.post('/', protect, adminOnly, createMovie);
router.put('/:id', protect, adminOnly, updateMovie);
router.delete('/:id', protect, adminOnly, deleteMovie);

export default router;
