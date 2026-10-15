import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, Proposal, Client } from '../types';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with Database ID (Mandatory for AI Studio configuration)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Authentication
export const auth = getAuth(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Operation Types for Hardened Error Handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Startup connection verification
async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network is unreachable.');
    }
  }
}
testFirestoreConnection();

/**
 * Sync or create user profile details in Firestore
 * Stored individually under /users/{userId}
 */
export async function syncUserProfile(
  user: FirebaseUser,
  additionalData?: Partial<UserProfile>
): Promise<UserProfile> {
  const userDocRef = doc(db, 'users', user.uid);
  const now = new Date().toISOString();

  let existingData: Partial<UserProfile> = {};
  try {
    const existingSnap = await getDoc(userDocRef);
    if (existingSnap.exists()) {
      existingData = existingSnap.data() as Partial<UserProfile>;
    }
  } catch (error) {
    console.warn('Could not read existing user profile, proceeding with creation:', error);
  }

  const profileData: UserProfile = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || additionalData?.displayName || existingData.displayName || user.email?.split('@')[0] || 'PitchCraft Creator',
    photoURL: user.photoURL || existingData.photoURL || null,
    providerId: user.providerData?.[0]?.providerId || additionalData?.providerId || 'password',
    role: additionalData?.role || existingData.role || 'freelancer',
    hourlyRate: additionalData?.hourlyRate ?? existingData.hourlyRate ?? 85,
    currency: additionalData?.currency || existingData.currency || 'USD',
    agencyName: additionalData?.agencyName || existingData.agencyName || 'Independent Studio',
    bio: additionalData?.bio || existingData.bio || 'Freelance professional creating high-converting proposals.',
    createdAt: existingData.createdAt || now,
    lastLoginAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(userDocRef, profileData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
  }

  return profileData;
}

/**
 * Fetch individual user details from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userDocRef = doc(db, 'users', uid);
  try {
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
  }
}

/**
 * Update user details in Firestore
 */
export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  const userDocRef = doc(db, 'users', uid);
  const payload = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  try {
    await setDoc(userDocRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }
}

/**
 * Save user proposal to Firestore
 */
export async function saveUserProposalToFirestore(userId: string, proposal: Proposal): Promise<void> {
  const proposalRef = doc(db, 'users', userId, 'proposals', proposal.id);
  try {
    await setDoc(proposalRef, {
      ...proposal,
      userId,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}/proposals/${proposal.id}`);
  }
}

/**
 * Fetch all proposals for an individual user from Firestore
 */
export async function getUserProposalsFromFirestore(userId: string): Promise<Proposal[]> {
  const proposalsCol = collection(db, 'users', userId, 'proposals');
  try {
    const snap = await getDocs(proposalsCol);
    return snap.docs.map((d) => d.data() as Proposal);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `users/${userId}/proposals`);
  }
}

/**
 * Delete a user proposal from Firestore
 */
export async function deleteUserProposalFromFirestore(userId: string, proposalId: string): Promise<void> {
  const proposalRef = doc(db, 'users', userId, 'proposals', proposalId);
  try {
    await deleteDoc(proposalRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${userId}/proposals/${proposalId}`);
  }
}

/**
 * Save user client to Firestore
 */
export async function saveUserClientToFirestore(userId: string, client: Client): Promise<void> {
  const clientRef = doc(db, 'users', userId, 'clients', client.id);
  try {
    await setDoc(clientRef, {
      ...client,
      userId,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}/clients/${client.id}`);
  }
}

/**
 * Fetch all clients for an individual user from Firestore
 */
export async function getUserClientsFromFirestore(userId: string): Promise<Client[]> {
  const clientsCol = collection(db, 'users', userId, 'clients');
  try {
    const snap = await getDocs(clientsCol);
    return snap.docs.map((d) => d.data() as Client);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `users/${userId}/clients`);
  }
}

/**
 * Delete user client from Firestore
 */
export async function deleteUserClientFromFirestore(userId: string, clientId: string): Promise<void> {
  const clientRef = doc(db, 'users', userId, 'clients', clientId);
  try {
    await deleteDoc(clientRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${userId}/clients/${clientId}`);
  }
}

// Authentication Service Helper Functions
export const firebaseAuthService = {
  signInWithGoogle: async (): Promise<FirebaseUser> => {
    const cred = await signInWithPopup(auth, googleProvider);
    await syncUserProfile(cred.user);
    return cred.user;
  },

  signInWithEmail: async (email: string, pass: string): Promise<FirebaseUser> => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    await syncUserProfile(cred.user);
    return cred.user;
  },

  signUpWithEmail: async (email: string, pass: string, name: string): Promise<FirebaseUser> => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }
    await syncUserProfile(cred.user, { displayName: name });
    return cred.user;
  },

  resetPassword: async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  },

  signOut: async (): Promise<void> => {
    await firebaseSignOut(auth);
  },
};
