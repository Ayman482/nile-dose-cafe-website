import { useState, useEffect } from 'react';
import { getTranslations } from '../../i18n/utils';
import { getCurrentUser } from '../../lib/auth';
import { getUserPoints, getTransactionHistory, getAvailableRewards } from '../../lib/loyalty';

export default function LoyaltyDashboard({ locale }) {
  const t = getTranslations(locale);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState({ total: 0, available: 0, redeemed: 0 });
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('points');
  
  useEffect(() => {
    async function loadLoyaltyData() {
      try {
        // Get current user
        const userResult = await getCurrentUser();
        if (!userResult.success) {
          throw new Error('User not found');
        }
        
        setUser(userResult.user);
        
        // Get user points
        const pointsResult = await getUserPoints(userResult.user.id);
        if (!pointsResult.success) {
          throw new Error('Failed to load loyalty points');
        }
        
        const totalPoints = pointsResult.data?.total_points || 0;
        const redeemedPoints = pointsResult.data?.redeemed_points || 0;
        
        setPoints({
          total: totalPoints,
          redeemed: redeemedPoints,
          available: totalPoints - redeemedPoints
        });
        
        // Get transaction history
        const transactionsResult = await getTransactionHistory(userResult.user.id, 20);
        if (!transactionsResult.success) {
          throw new Error('Failed to load transaction history');
        }
        
        setTransactions(transactionsResult.data || []);
        
        // Get available rewards
        const rewardsResult = await getAvailableRewards();
        if (!rewardsResult.success) {
          throw new Error('Failed to load rewards');
        }
        
        setRewards(rewardsResult.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadLoyaltyData();
  }, []);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto text-center">
        <p className="text-gray-600">
          {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
        </p>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4 text-nile-blue">
          {locale === 'ar' ? 'يرجى تسجيل الدخول' : 'Please Log In'}
        </h2>
        <p className="text-gray-600 mb-4">
          {locale === 'ar' 
            ? 'يجب عليك تسجيل الدخول لعرض برنامج الولاء الخاص بك.' 
            : 'You need to be logged in to view your loyalty program.'}
        </p>
        <a 
          href={locale === 'ar' ? '/login' : '/en/login'} 
          className="bg-nile-blue text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          {locale === 'ar' ? 'تسجيل الدخول' : 'Log In'}
        </a>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-nile-blue text-center">
        {locale === 'ar' ? 'برنامج الولاء' : 'Loyalty Program'}
      </h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Points Summary Card */}
      <div className="bg-nile-blue-pale rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-600">
              {locale === 'ar' ? 'إجمالي النقاط' : 'Total Points'}
            </h3>
            <p className="text-3xl font-bold text-nile-blue">{points.total}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-600">
              {locale === 'ar' ? 'النقاط المتاحة' : 'Available Points'}
            </h3>
            <p className="text-3xl font-bold text-nile-blue">{points.available}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-600">
              {locale === 'ar' ? 'النقاط المستبدلة' : 'Redeemed Points'}
            </h3>
            <p className="text-3xl font-bold text-nile-blue">{points.redeemed}</p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8 rtl:space-x-reverse">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'points'
                ? 'border-nile-blue text-nile-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('points')}
          >
            {locale === 'ar' ? 'كيفية كسب النقاط' : 'How to Earn Points'}
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'rewards'
                ? 'border-nile-blue text-nile-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('rewards')}
          >
            {locale === 'ar' ? 'المكافآت المتاحة' : 'Available Rewards'}
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-nile-blue text-nile-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('history')}
          >
            {locale === 'ar' ? 'سجل المعاملات' : 'Transaction History'}
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="mb-6">
        {/* How to Earn Points */}
        {activeTab === 'points' && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-nile-blue">
              {locale === 'ar' ? 'كيفية كسب النقاط' : 'How to Earn Points'}
            </h3>
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h4 className="font-bold text-lg mb-2">
                {locale === 'ar' ? 'مشتريات المقهى' : 'Cafe Purchases'}
              </h4>
              <p className="text-gray-600">
                {locale === 'ar' 
                  ? 'اكسب نقطة واحدة مقابل كل 10 ريال سعودي تنفقها في المقهى.' 
                  : 'Earn 1 point for every 10 SAR you spend at the cafe.'}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h4 className="font-bold text-lg mb-2">
                {locale === 'ar' ? 'طلبات التموين' : 'Catering Orders'}
              </h4>
              <p className="text-gray-600">
                {locale === 'ar' 
                  ? 'اكسب نقطتين مقابل كل 10 ريال سعودي تنفقها على طلبات التموين.' 
                  : 'Earn 2 points for every 10 SAR you spend on catering orders.'}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="font-bold text-lg mb-2">
                {locale === 'ar' ? 'مكافآت الإحالة' : 'Referral Bonuses'}
              </h4>
              <p className="text-gray-600">
                {locale === 'ar' 
                  ? 'اكسب 50 نقطة عندما يقوم صديق بالتسجيل باستخدام رمز الإحالة الخاص بك ويكمل أول طلب.' 
                  : 'Earn 50 points when a friend signs up using your referral code and completes their first order.'}
              </p>
            </div>
          </div>
        )}
        
        {/* Available Rewards */}
        {activeTab === 'rewards' && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-nile-blue">
              {locale === 'ar' ? 'المكافآت المتاحة' : 'Available Rewards'}
            </h3>
            
            {rewards.length === 0 ? (
              <p className="text-gray-600 text-center py-4">
                {locale === 'ar' ? 'لا توجد مكافآت متاحة حاليًا.' : 'No rewards available at the moment.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.map((reward) => (
                  <div key={reward.id} className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="font-bold text-lg mb-2">{locale === 'ar' ? reward.name_ar : reward.name}</h4>
                    <p className="text-gray-600 mb-4">{locale === 'ar' ? reward.description_ar : reward.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-nile-blue font-bold">{reward.points_required} {locale === 'ar' ? 'نقطة' : 'points'}</span>
                      <button
                        className={`px-4 py-2 rounded-lg font-bold ${
                          points.available >= reward.points_required
                            ? 'bg-nile-blue text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={points.available < reward.points_required}
                      >
                        {locale === 'ar' ? 'استبدال' : 'Redeem'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Transaction History */}
        {activeTab === 'history' && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-nile-blue">
              {locale === 'ar' ? 'سجل المعاملات' : 'Transaction History'}
            </h3>
            
            {transactions.length === 0 ? (
              <p className="text-gray-600 text-center py-4">
                {locale === 'ar' ? 'لا توجد معاملات حتى الآن.' : 'No transactions yet.'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {locale === 'ar' ? 'التاريخ' : 'Date'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {locale === 'ar' ? 'النقاط' : 'Points'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {locale === 'ar' ? 'النوع' : 'Type'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {locale === 'ar' ? 'الوصف' : 'Description'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(transaction.created_at)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.points > 0 ? '+' : ''}{transaction.points}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.transaction_type === 'earn' 
                            ? (locale === 'ar' ? 'كسب' : 'Earned') 
                            : (locale === 'ar' ? 'استبدال' : 'Redeemed')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {transaction.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
