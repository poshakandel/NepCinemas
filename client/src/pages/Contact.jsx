import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Contact() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
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
          <h1 className="text-5xl font-bold">Contact Us</h1>
        </div>
      </div>

      {/* Contact Form */}
      <div className="py-16 px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-orange-500 text-sm font-semibold mb-2">Contact With Us</p>
            <h2 className="text-4xl font-bold text-black mb-4">Feel Free to Write us Anytime</h2>
          </div>

          {!user ? (
            <div className="bg-orange-100 border-2 border-orange-500 rounded-lg p-8 text-center">
              <p className="text-gray-700 mb-4">You need to be logged in to send a message.</p>
              <button
                onClick={() => navigate('/login')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded transition"
              >
                Login Now
              </button>
            </div>
          ) : user.role === 'admin' ? (
            <div className="bg-red-100 border-2 border-red-500 rounded-lg p-8 text-center">
              <p className="text-red-700 font-bold text-lg">Admins cannot send messages. Please use a regular user account.</p>
            </div>
          ) : (
            <>
              {submitted && (
                <div className="mb-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500 bg-gray-50"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500 bg-gray-50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500 bg-gray-50"
                  />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500 bg-gray-50"
                  />
                </div>

                <textarea
                  name="message"
                  placeholder="Write a Comment"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="8"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500 bg-gray-50 resize-none"
                ></textarea>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-12 py-3 rounded transition"
                  >
                    Send a Message
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
