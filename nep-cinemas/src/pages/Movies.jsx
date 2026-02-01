
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/movies")
      .then((res) => {
        setMovies(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-3xl animate-pulse">Loading movies...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-20">
      {/* Hero Header */}
      <div className="text-center mb-16 px-6">
        <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
          All Movies
        </h1>
        <p className="text-gray-400 text-xl mt-4">Now showing across Nepal</p>
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-6">
        {movies.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-4xl text-gray-600">No movies available yet</p>
            <p className="text-gray-500 mt-4">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {movies.map((movie) => (
              <Link
                to={`/movies/${movie._id}`}
                key={movie._id}
                className="group relative block rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 bg-gray-900 border border-gray-800"
              >
                {/* Poster */}
                <div className="relative aspect-w-2 aspect-h-3 overflow-hidden">
                  <img
                    src={movie.poster || movie.image || "https://via.placeholder.com/400x600"}
                    alt={movie.title}
                    className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>

                  {/* Rating Badge */}
                  {movie.rating && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded-full font-bold shadow-lg">
                      Star {movie.rating}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2 truncate">{movie.title}</h3>
                  <div className="flex justify-between items-center text-gray-400">
                    <span className="bg-purple-600 px-4 py-1 rounded-full text-sm">
                      {movie.genre || "Action"}
                    </span>
                    <span>{movie.duration} min</span>
                  </div>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 ring-4 ring-purple-600 opacity-0 group-hover:opacity-30 transition-opacity rounded-3xl pointer-events-none"></div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}