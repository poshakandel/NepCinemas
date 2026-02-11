import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  posterUrl: { type: String, required: true },
  duration: { type: Number, required: true },
  genre: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Movie', movieSchema);
