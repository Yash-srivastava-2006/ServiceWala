import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { AuthContextType, User } from '../types';
import { userService } from '../services/database';

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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Always create fallback user from Firebase data
        const fallbackUser: User = {
          id: firebaseUser.uid,
          firebase_uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          role: 'client',
          avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'User')}&background=3b82f6&color=fff`,
          phone: firebaseUser.phoneNumber || '',
          verified: firebaseUser.emailVerified,
          joinedDate: firebaseUser.metadata.creationTime || new Date().toISOString()
        };

        // Set user immediately from Firebase data
        setUser(fallbackUser);
        localStorage.setItem('user', JSON.stringify(fallbackUser));

        // Try to sync with Supabase in the background (optional)
        try {
          const supabaseUser = await userService.upsertUser({
            firebase_uid: firebaseUser.uid,
            name: fallbackUser.name,
            email: fallbackUser.email,
            role: 'client',
            avatar: fallbackUser.avatar,
            phone: fallbackUser.phone,
            verified: firebaseUser.emailVerified,
            joinedDate: firebaseUser.metadata.creationTime || new Date().toISOString()
          });

          // If Supabase sync succeeds, update user data
          if (supabaseUser) {
            setUser(supabaseUser);
            localStorage.setItem('user', JSON.stringify(supabaseUser));
          }
        } catch (error) {
          console.warn('Supabase sync failed, using Firebase data only:', error);
          // Continue with Firebase data - don't throw error
        }
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

  const loginWithGoogle = async () => {
    if (!useFirebase) {
      throw new Error('Google authentication is only available in Firebase mode');
    }
    
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // User state will be updated automatically by onAuthStateChanged
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'client' | 'provider') => {
    setIsLoading(true);
    try {
      if (useFirebase) {
        // Firebase authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Try to sync with Supabase with the role (optional)
        try {
          await userService.upsertUser({
            firebase_uid: userCredential.user.uid,
            name: name,
            email: email,
            role: role,
            verified: false
          });
        } catch (error) {
          console.warn('Supabase sync during signup failed:', error);
          // Continue with Firebase auth - don't fail the signup
        }
        
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

  const updateProfile = async (updates: Partial<User>) => {
    if (user) {
      try {
        if (useFirebase && user.firebase_uid) {
          // Update in Supabase
          const updatedUser = await userService.updateUser(user.id, updates);
          if (updatedUser) {
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        } else {
          // Mock mode - update locally
          const updatedUser = { ...user, ...updates };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        // Fallback to local update if Supabase fails
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
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
    loginWithGoogle,
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