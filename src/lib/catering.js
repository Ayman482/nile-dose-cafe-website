// Catering system API functions for Supabase
import { supabase } from './supabase';

/**
 * Get catering menu items
 * @returns {Promise} - Catering menu items
 */
export async function getCateringMenu() {
  try {
    const { data, error } = await supabase
      .from('catering_menu')
      .select('*')
      .eq('active', true)
      .order('category');
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error getting catering menu:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Submit catering order
 * @param {object} orderData - Order data
 * @returns {Promise} - Order submission result
 */
export async function submitCateringOrder(orderData) {
  try {
    // First create the order
    const { data: order, error: orderError } = await supabase
      .from('catering_orders')
      .insert([
        {
          user_id: orderData.userId,
          customer_name: orderData.customerName,
          email: orderData.email,
          phone: orderData.phone,
          delivery_method: orderData.deliveryMethod,
          delivery_address: orderData.deliveryAddress,
          delivery_date: orderData.deliveryDate,
          delivery_time: orderData.deliveryTime,
          special_instructions: orderData.specialInstructions,
          total_amount: orderData.totalAmount,
          status: 'pending'
        }
      ])
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    // Then create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      item_id: item.id,
      item_name: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.quantity * item.price
    }));
    
    const { error: itemsError } = await supabase
      .from('catering_order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;
    
    // If user is logged in, add loyalty points
    if (orderData.userId) {
      // Import loyalty functions dynamically to avoid circular dependencies
      const { addPoints, calculatePoints } = await import('./loyalty');
      
      // Calculate and add points
      const points = calculatePoints(orderData.totalAmount, 'catering');
      await addPoints(
        orderData.userId,
        points,
        'catering',
        `Catering order #${order.id}`
      );
    }
    
    return { success: true, data: { orderId: order.id } };
  } catch (error) {
    console.error('Error submitting catering order:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get user's catering orders
 * @param {string} userId - User ID
 * @returns {Promise} - User's catering orders
 */
export async function getUserCateringOrders(userId) {
  try {
    const { data, error } = await supabase
      .from('catering_orders')
      .select(`
        *,
        catering_order_items (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error getting user catering orders:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get catering order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise} - Catering order details
 */
export async function getCateringOrderById(orderId) {
  try {
    const { data, error } = await supabase
      .from('catering_orders')
      .select(`
        *,
        catering_order_items (*)
      `)
      .eq('id', orderId)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error getting catering order:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Cancel catering order
 * @param {string} orderId - Order ID
 * @param {string} userId - User ID (for verification)
 * @returns {Promise} - Cancellation result
 */
export async function cancelCateringOrder(orderId, userId) {
  try {
    // First verify that the order belongs to the user
    const { data: order, error: verifyError } = await supabase
      .from('catering_orders')
      .select('id, status')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();
    
    if (verifyError) throw verifyError;
    
    // Check if order can be cancelled (only pending orders can be cancelled)
    if (order.status !== 'pending') {
      throw new Error('Only pending orders can be cancelled');
    }
    
    // Update order status
    const { error: updateError } = await supabase
      .from('catering_orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId);
    
    if (updateError) throw updateError;
    
    return { success: true };
  } catch (error) {
    console.error('Error cancelling catering order:', error.message);
    return { success: false, error: error.message };
  }
}

export default {
  getCateringMenu,
  submitCateringOrder,
  getUserCateringOrders,
  getCateringOrderById,
  cancelCateringOrder
};
