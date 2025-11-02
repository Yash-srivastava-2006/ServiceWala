// Enhanced ServiceCard component with better image display
import React from 'react';
import { Star, MapPin, Clock, Calendar } from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
  onBookNow?: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick, onBookNow }) => {
  // Get the first image or use a placeholder
  const primaryImage = service.images && service.images.length > 0 
    ? service.images[0] 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(service.title)}&background=f3f4f6&color=9ca3af&size=400`;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(service.title)}&background=f3f4f6&color=9ca3af&size=400`;
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Image Section with Better Handling */}
      <div className="relative h-48 bg-gray-100">
        <img
          src={primaryImage}
          alt={service.title}
          className="w-full h-full object-cover"
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Image Count Indicator */}
        {service.images && service.images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
            +{service.images.length - 1} more
          </div>
        )}
        
        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 px-2 py-1 rounded-lg">
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-gray-900">
              ₹{service.price}
              {service.priceType === 'hourly' && (
                <span className="text-sm text-gray-600">/hr</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2">
            {service.title}
          </h3>
          {service.rating > 0 && (
            <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">
                {service.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {service.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{service.city}, {service.state}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>{service.duration}</span>
          </div>
        </div>

        {/* Provider Info */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <img
              src={service.provider.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(service.provider.name)}&background=3b82f6&color=fff`}
              alt={service.provider.name}
              className="w-6 h-6 rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(service.provider.name)}&background=3b82f6&color=fff`;
              }}
            />
            <span className="text-sm text-gray-600">{service.provider.name}</span>
            {service.provider.verified && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        {service.tags && service.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {service.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {service.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{service.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Book Now Button */}
        {onBookNow && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookNow(service);
              }}
              className="w-full flex items-center justify-center space-x-2 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Now</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;