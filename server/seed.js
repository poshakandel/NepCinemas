import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import User from './models/User.js';
import Movie from './models/Movie.js';
import Showtime from './models/Showtime.js';

dotenv.config();

const TMDB_API_KEY = '92b647693051c4e04305c5cc27d2a225';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Showtime.deleteMany({});
    console.log('Data cleared');

    console.log('Creating users...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@nepcinemas.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Admin created:', admin._id);

    const user = await User.create({
      name: 'John Doe',
      email: 'user@nepcinemas.com',
      password: 'user123',
      role: 'user'
    });
    console.log('User created:', user._id);

    console.log('Fetching movies from TMDB...');
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        page: 1
      }
    });

    const response2 = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        page: 2
      }
    });

    const response3 = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        page: 3
      }
    });

    const allTmdbMovies = [
      ...response.data.results,
      ...response2.data.results,
      ...response3.data.results
    ];

    const tmdbMovies = allTmdbMovies.slice(0, 60);
    const moviesData = tmdbMovies.map(movie => {
      let posterUrl = 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&h=750&fit=crop';
      if (movie.poster_path) {
        posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      }
      return {
        title: movie.title || 'Unknown Title',
        description: movie.overview || 'No description available',
        posterUrl: posterUrl,
        duration: Math.floor(Math.random() * 60) + 90,
        genre: ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller'][Math.floor(Math.random() * 6)]
      };
    });

    console.log('Movies data prepared:', moviesData.length);

    console.log('Creating movies...');
    const movies = await Movie.insertMany(moviesData);
    console.log('Movies created:', movies.length);

    console.log('Creating showtimes...');
    const showtimes = [];
    movies.forEach(movie => {
      const times = ['10:00 AM', '02:00 PM', '06:00 PM', '09:00 PM'];
      times.forEach(time => {
        showtimes.push({
          movieId: movie._id,
          date: '2026-02-15',
          time: time,
          price: Math.floor(Math.random() * 150) + 250
        });
      });
    });

    await Showtime.insertMany(showtimes);
    console.log('Showtimes created:', showtimes.length);

    console.log('Database seeded successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

seedDatabase();
