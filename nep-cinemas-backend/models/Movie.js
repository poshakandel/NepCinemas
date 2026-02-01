import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: Number, required: true },       // movie length in minutes
  genre: { type: String },
  poster: { type: String },                         // image URL
  rating: { type: Number, default: 0 },
  showtimes: [{ type: String }],
  seatLayout: {                                     // dynamic seat grid
    rows: { type: Number, default: 5 },
    cols: { type: Number, default: 5 }
  }
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
