import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Star, MessageCircle, Phone, MoreVertical } from 'lucide-react';
import { Booking } from '../types';

const Bookings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');

  // Mock bookings data
  const mockBookings: Booking[] = [
    {
      id: '1',
      serviceId: '1',
      serviceName: 'House Cleaning',
      providerId: 'provider-1',
      providerName: 'CleanPro Services',
      date: '2024-02-15',
      time: '10:00 AM',
      status: 'confirmed',
      price: 80,
      image: 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=300',
      location: 'Downtown Area'
    },
    {
      id: '2',
      serviceId: '2',
      serviceName: 'Plumbing Repair',
      providerId: 'provider-2',
      providerName: 'FixIt Fast',
      date: '2024-02-18',
      time: '2:00 PM',
      status: 'pending',
      price: 120,
      image: 'https://images.pexels.com/photos/8486944/pexels-photo-8486944.jpeg?auto=compress&cs=tinysrgb&w=300',
      location: 'City Wide'
    },
    {
      id: '3',
      serviceId: '3',
      serviceName: 'Garden Maintenance',
      providerId: 'provider-3',
      providerName: 'Green Thumb Co.',
      date: '2024-01-20',
      time: '9:00 AM',
      status: 'completed',
      price: 95,
      image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=300',
      location: 'Suburban Areas'
    },
    {
      id: '4',
      serviceId: '4',
      serviceName: 'Pet Sitting',
      providerId: 'provider-4',
      providerName: 'Paws & Care',
      date: '2024-01-10',
      time: '8:00 AM',
      status: 'cancelled',
      price: 45,
      image: 'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg?auto=compress&cs=tinysrgb&w=300',
      location: 'Local Area'
    }
  ];

  const getFilteredBookings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (activeTab) {
      case 'upcoming':
        return mockBookings.filter(booking => {
          const bookingDate = new Date(booking.date);
          return bookingDate >= today && booking.status !== 'cancelled';
        });
      case 'past':
        return mockBookings.filter(booking => {
          const bookingDate = new Date(booking.date);
          return bookingDate < today || booking.status === 'completed';
        });
      case 'cancelled':
        return mockBookings.filter(booking => booking.status === 'cancelled');
      default:
        return mockBookings;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = getFilteredBookings();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bookings</h1>
          <p className="text-gray-600">Manage and track all your service bookings</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'upcoming', label: 'Upcoming', count: mockBookings.filter(b => new Date(b.date) >= new Date() && b.status !== 'cancelled').length },
                { key: 'past', label: 'Past', count: mockBookings.filter(b => new Date(b.date) < new Date() || b.status === 'completed').length },
                { key: 'cancelled', label: 'Cancelled', count: mockBookings.filter(b => b.status === 'cancelled').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4">
                      <img
                        src={booking.image}
                        alt={booking.serviceName}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{booking.serviceName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">by {booking.providerName}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{booking.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{booking.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">${booking.price}</p>
                      <button className="mt-2 p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreVertical className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex space-x-3">
                    {booking.status === 'confirmed' && (
                      <>
                        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          <span>Message Provider</span>
                        </button>
                        <button className="flex items-center space-x-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                          <Phone className="h-4 w-4" />
                          <span>Call</span>
                        </button>
                      </>
                    )}
                    {booking.status === 'completed' && (
                      <button className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors">
                        <Star className="h-4 w-4" />
                        <span>Leave Review</span>
                      </button>
                    )}
                    {booking.status === 'pending' && (
                      <button className="flex items-center space-x-2 border border-red-300 hover:bg-red-50 text-red-700 px-4 py-2 rounded-lg transition-colors">
                        <span>Cancel Booking</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'upcoming' && "You don't have any upcoming bookings."}
              {activeTab === 'past' && "You don't have any past bookings."}
              {activeTab === 'cancelled' && "You don't have any cancelled bookings."}
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
              Browse Services
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;