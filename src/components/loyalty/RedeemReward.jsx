import { useState } from 'react';
import { getTranslations } from '../../i18n/utils';
import { redeemPoints } from '../../lib/loyalty';

export default function RedeemReward({ locale, reward, availablePoints, onSuccess, onError }) {
  const t = getTranslations(locale);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const handleRedeem = async () => {
    if (availablePoints < reward.points_required) {
      onError(locale === 'ar' 
        ? 'ليس لديك نقاط كافية لاستبدال هذه المكافأة' 
        : 'You don\'t have enough points to redeem this reward');
      return;
    }
    
    setLoading(true);
    try {
      const { success, error } = await redeemPoints(
        // In a real implementation, you would get the user ID from auth context
        'current-user-id', 
        reward.points_required,
        locale === 'ar' ? reward.name_ar : reward.name
      );
      
      if (!success) {
        throw new Error(error);
      }
      
      onSuccess();
      setShowConfirmation(false);
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-xl font-bold mb-4 text-nile-blue">
            {locale === 'ar' ? 'تأكيد الاستبدال' : 'Confirm Redemption'}
          </h3>
          <p className="mb-6">
            {locale === 'ar' 
              ? `هل أنت متأكد أنك تريد استبدال ${reward.points_required} نقطة للحصول على ${reward.name_ar}؟` 
              : `Are you sure you want to redeem ${reward.points_required} points for ${reward.name}?`}
          </p>
          <div className="flex justify-end space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => setShowConfirmation(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              disabled={loading}
            >
              {locale === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={handleRedeem}
              className="px-4 py-2 bg-nile-blue text-white rounded-lg"
              disabled={loading}
            >
              {loading 
                ? (locale === 'ar' ? 'جاري الاستبدال...' : 'Redeeming...') 
                : (locale === 'ar' ? 'تأكيد' : 'Confirm')}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <button
      onClick={() => setShowConfirmation(true)}
      className={`px-4 py-2 rounded-lg font-bold ${
        availablePoints >= reward.points_required
          ? 'bg-nile-blue text-white hover:bg-blue-700'
          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
      }`}
      disabled={availablePoints < reward.points_required}
    >
      {locale === 'ar' ? 'استبدال' : 'Redeem'}
    </button>
  );
}
