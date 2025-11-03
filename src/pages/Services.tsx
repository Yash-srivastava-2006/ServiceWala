import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { mockCategories } from '../data/mockData';
import { Service } from '../types';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import EnhancedServiceCard from '../components/EnhancedServiceCard';
import BookingModal from '../components/BookingModal';
import LocationSelector from '../components/LocationSelector';

const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [rating, setRating] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  
  // Booking modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  const { selectedState, selectedCity, setSelectedState, setSelectedCity } = useLocation();
  const { user } = useAuth();
  const { services, isLoadingServices: isLoading } = useData();

  // Booking handlers
  const handleBookNow = (service: Service) => {
    if (!user) {
      alert('Please log in to book a service');
      return;
    }
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = () => {
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 3000); // Hide success message after 3 seconds
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedService(null);
  };

  const filteredServices = useMemo(() => {
    let filtered = [...services];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by location
    if (selectedState) {
      filtered = filtered.filter(service => service.state === selectedState);
    }
    if (selectedCity) {
      filtered = filtered.filter(service => service.city === selectedCity);
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Filter by price range
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(service => {
        const price = service.price;
        if (max) {
          return price >= min && price <= max;
        } else {
          return price >= min;
        }
      });
    }

    // Filter by rating
    if (rating) {
      filtered = filtered.filter(service => service.rating >= Number(rating));
    }

    // Sort services
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedState, selectedCity, selectedCategory, priceRange, rating, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Services</h1>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Location Selector */}
          <div className="mb-6">
            <LocationSelector
              selectedState={selectedState}
              selectedCity={selectedCity}
              onStateChange={setSelectedState}
              onCityChange={setSelectedCity}
              className="justify-start"
            />
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 lg:hidden"
          >
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {mockCategories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Any Price</option>
                  <option value="50-100">₹50 - ₹100</option>
                  <option value="100-200">₹100 - ₹200</option>
                  <option value="200-500">₹200 - ₹500</option>
                  <option value="500">₹500+</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3.0">3.0+ Stars</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setPriceRange('');
                  setRating('');
                  setSelectedState('');
                  setSelectedCity('');
                }}
                className="w-full text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Services Grid */}
          <div className="lg:w-3/4">
            {/* Sort and Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {filteredServices.length} service(s) found
                {(selectedState || selectedCity) && (
                  <span className="text-orange-600 ml-1">
                    in {selectedCity ? `${selectedCity}, ` : ''}{selectedState}
                  </span>
                )}
              </p>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="reviews">Most Reviews</option>
                </select>
              </div>
            </div>

            {/* Services Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading services...</p>
              </div>
            ) : filteredServices.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <EnhancedServiceCard 
                    key={service.id} 
                    service={service} 
                    onClick={() => {/* Handle service click - could navigate to service detail */}} 
                    onBookNow={handleBookNow}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-600 mb-4">
                  {(selectedState || selectedCity) ? 
                    `No services available in ${selectedCity ? `${selectedCity}, ` : ''}${selectedState}` :
                    'Try adjusting your search criteria or browse all services'
                  }
                </p>
                {(selectedState || selectedCity) && (
                  <button
                    onClick={() => {
                      setSelectedState('');
                      setSelectedCity('');
                    }}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    View all locations
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {bookingSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Booking request sent successfully!</span>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        service={selectedService}
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
};

export default Services;