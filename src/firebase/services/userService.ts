import { User } from 'firebase/auth';
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../config';
import { SecurityDoc, UserProfile } from '../types';
import { SecurityPrivacyValues } from '../../native/types';

const DEFAULT_SECURITY: Omit<SecurityDoc, 'updatedAt'> = {
  biometric: true,
  verifiedProfile: true,
  familySharing: false,
  emergencyContact: '',
};

/** Called once right after sign-up. Idempotent: safe to call again. */
export async function ensureUserDocument(user: User, name?: string): Promise<void> {
  const userRef = doc(db, 'users', user.uid);
  const existing = await getDoc(userRef);
  if (!existing.exists()) {
    const profile: Omit<UserProfile, 'createdAt'> & { createdAt: unknown } = {
      uid: user.uid,
      name: name || user.displayName || 'OneBuddy user',
      email: user.email,
      phone: user.phoneNumber,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
    };
    await setDoc(userRef, profile);
    await setDoc(doc(db, 'users', user.uid, 'meta', 'security'), {
      ...DEFAULT_SECURITY,
      updatedAt: serverTimestamp(),
    });
    await setDoc(doc(db, 'users', user.uid, 'meta', 'wallet'), {
      balance: 0,
      updatedAt: serverTimestamp(),
    });
  }
}

export function subscribeToProfile(
  uid: string,
  onData: (profile: UserProfile | null) => void
): () => void {
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    onData(snap.exists() ? (snap.data() as UserProfile) : null);
  });
}

export async function updateProfileFields(
  uid: string,
  fields: Partial<Pick<UserProfile, 'name' | 'phone' | 'photoURL'>>
): Promise<void> {
  await setDoc(doc(db, 'users', uid), fields, { merge: true });
}

export async function getSecurity(uid: string): Promise<SecurityPrivacyValues> {
  const snap = await getDoc(doc(db, 'users', uid, 'meta', 'security'));
  if (!snap.exists()) return { ...DEFAULT_SECURITY };
  const data = snap.data() as SecurityDoc;
  return {
    biometric: data.biometric,
    verifiedProfile: data.verifiedProfile,
    familySharing: data.familySharing,
    emergencyContact: data.emergencyContact,
  };
}

export async function saveSecurity(
  uid: string,
  values: SecurityPrivacyValues
): Promise<void> {
  await setDoc(
    doc(db, 'users', uid, 'meta', 'security'),
    { ...values, updatedAt: serverTimestamp() },
    { merge: true }
  );
}
