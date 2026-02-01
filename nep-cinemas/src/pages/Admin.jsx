 
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Admin = () => {
  const [movies, setMovies] = useState([]);
  const [formData, setFormData] = useState({
    title: "", description: "", duration: "", genre: "", poster: "", rating: "", showtimes: ""
  });
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (isAdmin) {
      fetchMovies();
    }
  }, [isAdmin]);

  const fetchMovies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/movies");
      setMovies(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/movies", {
        ...formData,
        duration: Number(formData.duration),
        rating: Number(formData.rating),
        showtimes: formData.showtimes.split(",").map(t => t.trim()).filter(t => t),
      });
      alert("Movie Added!");
      setFormData({ title: "", description: "", duration: "", genre: "", poster: "", rating: "", showtimes: "" });
      fetchMovies();
    } catch (err) {
      alert("Failed to add movie");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/movies/${id}`);
      alert("Movie Deleted!");
      fetchMovies();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-6xl text-red-500">Access Denied</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-16">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
          Admin Panel
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
        {/* Add Movie Form */}
        <div className="bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-3xl p-10">
          <h2 className="text-3xl font-bold mb-8 text-orange-400">Add New Movie</h2>
          <form onSubmit={handleAddMovie} className="space-y-6">
            <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="w-full px-5 py-4 bg-gray-800 rounded-xl" />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required rows="3" className="w-full px-5 py-4 bg-gray-800 rounded-xl" />
            <input name="duration" type="number" value={formData.duration} onChange={handleChange} placeholder="Duration (min)" required className="w-full px-5 py-4 bg-gray-800 rounded-xl" />
            <input name="genre" value={formData.genre} onChange={handleChange} placeholder="Genre" required className="w-full px-5 py-4 bg-gray-800 rounded-xl" />
            <input name="poster" value={formData.poster} onChange={handleChange} placeholder="Poster URL" required className="w-full px-5 py-4 bg-gray-800 rounded-xl" />
            <input name="rating" type="number" step="0.1" value={formData.rating} onChange={handleChange} placeholder="Rating (0-10)" className="w-full px-5 py-4 bg-gray-800 rounded-xl" />
            <input name="showtimes" value={formData.showtimes} onChange={handleChange} placeholder="Showtimes (comma separated)" required className="w-full px-5 py-4 bg-gray-800 rounded-xl" />
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-600 to-red-600 py-4 rounded-xl font-bold text-xl hover:shadow-2xl transition">
              {loading ? "Adding..." : "Add Movie"}
            </button>
          </form>
        </div>

        {/* Movie List with Delete */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-orange-400">All Movies ({movies.length})</h2>
          <div className="space-y-6">
            {movies.map((movie) => (
              <div key={movie._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <img src={movie.poster} alt={movie.title} className="w-20 h-28 object-cover rounded-lg" />
                  <div>
                    <h3 className="text-xl font-bold">{movie.title}</h3>
                    <p className="text-gray-400">{movie.genre} • {movie.duration} min</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(movie._id)}
                  className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full font-bold transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;