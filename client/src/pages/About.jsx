import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
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
          <h1 className="text-5xl font-bold">About Us</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            {/* Left Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1489599849228-bed96c3f3eff?w=500&h=600&fit=crop"
                alt="About NepCinemas"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -top-8 -left-8 bg-white rounded-full w-32 h-32 flex items-center justify-center shadow-lg border-4 border-orange-500">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-500">22</div>
                  <div className="text-sm text-gray-600">Years of<br />Excellence</div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div>
              <p className="text-orange-500 text-sm font-semibold mb-2">Get To Know</p>
              <h2 className="text-4xl font-bold text-black mb-6">Proving the Best Film Services</h2>
              <p className="text-gray-600 mb-6">
                NepCinemas is dedicated to providing the best movie-watching experience in Nepal. 
                We believe in making cinema accessible to everyone with affordable tickets, comfortable 
                seating, and the latest blockbuster movies.
              </p>
              <div className="flex items-start gap-4 mb-8">
                <div className="text-orange-500 text-3xl">🎬</div>
                <div>
                  <h3 className="font-bold text-lg text-black mb-2">5 Years of Innovation</h3>
                  <p className="text-gray-600">We're here to look even you from start to finish with cutting-edge technology and customer service.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="bg-gray-50 py-16 px-8 rounded-lg">
            <div className="mb-12">
              <p className="text-orange-500 text-sm font-semibold mb-2">Our Feedbacks</p>
              <h2 className="text-4xl font-bold text-black">What They're Talking About us?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Testimonial Left */}
              <div>
                <p className="text-gray-600 mb-8">
                  Every person must decide whether they will walk in the light of creative altruism or in the 
                  darkness of destructive selfishness. NepCinemas has been a beacon of quality entertainment 
                  for our community.
                </p>

                <div className="flex items-start gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
                    alt="Customer"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-orange-500 text-2xl mb-2">❝</div>
                    <h4 className="font-bold text-black">LOREM PORTA</h4>
                    <p className="text-sm text-gray-600 mb-2">CUSTOMER</p>
                    <p className="text-sm text-gray-600">
                      NepCinemas has been the industry's standard for quality and service. 
                      Highly recommended for movie lovers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Testimonial Right - Images */}
              <div className="relative h-96">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
                  alt="Testimonial"
                  className="absolute top-0 right-0 w-40 h-40 rounded-full object-cover shadow-lg border-4 border-white"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&fit=crop"
                  alt="Testimonial"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full object-cover shadow-lg border-4 border-white"
                />
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
                  alt="Testimonial"
                  className="absolute bottom-12 left-0 w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
