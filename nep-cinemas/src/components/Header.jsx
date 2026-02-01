// frontend/src/components/Header.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const loadUser = () => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      try {
        setUser(JSON.parse(loggedInUser));
      } catch (e) {
        localStorage.removeItem("user");
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("userLogin", loadUser);
    window.addEventListener("userLogout", loadUser);
    return () => {
      window.removeEventListener("userLogin", loadUser);
      window.removeEventListener("userLogout", loadUser);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setDropdownOpen(false);
    window.dispatchEvent(new Event("userLogout"));
    navigate("/");
  };

  const isAdmin = user?.role === "admin";

  return (
    <header className="bg-black/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-3xl font-black bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition"
        >
          NepCinemas
        </Link>

        {/* Navigation Links - Clean & Simple */}
        <nav className="hidden md:flex items-center space-x-10 text-gray-300 font-medium">
          <Link to="/" className="hover:text-white transition">
            Home
          </Link>
          <Link to="/movies" className="hover:text-white transition">
            Movies
          </Link>
          <Link to="/about" className="hover:text-white transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-white transition">
            Contact
          </Link>
        </nav>

        {/* User Dropdown */}
        <div className="flex items-center">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-3 hover:bg-gray-900/50 px-4 py-2 rounded-full transition"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name?.[0] || user.email[0].toUpperCase()}
                </div>
                <span className="hidden lg:block text-gray-300 font-medium">
                  {user.name || user.email.split("@")[0]}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl">
                  <div className="p-5 border-b border-gray-800">
                    <p className="font-semibold text-white">{user.name || "User"}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                  <div className="py-2">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-5 py-3 text-orange-400 hover:bg-gray-800 transition"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-5 py-3 text-gray-300 hover:bg-gray-800 transition"
                    >
                      My Bookings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-5 py-3 text-red-400 hover:bg-gray-800 transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-300 hover:text-white font-medium transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 px-7 py-3 rounded-full font-bold hover:shadow-xl transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;