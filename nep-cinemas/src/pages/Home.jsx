import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/movies')
      .then(res => setMovies(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,120,120,0.2)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
        </div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-4">
            NepCinemas
          </h1>
          <p className="text-2xl md:text-4xl text-gray-300 font-light">
            Book Your Favorite Movies, Anytime
          </p>
        </div>

        <div className="absolute bottom-0 w-full">
          <svg viewBox="0 0 1440 150" className="w-full fill-gray-900">
            <path d="M0,0L48,32C96,64,192,128,288,138.7C384,149,480,107,576,90.7C672,74,768,85,864,90.7C960,96,1056,96,1152,85.3C1248,74,1344,53,1392,42.7L1440,32L1440,150L0,150Z"></path>
          </svg>
        </div>
      </section>

      {/* Now Playing – VIBRANT & BOLD */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-center text-5xl font-bold mb-4">Now Playing</h2>
        <p className="text-center text-gray-400 text-lg mb-16">Choose from the latest releases</p>

        {movies.length === 0 ? (
          <div className="text-center py-24 text-2xl text-gray-500">
            Loading movies...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {movies.map(movie => (
              <Link
                key={movie._id}
                to={`/movies/${movie._id}`}
                className="group relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 bg-gray-800 border border-gray-700"
              >
                {/* Poster – Full brightness & contrast */}
                <div className="relative overflow-hidden">
                  <img
                    src={movie.poster || 'https://via.placeholder.com/300x450/111/eee?text=No+Image'}
                    alt={movie.title}
                    className="w-full h-96 object-cover brightness-100 contrast-110 saturate-110 group-hover:scale-110 transition-all duration-700"
                  />
                  
                  {/* Dark gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                  {/* Rating Badge */}
                  {movie.rating && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-black font-bold px-4 py-2 rounded-full text-sm shadow-xl">
                      Star {movie.rating}
                    </div>
                  )}
                </div>

                {/* Movie Info – Bright & Clean */}
                <div className="p-6 bg-gradient-to-b from-gray-800 to-black">
                  <h3 className="text-2xl font-bold text-white truncate">{movie.title}</h3>
                  <div className="flex justify-between items-center mt-4 text-gray-300">
                    <span className="text-lg">{movie.duration} min</span>
                    {movie.genre && (
                      <span className="bg-blue-600 px-4 py-2 rounded-full text-sm font-medium">
                        {movie.genre}
                      </span>
                    )}
                  </div>
                </div>

                {/* Subtle glow on hover */}
                <div className="absolute inset-0 ring-4 ring-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-10 text-center text-gray-500 border-t border-gray-800">
        © 2025 NepCinemas. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;