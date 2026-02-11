import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api';

export default function MovieDetails() {
  const { id } = useParams();
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [seats, setSeats] = useState(1);

  const ticketTypes = [
    { name: 'Regular', price: 350, description: 'Standard seat experience', features: ['1 box of popcorn', 'Standard seat', 'Talk to the actor', '1x photo with actor', 'Free Souvenirs'] },
    { name: 'Premium', price: 550, description: 'Premium seat experience', features: ['3 box of popcorn', 'Premium seat', 'Talk to the actor', '1x photo with actor', 'Free Souvenirs'] },
    { name: 'VIP', price: 850, description: 'VIP seat experience', features: ['5 box of popcorn', 'VIP seat', 'Talk to the actor', '1x photo with actor', 'Free Souvenirs'] }
  ];

  useEffect(() => {
    API.get(`/movies/${id}`).then(res => setMovie(res.data)).catch(err => console.error(err));
    API.get(`/showtimes/movie/${id}`).then(res => setShowtimes(res.data)).catch(err => console.error(err));
  }, [id]);

  const handleBooking = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (user.role === 'admin') {
      alert('Admins cannot book tickets');
      return;
    }
    if (!selectedShowtime || !selectedTicket) {
      alert('Please select a showtime and ticket type');
      return;
    }
    try {
      const totalPrice = selectedTicket.price * seats;
      await API.post('/bookings', { showtimeId: selectedShowtime._id, seats, totalPrice });
      alert('Booking successful!');
      // Redirect to dashboard with a refresh flag
      navigate('/dashboard?refresh=true');
    } catch (error) {
      alert('Booking failed: ' + error.response?.data?.message);
    }
  };

  if (!movie) return <div className="text-white text-center p-8">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold mb-4">Please login to book tickets</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Movie Header */}
      <div className="bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto flex gap-8">
          <img src={movie.posterUrl} alt={movie.title} className="w-64 h-96 object-cover rounded-lg shadow-lg" />
          <div>
            <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
            <p className="text-gray-400 text-lg mb-4">{movie.genre} • {movie.duration} minutes</p>
            <p className="text-gray-300 text-lg leading-relaxed">{movie.description}</p>
          </div>
        </div>
      </div>

      {/* Showtime Selection */}
      <div className="bg-black p-8">
        <div className="max-w-6xl mx-auto">
          {user.role === 'admin' ? (
            <div className="bg-red-900 p-8 rounded-lg border-2 border-red-500 text-center">
              <h2 className="text-3xl font-bold text-red-200 mb-4">Admins Cannot Book Movies</h2>
              <p className="text-red-200 text-lg mb-6">Please login from a regular user account to book tickets.</p>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded transition"
              >
                Logout & Login as User
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-6">Select Showtime</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {showtimes.map(showtime => (
                  <button
                    key={showtime._id}
                    onClick={() => setSelectedShowtime(showtime)}
                    className={`p-4 rounded-lg transition ${
                      selectedShowtime?._id === showtime._id
                        ? 'bg-orange-500 border-2 border-orange-600'
                        : 'bg-gray-800 border-2 border-gray-700 hover:border-orange-500'
                    }`}
                  >
                    <div className="font-bold text-lg">{showtime.date}</div>
                    <div className="text-lg mb-2">{showtime.time}</div>
                    <div className="text-sm text-gray-300">Rs. {showtime.price}</div>
                  </button>
                ))}
              </div>

              {/* Ticket Types */}
              <h2 className="text-3xl font-bold mb-8">Choose Your Ticket</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {ticketTypes.map((ticket, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-6 rounded-lg cursor-pointer transition border-2 ${
                      selectedTicket?.name === ticket.name
                        ? 'bg-gray-800 border-orange-500 shadow-lg shadow-orange-500/50'
                        : 'bg-gray-900 border-gray-700 hover:border-orange-500'
                    }`}
                  >
                    <h3 className="text-2xl font-bold mb-2">{ticket.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{ticket.description}</p>
                    <div className="text-4xl font-bold mb-6">
                      Rs. <span className="text-orange-500">{ticket.price}</span>
                      <span className="text-lg text-gray-400">/Seat</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {ticket.features.map((feature, i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                          <span className="text-orange-500">✓</span> {feature}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded transition">
                      Get Ticket
                    </button>
                  </div>
                ))}
              </div>

              {/* Booking Summary */}
              {selectedShowtime && selectedTicket && (
                <div className="bg-gray-900 p-8 rounded-lg border-2 border-orange-500">
                  <h3 className="text-2xl font-bold mb-6">Booking Summary</h3>
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <p className="text-gray-400 mb-2">Movie</p>
                      <p className="text-xl font-bold">{movie.title}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-2">Showtime</p>
                      <p className="text-xl font-bold">{selectedShowtime.date} at {selectedShowtime.time}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-2">Ticket Type</p>
                      <p className="text-xl font-bold">{selectedTicket.name}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 mb-2 block">Number of Seats</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={seats}
                        onChange={(e) => setSeats(parseInt(e.target.value))}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-6 mb-6">
                    <div className="flex justify-between items-center text-2xl font-bold">
                      <span>Total Price:</span>
                      <span className="text-orange-500">Rs. {selectedTicket.price * seats}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleBooking}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg text-lg transition"
                  >
                    {token ? 'Confirm Booking' : 'Login to Book'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
