import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { auth, firebaseConfigured } from '../config';
import { ensureUserDocument } from '../services/userService';

interface AuthContextValue {
  user: User | null;
  initializing: boolean;
  /** False when EXPO_PUBLIC_FIREBASE_* env vars are missing — screens can
   *  fall back to local-only mode instead of failing every call. */
  enabled: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapAuthError(err: unknown): Error {
  const code = (err as { code?: string })?.code ?? '';
  const messages: Record<string, string> = {
    'auth/email-already-in-use': 'That email already has an account. Try logging in instead.',
    'auth/invalid-email': 'That email address doesn\u2019t look right.',
    'auth/weak-password': 'Use at least 6 characters for your password.',
    'auth/user-not-found': 'No account found for that email.',
    'auth/wrong-password': 'That password is incorrect.',
    'auth/invalid-credential': 'Email or password is incorrect.',
    'auth/too-many-requests': 'Too many attempts. Try again in a few minutes.',
    'auth/network-request-failed': 'Network error — check your connection.',
  };
  return new Error(messages[code] ?? (err as Error)?.message ?? 'Something went wrong.');
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured) {
      setInitializing(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      initializing,
      enabled: firebaseConfigured,
      async signUp(name, email, password) {
        try {
          const credential = await createUserWithEmailAndPassword(auth, email, password);
          if (name.trim()) {
            await updateProfile(credential.user, { displayName: name.trim() });
          }
          await ensureUserDocument(credential.user, name.trim());
        } catch (err) {
          throw mapAuthError(err);
        }
      },
      async signIn(email, password) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
          throw mapAuthError(err);
        }
      },
      async signOut() {
        await firebaseSignOut(auth);
      },
      async resetPassword(email) {
        try {
          await sendPasswordResetEmail(auth, email);
        } catch (err) {
          throw mapAuthError(err);
        }
      },
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
