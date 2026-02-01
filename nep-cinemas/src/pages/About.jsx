// frontend/src/pages/About.jsx
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent mb-10">
          About NepCinemas
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed mb-10">
          NepCinemas is Nepal's most loved movie booking platform — bringing the magic of cinema to every corner of the country.
        </p>
        <p className="text-lg text-gray-400 leading-relaxed">
          From blockbuster hits to hidden gems, we make it easy to discover, book, and enjoy movies with friends and family.
          Proudly built in Nepal, for Nepal — with love for cinema and technology.
        </p>
        <div className="mt-16">
          <Link to="/" className="bg-gradient-to-r from-purple-600 to-pink-600 px-10 py-4 rounded-full font-bold text-xl hover:shadow-2xl transition">
            Back to Movies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;