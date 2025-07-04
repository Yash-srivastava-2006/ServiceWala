# ServiceWala
# ServiceWala 🔧

A modern web platform connecting customers with trusted local service providers across India. Find verified professionals for all your home and business needs - from carpentry to cleaning, electrical work to gardening.

## 🌟 Features

### For Customers
- **Location-Based Discovery**: Select your state and city to find services in your area
- **Easy Service Discovery**: Browse through categorized services or search for specific needs
- **Verified Professionals**: All service providers are background-checked and verified
- **Transparent Pricing**: Clear pricing information with no hidden costs
- **Real Reviews**: Authentic customer reviews and ratings
- **Secure Booking**: Safe and secure booking system with multiple payment options
- **Smart Filtering**: Filter by category, price range, rating, and location
- **24/7 Support**: Round-the-clock customer support

### For Service Providers
- **Professional Profiles**: Showcase your skills, experience, and specialties
- **Location-Based Visibility**: Reach customers in your service area
- **Direct Customer Connection**: Connect directly with customers in your area
- **Flexible Scheduling**: Manage your availability and bookings
- **Secure Payments**: Get paid securely and on time
- **Build Reputation**: Earn reviews and ratings to grow your business

## 🗺️ Location Coverage

ServiceWala currently covers major cities across India:

### Available States & Cities
- **Delhi**: New Delhi, Old Delhi, Dwarka, Rohini, Lajpat Nagar
- **Maharashtra**: Mumbai, Pune, Nagpur, Nashik, Aurangabad
- **Karnataka**: Bangalore, Mysore, Hubli, Mangalore, Belgaum
- **Tamil Nadu**: Chennai, Coimbatore, Madurai, Salem, Tiruchirappalli
- **Gujarat**: Ahmedabad, Surat, Vadodara, Rajkot, Bhavnagar
- **Rajasthan**: Jaipur, Jodhpur, Udaipur, Kota, Bikaner
- **West Bengal**: Kolkata, Howrah, Durgapur, Asansol, Siliguri
- **Uttar Pradesh**: Lucknow, Kanpur, Ghaziabad, Agra, Varanasi
- **Haryana**: Gurgaon, Faridabad, Panipat, Ambala, Karnal
- **Punjab**: Chandigarh, Ludhiana, Amritsar, Jalandhar, Patiala

*More cities being added regularly!*

## 🛠️ Services Available

- **🔨 Carpentry**: Custom woodwork, furniture installation, repairs
- **⚡ Electrical**: Wiring, repairs, installations, emergency services
- **🎨 Painting**: Interior/exterior painting, wall texturing, waterproofing
- **🧹 Cleaning**: Deep cleaning, regular maintenance, specialized cleaning
- **🔧 Plumbing**: Leak repairs, installations, drain cleaning, emergency fixes
- **🐛 Pest Control**: Termite treatment, general pest control, eco-friendly solutions
- **🌱 Gardening**: Garden maintenance, landscaping, plant care, soil management
- **🔌 Appliance Repair**: AC repair, refrigerator service, washing machine repair

## 🚀 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Build Tool**: Vite
- **Development**: Hot Module Replacement (HMR)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd servicewala
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Navigation with location selector
│   ├── ServiceCard.tsx # Service display card
│   └── LocationSelector.tsx # State/city selection component
├── context/            # React context providers
│   ├── AuthContext.tsx # Authentication state management
│   └── LocationContext.tsx # Location state management
├── data/               # Mock data and constants
│   └── mockData.ts     # Service, category, and location data
├── pages/              # Page components
│   ├── Home.tsx        # Landing page with location-aware features
│   ├── Services.tsx    # Service listing with location filtering
│   ├── ServiceDetail.tsx # Individual service details
│   ├── Login.tsx       # User authentication
│   ├── Signup.tsx      # User registration
│   ├── Profile.tsx     # User profile management
│   ├── Bookings.tsx    # Booking management
│   ├── Settings.tsx    # User settings
│   └── HowItWorks.tsx  # Information page
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared interfaces and types
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## 🎯 Key Features Implementation

### Location-Based Service Discovery
- **Smart Location Selector**: Cascading dropdowns for state and city selection
- **Persistent Location**: User's location preference saved across sessions
- **Location-Aware Filtering**: Services filtered by selected location
- **Responsive Design**: Location selector works seamlessly on all devices

### Authentication System
- Mock authentication with localStorage persistence
- Role-based access (Customer/Service Provider)
- Protected routes and user state management

### Service Management
- Comprehensive service catalog with filtering and search
- Category-based organization
- Rating and review system
- Location-based service discovery
- Price range and rating filters

### Booking System
- Easy booking flow with date/time selection
- Booking status tracking (Pending, Confirmed, Completed, Cancelled)
- Communication between customers and providers

### User Experience
- Responsive design for all device sizes
- Intuitive navigation and user interface
- Real-time search and filtering
- Professional service provider profiles
- Location-aware search results

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 🌍 Demo Credentials

For testing purposes, you can use these demo credentials:

**Customer Account:**
- Email: `demo@example.com`
- Password: `password123`

**Demo Locations:**
- Try selecting "Delhi" → "New Delhi" to see available services
- Switch to "Maharashtra" → "Mumbai" to see different services

## 🎨 Design Philosophy

ServiceWala follows modern design principles with:
- Clean, professional aesthetics inspired by industry leaders
- Consistent orange/red color system for brand identity
- Thoughtful micro-interactions and hover states
- Accessible design with proper contrast ratios
- Mobile-first responsive design approach
- Location-aware user interface elements

## 🔒 Security Features

- Background verification for all service providers
- Secure payment processing
- Identity verification system
- Customer protection policies
- 24/7 monitoring and support
- Data privacy and protection

## 🚀 Recent Updates

### Version 2.0 - Location Intelligence
- **Location-Based Filtering**: Find services in your specific city
- **Enhanced Navigation**: Location selector integrated into navbar
- **Smart Search**: Location-aware search results
- **Improved UX**: Persistent location preferences
- **Mobile Optimization**: Better mobile experience for location selection

### Version 1.0 - Core Platform
- Complete service marketplace
- User authentication system
- Booking management
- Service provider profiles
- Review and rating system

## 🔮 Future Enhancements

- **Real-time Features**: Live chat system and notifications
- **Advanced Booking**: Calendar integration and recurring bookings
- **Payment Integration**: Multiple payment gateways
- **Mobile App**: Native iOS and Android applications
- **AI Features**: Smart service recommendations
- **Expansion**: More cities and service categories
- **Multi-language**: Support for regional languages
- **Analytics**: Advanced dashboard for providers

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📊 Performance

- **Fast Loading**: Optimized with Vite build system
- **Responsive**: Works seamlessly on all device sizes
- **Efficient**: Smart filtering without API calls
- **Scalable**: Modular architecture for easy expansion

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and inquiries:
- Email: support@servicewala.com
- Phone: +91-XXXX-XXXX-XX
- Website: www.servicewala.com

## 🙏 Acknowledgments

- Icons provided by [Lucide React](https://lucide.dev/)
- Images from [Pexels](https://www.pexels.com/)
- Built with [React](https://reactjs.org/) and [Tailwind CSS](https://tailwindcss.com/)

