// src/services/firebase/userService.js
import { firestore, collections } from './config';
import { getCurrentUser } from './authService';

/**
 * User Service
 * Handles user profile and settings operations
 */

// Get user profile
export const getUserProfile = async (userId = null) => {
  try {
    const uid = userId || getCurrentUser()?.uid;
    if (!uid) return { success: false, error: 'Not authenticated' };

    const doc = await firestore()
      .collection(collections.USERS)
      .doc(uid)
      .get();

    if (doc.exists) {
      return { success: true, data: { id: doc.id, ...doc.data() } };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update user profile
export const updateUserProfile = async (updates) => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return { success: false, error: 'Not authenticated' };

    await firestore()
      .collection(collections.USERS)
      .doc(uid)
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update user settings
export const updateUserSettings = async (settings) => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return { success: false, error: 'Not authenticated' };

    await firestore()
      .collection(collections.USERS)
      .doc(uid)
      .update({
        settings,
        updatedAt: new Date().toISOString(),
      });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Upgrade to premium
export const upgradeToPremium = async (expiresAt) => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return { success: false, error: 'Not authenticated' };

    await firestore()
      .collection(collections.USERS)
      .doc(uid)
      .update({
        isPremium: true,
        premiumExpiresAt: expiresAt,
        premiumStartedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Cancel premium
export const cancelPremium = async () => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return { success: false, error: 'Not authenticated' };

    await firestore()
      .collection(collections.USERS)
      .doc(uid)
      .update({
        isPremium: false,
        premiumCancelledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Check premium status
export const checkPremiumStatus = async () => {
  try {
    const uid = getCurrentUser()?.uid;
    if (!uid) return { success: false, isPremium: false };

    const doc = await firestore()
      .collection(collections.USERS)
      .doc(uid)
      .get();

    if (doc.exists) {
      const data = doc.data();
      const isPremium = data.isPremium && 
        (!data.premiumExpiresAt || new Date(data.premiumExpiresAt) > new Date());
      return { success: true, isPremium };
    }
    return { success: false, isPremium: false };
  } catch (error) {
    return { success: false, isPremium: false, error: error.message };
  }
};

export default {
  getUserProfile,
  updateUserProfile,
  updateUserSettings,
  upgradeToPremium,
  cancelPremium,
  checkPremiumStatus,
};
