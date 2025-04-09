// Authentication utility functions for Supabase
import { supabase } from './supabase';

/**
 * Register a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {object} metadata - Additional user metadata (name, phone, etc.)
 * @returns {Promise} - Registration result
 */
export async function registerUser(email, password, metadata = {}) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error registering user:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Login a user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - Login result
 */
export async function loginUser(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error logging in:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Logout the current user
 * @returns {Promise} - Logout result
 */
export async function logoutUser() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error logging out:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get the current logged in user
 * @returns {Promise} - Current user data
 */
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Error getting current user:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send password reset email
 * @param {string} email - User's email
 * @returns {Promise} - Reset password result
 */
export async function resetPassword(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error resetting password:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise} - Update password result
 */
export async function updatePassword(newPassword) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating password:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Update user profile
 * @param {object} updates - Profile updates
 * @returns {Promise} - Update profile result
 */
export async function updateProfile(updates) {
  try {
    const { error } = await supabase.auth.updateUser({
      data: updates
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Check if user's email is verified
 * @returns {Promise} - Email verification status
 */
export async function isEmailVerified() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    return { 
      success: true, 
      verified: data.user?.email_confirmed_at ? true : false 
    };
  } catch (error) {
    console.error('Error checking email verification:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send verification email
 * @param {string} email - User's email
 * @returns {Promise} - Send verification email result
 */
export async function sendVerificationEmail(email) {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error.message);
    return { success: false, error: error.message };
  }
}
