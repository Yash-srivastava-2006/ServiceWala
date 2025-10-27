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
  // Firebase-only authentication (demo/mock mode removed)

  useEffect(() => {
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
  }, []);

  const login = async (email: string, password: string, role?: 'client' | 'provider') => {
    setIsLoading(true);
    try {
      // Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // If role is provided, update user data with the role
      if (role && userCredential.user) {
        try {
          await userService.upsertUser({
            firebase_uid: userCredential.user.uid,
            name: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'User',
            email: userCredential.user.email || '',
            role: role, // Update role based on login selection
            verified: userCredential.user.emailVerified
          });
        } catch (error) {
          console.warn('Supabase role sync during login failed:', error);
          // Continue with Firebase auth - don't fail the login
        }
      }
      
      // User state will be updated automatically by onAuthStateChanged
      // Don't set loading to false here - let onAuthStateChanged handle it
    } catch (error) {
      setIsLoading(false); // Always reset loading state on error
      throw error; // Re-throw the original error to preserve Firebase error codes
    }
  };

  const loginWithGoogle = async () => {
    // Google Sign-In via Firebase
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
      // Firebase authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Always sync with Supabase with the specified role
      try {
        await userService.upsertUser({
          firebase_uid: userCredential.user.uid,
          name: name,
          email: email,
          role: role, // Always use the role provided during signup
          verified: false
        });
      } catch (error) {
        console.warn('Supabase sync during signup failed:', error);
        // Continue with Firebase auth - don't fail the signup
      }

      // User state will be updated automatically by onAuthStateChanged
    } catch (error) {
      setIsLoading(false); // Always reset loading state on error
      throw error; // Re-throw the original error to preserve Firebase error codes
    }
  };

  const logout = async () => {
    await signOut(auth);
    // User state will be updated automatically by onAuthStateChanged
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (user) {
      try {
        if (user.firebase_uid) {
          // Update in Supabase
          const updatedUser = await userService.updateUser(user.id, updates);
          if (updatedUser) {
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        } else {
          // Local user object - update locally
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

  const value: AuthContextType = {
    user,
    login,
    loginWithGoogle,
    signup,
    logout,
    updateProfile,
    isLoading,
    // Firebase-only: demo mode removed
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};