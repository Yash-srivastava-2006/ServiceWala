# 🛠️ ServiceWala - Local Service Marketplace

A modern, full-stack marketplace platform connecting customers with local service providers. Built with React, TypeScript, Firebase, and Supabase.

![ServiceWala](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![Firebase](https://img.shields.io/badge/Firebase-12.4.0-orange)
![Supabase](https://img.shields.io/badge/Supabase-2.75.0-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-cyan)

## 🚀 Features

### 👥 **Dual User Types**
- **Customers**: Browse, search, and book services
- **Service Providers**: List services, manage bookings, track earnings

### 🔐 **Authentication & Authorization**
- Firebase Authentication with email/password and Google OAuth
- Role-based access control (Customer vs Provider)
- Secure user profile management

### 🏠 **Service Management**
- **Service Listing**: Providers can create detailed service offerings
- **Category System**: Organized service categories (Carpentry, Electrical, Plumbing, etc.)
- **Advanced Search**: Filter by location, price, category, and ratings
- **Image Gallery**: Multiple images per service
- **Availability Management**: Set working days and hours

### 📍 **Location-Based Services**
- Indian state and city selection
- Location-based service discovery
- Service area management for providers

### 📊 **Dashboard Features**
- **Provider Dashboard**: Service management, booking overview, earnings
- **Customer Dashboard**: Booking history, favorites, profile management
- **Analytics**: Performance metrics and insights

### 💰 **Pricing & Booking**
- Flexible pricing (Fixed rate or Hourly)
- Real-time booking system
- Service duration estimation
- Special instructions support

### ⭐ **Reviews & Ratings**
- 5-star rating system
- Customer reviews and feedback
- Provider reputation management
- Verified reviews

## 🛠️ Tech Stack

### **Frontend**
- **React 18.3.1** - Modern UI library with hooks
- **TypeScript 5.5.3** - Type-safe development
- **React Router DOM 6.22.0** - Client-side routing
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React 0.344.0** - Beautiful icon library
- **Vite 5.4.19** - Fast build tool and dev server

### **Backend & Database**
- **Firebase 12.4.0** - Authentication and hosting
- **Supabase 2.75.0** - PostgreSQL database and real-time features
- **PostgreSQL** - Relational database with foreign key constraints

### **Development Tools**
- **ESLint 9.9.1** - Code linting and formatting
- **PostCSS 8.4.35** - CSS processing
- **Autoprefixer 10.4.18** - CSS vendor prefixing

## 🏗️ Project Structure

```
ServiceWala/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ErrorBoundary.tsx
│   │   ├── LocationSelector.tsx
│   │   ├── Navbar.tsx
│   │   └── ServiceCard.tsx
│   ├── config/           # Configuration files
│   │   ├── firebase.ts   # Firebase setup
│   │   └── supabase.ts   # Supabase setup
│   ├── context/          # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── DataContext.tsx
│   │   └── LocationContext.tsx
│   ├── data/             # Static data and mocks
│   │   └── mockData.tsx
│   ├── pages/            # Route components
│   │   ├── AddService.tsx
│   │   ├── Bookings.tsx
│   │   ├── Home.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Login.tsx
│   │   ├── Profile.tsx
│   │   ├── ServiceDetail.tsx
│   │   ├── Services.tsx
│   │   ├── Settings.tsx
│   │   └── Signup.tsx
│   ├── services/         # API and database services
│   │   └── database.ts
│   ├── types/            # TypeScript type definitions
│   │   ├── database.ts
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   └── testUtils.ts
│   ├── App.tsx           # Main app component
│   ├── index.css         # Global styles
│   └── main.tsx          # App entry point
├── .env.local            # Environment variables
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.js        # Vite configuration
```

## 📋 Database Schema

### **Users Table**
- `user_id` (UUID, Primary Key)
- `firebase_uid` (String, Unique)
- `name`, `email`, `phone`, `avatar`
- `role` ('client' | 'provider')
- `location`, `city`, `state`
- `verified`, `bio`, `experience_years`
- `specialties`, `skills`, `completed_jobs`, `rating`

### **Services Table**
- `service_id` (UUID, Primary Key)
- `provider_id` (UUID, Foreign Key → users.user_id)
- `category_id` (UUID, Foreign Key → categories.category_id)
- `title`, `description`, `price`, `price_type`
- `duration`, `images`, `availability`
- `location`, `city`, `state`, `tags`
- `rating`, `review_count`, `is_active`

### **Categories Table**
- `category_id` (UUID, Primary Key)
- `name` (Unique), `description`, `icon`
- `is_active`

### **Bookings Table**
- `booking_id` (UUID, Primary Key)
- `user_id`, `service_id`, `provider_id` (Foreign Keys)
- `service_name`, `provider_name`
- `booking_date`, `booking_time`, `status`
- `price`, `location`, `special_instructions`

### **Reviews Table**
- `review_id` (UUID, Primary Key)
- `user_id`, `provider_id`, `service_id`, `booking_id` (Foreign Keys)
- `rating` (1-5), `comment`, `user_name`
- `verified`

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Firebase account
- Supabase account

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/ServiceWala.git
cd ServiceWala
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Setup**
Create a `.env.local` file in the root directory:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id

# Supabase Configuration
VITE_SUPABASE_URL=https://your_project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **4. Database Setup**

#### **Firebase Setup:**
1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication with Email/Password and Google providers
3. Configure authorized domains
4. Copy configuration to `.env.local`

#### **Supabase Setup:**
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database schema (see Database Schema section above)
3. Set up Row Level Security (RLS) policies
4. Copy project URL and anon key to `.env.local`

### **5. Run the Development Server**
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

### **6. Build for Production**
```bash
npm run build
npm run preview
```

## 🔧 Configuration

### **Firebase Configuration**
- Set up authentication providers
- Configure security rules
- Set up hosting (optional)

### **Supabase Configuration**
- Enable Row Level Security
- Set up database policies
- Configure real-time subscriptions

### **Environment Variables**
All sensitive configuration is handled through environment variables in `.env.local`.

## 🧪 Testing

### **Manual Testing**
- Use the development environment to test features
- Test both customer and provider workflows
- Verify authentication flows

### **Database Testing**
```bash
# Run database integrity check (in browser console)
checkDatabaseIntegrity()
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🛡️ Security

- All user data is secured with Firebase Authentication
- Database access is controlled through Supabase RLS policies
- Input validation and sanitization on all forms
- Secure API endpoints with proper authorization

## 🚀 Deployment

### **Frontend Deployment (Vercel/Netlify)**
```bash
npm run build
# Deploy the dist/ folder
```

### **Database**
- Supabase handles database hosting
- Configure production environment variables

### **Environment Variables for Production**
Update all `VITE_*` variables with production values.

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section in the wiki
- Review common problems in the FAQ

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Firebase** for authentication and hosting
- **Supabase** for the excellent database solution
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icons

---

**Built with ❤️ for the local service community**