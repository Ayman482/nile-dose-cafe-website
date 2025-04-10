import { useState } from 'react';
import { getTranslations } from '../../i18n/utils';

export default function CateringForm({ locale }) {
  const t = getTranslations(locale);
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-nile-blue">{t.catering.orderForm.submit}</h2>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="name">
              {t.catering.orderForm.name}
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="email">
              {t.catering.orderForm.email}
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="phone">
              {t.catering.orderForm.phone}
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="guests">
              {t.catering.orderForm.guests}
            </label>
            <input
              type="number"
              id="guests"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="date">
              {t.catering.orderForm.date}
            </label>
            <input
              type="date"
              id="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="time">
              {t.catering.orderForm.time}
            </label>
            <input
              type="time"
              id="time"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="location">
            {t.catering.orderForm.location}
          </label>
          <input
            type="text"
            id="location"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
            required
          />
        </div>
        
        <div>
          <p className="block text-gray-700 mb-2">Delivery Method</p>
          <div className="flex space-x-4 rtl:space-x-reverse">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="deliveryMethod"
                value="delivery"
                checked={deliveryMethod === 'delivery'}
                onChange={() => setDeliveryMethod('delivery')}
                className="text-nile-blue"
              />
              <span className="ml-2 rtl:mr-2">{t.catering.delivery}</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="deliveryMethod"
                value="pickup"
                checked={deliveryMethod === 'pickup'}
                onChange={() => setDeliveryMethod('pickup')}
                className="text-nile-blue"
              />
              <span className="ml-2 rtl:mr-2">{t.catering.pickup}</span>
            </label>
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="message">
            {t.catering.orderForm.message}
          </label>
          <textarea
            id="message"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="w-full bg-nile-blue text-white py-3 px-4 rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          {t.catering.orderForm.submit}
        </button>
      </form>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-nile-blue">{t.catering.paymentMethods.title}</h3>
        <div className="space-y-2">
          <p><strong>{t.catering.paymentMethods.bankTransfer}:</strong> Bank transfer details will be provided after order confirmation.</p>
          <p><strong>{t.catering.paymentMethods.stcPay}:</strong> STC Pay details will be provided after order confirmation.</p>
        </div>
      </div>
    </div>
  );
}
