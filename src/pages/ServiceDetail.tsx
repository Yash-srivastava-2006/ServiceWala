import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Calendar, MessageCircle, Shield, Verified, ArrowLeft } from 'lucide-react';
import { mockServices as services } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const ServiceDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [message, setMessage] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  const service = services.find(s => s.id === id);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service not found</h2>
          <button
            onClick={() => navigate('/services')}
            className="text-orange-600 hover:text-orange-700"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowBookingForm(true);
  };

  const submitBooking = () => {
    // Handle booking submission
    alert('Booking request sent! The service provider will contact you soon.');
    setShowBookingForm(false);
  };

  const formatPrice = () => {
    if (service.priceType === 'hour') {
      return `₹${service.price}/hr`;
    } else if (service.priceType === 'day') {
      return `₹${service.price}/day`;
    } else {
      return `₹${service.price}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4">
                {service.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${service.title} ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>

            {/* Service Info */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="mb-4">
                <span className="inline-block bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full font-medium">
                  {service.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h1>

              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold text-gray-900 ml-1">
                    {service.rating}
                  </span>
                  <span className="text-gray-500 ml-1">
                    ({service.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex items-center ml-6 text-gray-500">
                  <MapPin className="w-5 h-5 mr-1" />
                  <span>{service.location}</span>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {service.description}
              </p>

              {/* Tags */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Availability</h3>
                <div className="flex flex-wrap gap-2">
                  {service.availability.map((day, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Provider Info */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Service Provider</h2>
              
              <div className="flex items-start">
                <img
                  src={service.provider.avatar}
                  alt={service.provider.name}
                  className="w-16 h-16 rounded-full object-cover mr-6"
                />
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{service.provider.name}</h3>
                    {service.provider.verified && (
                      <Verified className="w-5 h-5 text-green-500 ml-2" />
                    )}
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-gray-900 font-medium ml-1">
                      {service.provider.rating}
                    </span>
                    <span className="text-gray-500 ml-1">
                      ({service.provider.reviewCount} reviews)
                    </span>
                    <span className="text-gray-500 mx-2">•</span>
                    <span className="text-gray-500">
                      {service.provider.yearsExperience} years experience
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{service.provider.bio}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <span className="text-gray-900 ml-1">{service.provider.location}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Completed Jobs:</span>
                      <span className="text-gray-900 ml-1">{service.provider.completedJobs}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.provider.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatPrice()}
                </div>
                <p className="text-gray-500">
                  {service.priceType === 'fixed' ? 'Fixed price' : `Per ${service.priceType}`}
                </p>
              </div>

              {!showBookingForm ? (
                <div className="space-y-4">
                  <button
                    onClick={handleBooking}
                    className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    Book Now
                  </button>
                  
                  <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Message Provider
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Time
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Choose time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      placeholder="Describe your project details..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={submitBooking}
                      disabled={!selectedDate || !selectedTime}
                      className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm Booking
                    </button>
                    
                    <button
                      onClick={() => setShowBookingForm(false)}
                      className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Safety Features */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Safety & Trust</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-green-500 mr-2" />
                    Background verified
                  </div>
                  <div className="flex items-center">
                    <Verified className="w-4 h-4 text-green-500 mr-2" />
                    Identity verified
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-2" />
                    Highly rated
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;