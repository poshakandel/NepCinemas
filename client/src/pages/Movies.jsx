import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 12;

  useEffect(() => {
    API.get('/movies')
      .then(res => {
        console.log('Movies loaded:', res.data.length);
        setMovies(res.data);
      })
      .catch(err => console.error('Error loading movies:', err));
  }, []);

  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const currentMovies = movies.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPaginationPages = () => {
    const pages = [];
    const maxPagesToShow = 6;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div
        className="relative h-80 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1489599849228-bed96c3f3eff?w=1200&h=400&fit=crop)',
          backgroundBlend: 'overlay'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative text-center text-white">
          <h1 className="text-5xl font-bold">All Movies</h1>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {currentMovies.map((movie) => (
              <Link key={movie._id} to={`/movie/${movie._id}`}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg mb-4 h-80">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex flex-col items-end justify-end p-4">
                      <button className="bg-white text-black px-6 py-2 rounded font-bold opacity-0 group-hover:opacity-100 transition mb-4">
                        Get Ticket
                      </button>
                    </div>
                    <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
                      {movie.genre}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-2">{movie.genre} / {movie.duration} Mins</p>
                    <h3 className="text-lg font-bold text-black">{movie.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mb-8">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ❮
              </button>

              {getPaginationPages().map((page, idx) => (
                <button
                  key={idx}
                  onClick={() => typeof page === 'number' && handlePageChange(page)}
                  disabled={page === '...'}
                  className={`px-4 py-2 rounded font-bold transition ${
                    page === currentPage
                      ? 'bg-orange-500 text-white'
                      : page === '...'
                      ? 'bg-gray-100 text-gray-600 cursor-default'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ❯
              </button>
            </div>
          )}

          <div className="text-center text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, movies.length)} of {movies.length} movies
          </div>
        </div>
      </div>
    </div>
  );
}
