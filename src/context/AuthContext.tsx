import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  firebaseAuthService,
  getUserProfile,
  syncUserProfile,
  updateUserProfile as updateFirestoreUserProfile,
} from '../services/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  authLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  error: string | null;
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  clearError: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const openAuthModal = useCallback((mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setError(null);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setError(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!auth.currentUser) {
      setUserProfile(null);
      return;
    }
    try {
      let profile = await getUserProfile(auth.currentUser.uid);
      if (!profile) {
        profile = await syncUserProfile(auth.currentUser);
      }
      setUserProfile(profile);
    } catch (err) {
      console.error('Failed to load profile from Firestore:', err);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          let profile = await getUserProfile(firebaseUser.uid);
          if (!profile) {
            profile = await syncUserProfile(firebaseUser);
          }
          setUserProfile(profile);
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setUserProfile(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const firebaseUser = await firebaseAuthService.signInWithGoogle();
      const profile = await syncUserProfile(firebaseUser);
      setUser(firebaseUser);
      setUserProfile(profile);
      closeAuthModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed.';
      // Format common firebase error codes for friendly display
      if (msg.includes('auth/popup-closed-by-user')) {
        setError('Sign-in cancelled. Please try again.');
      } else if (msg.includes('auth/unauthorized-domain')) {
        setError('This domain is being authorized. You can also sign in with Email.');
      } else {
        setError(msg);
      }
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setError(null);
    try {
      const firebaseUser = await firebaseAuthService.signInWithEmail(email, pass);
      const profile = await syncUserProfile(firebaseUser);
      setUser(firebaseUser);
      setUserProfile(profile);
      closeAuthModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign-in failed.';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password') || msg.includes('auth/user-not-found')) {
        setError('Invalid email or password. Please check your credentials.');
      } else if (msg.includes('auth/too-many-requests')) {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError(msg);
      }
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setError(null);
    try {
      const firebaseUser = await firebaseAuthService.signUpWithEmail(email, pass, name);
      const profile = await syncUserProfile(firebaseUser, { displayName: name });
      setUser(firebaseUser);
      setUserProfile(profile);
      closeAuthModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign-up failed.';
      if (msg.includes('auth/email-already-in-use')) {
        setError('An account with this email already exists. Try signing in instead.');
      } else if (msg.includes('auth/weak-password')) {
        setError('Password is too weak. Please use at least 6 characters.');
      } else {
        setError(msg);
      }
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await firebaseAuthService.resetPassword(email);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send reset email.';
      setError(msg);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await firebaseAuthService.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (err: unknown) {
      console.error('Sign out error:', err);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      await updateFirestoreUserProfile(user.uid, updates);
      setUserProfile((prev) => (prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null));
    } catch (err: unknown) {
      console.error('Update profile error:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        authLoading,
        isAuthModalOpen,
        authModalMode,
        error,
        openAuthModal,
        closeAuthModal,
        clearError,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
