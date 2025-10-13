# Firebase Authentication Setup Guide

## Overview
Your ServiceWala application now supports Firebase Authentication with both Email/Password and Google Sign-In, alongside the existing mock authentication system. You can toggle between Firebase and Demo modes using the switch on the login/signup pages.

## Firebase Project Setup

### 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "servicewala-app")
4. Follow the setup wizard

### 2. Enable Authentication Methods
1. In your Firebase project console, navigate to **Authentication**
2. Click on the **Sign-in method** tab
3. Enable **Email/Password** authentication
4. Enable **Google** authentication:
   - Click on Google
   - Toggle "Enable"
   - Add your project's public-facing name
   - Choose a support email
   - Click "Save"

### 3. Configure Google OAuth (Important!)
For Google Sign-In to work, you need to configure OAuth properly:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **APIs & Services** > **Credentials**
4. Find your OAuth 2.0 Client ID (created automatically by Firebase)
5. Add authorized domains:
   - `localhost` (for development)
   - Your production domain (when deployed)
6. Add authorized redirect URIs:
   - `http://localhost:5174` (for development)
   - Your production URL (when deployed)

### 4. Get Firebase Configuration
1. In your Firebase project console, click on the gear icon (Project settings)
2. Scroll down to the "Your apps" section
3. Click on the **Web** icon (`</>`)
4. Register your app with a name (e.g., "ServiceWala Web")
5. Copy the Firebase configuration object

### 5. Update Your Configuration
Your configuration is already set up in `src/config/firebase.ts`. The current setup includes:
- Firebase initialization
- Google Auth Provider configuration
- Custom parameters for better UX (account selection prompt)

## Features

### Authentication Modes
- **Firebase Mode**: Real Firebase authentication with Email/Password and Google Sign-In
- **Demo Mode**: Mock authentication for testing and development

### Available Authentication Methods

#### Email/Password Authentication
- ✅ Email/Password sign in
- ✅ Email/Password sign up
- ✅ User state persistence
- ✅ Sign out
- ✅ Error handling with Firebase-specific messages

#### Google Authentication
- ✅ Google Sign-In (works for both login and signup)
- ✅ Popup-based authentication
- ✅ Account selection prompt
- ✅ Error handling for popup issues
- ✅ Automatic user profile creation from Google account

### Current Features
- User state persistence across browser sessions
- Real-time authentication state updates
- Comprehensive error handling
- Responsive UI with loading states
- Mode switching between Firebase and Demo

## Usage

### Switching Authentication Modes
Use the toggle button on the login/signup pages to switch between:
- **Firebase Auth**: Real authentication using Firebase (Email/Password + Google)
- **Demo Mode**: Mock authentication for testing

### Demo Credentials (Demo Mode Only)
- Email: `demo@example.com`
- Password: `password123`

### Firebase Authentication
When in Firebase mode, users can:

**Email/Password:**
1. Sign up with a new email and password
2. Sign in with existing Firebase credentials
3. Get proper error messages for authentication issues

**Google Sign-In:**
1. Click "Continue with Google" on login or signup page
2. Select Google account in popup
3. Automatically get signed in/up
4. Profile information is automatically populated from Google account

## Development

### Testing Google Authentication
1. Make sure you're in Firebase mode (toggle if needed)
2. Click "Continue with Google" 
3. Allow popups in your browser if blocked
4. Select your Google account
5. You should be automatically signed in and redirected

### Common Google Auth Issues
- **Popup Blocked**: Browser blocked the popup → Allow popups for localhost
- **Account Exists**: Email already exists with different method → Use the existing method
- **Popup Closed**: User closed popup → Try again

## Troubleshooting

### Common Issues

#### Email/Password Authentication
1. **"Firebase config is invalid"**: Check that all configuration values are correct
2. **"Email already in use"**: User already exists, try signing in instead
3. **"Weak password"**: Firebase requires passwords to be at least 6 characters
4. **"Invalid email"**: Check email format
5. **"Network error"**: Check internet connection and Firebase service status

#### Google Authentication
1. **"Popup blocked"**: Browser blocked the popup → Enable popups for your domain
2. **"Popup closed by user"**: User closed the popup → Try again
3. **"Account exists with different credential"**: Email exists with email/password → Use email/password to sign in
4. **"OAuth domain not authorized"**: Add your domain to authorized domains in Google Cloud Console
5. **"Redirect URI mismatch"**: Add correct redirect URIs in Google Cloud Console

### Development Tips
- Use browser DevTools to check for console errors
- Firebase Auth state changes are logged in the console
- Test both authentication modes during development
- Firebase emulator can be used for local development
- Google Sign-In requires HTTPS in production (localhost is exempt)

### Production Deployment
1. Add your production domain to Firebase authorized domains
2. Add your production domain to Google Cloud Console authorized domains
3. Update redirect URIs for production URLs
4. Ensure HTTPS is enabled for your production app
5. Test Google Sign-In thoroughly on production

## Authentication Flow Summary

### Email/Password Flow
1. User enters email/password
2. Firebase validates credentials
3. User object created/retrieved
4. App state updated
5. User redirected to home

### Google Sign-In Flow
1. User clicks "Continue with Google"
2. Google popup opens
3. User selects Google account
4. Google returns user data to Firebase
5. Firebase creates/retrieves user
6. App state updated
7. User redirected to home

Both flows result in the same user experience and state management!