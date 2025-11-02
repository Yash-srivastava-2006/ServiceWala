import React, { useState } from 'react';
import { Clock, Calendar, MapPin, User, MessageSquare, Check, X, AlertCircle } from 'lucide-react';
import { Booking } from '../types';
import { bookingService } from '../services/database';

interface BookingRequestProps {
  request: Booking;
  onRequestUpdate: () => void;
}

const BookingRequest: React.FC<BookingRequestProps> = ({ request, onRequestUpdate }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const success = await bookingService.approveRequest(request.id);
      if (success) {
        onRequestUpdate();
      } else {
        setError('Failed to approve request. Please try again.');
      }
    } catch (err) {
      console.error('Approve request error:', err);
      setError('An error occurred while approving the request.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const success = await bookingService.rejectRequest(request.id);
      if (success) {
        onRequestUpdate();
      } else {
        setError('Failed to reject request. Please try again.');
      }
    } catch (err) {
      console.error('Reject request error:', err);
      setError('An error occurred while rejecting the request.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{request.serviceName}</h3>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
              NEW REQUEST
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <User className="w-4 h-4 mr-1" />
            {request.customerName || 'Customer'}
            {request.requestedAt && (
              <>
                <span className="mx-2">•</span>
                <span>{getTimeAgo(request.requestedAt)}</span>
              </>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-gray-900">₹{request.price}</div>
          {request.estimatedDuration && (
            <div className="text-sm text-gray-500">{request.estimatedDuration} mins</div>
          )}
        </div>
      </div>

      {/* Service Image */}
      {request.image && (
        <div className="mb-4">
          <img
            src={request.image}
            alt={request.serviceName}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Request Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-blue-500" />
          <span className="font-medium">{formatDate(request.date)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-green-500" />
          <span className="font-medium">{request.time}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-red-500" />
          <span>{request.location}</span>
        </div>
      </div>

      {/* Special Instructions */}
      {request.specialInstructions && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start">
            <MessageSquare className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Special Instructions:</p>
              <p className="text-sm text-gray-600">{request.specialInstructions}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleApprove}
          disabled={isProcessing}
          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          <Check className="w-4 h-4 mr-2" />
          {isProcessing ? 'Approving...' : 'Approve Request'}
        </button>
        
        <button
          onClick={handleReject}
          disabled={isProcessing}
          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          <X className="w-4 h-4 mr-2" />
          {isProcessing ? 'Rejecting...' : 'Reject Request'}
        </button>
      </div>

      {/* Contact Customer Button */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <button className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium">
          Contact Customer
        </button>
      </div>
    </div>
  );
};

export default BookingRequest;