import { useState } from 'react';
import { getTranslations } from '../../i18n/utils';
import CateringOrdersManager from './CateringOrdersManager';
import LoyaltyRewardsManager from './LoyaltyRewardsManager';
import CateringMenuManager from './CateringMenuManager';
import { getLoyaltyStats } from '../../lib/admin';

export default function AdminDashboard({ locale }) {
  const t = getTranslations(locale);
  const [activeTab, setActiveTab] = useState('orders');
  const [loyaltyStats, setLoyaltyStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Load loyalty stats when switching to the dashboard tab
  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    
    if (tab === 'dashboard' && !loyaltyStats) {
      setLoading(true);
      setError('');
      
      try {
        const { success, data, error } = await getLoyaltyStats();
        
        if (!success) {
          throw new Error(error);
        }
        
        setLoyaltyStats(data);
      } catch (err) {
        setError(locale === 'ar' 
          ? 'فشل تحميل إحصائيات الولاء. يرجى المحاولة مرة أخرى.' 
          : 'Failed to load loyalty statistics. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold mb-8 text-nile-blue text-center">
        {locale === 'ar' ? 'لوحة تحكم المدير' : 'Admin Dashboard'}
      </h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8 rtl:space-x-reverse">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-nile-blue text-nile-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => handleTabChange('dashboard')}
          >
            {locale === 'ar' ? 'لوحة المعلومات' : 'Dashboard'}
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-nile-blue text-nile-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => handleTabChange('orders')}
          >
            {locale === 'ar' ? 'طلبات التموين' : 'Catering Orders'}
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'menu'
                ? 'border-nile-blue text-nile-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => handleTabChange('menu')}
          >
            {locale === 'ar' ? 'قائمة التموين' : 'Catering Menu'}
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'rewards'
                ? 'border-nile-blue text-nile-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => handleTabChange('rewards')}
          >
            {locale === 'ar' ? 'مكافآت الولاء' : 'Loyalty Rewards'}
          </button>
        </nav>
      </div>
      
      {/* Dashboard Overview */}
      {activeTab === 'dashboard' && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-nile-blue">
            {locale === 'ar' ? 'نظرة عامة' : 'Overview'}
          </h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
              </p>
            </div>
          ) : loyaltyStats ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-nile-blue-pale rounded-lg p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {locale === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}
                  </h3>
                  <p className="text-3xl font-bold text-nile-blue">{loyaltyStats.totalUsers}</p>
                </div>
                
                <div className="bg-nile-blue-pale rounded-lg p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {locale === 'ar' ? 'إجمالي النقاط' : 'Total Points'}
                  </h3>
                  <p className="text-3xl font-bold text-nile-blue">{loyaltyStats.totalPoints}</p>
                </div>
                
                <div className="bg-nile-blue-pale rounded-lg p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {locale === 'ar' ? 'النقاط المستبدلة' : 'Redeemed Points'}
                  </h3>
                  <p className="text-3xl font-bold text-nile-blue">{loyaltyStats.redeemedPoints}</p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-4 text-nile-blue">
                {locale === 'ar' ? 'أحدث المعاملات' : 'Recent Transactions'}
              </h3>
              
              {loyaltyStats.recentTransactions.length === 0 ? (
                <p className="text-gray-600 text-center py-4">
                  {locale === 'ar' ? 'لا توجد معاملات حديثة' : 'No recent transactions'}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {locale === 'ar' ? 'المستخدم' : 'User'}
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
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {locale === 'ar' ? 'التاريخ' : 'Date'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loyaltyStats.recentTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.user_id}
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(transaction.created_at).toLocaleDateString(
                              locale === 'ar' ? 'ar-SA' : 'en-US'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {locale === 'ar' ? 'لا توجد بيانات متاحة' : 'No data available'}
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Catering Orders */}
      {activeTab === 'orders' && (
        <CateringOrdersManager locale={locale} />
      )}
      
      {/* Catering Menu */}
      {activeTab === 'menu' && (
        <CateringMenuManager locale={locale} />
      )}
      
      {/* Loyalty Rewards */}
      {activeTab === 'rewards' && (
        <LoyaltyRewardsManager locale={locale} />
      )}
    </div>
  );
}
