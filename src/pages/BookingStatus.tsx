import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  FileText,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/database';
import { Booking } from '../types';

const BookingStatus: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookingId) {
      setError('No booking ID provided');
      setIsLoading(false);
      return;
    }

    loadBookingDetails();
  }, [bookingId]);

  const loadBookingDetails = async () => {
    if (!user || !bookingId) return;

    setIsLoading(true);
    try {
      // Get all user bookings and find the specific one
      const userBookings = await bookingService.getUserBookings(user.id);
      const foundBooking = userBookings.find(b => b.id === bookingId);
      
      if (foundBooking) {
        setBooking(foundBooking);
        setError('');
      } else {
        setError('Booking not found or you do not have permission to view it');
      }
    } catch (err) {
      console.error('Error loading booking details:', err);
      setError('Failed to load booking details');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: <AlertCircle className="w-8 h-8 text-yellow-500" />,
          title: 'Request Pending',
          description: 'Your booking request is waiting for provider approval',
          color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          actionText: 'Waiting for response...'
        };
      case 'approved':
        return {
          icon: <CheckCircle className="w-8 h-8 text-green-500" />,
          title: 'Booking Approved',
          description: 'Great! Your booking has been approved by the provider',
          color: 'bg-green-50 border-green-200 text-green-800',
          actionText: 'Prepare for your service'
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-8 h-8 text-red-500" />,
          title: 'Booking Rejected',
          description: 'Unfortunately, your booking request was declined',
          color: 'bg-red-50 border-red-200 text-red-800',
          actionText: 'Try booking another provider'
        };
      case 'cancelled':
        return {
          icon: <XCircle className="w-8 h-8 text-gray-500" />,
          title: 'Booking Cancelled',
          description: 'This booking has been cancelled',
          color: 'bg-gray-50 border-gray-200 text-gray-800',
          actionText: 'Book again if needed'
        };
      case 'in_progress':
        return {
          icon: <Clock className="w-8 h-8 text-blue-500" />,
          title: 'Service In Progress',
          description: 'Your service is currently being performed',
          color: 'bg-blue-50 border-blue-200 text-blue-800',
          actionText: 'Service in progress'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="w-8 h-8 text-purple-500" />,
          title: 'Service Completed',
          description: 'Your service has been completed successfully',
          color: 'bg-purple-50 border-purple-200 text-purple-800',
          actionText: 'Leave a review'
        };
      default:
        return {
          icon: <AlertCircle className="w-8 h-8 text-gray-500" />,
          title: 'Unknown Status',
          description: 'Status information unavailable',
          color: 'bg-gray-50 border-gray-200 text-gray-800',
          actionText: ''
        };
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleRefresh = () => {
    loadBookingDetails();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to view booking details.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading booking details...</h2>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The requested booking could not be found.'}</p>
          <Link 
            to="/bookings"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Back to Bookings
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(booking.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
              <p className="text-gray-600">Booking ID: {booking.id}</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Status Card */}
        <div className={`rounded-xl border-2 p-6 mb-8 ${statusInfo.color}`}>
          <div className="flex items-center space-x-4">
            {statusInfo.icon}
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">{statusInfo.title}</h2>
              <p className="text-sm opacity-90 mb-2">{statusInfo.description}</p>
              <p className="text-sm font-medium">{statusInfo.actionText}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2">
            {/* Service Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Information</h3>
              
              <div className="flex items-start space-x-4 mb-4">
                <img
                  src={booking.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.serviceName)}&background=f3f4f6&color=9ca3af&size=100`}
                  alt={booking.serviceName}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg">{booking.serviceName}</h4>
                  <div className="flex items-center text-gray-600 mt-1">
                    <User className="w-4 h-4 mr-1" />
                    <span>by {booking.providerName}</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600 mt-2">₹{booking.price}</div>
                </div>
              </div>

              {booking.specialInstructions && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Special Instructions</h5>
                      <p className="text-sm text-gray-600">{booking.specialInstructions}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Booking Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Timeline</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Request Submitted</p>
                    <p className="text-sm text-gray-600">
                      {booking.requestedAt ? formatDateTime(booking.requestedAt) : 'Time not available'}
                    </p>
                  </div>
                </div>

                {booking.respondedAt && (
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      booking.status === 'approved' ? 'bg-green-500' : 
                      booking.status === 'rejected' ? 'bg-red-500' : 'bg-gray-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Provider {booking.status === 'approved' ? 'Approved' : 
                                booking.status === 'rejected' ? 'Rejected' : 'Responded'}
                      </p>
                      <p className="text-sm text-gray-600">{formatDateTime(booking.respondedAt)}</p>
                    </div>
                  </div>
                )}

                {booking.status === 'completed' && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900">Service Completed</p>
                      <p className="text-sm text-gray-600">Service finished successfully</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Schedule Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Date</p>
                    <p className="text-sm text-gray-600">{new Date(booking.date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Time</p>
                    <p className="text-sm text-gray-600">{booking.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-sm text-gray-600">{booking.location}</p>
                  </div>
                </div>

                {booking.estimatedDuration && (
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Duration</p>
                      <p className="text-sm text-gray-600">{booking.estimatedDuration} hours</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {(booking.status === 'approved' || booking.status === 'in_progress') && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Provider</h3>
                
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>Message Provider</span>
                  </button>
                  
                  <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Phone className="w-4 h-4" />
                    <span>Call Provider</span>
                  </button>
                </div>
              </div>
            )}

            {booking.status === 'completed' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Service</h3>
                <p className="text-sm text-gray-600 mb-4">
                  How was your experience with this service?
                </p>
                <button className="w-full flex items-center justify-center space-x-2 bg-yellow-500 text-white px-4 py-3 rounded-lg hover:bg-yellow-600 transition-colors">
                  <Star className="w-4 h-4" />
                  <span>Leave Review</span>
                </button>
              </div>
            )}

            {booking.status === 'pending' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Request</h3>
                <p className="text-sm text-gray-600 mb-4">
                  You can cancel this request if you no longer need the service.
                </p>
                <button className="w-full flex items-center justify-center space-x-2 border border-red-300 text-red-700 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors">
                  <XCircle className="w-4 h-4" />
                  <span>Cancel Request</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Back to Bookings */}
        <div className="mt-8 text-center">
          <Link
            to="/bookings"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Bookings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingStatus;