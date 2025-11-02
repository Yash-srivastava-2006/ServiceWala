import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Star, MessageCircle, Phone, MoreVertical } from 'lucide-react';
import { Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/database';

const Bookings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Load user bookings
  useEffect(() => {
    const loadBookings = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('Loading bookings for user:', user.id);
        const userBookings = await bookingService.getUserBookings(user.id);
        console.log('Loaded bookings:', userBookings);
        setBookings(userBookings);
        setError('');
      } catch (err) {
        console.error('Error loading bookings:', err);
        setError('Failed to load bookings');
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [user]);

  // Refresh bookings (can be called from BookingModal)
  const refreshBookings = async () => {
    if (user) {
      try {
        const userBookings = await bookingService.getUserBookings(user.id);
        setBookings(userBookings);
      } catch (err) {
        console.error('Error refreshing bookings:', err);
      }
    }
  };

  // Expose refresh function globally so BookingModal can call it
  useEffect(() => {
    (window as any).refreshBookings = refreshBookings;
    return () => {
      delete (window as any).refreshBookings;
    };
  }, [user]);

  const getFilteredBookings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (activeTab) {
      case 'upcoming':
        return bookings.filter(booking => {
          const bookingDate = new Date(booking.date);
          return bookingDate >= today && booking.status !== 'cancelled';
        });
      case 'past':
        return bookings.filter(booking => {
          const bookingDate = new Date(booking.date);
          return bookingDate < today || booking.status === 'completed';
        });
      case 'cancelled':
        return bookings.filter(booking => booking.status === 'cancelled');
      default:
        return bookings;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = getFilteredBookings();

  // Show loading or login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Please log in</h3>
            <p className="text-gray-500 mb-6">You need to be logged in to view your bookings.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

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
                { key: 'upcoming', label: 'Upcoming', count: bookings.filter(b => new Date(b.date) >= new Date() && b.status !== 'cancelled').length },
                { key: 'past', label: 'Past', count: bookings.filter(b => new Date(b.date) < new Date() || b.status === 'completed').length },
                { key: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
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
                      <p className="text-2xl font-bold text-gray-900">₹{booking.price}</p>
                      <button className="mt-2 p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreVertical className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                        <div className="mt-6 flex space-x-3">
                          <Link
                            to={`/booking/${booking.id}`}
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            <span>View Details</span>
                          </Link>
                          
                          {(booking.status === 'approved' || booking.status === 'in_progress') && (
                            <>
                              <button className="flex items-center space-x-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors">
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
                              <span>Cancel Request</span>
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