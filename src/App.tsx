import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HowItWorks from './pages/HowItWorks';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import Settings from './pages/Settings';
import ProviderDashboard from './pages/ProviderDashboard';
import AddService from './pages/AddService';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <LocationProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/service/:id" element={<ServiceDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/provider-dashboard" element={<ProviderDashboard />} />
                <Route path="/add-service" element={<AddService />} />
              </Routes>
            </div>
          </Router>
        </LocationProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;