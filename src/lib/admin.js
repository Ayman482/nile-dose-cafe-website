// Admin dashboard API functions for Supabase
import { supabase } from './supabase';

/**
 * Get all catering orders with pagination
 * @param {number} page - Page number (starting from 1)
 * @param {number} pageSize - Number of items per page
 * @param {string} status - Filter by status (optional)
 * @returns {Promise} - Catering orders with pagination info
 */
export async function getAllCateringOrders(page = 1, pageSize = 10, status = null) {
  try {
    let query = supabase
      .from('catering_orders')
      .select(`
        *,
        catering_order_items (*)
      `, { count: 'exact' });
    
    // Apply status filter if provided
    if (status) {
      query = query.eq('status', status);
    }
    
    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    
    return { 
      success: true, 
      data, 
      pagination: {
        page,
        pageSize,
        total: count,
        totalPages: Math.ceil(count / pageSize)
      }
    };
  } catch (error) {
    console.error('Error getting catering orders:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Update catering order status
 * @param {string} orderId - Order ID
 * @param {string} status - New status (pending, confirmed, preparing, ready, delivered, cancelled)
 * @returns {Promise} - Update result
 */
export async function updateCateringOrderStatus(orderId, status) {
  try {
    const { error } = await supabase
      .from('catering_orders')
      .update({ status })
      .eq('id', orderId);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating catering order status:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get all loyalty rewards
 * @returns {Promise} - Loyalty rewards
 */
export async function getAllLoyaltyRewards() {
  try {
    const { data, error } = await supabase
      .from('loyalty_rewards')
      .select('*')
      .order('points_required', { ascending: true });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error getting loyalty rewards:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Create or update loyalty reward
 * @param {object} reward - Reward data
 * @returns {Promise} - Create/update result
 */
export async function saveReward(reward) {
  try {
    let result;
    
    if (reward.id) {
      // Update existing reward
      const { data, error } = await supabase
        .from('loyalty_rewards')
        .update({
          name: reward.name,
          name_ar: reward.name_ar,
          description: reward.description,
          description_ar: reward.description_ar,
          points_required: reward.points_required,
          active: reward.active
        })
        .eq('id', reward.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Create new reward
      const { data, error } = await supabase
        .from('loyalty_rewards')
        .insert([{
          name: reward.name,
          name_ar: reward.name_ar,
          description: reward.description,
          description_ar: reward.description_ar,
          points_required: reward.points_required,
          active: reward.active
        }])
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error saving loyalty reward:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Delete loyalty reward
 * @param {string} rewardId - Reward ID
 * @returns {Promise} - Delete result
 */
export async function deleteReward(rewardId) {
  try {
    const { error } = await supabase
      .from('loyalty_rewards')
      .delete()
      .eq('id', rewardId);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting loyalty reward:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get all catering menu items
 * @returns {Promise} - Catering menu items
 */
export async function getAllCateringMenuItems() {
  try {
    const { data, error } = await supabase
      .from('catering_menu')
      .select('*')
      .order('category')
      .order('name');
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error getting catering menu items:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Create or update catering menu item
 * @param {object} item - Menu item data
 * @returns {Promise} - Create/update result
 */
export async function saveCateringMenuItem(item) {
  try {
    let result;
    
    if (item.id) {
      // Update existing item
      const { data, error } = await supabase
        .from('catering_menu')
        .update({
          name: item.name,
          name_ar: item.name_ar,
          description: item.description,
          description_ar: item.description_ar,
          price: item.price,
          category: item.category,
          serves: item.serves,
          active: item.active
        })
        .eq('id', item.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Create new item
      const { data, error } = await supabase
        .from('catering_menu')
        .insert([{
          name: item.name,
          name_ar: item.name_ar,
          description: item.description,
          description_ar: item.description_ar,
          price: item.price,
          category: item.category,
          serves: item.serves,
          active: item.active
        }])
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error saving catering menu item:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Delete catering menu item
 * @param {string} itemId - Item ID
 * @returns {Promise} - Delete result
 */
export async function deleteCateringMenuItem(itemId) {
  try {
    const { error } = await supabase
      .from('catering_menu')
      .delete()
      .eq('id', itemId);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting catering menu item:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get loyalty program statistics
 * @returns {Promise} - Loyalty program statistics
 */
export async function getLoyaltyStats() {
  try {
    // Get total users with loyalty points
    const { data: usersData, error: usersError, count: usersCount } = await supabase
      .from('loyalty_points')
      .select('*', { count: 'exact' });
    
    if (usersError) throw usersError;
    
    // Get total points issued
    const totalPoints = usersData.reduce((sum, user) => sum + user.total_points, 0);
    
    // Get total points redeemed
    const redeemedPoints = usersData.reduce((sum, user) => sum + user.redeemed_points, 0);
    
    // Get recent transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from('loyalty_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (transactionsError) throw transactionsError;
    
    return { 
      success: true, 
      data: {
        totalUsers: usersCount,
        totalPoints,
        redeemedPoints,
        availablePoints: totalPoints - redeemedPoints,
        recentTransactions: transactions
      }
    };
  } catch (error) {
    console.error('Error getting loyalty stats:', error.message);
    return { success: false, error: error.message };
  }
}

export default {
  getAllCateringOrders,
  updateCateringOrderStatus,
  getAllLoyaltyRewards,
  saveReward,
  deleteReward,
  getAllCateringMenuItems,
  saveCateringMenuItem,
  deleteCateringMenuItem,
  getLoyaltyStats
};
