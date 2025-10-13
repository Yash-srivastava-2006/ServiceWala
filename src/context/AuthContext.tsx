import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useFirebase, setUseFirebase] = useState(true); // Toggle between Firebase and mock auth

  useEffect(() => {
    // Check for stored user session if not using Firebase
    if (!useFirebase) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      return;
    }

    // Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Convert Firebase user to our User type
        const appUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          role: 'client', // Default role, you might want to store this in Firestore
          avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'User')}&background=3b82f6&color=fff`,
          phone: firebaseUser.phoneNumber || '',
          location: '',
          joinedDate: firebaseUser.metadata.creationTime || new Date().toISOString(),
          verified: firebaseUser.emailVerified
        };
        setUser(appUser);
        localStorage.setItem('user', JSON.stringify(appUser));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [useFirebase]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (useFirebase) {
        // Firebase authentication
        await signInWithEmailAndPassword(auth, email, password);
        // User state will be updated automatically by onAuthStateChanged
        // Don't set loading to false here - let onAuthStateChanged handle it
      } else {
        // Mock authentication (existing logic)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        const mockUser: User = {
          id: '1',
          name: name,
          email,
          role: 'client',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`,
          phone: '+1 (555) 123-4567',
          location: 'New York, NY',
          joinedDate: '2023-01-15',
          verified: true
        };
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false); // Always reset loading state on error
      throw error; // Re-throw the original error to preserve Firebase error codes
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'client' | 'provider') => {
    setIsLoading(true);
    try {
      if (useFirebase) {
        // Firebase authentication
        await createUserWithEmailAndPassword(auth, email, password);
        // You might want to update the user's display name
        // await updateProfile(userCredential.user, { displayName: name });
        // User state will be updated automatically by onAuthStateChanged
      } else {
        // Mock authentication (existing logic)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockUser: User = {
          id: Date.now().toString(),
          name,
          email,
          role,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`,
          phone: '',
          location: '',
          joinedDate: new Date().toISOString().split('T')[0],
          verified: false
        };
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false); // Always reset loading state on error
      throw error; // Re-throw the original error to preserve Firebase error codes
    }
  };

  const logout = async () => {
    if (useFirebase) {
      await signOut(auth);
      // User state will be updated automatically by onAuthStateChanged
    } else {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const toggleAuthMode = () => {
    setUseFirebase(!useFirebase);
    // Clear current user when switching modes
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    isLoading,
    useFirebase,
    toggleAuthMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};