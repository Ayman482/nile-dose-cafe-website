// Loyalty program API functions for Supabase
import { supabase } from './supabase';

/**
 * Get user's loyalty points
 * @param {string} userId - User ID
 * @returns {Promise} - User's loyalty points data
 */
export async function getUserPoints(userId) {
  try {
    const { data, error } = await supabase
      .from('loyalty_points')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error getting user points:', error.message);
    // If no record found, return 0 points
    if (error.code === 'PGRST116') {
      return { success: true, data: { total_points: 0, redeemed_points: 0 } };
    }
    return { success: false, error: error.message };
  }
}

/**
 * Add points to user's loyalty account
 * @param {string} userId - User ID
 * @param {number} points - Points to add
 * @param {string} source - Source of points (cafe, catering)
 * @param {string} description - Description of transaction
 * @returns {Promise} - Result of adding points
 */
export async function addPoints(userId, points, source, description) {
  try {
    // First check if user has a loyalty record
    const { data: existingRecord } = await supabase
      .from('loyalty_points')
      .select('id, total_points')
      .eq('user_id', userId)
      .single();
    
    // If no record exists, create one
    if (!existingRecord) {
      const { error: createError } = await supabase
        .from('loyalty_points')
        .insert([
          { 
            user_id: userId, 
            total_points: points,
            redeemed_points: 0
          }
        ]);
      
      if (createError) throw createError;
    } else {
      // Update existing record
      const { error: updateError } = await supabase
        .from('loyalty_points')
        .update({ 
          total_points: existingRecord.total_points + points 
        })
        .eq('user_id', userId);
      
      if (updateError) throw updateError;
    }
    
    // Record the transaction
    const { error: transactionError } = await supabase
      .from('loyalty_transactions')
      .insert([
        {
          user_id: userId,
          points: points,
          transaction_type: 'earn',
          source: source,
          description: description
        }
      ]);
    
    if (transactionError) throw transactionError;
    
    return { success: true };
  } catch (error) {
    console.error('Error adding points:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Redeem points from user's loyalty account
 * @param {string} userId - User ID
 * @param {number} points - Points to redeem
 * @param {string} reward - Reward description
 * @returns {Promise} - Result of redeeming points
 */
export async function redeemPoints(userId, points, reward) {
  try {
    // Get current points
    const { data: userPoints, error: pointsError } = await supabase
      .from('loyalty_points')
      .select('total_points, redeemed_points')
      .eq('user_id', userId)
      .single();
    
    if (pointsError) throw pointsError;
    
    // Check if user has enough points
    const availablePoints = userPoints.total_points - userPoints.redeemed_points;
    if (availablePoints < points) {
      throw new Error('Not enough points available');
    }
    
    // Update redeemed points
    const { error: updateError } = await supabase
      .from('loyalty_points')
      .update({ 
        redeemed_points: userPoints.redeemed_points + points 
      })
      .eq('user_id', userId);
    
    if (updateError) throw updateError;
    
    // Record the transaction
    const { error: transactionError } = await supabase
      .from('loyalty_transactions')
      .insert([
        {
          user_id: userId,
          points: -points, // Negative points for redemption
          transaction_type: 'redeem',
          source: 'reward',
          description: reward
        }
      ]);
    
    if (transactionError) throw transactionError;
    
    return { success: true };
  } catch (error) {
    console.error('Error redeeming points:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get user's loyalty transaction history
 * @param {string} userId - User ID
 * @param {number} limit - Number of transactions to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise} - User's transaction history
 */
export async function getTransactionHistory(userId, limit = 10, offset = 0) {
  try {
    const { data, error, count } = await supabase
      .from('loyalty_transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return { success: true, data, count };
  } catch (error) {
    console.error('Error getting transaction history:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get available rewards
 * @returns {Promise} - Available rewards
 */
export async function getAvailableRewards() {
  try {
    const { data, error } = await supabase
      .from('loyalty_rewards')
      .select('*')
      .eq('active', true)
      .order('points_required', { ascending: true });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error getting available rewards:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Calculate points for purchase amount
 * @param {number} amount - Purchase amount
 * @param {string} type - Purchase type (cafe, catering)
 * @returns {number} - Points earned
 */
export function calculatePoints(amount, type = 'cafe') {
  // Points calculation rules
  // Cafe: 1 point per 10 SAR
  // Catering: 2 points per 10 SAR
  const rate = type === 'catering' ? 2 : 1;
  return Math.floor((amount / 10) * rate);
}

export default {
  getUserPoints,
  addPoints,
  redeemPoints,
  getTransactionHistory,
  getAvailableRewards,
  calculatePoints
};
