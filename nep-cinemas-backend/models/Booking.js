import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    showtime: { type: String, required: true },
    seats: [{ type: String, required: true }],
}, { timestamps: true });

export default mongoose.model('Booking', BookingSchema);
