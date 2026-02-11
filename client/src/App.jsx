import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import Movies from './pages/Movies';
import Contact from './pages/Contact';
import MovieDetails from './pages/MovieDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './index.css';

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      <nav className="bg-black text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            <span className="text-orange-500">🎬</span> NepCinemas
          </Link>
          
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/" className="hover:text-orange-500 transition">Home</Link>
            <Link to="/about" className="hover:text-orange-500 transition">About Us</Link>
            <Link to="/movies" className="hover:text-orange-500 transition">Movies</Link>
            <Link to="/contact" className="hover:text-orange-500 transition">Contact</Link>
          </div>

          <div className="flex gap-4 items-center">
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-orange-500 transition">
                  {user.name}
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-orange-500 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded font-bold transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-12 px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <span className="text-orange-500">🎬</span> NepCinemas
            </h3>
            <p className="text-sm">Buy movie tickets easily with NepCinemas system nationwide</p>
          </div>
          
          <div>
            <h4 className="text-orange-500 font-bold mb-4">Movies</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Action</a></li>
              <li><a href="#" className="hover:text-white transition">Adventure</a></li>
              <li><a href="#" className="hover:text-white transition">Animation</a></li>
              <li><a href="#" className="hover:text-white transition">Thriller</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-orange-500 font-bold mb-4">Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><a href="#" className="hover:text-white transition">My Account</a></li>
              <li><a href="#" className="hover:text-white transition">News</a></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 flex justify-between items-center text-sm">
          <p>&copy; 2024 NepCinemas. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-orange-500 transition">Help</a>
            <a href="#" className="hover:text-orange-500 transition">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </Router>
  );
}

export default App;
