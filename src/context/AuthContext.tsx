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
        // Try to get existing user data from Supabase first
        try {
          const existingUser = await userService.getUserByFirebaseUid(firebaseUser.uid);
          
          if (existingUser) {
            // User exists in Supabase, use that data (preserves role)
            setUser(existingUser);
            localStorage.setItem('user', JSON.stringify(existingUser));
          } else {
            // User doesn't exist in Supabase, create fallback with default client role
            const fallbackUser: User = {
              id: firebaseUser.uid,
              firebase_uid: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email || '',
              role: 'client', // Default role for Firebase-only users
              avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'User')}&background=3b82f6&color=fff`,
              phone: firebaseUser.phoneNumber || '',
              verified: firebaseUser.emailVerified,
              joinedDate: firebaseUser.metadata.creationTime || new Date().toISOString()
            };

            setUser(fallbackUser);
            localStorage.setItem('user', JSON.stringify(fallbackUser));
          }
        } catch (error) {
          console.warn('Failed to get user from Supabase, using Firebase data only:', error);
          
          // Fallback to Firebase data only
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

          setUser(fallbackUser);
          localStorage.setItem('user', JSON.stringify(fallbackUser));
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

      console.log('Firebase user created:', userCredential.user.uid);

      // Always sync with Supabase with the specified role
      let supabaseUser = null;
      try {
        supabaseUser = await userService.upsertUser({
          firebase_uid: userCredential.user.uid,
          name: name,
          email: email,
          role: role, // Always use the role provided during signup
          verified: false,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`
        });

        console.log('User successfully created in Supabase:', supabaseUser?.id);
      } catch (supabaseError) {
        console.error('❌ CRITICAL: Supabase sync during signup failed!');
        console.error('Supabase error details:', JSON.stringify(supabaseError, null, 2));
        console.error('User will exist in Firebase but not in Supabase database');
        
        // Show user-friendly error but don't fail the signup
        console.warn('⚠️ Account created but some features may not work properly. Please contact support if issues persist.');
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