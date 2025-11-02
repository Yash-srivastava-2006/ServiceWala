import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { serviceService } from '../services/database';
import { 
  Briefcase, 
  Calendar, 
  Star, 
  Plus, 
  Settings as SettingsIcon,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Eye,
  MapPin
} from 'lucide-react';
import { Booking, Service } from '../types';

const ProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const { userBookings, isLoadingBookings } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [providerServices, setProviderServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  const [stats, setStats] = useState({
    totalServices: 0,
    activeBookings: 0,
    completedJobs: user?.completedJobs || 0,
    rating: user?.rating || 0,
    monthlyEarnings: 0
  });

  useEffect(() => {
    // Check if user role is still loading from authentication
    if (!user) {
      return; // Still loading
    }
    
    if (user.role !== 'provider') {
      // Give a short delay in case the role is being updated
      const timer = setTimeout(() => {
        if (user.role !== 'provider') {
          // Still not a provider after delay, redirect
          window.location.href = '/';
        }
      }, 2000); // 2 second delay
      
      return () => clearTimeout(timer);
    }
    
    // Load provider services
    loadProviderServices();
    
    // Calculate stats from bookings
    const activeBookings = userBookings.filter(booking => 
      ['pending', 'confirmed', 'in_progress'].includes(booking.status)
    ).length;
    
    const monthlyEarnings = userBookings
      .filter(booking => {
        const bookingDate = new Date(booking.date);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return bookingDate.getMonth() === currentMonth && 
               bookingDate.getFullYear() === currentYear &&
               booking.status === 'completed';
      })
      .reduce((total, booking) => total + booking.price, 0);

    setStats(prev => ({
      ...prev,
      totalServices: providerServices.length,
      activeBookings,
      monthlyEarnings
    }));
  }, [user, userBookings, providerServices.length]);

  const loadProviderServices = async () => {
    if (!user?.id) return;
    
    setIsLoadingServices(true);
    try {
      const services = await serviceService.getServicesByProvider(user.id);
      setProviderServices(services);
    } catch (error) {
      console.error('Error loading provider services:', error);
    } finally {
      setIsLoadingServices(false);
    }
  };

  const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; color: string }> = 
    ({ icon, title, value, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'confirmed': return 'bg-blue-100 text-blue-800';
        case 'in_progress': return 'bg-purple-100 text-purple-800';
        case 'completed': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{booking.serviceName}</h3>
            <p className="text-sm text-gray-600 mt-1">Client: {booking.providerName}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
            {booking.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {booking.date}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            {booking.time}
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900">₹{booking.price}</span>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait while we verify your account.</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'provider') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Provider Access Required</h2>
          <p className="text-gray-600 mb-4">
            This page is only accessible to service providers. If you just signed up as a provider, 
            please wait a moment for your account to be updated.
          </p>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
            >
              Refresh Page
            </button>
            <Link 
              to="/" 
              className="block bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Briefcase className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Provider Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/add-service"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Link>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <SettingsIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={<Briefcase className="w-6 h-6 text-white" />}
            title="Active Services"
            value={stats.totalServices}
            color="bg-blue-500"
          />
          <StatCard
            icon={<Calendar className="w-6 h-6 text-white" />}
            title="Active Bookings"
            value={stats.activeBookings}
            color="bg-purple-500"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6 text-white" />}
            title="Completed Jobs"
            value={stats.completedJobs}
            color="bg-green-500"
          />
          <StatCard
            icon={<Star className="w-6 h-6 text-white" />}
            title="Rating"
            value={`${stats.rating.toFixed(1)}/5.0`}
            color="bg-yellow-500"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6 text-white" />}
            title="Monthly Earnings"
            value={`₹${stats.monthlyEarnings}`}
            color="bg-indigo-500"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'bookings', label: 'Bookings', icon: Calendar },
                { id: 'services', label: 'My Services', icon: Briefcase },
                { id: 'reviews', label: 'Reviews', icon: Star }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                {userBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h4>
                    <p className="text-gray-600">Start by creating your first service to attract customers.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userBookings.slice(0, 4).map(booking => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">All Bookings</h3>
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
                
                {isLoadingBookings ? (
                  <div className="text-center py-8">Loading bookings...</div>
                ) : userBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h4>
                    <p className="text-gray-600">Your bookings will appear here once customers start booking your services.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userBookings.map(booking => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Services</h3>
                  <Link 
                    to="/add-service"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Service
                  </Link>
                </div>
                
                {isLoadingServices ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your services...</p>
                  </div>
                ) : providerServices.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No services created yet</h4>
                    <p className="text-gray-600 mb-4">Create your first service to start receiving bookings from customers.</p>
                    <Link 
                      to="/add-service"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                    >
                      Create Your First Service
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {providerServices.map(service => (
                      <div key={service.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        {service.images.length > 0 && (
                          <img
                            src={service.images[0]}
                            alt={service.title}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 text-lg">{service.title}</h4>
                            <div className="flex items-center text-yellow-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-sm text-gray-600 ml-1">
                                {service.rating.toFixed(1)} ({service.reviewCount})
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                          
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {service.location}, {service.city}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <Clock className="w-4 h-4 mr-1" />
                            {service.duration}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-lg font-semibold text-gray-900">
                              ₹{service.price}
                              <span className="text-sm font-normal text-gray-500 ml-1">
                                {service.priceType === 'hourly' ? '/hr' : ''}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Link
                                to={`/service/${service.id}`}
                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                title="View Service"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <button
                                className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                title="Edit Service"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          {service.tags.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="flex flex-wrap gap-1">
                                {service.tags.slice(0, 3).map(tag => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {service.tags.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    +{service.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Reviews</h3>
                <div className="text-center py-8">
                  <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
                  <p className="text-gray-600">Reviews from your customers will appear here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;