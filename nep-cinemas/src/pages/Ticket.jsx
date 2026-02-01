import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const Ticket = () => {
  const { id } = useParams(); // booking id from URL
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/bookings/ticket/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBooking(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch ticket");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-2xl animate-pulse">Loading ticket details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <p className="text-red-500 text-xl mb-6">{error}</p>
        <Link
          to="/bookings"
          className="bg-blue-600 px-6 py-3 rounded text-white hover:bg-blue-700 transition"
        >
          Back to Bookings
        </Link>
      </div>
    );
  }

  const { movie, seats, showtime, _id } = booking;

  return (
    <div className="min-h-screen bg-black text-white py-16 px-6 max-w-3xl mx-auto">
      <h1 className="text-5xl font-bold mb-8">{movie.title} — Ticket</h1>

      <div className="bg-gray-900 rounded-xl p-8 shadow-lg">
        <img
          src={movie.poster || "https://via.placeholder.com/600x900"}
          alt={movie.title}
          className="w-full rounded-lg mb-6"
        />

        <p className="text-gray-400 mb-2">
          <strong>Showtime:</strong> {showtime}
        </p>

        <p className="text-gray-400 mb-2">
          <strong>Seats:</strong>{" "}
          {seats.map((seat) => (
            <span
              key={seat}
              className="inline-block bg-green-600 text-white px-3 py-1 rounded-full mr-2"
            >
              {seat}
            </span>
          ))}
        </p>

        <p className="text-gray-500 text-sm mt-8 border-t border-gray-700 pt-4 font-mono">
          Booking ID: {_id}
        </p>

        <Link
          to="/bookings"
          className="inline-block mt-8 bg-blue-600 px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Back to Bookings
        </Link>
      </div>
    </div>
  );
};

export default Ticket;
