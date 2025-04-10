import { useState, useEffect } from 'react';
import { getTranslations } from '../../i18n/utils';
import { getCurrentUser } from '../../lib/auth';

export default function CateringOrderForm({ locale, cartItems, totalAmount, onSubmit, onCancel }) {
  const t = getTranslations(locale);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    deliveryMethod: 'delivery', // delivery or pickup
    deliveryAddress: '',
    deliveryDate: '',
    deliveryTime: '',
    specialInstructions: ''
  });
  const [error, setError] = useState('');
  
  // Get current user if logged in
  useEffect(() => {
    async function loadUserData() {
      try {
        const { success, user } = await getCurrentUser();
        if (success && user) {
          setUser(user);
          // Pre-fill form with user data
          setFormData(prev => ({
            ...prev,
            customerName: user.user_metadata?.name || '',
            email: user.email || '',
            phone: user.user_metadata?.phone || ''
          }));
        }
      } catch (err) {
        console.error('Error loading user data:', err);
      }
    }
    
    loadUserData();
  }, []);
  
  // Calculate minimum delivery date (tomorrow)
  const getMinDeliveryDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate form
    if (!formData.customerName || !formData.email || !formData.phone) {
      setError(locale === 'ar' 
        ? 'يرجى ملء جميع الحقول المطلوبة' 
        : 'Please fill in all required fields');
      setLoading(false);
      return;
    }
    
    if (formData.deliveryMethod === 'delivery' && !formData.deliveryAddress) {
      setError(locale === 'ar' 
        ? 'يرجى إدخال عنوان التوصيل' 
        : 'Please enter a delivery address');
      setLoading(false);
      return;
    }
    
    if (!formData.deliveryDate || !formData.deliveryTime) {
      setError(locale === 'ar' 
        ? 'يرجى تحديد تاريخ ووقت التوصيل/الاستلام' 
        : 'Please specify delivery/pickup date and time');
      setLoading(false);
      return;
    }
    
    // Prepare order data
    const orderData = {
      userId: user?.id || null,
      customerName: formData.customerName,
      email: formData.email,
      phone: formData.phone,
      deliveryMethod: formData.deliveryMethod,
      deliveryAddress: formData.deliveryAddress,
      deliveryDate: formData.deliveryDate,
      deliveryTime: formData.deliveryTime,
      specialInstructions: formData.specialInstructions,
      items: cartItems,
      totalAmount: totalAmount
    };
    
    try {
      await onSubmit(orderData);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-nile-blue text-center">
        {locale === 'ar' ? 'معلومات الطلب' : 'Order Information'}
      </h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contact Information */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4 text-nile-blue">
            {locale === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="customerName">
                {locale === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="email">
                {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="phone">
                {locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Delivery Method */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4 text-nile-blue">
            {locale === 'ar' ? 'طريقة التوصيل' : 'Delivery Method'}
          </h3>
          
          <div className="flex space-x-4 rtl:space-x-reverse mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="deliveryMethod"
                value="delivery"
                checked={formData.deliveryMethod === 'delivery'}
                onChange={handleChange}
                className="mr-2 rtl:ml-2 rtl:mr-0"
              />
              {locale === 'ar' ? 'توصيل' : 'Delivery'}
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="deliveryMethod"
                value="pickup"
                checked={formData.deliveryMethod === 'pickup'}
                onChange={handleChange}
                className="mr-2 rtl:ml-2 rtl:mr-0"
              />
              {locale === 'ar' ? 'استلام من المقهى' : 'Pickup from Cafe'}
            </label>
          </div>
          
          {formData.deliveryMethod === 'delivery' && (
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="deliveryAddress">
                {locale === 'ar' ? 'عنوان التوصيل' : 'Delivery Address'} *
              </label>
              <textarea
                id="deliveryAddress"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
                rows="3"
                required={formData.deliveryMethod === 'delivery'}
              />
            </div>
          )}
        </div>
        
        {/* Delivery/Pickup Time */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4 text-nile-blue">
            {formData.deliveryMethod === 'delivery' 
              ? (locale === 'ar' ? 'وقت التوصيل' : 'Delivery Time') 
              : (locale === 'ar' ? 'وقت الاستلام' : 'Pickup Time')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="deliveryDate">
                {locale === 'ar' ? 'التاريخ' : 'Date'} *
              </label>
              <input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                min={getMinDeliveryDate()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="deliveryTime">
                {locale === 'ar' ? 'الوقت' : 'Time'} *
              </label>
              <input
                type="time"
                id="deliveryTime"
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Special Instructions */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="specialInstructions">
            {locale === 'ar' ? 'تعليمات خاصة' : 'Special Instructions'}
          </label>
          <textarea
            id="specialInstructions"
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
            rows="3"
          />
        </div>
        
        {/* Order Summary */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4 text-nile-blue">
            {locale === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2 mb-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {item.quantity} x {locale === 'ar' && item.name_ar ? item.name_ar : item.name}
                  </span>
                  <span className="font-semibold">{(item.price * item.quantity).toFixed(2)} SAR</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>{locale === 'ar' ? 'المجموع' : 'Total'}</span>
                <span className="text-nile-blue">{totalAmount.toFixed(2)} SAR</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Submit Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {locale === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          
          <button
            type="submit"
            className="px-6 py-2 bg-nile-blue text-white rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading 
              ? (locale === 'ar' ? 'جاري الإرسال...' : 'Submitting...') 
              : (locale === 'ar' ? 'تأكيد الطلب' : 'Confirm Order')}
          </button>
        </div>
      </form>
    </div>
  );
}
