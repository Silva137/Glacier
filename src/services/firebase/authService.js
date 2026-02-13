// src/services/firebase/authService.js
import auth from '@react-native-firebase/auth';
import { firestore, collections } from './config';

/**
 * Authentication Service
 * Handles all user authentication operations
 */

// Sign up with email and password
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Update display name
    await user.updateProfile({ displayName });

    // Create user document in Firestore
    await createUserDocument(user.uid, {
      email,
      displayName,
      createdAt: new Date().toISOString(),
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: getAuthErrorMessage(error.code) };
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: getAuthErrorMessage(error.code) };
  }
};

// Sign out
export const signOut = async () => {
  try {
    await auth().signOut();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Password reset
export const sendPasswordReset = async (email) => {
  try {
    await auth().sendPasswordResetEmail(email);
    return { success: true };
  } catch (error) {
    return { success: false, error: getAuthErrorMessage(error.code) };
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth().currentUser;
};

// Auth state listener
export const onAuthStateChanged = (callback) => {
  return auth().onAuthStateChanged(callback);
};

// Create user document in Firestore
const createUserDocument = async (userId, userData) => {
  try {
    await firestore()
      .collection(collections.USERS)
      .doc(userId)
      .set({
        ...userData,
        isPremium: false,
        premiumExpiresAt: null,
        settings: {
          notifications: {
            newReleases: true,
            recommendations: true,
            reminders: false,
          },
          privacy: {
            analytics: true,
            saveHistory: true,
          },
          downloadQuality: 'medium',
        },
      });
  } catch (error) {
    console.error('Error creating user document:', error);
  }
};

// Get user-friendly error messages
const getAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Try signing in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return 'An error occurred. Please try again.';
  }
};

export default {
  signUpWithEmail,
  signInWithEmail,
  signOut,
  sendPasswordReset,
  getCurrentUser,
  onAuthStateChanged,
};
