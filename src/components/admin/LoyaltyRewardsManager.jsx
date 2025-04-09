import { useState, useEffect } from 'react';
import { getTranslations } from '../../i18n/utils';
import { getAllLoyaltyRewards, saveReward, deleteReward } from '../../lib/admin';

export default function LoyaltyRewardsManager({ locale }) {
  const t = getTranslations(locale);
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState([]);
  const [editingReward, setEditingReward] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Load rewards on component mount
  useEffect(() => {
    loadRewards();
  }, []);
  
  const loadRewards = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { success, data, error } = await getAllLoyaltyRewards();
      
      if (!success) {
        throw new Error(error);
      }
      
      setRewards(data || []);
    } catch (err) {
      setError(locale === 'ar' 
        ? 'فشل تحميل مكافآت الولاء. يرجى المحاولة مرة أخرى.' 
        : 'Failed to load loyalty rewards. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditReward = (reward) => {
    setEditingReward(reward);
    setIsEditing(true);
  };
  
  const handleNewReward = () => {
    setEditingReward({
      name: '',
      name_ar: '',
      description: '',
      description_ar: '',
      points_required: 100,
      active: true
    });
    setIsEditing(true);
  };
  
  const handleSaveReward = async () => {
    setError('');
    setSuccess('');
    
    // Validate form
    if (!editingReward.name || !editingReward.name_ar || !editingReward.points_required) {
      setError(locale === 'ar' 
        ? 'يرجى ملء جميع الحقول المطلوبة' 
        : 'Please fill in all required fields');
      return;
    }
    
    try {
      const { success, data, error } = await saveReward(editingReward);
      
      if (!success) {
        throw new Error(error);
      }
      
      // Update rewards list
      if (editingReward.id) {
        setRewards(rewards.map(reward => 
          reward.id === data.id ? data : reward
        ));
      } else {
        setRewards([...rewards, data]);
      }
      
      setSuccess(locale === 'ar' 
        ? 'تم حفظ المكافأة بنجاح' 
        : 'Reward saved successfully');
      setIsEditing(false);
      setEditingReward(null);
    } catch (err) {
      setError(locale === 'ar' 
        ? 'فشل حفظ المكافأة. يرجى المحاولة مرة أخرى.' 
        : 'Failed to save reward. Please try again.');
    }
  };
  
  const handleDeleteReward = async (rewardId) => {
    if (!confirm(locale === 'ar' 
      ? 'هل أنت متأكد من رغبتك في حذف هذه المكافأة؟' 
      : 'Are you sure you want to delete this reward?')) {
      return;
    }
    
    setError('');
    setSuccess('');
    
    try {
      const { success, error } = await deleteReward(rewardId);
      
      if (!success) {
        throw new Error(error);
      }
      
      // Update rewards list
      setRewards(rewards.filter(reward => reward.id !== rewardId));
      
      setSuccess(locale === 'ar' 
        ? 'تم حذف المكافأة بنجاح' 
        : 'Reward deleted successfully');
    } catch (err) {
      setError(locale === 'ar' 
        ? 'فشل حذف المكافأة. يرجى المحاولة مرة أخرى.' 
        : 'Failed to delete reward. Please try again.');
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-nile-blue">
        {locale === 'ar' ? 'إدارة مكافآت الولاء' : 'Loyalty Rewards Management'}
      </h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      {/* Add New Reward Button */}
      {!isEditing && (
        <div className="mb-6">
          <button
            onClick={handleNewReward}
            className="px-4 py-2 bg-nile-blue text-white rounded-lg hover:bg-blue-700"
          >
            {locale === 'ar' ? 'إضافة مكافأة جديدة' : 'Add New Reward'}
          </button>
        </div>
      )}
      
      {/* Edit Reward Form */}
      {isEditing && editingReward && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-nile-blue">
            {editingReward.id 
              ? (locale === 'ar' ? 'تعديل المكافأة' : 'Edit Reward') 
              : (locale === 'ar' ? 'إضافة مكافأة جديدة' : 'Add New Reward')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="name">
                {locale === 'ar' ? 'الاسم (بالإنجليزية)' : 'Name (English)'} *
              </label>
              <input
                type="text"
                id="name"
                value={editingReward.name}
                onChange={(e) => setEditingReward({...editingReward, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="name_ar">
                {locale === 'ar' ? 'الاسم (بالعربية)' : 'Name (Arabic)'} *
              </label>
              <input
                type="text"
                id="name_ar"
                value={editingReward.name_ar}
                onChange={(e) => setEditingReward({...editingReward, name_ar: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="description">
                {locale === 'ar' ? 'الوصف (بالإنجليزية)' : 'Description (English)'}
              </label>
              <textarea
                id="description"
                value={editingReward.description}
                onChange={(e) => setEditingReward({...editingReward, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
                rows="3"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="description_ar">
                {locale === 'ar' ? 'الوصف (بالعربية)' : 'Description (Arabic)'}
              </label>
              <textarea
                id="description_ar"
                value={editingReward.description_ar}
                onChange={(e) => setEditingReward({...editingReward, description_ar: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
                rows="3"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="points_required">
                {locale === 'ar' ? 'النقاط المطلوبة' : 'Points Required'} *
              </label>
              <input
                type="number"
                id="points_required"
                value={editingReward.points_required}
                onChange={(e) => setEditingReward({...editingReward, points_required: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
                min="1"
                required
              />
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingReward.active}
                  onChange={(e) => setEditingReward({...editingReward, active: e.target.checked})}
                  className="mr-2 rtl:ml-2 rtl:mr-0"
                />
                {locale === 'ar' ? 'نشط' : 'Active'}
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingReward(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {locale === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            
            <button
              onClick={handleSaveReward}
              className="px-4 py-2 bg-nile-blue text-white rounded-lg hover:bg-blue-700"
            >
              {locale === 'ar' ? 'حفظ' : 'Save'}
            </button>
          </div>
        </div>
      )}
      
      {/* Rewards Table */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      ) : rewards.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {locale === 'ar' ? 'لا توجد مكافآت ولاء' : 'No loyalty rewards found'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'ar' ? 'الاسم' : 'Name'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'ar' ? 'الوصف' : 'Description'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'ar' ? 'النقاط المطلوبة' : 'Points Required'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'ar' ? 'الحالة' : 'Status'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rewards.map((reward) => (
                <tr key={reward.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {locale === 'ar' ? reward.name_ar : reward.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {locale === 'ar' ? reward.name : reward.name_ar}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {locale === 'ar' ? reward.description_ar : reward.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reward.points_required}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      reward.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {reward.active 
                        ? (locale === 'ar' ? 'نشط' : 'Active') 
                        : (locale === 'ar' ? 'غير نشط' : 'Inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditReward(reward)}
                      className="text-nile-blue hover:text-blue-700 mr-3"
                    >
                      {locale === 'ar' ? 'تعديل' : 'Edit'}
                    </button>
                    <button
                      onClick={() => handleDeleteReward(reward.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      {locale === 'ar' ? 'حذف' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
