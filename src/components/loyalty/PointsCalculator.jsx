import { useState } from 'react';
import { getTranslations } from '../../i18n/utils';
import { addPoints, calculatePoints } from '../../lib/loyalty';

export default function PointsCalculator({ locale }) {
  const t = getTranslations(locale);
  const [amount, setAmount] = useState('');
  const [purchaseType, setPurchaseType] = useState('cafe');
  const [calculatedPoints, setCalculatedPoints] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleCalculate = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError(locale === 'ar' 
        ? 'يرجى إدخال مبلغ صالح' 
        : 'Please enter a valid amount');
      return;
    }
    
    const points = calculatePoints(parseFloat(amount), purchaseType);
    setCalculatedPoints(points);
    setError('');
  };
  
  const handleAddPoints = async () => {
    if (!calculatedPoints) return;
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // In a real implementation, you would get the user ID from auth context
      const userId = 'current-user-id';
      const description = purchaseType === 'cafe' 
        ? (locale === 'ar' ? 'مشتريات المقهى' : 'Cafe purchase') 
        : (locale === 'ar' ? 'طلب تموين' : 'Catering order');
      
      const { success, error } = await addPoints(
        userId,
        calculatedPoints,
        purchaseType,
        description
      );
      
      if (!success) {
        throw new Error(error);
      }
      
      setSuccess(true);
      setAmount('');
      setCalculatedPoints(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-nile-blue text-center">
        {locale === 'ar' ? 'حاسبة النقاط' : 'Points Calculator'}
      </h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {locale === 'ar' 
            ? 'تمت إضافة النقاط بنجاح!' 
            : 'Points added successfully!'}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="amount">
            {locale === 'ar' ? 'مبلغ الشراء (ريال سعودي)' : 'Purchase Amount (SAR)'}
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">
            {locale === 'ar' ? 'نوع الشراء' : 'Purchase Type'}
          </label>
          <div className="flex space-x-4 rtl:space-x-reverse">
            <label className="flex items-center">
              <input
                type="radio"
                name="purchaseType"
                value="cafe"
                checked={purchaseType === 'cafe'}
                onChange={() => setPurchaseType('cafe')}
                className="mr-2 rtl:ml-2 rtl:mr-0"
              />
              {locale === 'ar' ? 'مقهى' : 'Cafe'}
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="purchaseType"
                value="catering"
                checked={purchaseType === 'catering'}
                onChange={() => setPurchaseType('catering')}
                className="mr-2 rtl:ml-2 rtl:mr-0"
              />
              {locale === 'ar' ? 'تموين' : 'Catering'}
            </label>
          </div>
        </div>
        
        <button
          onClick={handleCalculate}
          className="w-full bg-nile-blue text-white py-3 px-4 rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          {locale === 'ar' ? 'حساب النقاط' : 'Calculate Points'}
        </button>
        
        {calculatedPoints !== null && (
          <div className="mt-6">
            <div className="bg-nile-blue-pale rounded-lg p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {locale === 'ar' ? 'النقاط المكتسبة' : 'Points Earned'}
              </h3>
              <p className="text-3xl font-bold text-nile-blue">{calculatedPoints}</p>
            </div>
            
            <button
              onClick={handleAddPoints}
              className="w-full mt-4 bg-green-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-green-700 transition-colors"
              disabled={loading}
            >
              {loading 
                ? (locale === 'ar' ? 'جاري الإضافة...' : 'Adding...') 
                : (locale === 'ar' ? 'إضافة النقاط إلى حسابي' : 'Add Points to My Account')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
