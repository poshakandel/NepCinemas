// frontend/src/pages/MovieDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState('');
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/movies/${id}`)
      .then(res => setMovie(res.data))
      .catch(err => console.log(err));
  }, [id]);

  useEffect(() => {
    if (!selectedShowtime) {
      setBookedSeats([]);
      return;
    }
    axios.get(`http://localhost:5000/api/bookings/seats/${id}/${encodeURIComponent(selectedShowtime)}`)
      .then(res => setBookedSeats(res.data.bookedSeats || []))
      .catch(err => console.log("No booked seats yet"));
  }, [selectedShowtime, id]);

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats(prev =>
      prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
    );
  };

 const bookSeats = async () => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  if (!userId || !token) {
    alert('Please login to book seats');
    return;
  }

  if (!selectedShowtime || selectedSeats.length === 0) return;

  setLoading(true);
  try {
    await axios.post(
      'http://localhost:5000/api/bookings',
      {
        user: userId,
        movie: id,
        showtime: selectedShowtime,
        seats: selectedSeats
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert(`Success! Booked ${selectedSeats.length} seat(s): ${selectedSeats.join(', ')}`);
    setBookedSeats(prev => [...prev, ...selectedSeats]);
    setSelectedSeats([]);
  } catch (err) {
    alert(err.response?.data?.error || 'Booking failed');
  } finally {
    setLoading(false);
  }
};


  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-2xl">Loading movie details...</p>
      </div>
    );
  }

  const rows = movie.seatLayout?.rows || 6;
  const cols = movie.seatLayout?.cols || 8;

  const seatList = [];
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      seatList.push(`R${r}C${c}`);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={movie.poster || 'https://via.placeholder.com/1200x600'}
          alt={movie.title}
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/70"></div>
        <div className="absolute bottom-0 left-0 p-10 max-w-4xl">
          <h1 className="text-6xl font-bold mb-4">{movie.title}</h1>
          <div className="flex flex-wrap gap-4 text-lg">
            <span className="bg-blue-600 px-4 py-2 rounded-full">{movie.duration} min</span>
            <span className="bg-purple-600 px-4 py-2 rounded-full">{movie.genre}</span>
            {movie.rating && <span className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold">Star {movie.rating}</span>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        {/* Left: Info + Showtime */}
        <div className="md:col-span-1 space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-gray-300 leading-relaxed">{movie.description || "No description available."}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Select Showtime</h2>
            <select
              value={selectedShowtime}
              onChange={(e) => setSelectedShowtime(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-5 py-4 text-lg focus:outline-none focus:border-purple-500 transition"
            >
              <option value="">Choose a showtime</option>
              {movie.showtimes?.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          {selectedShowtime && (
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <p className="text-sm text-gray-400">Selected Show:</p>
              <p className="text-2xl font-bold text-purple-400">{selectedShowtime}</p>
            </div>
          )}
        </div>

        {/* Right: Seat Selection */}
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold mb-6 text-center">Screen This Way</h2>
          <div className="bg-gray-900 p-8 rounded-3xl border-4 border-purple-800 shadow-2xl">
            {/* Screen */}
            <div className="bg-gradient-to-b from-purple-600 to-purple-900 h-16 rounded-t-3xl mb-10 flex items-center justify-center text-2xl font-bold shadow-lg">
              SCREEN
            </div>

            {/* Seats Grid */}
            <div className={`grid grid-cols-${cols} gap-3 mx-auto max-w-2xl`}>
              {seatList.map(seat => {
                const isBooked = bookedSeats.includes(seat);
                const isSelected = selectedSeats.includes(seat);
                return (
                  <button
                    key={seat}
                    onClick={() => toggleSeat(seat)}
                    disabled={isBooked}
                    className={`w-12 h-12 rounded-lg font-bold transition-all transform hover:scale-110
                      ${isBooked 
                        ? 'bg-red-800 text-red-200 cursor-not-allowed' 
                        : isSelected 
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/50' 
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600'
                      }`}
                  >
                    {seat.replace('R', '').replace('C', '')}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-8 mt-10 text-sm">
              <div className="flex items-center gap-2"><div className="w-6 h-6 bg-gray-700 rounded"></div> Available</div>
              <div className="flex items-center gap-2"><div className="w-6 h-6 bg-green-500 rounded"></div> Selected</div>
              <div className="flex items-center gap-2"><div className="w-6 h-6 bg-red-800 rounded"></div> Booked</div>
            </div>
          </div>

          {/* Booking Button */}
          <div className="text-center mt-10">
            <p className="text-xl mb-4">
              {selectedSeats.length > 0 
                ? `Selected: ${selectedSeats.join(', ')} (${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''})`
                : "No seats selected"}
            </p>
            <button
              onClick={bookSeats}
              disabled={!selectedShowtime || selectedSeats.length === 0 || loading}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-xl px-12 py-5 rounded-full hover:shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Booking..." : `Book Now (${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;