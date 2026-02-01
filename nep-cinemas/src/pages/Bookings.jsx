import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get full user from localStorage (safe & always up to date)
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?._id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/api/bookings/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [userId]); // Re-runs when user changes

  const deleteBooking = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setBookings(bookings.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete booking");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Please Login</h1>
          <Link
            to="/login"
            className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-purple-600/50 transition transform hover:scale-105"
          >
            Login to View Bookings
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-2xl animate-pulse">Loading your tickets...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-16">
      <div className="text-center mb-16 px-6">
        <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          My Tickets
        </h1>
        <p className="text-gray-400 text-xl mt-4">Your movie memories, all in one place</p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {bookings.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-9xl mb-8 opacity-20">Ticket</div>
            <h2 className="text-4xl font-bold text-gray-500 mb-4">No bookings yet</h2>
            <p className="text-gray-400 text-lg mb-8">Time to book your next movie adventure!</p>
            <Link
              to="/"
              className="bg-gradient-to-r from-green-500 to-emerald-600 px-10 py-4 rounded-full font-bold text-xl hover:shadow-2xl hover:shadow-green-500/50 transition transform hover:scale-105"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {bookings.map((booking) => {
              const movie = booking.movie;
              return (
                <div
                  key={booking._id}
                  className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800 transform hover:scale-105 transition-all duration-500"
                >
                  <div className="absolute inset-0 opacity-20">
                    <img
                      src={movie.poster || "https://via.placeholder.com/600x900"}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="relative z-10 p-8">
                    <h2 className="text-3xl font-bold text-white mb-3 truncate">
                      {movie.title}
                    </h2>

                    <div className="flex items-center gap-3 mb-4">
                      <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13h-1v6l5.25 3.15.75-1.23-4.5-2.67z" />
                      </svg>
                      <span className="text-xl font-semibold text-purple-300">{booking.showtime}</span>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                      <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                      </svg>
                      <div className="flex flex-wrap gap-2">
                        {booking.seats.map((seat) => (
                          <span key={seat} className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t-2 border-dashed border-gray-700 pt-6 mt-6">
                      <p className="text-gray-500 text-sm">Booking ID</p>
                      <p className="text-xs font-mono text-gray-400 tracking-wider">
                        {booking._id.slice(-12).toUpperCase()}
                      </p>
                    </div>

                    {/* Step 8: View & Delete buttons */}
                    <div className="flex gap-3 mt-4">
                      <Link
                        to={`/ticket/${booking._id}`}
                        className="bg-blue-600 px-4 py-2 rounded text-sm"
                      >
                        View Ticket
                      </Link>

                      <button
                        onClick={() => deleteBooking(booking._id)}
                        className="bg-red-600 px-4 py-2 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-600 to-transparent opacity-30 rounded-bl-3xl"></div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="text-center mt-20 text-gray-600">
        <p>© 2025 NepCinemas – Every ticket tells a story</p>
      </div>
    </div>
  );
};

export default Bookings;
