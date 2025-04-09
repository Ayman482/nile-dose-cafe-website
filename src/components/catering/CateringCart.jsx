import { useState, useEffect } from 'react';
import { getTranslations } from '../../i18n/utils';

export default function CateringCart({ locale, cartItems, setCartItems, onProceedToCheckout }) {
  const t = getTranslations(locale);
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Calculate total amount whenever cart items change
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalAmount(total);
  }, [cartItems]);
  
  // Get appropriate name based on locale
  const getItemName = (item) => {
    if (locale === 'ar' && item.name_ar) {
      return item.name_ar;
    }
    return item.name;
  };
  
  // Update item quantity
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = [...cartItems];
    updatedItems[index].quantity = newQuantity;
    setCartItems(updatedItems);
  };
  
  // Remove item from cart
  const removeItem = (index) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);
  };
  
  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600 mb-4">
          {locale === 'ar' ? 'سلة التموين فارغة' : 'Your catering cart is empty'}
        </p>
        <p className="text-gray-500 text-sm">
          {locale === 'ar' 
            ? 'أضف عناصر من قائمة التموين لبدء طلبك' 
            : 'Add items from the catering menu to start your order'}
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-nile-blue text-center">
        {locale === 'ar' ? 'سلة التموين' : 'Catering Cart'}
      </h2>
      
      <div className="space-y-4 mb-6">
        {cartItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex-grow">
              <h3 className="font-bold">{getItemName(item)}</h3>
              <p className="text-gray-600 text-sm">{item.price} SAR</p>
            </div>
            
            <div className="flex items-center">
              <button
                onClick={() => updateQuantity(index, item.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
              >
                -
              </button>
              <span className="mx-3">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(index, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
              >
                +
              </button>
              
              <button
                onClick={() => removeItem(index)}
                className="ml-4 rtl:mr-4 rtl:ml-0 text-red-500 hover:text-red-700"
                aria-label={locale === 'ar' ? 'إزالة العنصر' : 'Remove item'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center font-bold text-lg mb-6">
        <span>{locale === 'ar' ? 'المجموع' : 'Total'}</span>
        <span className="text-nile-blue">{totalAmount.toFixed(2)} SAR</span>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={clearCart}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          {locale === 'ar' ? 'إفراغ السلة' : 'Clear Cart'}
        </button>
        
        <button
          onClick={() => onProceedToCheckout(totalAmount)}
          className="px-6 py-2 bg-nile-blue text-white rounded-lg hover:bg-blue-700"
        >
          {locale === 'ar' ? 'متابعة الطلب' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
}
