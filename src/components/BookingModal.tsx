import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, User, MessageSquare } from 'lucide-react';
import { Service } from '../types';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/database';

interface BookingModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ 
  service, 
  isOpen, 
  onClose, 
  onBookingSuccess 
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    specialInstructions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !service) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please log in to book a service');
      return;
    }

    if (!formData.date || !formData.time) {
      setError('Please select both date and time');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const bookingData = {
        serviceId: service.id,
        serviceName: service.title,
        providerId: service.providerId,
        providerName: service.provider.name,
        customerName: user.name,
        userId: user.id, // Add the customer's user ID
        date: formData.date,
        time: formData.time,
        status: 'pending' as const,
        price: service.price,
        image: service.images[0] || '',
        location: service.location,
        specialInstructions: formData.specialInstructions,
        estimatedDuration: parseFloat(service.duration) || 1
      };

      const result = await bookingService.createBooking(bookingData);
      
      if (result) {
        // Refresh bookings list if function is available
        if ((window as any).refreshBookings) {
          (window as any).refreshBookings();
        }
        
        onBookingSuccess();
        onClose();
        // Reset form
        setFormData({
          date: '',
          time: '',
          specialInstructions: ''
        });
      } else {
        setError('Failed to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError('An error occurred while creating the booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tomorrow's date as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Request Booking</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Service Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start space-x-4">
            <img
              src={service.images[0] || `https://ui-avatars.com/api/?name=${encodeURIComponent(service.title)}&background=f3f4f6&color=9ca3af&size=100`}
              alt={service.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{service.title}</h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <User className="w-4 h-4 mr-1" />
                {service.provider.name}
              </div>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {service.location}
              </div>
              <div className="text-lg font-semibold text-orange-600 mt-2">
                ₹{service.price}
                {service.priceType === 'hourly' && <span className="text-sm">/hr</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Date Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Select Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              min={minDate}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          {/* Time Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Select Time *
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          {/* Special Instructions */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Special Instructions (Optional)
            </label>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              rows={3}
              placeholder="Any specific requirements or instructions for the service provider..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Info Message */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <Calendar className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Booking Request Process
                </h3>
                <div className="mt-1 text-sm text-blue-700">
                  Your request will be sent to the service provider for approval. You'll be notified once they respond.
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending Request...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;