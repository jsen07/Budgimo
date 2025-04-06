import React, { useState } from 'react';

export default function ContactSection() {const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thanks for reaching out!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      {/* Other Landing Sections... */}

      {/* Contact Section */}
      <section id="contact" className="text-black bg-indigo-500 min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Contact</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-xl shadow-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-xl shadow-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-xl shadow-sm resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-500 text-white font-semibold py-3 rounded-xl hover:bg-indigo-600 transition"
            >
              Send Message
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600 space-y-2">
            <p><strong>Phone:</strong> <a href="tel:12345678910" className="text-indigo-600">1234-567-8910</a></p>
            <p><strong>Email:</strong> <a href="mailto:zerodebtdrive@budgimo.com" className="text-indigo-600">zerodebtdrive@budgimo.com</a></p>
            <p><strong>Address:</strong> Pennywise Place, Budgetopia, NS5 7LP</p>
          </div>
        </div>
      </section>
    </>
  );
}