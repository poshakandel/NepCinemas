import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    API.get('/movies')
      .then(res => {
        console.log('Movies loaded:', res.data);
        setMovies(res.data);
      })
      .catch(err => {
        console.error('Error loading movies:', err);
        console.error('Error details:', err.response?.data || err.message);
      });
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % movies.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [movies]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % movies.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Slider */}
      {movies.length > 0 && (
        <div className="relative h-96 md:h-screen overflow-hidden">
          {movies.map((movie, idx) => (
            <div
              key={movie._id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute inset-0 flex items-center justify-start p-8 md:p-16">
                <div className="max-w-2xl">
                  <p className="text-orange-500 text-sm md:text-lg mb-2">{movie.genre} Movie</p>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
                  <p className="text-gray-300 text-sm md:text-base mb-6 line-clamp-3">
                    {movie.description}
                  </p>
                  <div className="flex gap-4">
                    <Link
                      to={`/movie/${movie._id}`}
                      className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded font-bold transition"
                    >
                      Get Ticket
                    </Link>
                    <button className="border-2 border-white hover:bg-white hover:text-black px-6 py-3 rounded font-bold transition">
                      More Info
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 p-3 rounded-full z-10 transition"
          >
            ❮
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 p-3 rounded-full z-10 transition"
          >
            ❯
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {movies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition ${
                  idx === currentSlide ? 'bg-orange-500 w-8' : 'bg-gray-500'
                }`}
              ></button>
            ))}
          </div>
        </div>
      )}

      {/* Movies Now Playing Section */}
      <div className="bg-white text-black py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-orange-500 text-sm font-semibold mb-2">Watch New Movies</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Movies Now Playing</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <Link key={movie._id} to={`/movie/${movie._id}`}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-end justify-center pb-4">
                      <button className="bg-white text-black px-6 py-2 rounded font-bold opacity-0 group-hover:opacity-100 transition">
                        Get Ticket
                      </button>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-1">{movie.genre} / {movie.duration} Mins</p>
                    <h3 className="text-lg font-bold">{movie.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Top Featured Movies Section */}
      <div className="bg-gray-50 py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-orange-500 text-sm font-semibold mb-2">Checkout Movies</p>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Top Featured Movies</h2>
            <p className="text-gray-600 max-w-2xl">
              Discover our handpicked selection of the best movies currently available. From thrilling action to heartwarming dramas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {movies.slice(0, 3).map((movie) => (
              <div key={movie._id} className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-3">{movie.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <span className="text-orange-500">🎬</span> {movie.genre}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-orange-500">⏱</span> {movie.duration} Mins
                    </span>
                  </div>
                  <Link
                    to={`/movie/${movie._id}`}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-bold transition text-center block"
                  >
                    Get Ticket
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">23,00+ more comedy & horror movies you can explore</p>
          </div>
        </div>
      </div>
    </div>
  );
}
