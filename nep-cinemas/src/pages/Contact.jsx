// frontend/src/pages/Contact.jsx
const Contact = () => {
  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-10">
          Contact Us
        </h1>
        <div className="space-y-8 text-lg text-gray-300">
          <p>Email: support@nepcinemas.com</p>
          <p>Phone: +977 980-000-0000</p>
          <p>Address: Kathmandu, Nepal</p>
          <p className="text-xl font-semibold text-purple-400 mt-10">
            We're here to help 24/7!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;