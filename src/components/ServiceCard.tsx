import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, Verified } from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
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
    <Link to={`/service/${service.id}`} className="group">
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-orange-200">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={service.images[0]}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold text-gray-800">
              {formatPrice()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category Badge */}
          <div className="mb-3">
            <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
              {service.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {service.description}
          </p>

          {/* Provider Info */}
          <div className="flex items-center mb-4">
            <img
              src={service.provider.avatar}
              alt={service.provider.name}
              className="w-8 h-8 rounded-full object-cover mr-3"
            />
            <div className="flex-1">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900">{service.provider.name}</span>
                {service.provider.verified && (
                  <Verified className="w-4 h-4 text-green-500 ml-1" />
                )}
              </div>
            </div>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900 ml-1">
                {service.rating}
              </span>
              <span className="text-sm text-gray-500 ml-1">
                ({service.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{service.location}</span>
          </div>

          {/* Availability */}
          <div className="flex items-center text-gray-500 text-sm mt-2">
            <Clock className="w-4 h-4 mr-1" />
            <span>Available {service.availability.length} days/week</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;