import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Shield, Clock, ArrowRight, Users, CheckCircle } from 'lucide-react';
import { mockCategories, mockServices as services } from '../data/mockData';
import { useLocation } from '../context/LocationContext';
import ServiceCard from '../components/ServiceCard';
import LocationSelector from '../components/LocationSelector';

const Home: React.FC = () => {
  const { selectedState, selectedCity, setSelectedState, setSelectedCity } = useLocation();

  // Filter services based on selected location for featured section
  const featuredServices = services.filter(service => {
    if (!selectedState && !selectedCity) return true;
    if (selectedState && !selectedCity) return service.state === selectedState;
    if (selectedState && selectedCity) return service.state === selectedState && service.city === selectedCity;
    return true;
  }).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Find <span className="text-orange-600">Trusted</span> Local Services
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect with verified professionals for all your home needs. 
                From carpentry to plumbing, find quality service providers in your city.
              </p>
              
              {/* Location Selector */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select your location:</h3>
                <LocationSelector
                  selectedState={selectedState}
                  selectedCity={selectedCity}
                  onStateChange={setSelectedState}
                  onCityChange={setSelectedCity}
                  className="justify-start"
                />
              </div>

              {/* Search Bar */}
              <div className="relative mb-8">
                <div className="flex bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  <input
                    type="text"
                    placeholder="What service do you need? (e.g., AC repair, painting)"
                    className="flex-1 px-6 py-4 text-lg border-none outline-none"
                  />
                  <Link
                    to="/services"
                    className="bg-orange-600 text-white px-8 py-4 hover:bg-orange-700 transition-colors flex items-center"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="flex space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">2500+</div>
                  <div className="text-gray-600">Service Providers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">15000+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">4.8★</div>
                  <div className="text-gray-600">Average Rating</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Professional service"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                  <span className="font-semibold">Verified Professionals</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <Star className="w-6 h-6 text-yellow-400 fill-current mr-2" />
                  <span className="font-semibold">Top Rated Services</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Service Categories</h2>
            <p className="text-xl text-gray-600">Discover the services you need from trusted professionals across India</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {mockCategories.map((category) => (
              <Link
                key={category.name}
                to={`/services?category=${category.name}`}
                className="group text-center p-6 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 hover:shadow-md"
              >
                <div className="mb-4 text-4xl">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors text-sm">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-600">{category.count} services</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get the help you need in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Browse Services</h3>
              <p className="text-gray-600">
                Search through our curated list of verified professionals in your city
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Connect & Book</h3>
              <p className="text-gray-600">
                Review profiles, read reviews, and book the perfect professional for your job
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Get It Done</h3>
              <p className="text-gray-600">
                Enjoy quality service with peace of mind knowing you're protected
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Featured Services
                {(selectedState || selectedCity) && (
                  <span className="text-orange-600 text-2xl ml-2">
                    in {selectedCity ? `${selectedCity}, ` : ''}{selectedState}
                  </span>
                )}
              </h2>
              <p className="text-xl text-gray-600">Top-rated services from trusted professionals</p>
            </div>
            <Link
              to="/services"
              className="flex items-center text-orange-600 hover:text-orange-700 font-medium"
            >
              View All Services
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

          {featuredServices.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No services available</h3>
              <p className="text-gray-600 mb-4">
                No services found in {selectedCity ? `${selectedCity}, ` : ''}{selectedState}
              </p>
              <button
                onClick={() => {
                  setSelectedState('');
                  setSelectedCity('');
                }}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                View services in all locations
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose ServiceWala</h2>
            <p className="text-xl text-orange-100">The trusted platform for finding quality services across India</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 text-white mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">Verified Professionals</h3>
              <p className="text-orange-100">
                All service providers are background-checked and verified for your safety
              </p>
            </div>

            <div className="text-center">
              <Star className="w-12 h-12 text-white mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">Quality Guarantee</h3>
              <p className="text-orange-100">
                We ensure high-quality service with our satisfaction guarantee policy
              </p>
            </div>

            <div className="text-center">
              <Clock className="w-12 h-12 text-white mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">24/7 Support</h3>
              <p className="text-orange-100">
                Our customer support team is available around the clock to help you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied customers who found their perfect service provider
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services"
              className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Find Services
            </Link>
            <Link
              to="/signup"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition-colors font-medium"
            >
              Become a Provider
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;