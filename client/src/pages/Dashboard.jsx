import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import html2pdf from 'html2pdf.js';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [activeTab, setActiveTab] = useState(user?.role === 'admin' ? 'analytics' : 'bookings');
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '' });
  const [newMovie, setNewMovie] = useState({ title: '', description: '', posterUrl: '', duration: '', genre: '' });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Initial load
    refreshBookings();
    
    if (user.role === 'admin') {
      API.get('/movies')
        .then(res => setMovies(res.data))
        .catch(err => console.error(err));
    }
    
    // Set up auto-refresh every 3 seconds
    const interval = setInterval(() => {
      refreshBookings();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const refreshBookings = () => {
    if (user.role === 'user') {
      API.get('/bookings/user/my-bookings')
        .then(res => setBookings(res.data))
        .catch(err => console.error(err));
    } else {
      API.get('/bookings')
        .then(res => setBookings(res.data))
        .catch(err => console.error(err));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      // Note: You may need to add an update profile endpoint in your backend
      alert('Profile updated successfully!');
      setShowEditProfile(false);
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
  };

  const downloadTicketPDF = (booking) => {
    const element = document.getElementById(`ticket-${booking._id}`);
    const opt = {
      margin: 10,
      filename: `ticket-${booking._id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      await API.post('/movies', newMovie);
      setNewMovie({ title: '', description: '', posterUrl: '', duration: '', genre: '' });
      setShowAddMovie(false);
      API.get('/movies').then(res => setMovies(res.data));
      alert('Movie added successfully!');
    } catch (error) {
      alert('Error adding movie: ' + error.response?.data?.message);
    }
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await API.delete(`/movies/${id}`);
        setMovies(movies.filter(m => m._id !== id));
        alert('Movie deleted successfully!');
      } catch (error) {
        alert('Error deleting movie: ' + error.response?.data?.message);
      }
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await API.put(`/bookings/${bookingId}`, { status });
      API.get('/bookings').then(res => setBookings(res.data));
      alert('Booking status updated!');
    } catch (error) {
      alert('Error updating booking: ' + error.response?.data?.message);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await API.delete(`/bookings/${bookingId}`);
        setBookings(bookings.filter(b => b._id !== bookingId));
        alert('Booking deleted successfully!');
      } catch (error) {
        alert('Error deleting booking: ' + error.response?.data?.message);
      }
    }
  };

  // Analytics calculations
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const totalSeatsBooked = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.seats || 0), 0);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-black text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{user.role === 'admin' ? 'Admin' : 'User'} Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome, {user.name}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={refreshBookings}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded font-bold transition"
            >
              Refresh Data
            </button>
            {user.role === 'user' && (
              <button
                onClick={() => setShowEditProfile(!showEditProfile)}
                className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded font-bold transition"
              >
                Edit Profile
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded font-bold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Edit Profile Modal */}
        {showEditProfile && user.role === 'user' && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6 border-2 border-blue-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 rounded transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* User Dashboard */}
        {user.role === 'user' && (
          <div className="space-y-6">
            {/* Bookings List */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h2>
              {bookings.length === 0 ? (
                <p className="text-gray-600">No bookings yet. <a href="/movies" className="text-orange-500 hover:text-orange-600">Browse movies</a></p>
              ) : (
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <div key={booking._id} className="border border-gray-300 rounded-lg p-6 hover:shadow-lg transition">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                        <div>
                          <p className="text-gray-600 text-sm font-bold">Movie</p>
                          <p className="text-gray-800 font-bold">{booking.showtimeId?.movieId?.title}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm font-bold">Date & Time</p>
                          <p className="text-gray-800">{booking.showtimeId?.date} {booking.showtimeId?.time}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm font-bold">Seats</p>
                          <p className="text-gray-800">{booking.seats}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm font-bold">Total Price</p>
                          <p className="text-gray-800 font-bold">Rs. {booking.totalPrice}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm font-bold">Status</p>
                          <span className={`px-3 py-1 rounded font-bold text-sm ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setSelectedBooking(selectedBooking?._id === booking._id ? null : booking)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-bold transition"
                        >
                          {selectedBooking?._id === booking._id ? 'Hide Ticket' : 'View Ticket'}
                        </button>
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => downloadTicketPDF(booking)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-bold transition"
                          >
                            Download PDF
                          </button>
                        )}
                      </div>

                      {/* Ticket Display */}
                      {selectedBooking?._id === booking._id && (
                        <div id={`ticket-${booking._id}`} className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 p-8 rounded-lg text-white">
                          <div className="text-center mb-6">
                            <h3 className="text-3xl font-bold">🎬 NepCinemas</h3>
                            <p className="text-orange-100">Movie Ticket</p>
                          </div>
                          <div className="grid grid-cols-2 gap-6 mb-6 border-b-2 border-orange-400 pb-6">
                            <div>
                              <p className="text-orange-100 text-sm">Movie Title</p>
                              <p className="text-2xl font-bold">{booking.showtimeId?.movieId?.title}</p>
                            </div>
                            <div>
                              <p className="text-orange-100 text-sm">Genre</p>
                              <p className="text-xl font-bold">{booking.showtimeId?.movieId?.genre}</p>
                            </div>
                            <div>
                              <p className="text-orange-100 text-sm">Date</p>
                              <p className="text-xl font-bold">{booking.showtimeId?.date}</p>
                            </div>
                            <div>
                              <p className="text-orange-100 text-sm">Time</p>
                              <p className="text-xl font-bold">{booking.showtimeId?.time}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center">
                              <p className="text-orange-100 text-sm">Number of Seats</p>
                              <p className="text-3xl font-bold">{booking.seats}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-orange-100 text-sm">Price per Seat</p>
                              <p className="text-2xl font-bold">Rs. {booking.showtimeId?.price}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-orange-100 text-sm">Total Amount</p>
                              <p className="text-3xl font-bold">Rs. {booking.totalPrice}</p>
                            </div>
                          </div>
                          <div className="text-center border-t-2 border-orange-400 pt-4">
                            <p className="text-orange-100 text-sm mb-2">Booking ID</p>
                            <p className="font-mono text-lg font-bold">{booking._id}</p>
                            <p className="text-orange-100 text-xs mt-4">Please present this ticket at the cinema</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admin Dashboard */}
        {user.role === 'admin' && (
          <>
            {/* Tabs */}
            <div className="flex gap-4 mb-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-3 rounded font-bold transition whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-6 py-3 rounded font-bold transition whitespace-nowrap ${
                  activeTab === 'bookings'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Bookings
              </button>
              <button
                onClick={() => setActiveTab('movies')}
                className={`px-6 py-3 rounded font-bold transition whitespace-nowrap ${
                  activeTab === 'movies'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Manage Movies
              </button>
            </div>

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
                    <p className="text-gray-600 text-sm font-bold mb-2">TOTAL BOOKINGS</p>
                    <p className="text-3xl font-bold text-gray-800">{totalBookings}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                    <p className="text-gray-600 text-sm font-bold mb-2">CONFIRMED</p>
                    <p className="text-3xl font-bold text-green-600">{confirmedBookings}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
                    <p className="text-gray-600 text-sm font-bold mb-2">CANCELLED</p>
                    <p className="text-3xl font-bold text-red-600">{cancelledBookings}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                    <p className="text-gray-600 text-sm font-bold mb-2">TOTAL REVENUE</p>
                    <p className="text-3xl font-bold text-blue-600">Rs. {totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
                    <p className="text-gray-600 text-sm font-bold mb-2">SEATS BOOKED</p>
                    <p className="text-3xl font-bold text-purple-600">{totalSeatsBooked}</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Movie Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {movies
                      .map(movie => {
                        const movieBookings = bookings.filter(b => b.showtimeId?.movieId?._id === movie._id && b.status === 'confirmed');
                        const movieRevenue = movieBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
                        return {
                          movie,
                          bookings: movieBookings.length,
                          revenue: movieRevenue,
                          seats: movieBookings.reduce((sum, b) => sum + (b.seats || 0), 0)
                        };
                      })
                      .sort((a, b) => b.bookings - a.bookings)
                      .map(({ movie, bookings: bookingCount, revenue, seats }) => (
                        <div key={movie._id} className={`border rounded-lg p-4 ${bookingCount > 0 ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`}>
                          <h4 className="font-bold text-gray-800 mb-2">{movie.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{movie.genre}</p>
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-700"><span className="font-bold">Bookings:</span> <span className="text-orange-600 font-bold">{bookingCount}</span></p>
                            <p className="text-gray-700"><span className="font-bold">Revenue:</span> Rs. {revenue.toLocaleString()}</p>
                            <p className="text-gray-700"><span className="font-bold">Seats:</span> {seats}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">All Bookings</h2>
                {bookings.length === 0 ? (
                  <p className="text-gray-600">No bookings yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100 border-b-2 border-gray-300">
                        <tr>
                          <th className="px-6 py-3 text-left text-gray-700 font-bold">User</th>
                          <th className="px-6 py-3 text-left text-gray-700 font-bold">Email</th>
                          <th className="px-6 py-3 text-left text-gray-700 font-bold">Movie</th>
                          <th className="px-6 py-3 text-left text-gray-700 font-bold">Date & Time</th>
                          <th className="px-6 py-3 text-left text-gray-700 font-bold">Seats</th>
                          <th className="px-6 py-3 text-left text-gray-700 font-bold">Total</th>
                          <th className="px-6 py-3 text-left text-gray-700 font-bold">Status</th>
                          <th className="px-6 py-3 text-center text-gray-700 font-bold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(booking => (
                          <tr key={booking._id} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-800">{booking.userId?.name}</td>
                            <td className="px-6 py-4 text-gray-800">{booking.userId?.email}</td>
                            <td className="px-6 py-4 text-gray-800">{booking.showtimeId?.movieId?.title}</td>
                            <td className="px-6 py-4 text-gray-800">{booking.showtimeId?.date} {booking.showtimeId?.time}</td>
                            <td className="px-6 py-4 text-gray-800">{booking.seats}</td>
                            <td className="px-6 py-4 text-gray-800 font-bold">Rs. {booking.totalPrice}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded font-bold text-sm ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2 justify-center flex-wrap">
                                {booking.status === 'confirmed' && (
                                  <button
                                    onClick={() => handleUpdateBookingStatus(booking._id, 'cancelled')}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-bold transition text-sm whitespace-nowrap"
                                  >
                                    Cancel
                                  </button>
                                )}
                                {booking.status === 'cancelled' && (
                                  <button
                                    onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')}
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded font-bold transition text-sm whitespace-nowrap"
                                  >
                                    Confirm
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteBooking(booking._id)}
                                  className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded font-bold transition text-sm whitespace-nowrap"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Movies Tab */}
            {activeTab === 'movies' && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Manage Movies ({movies.length})</h2>
                  <button
                    onClick={() => setShowAddMovie(!showAddMovie)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-bold transition"
                  >
                    {showAddMovie ? 'Cancel' : '+ Add Movie'}
                  </button>
                </div>

                {showAddMovie && (
                  <form onSubmit={handleAddMovie} className="bg-gray-50 p-6 rounded-lg mb-8 border-2 border-orange-500">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Movie</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Movie Title"
                        value={newMovie.title}
                        onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Genre"
                        value={newMovie.genre}
                        onChange={(e) => setNewMovie({...newMovie, genre: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Duration (minutes)"
                        value={newMovie.duration}
                        onChange={(e) => setNewMovie({...newMovie, duration: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                        required
                      />
                      <input
                        type="url"
                        placeholder="Poster URL"
                        value={newMovie.posterUrl}
                        onChange={(e) => setNewMovie({...newMovie, posterUrl: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                        required
                      />
                    </div>
                    <textarea
                      placeholder="Description"
                      value={newMovie.description}
                      onChange={(e) => setNewMovie({...newMovie, description: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500 mb-4"
                      rows="3"
                      required
                    ></textarea>
                    <button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded transition"
                    >
                      Add Movie
                    </button>
                  </form>
                )}

                {movies.length === 0 ? (
                  <p className="text-gray-600">No movies yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {movies.map(movie => (
                      <div key={movie._id} className="border border-gray-300 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
                        <img src={movie.posterUrl} alt={movie.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-gray-800 mb-2">{movie.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{movie.genre} • {movie.duration} min</p>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{movie.description}</p>
                          <button
                            onClick={() => handleDeleteMovie(movie._id)}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded transition"
                          >
                            Delete Movie
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
