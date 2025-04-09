import { useState, useEffect } from 'react';
import { getTranslations } from '../../i18n/utils';
import { getAllCateringMenuItems, saveCateringMenuItem, deleteCateringMenuItem } from '../../lib/admin';

export default function CateringMenuManager({ locale }) {
  const t = getTranslations(locale);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Available categories
  const categories = [
    'Beverages',
    'Appetizers',
    'Main Courses',
    'Desserts',
    'Platters'
  ];
  
  // Load menu items on component mount
  useEffect(() => {
    loadMenuItems();
  }, []);
  
  const loadMenuItems = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { success, data, error } = await getAllCateringMenuItems();
      
      if (!success) {
        throw new Error(error);
      }
      
      setMenuItems(data || []);
    } catch (err) {
      setError(locale === 'ar' 
        ? 'فشل تحميل قائمة التموين. يرجى المحاولة مرة أخرى.' 
        : 'Failed to load catering menu. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsEditing(true);
  };
  
  const handleNewItem = () => {
    setEditingItem({
      name: '',
      name_ar: '',
      description: '',
      description_ar: '',
      price: 0,
      category: 'Beverages',
      serves: 1,
      active: true
    });
    setIsEditing(true);
  };
  
  const handleSaveItem = async () => {
    setError('');
    setSuccess('');
    
    // Validate form
    if (!editingItem.name || !editingItem.name_ar || !editingItem.category) {
      setError(locale === 'ar' 
        ? 'يرجى ملء جميع الحقول المطلوبة' 
        : 'Please fill in all required fields');
      return;
    }
    
    try {
      const { success, data, error } = await saveCateringMenuItem(editingItem);
      
      if (!success) {
        throw new Error(error);
      }
      
      // Update menu items list
      if (editingItem.id) {
        setMenuItems(menuItems.map(item => 
          item.id === data.id ? data : item
        ));
      } else {
        setMenuItems([...menuItems, data]);
      }
      
      setSuccess(locale === 'ar' 
        ? 'تم حفظ عنصر القائمة بنجاح' 
        : 'Menu item saved successfully');
      setIsEditing(false);
      setEditingItem(null);
    } catch (err) {
      setError(locale === 'ar' 
        ? 'فشل حفظ عنصر القائمة. يرجى المحاولة مرة أخرى.' 
        : 'Failed to save menu item. Please try again.');
    }
  };
  
  const handleDeleteItem = async (itemId) => {
    if (!confirm(locale === 'ar' 
      ? 'هل أنت متأكد من رغبتك في حذف هذا العنصر من القائمة؟' 
      : 'Are you sure you want to delete this menu item?')) {
      return;
    }
    
    setError('');
    setSuccess('');
    
    try {
      const { success, error } = await deleteCateringMenuItem(itemId);
      
      if (!success) {
        throw new Error(error);
      }
      
      // Update menu items list
      setMenuItems(menuItems.filter(item => item.id !== itemId));
      
      setSuccess(locale === 'ar' 
        ? 'تم حذف عنصر القائمة بنجاح' 
        : 'Menu item deleted successfully');
    } catch (err) {
      setError(locale === 'ar' 
        ? 'فشل حذف عنصر القائمة. يرجى المحاولة مرة أخرى.' 
        : 'Failed to delete menu item. Please try again.');
    }
  };
  
  // Get translated category name
  const getTranslatedCategory = (category) => {
    // This would be replaced with actual translations
    const categoryTranslations = {
      'Beverages': locale === 'ar' ? 'المشروبات' : 'Beverages',
      'Appetizers': locale === 'ar' ? 'المقبلات' : 'Appetizers',
      'Main Courses': locale === 'ar' ? 'الأطباق الرئيسية' : 'Main Courses',
      'Desserts': locale === 'ar' ? 'الحلويات' : 'Desserts',
      'Platters': locale === 'ar' ? 'الأطباق المشتركة' : 'Platters'
    };
    
    return categoryTranslations[category] || category;
  };
  
  // Filter menu items by category
  const filteredItems = categoryFilter 
    ? menuItems.filter(item => item.category === categoryFilter)
    : menuItems;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-nile-blue">
        {locale === 'ar' ? 'إدارة قائمة التموين' : 'Catering Menu Management'}
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
      
      {/* Add New Item Button */}
      {!isEditing && (
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={handleNewItem}
            className="px-4 py-2 bg-nile-blue text-white rounded-lg hover:bg-blue-700"
          >
            {locale === 'ar' ? 'إضافة عنصر جديد' : 'Add New Item'}
          </button>
          
          {/* Category Filter */}
          <div className="flex items-center">
            <label className="mr-2 rtl:ml-2 rtl:mr-0 text-gray-700">
              {locale === 'ar' ? 'تصفية حسب الفئة:' : 'Filter by Category:'}
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
            >
              <option value="">{locale === 'ar' ? 'جميع الفئات' : 'All Categories'}</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {getTranslatedCategory(category)}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      
      {/* Edit Item Form */}
      {isEditing && editingItem && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-nile-blue">
            {editingItem.id 
              ? (locale === 'ar' ? 'تعديل عنصر القائمة' : 'Edit Menu Item') 
              : (locale === 'ar' ? 'إضافة عنصر جديد' : 'Add New Item')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="name">
                {locale === 'ar' ? 'الاسم (بالإنجليزية)' : 'Name (English)'} *
              </label>
              <input
                type="text"
                id="name"
                value={editingItem.name}
                onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
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
                value={editingItem.name_ar}
                onChange={(e) => setEditingItem({...editingItem, name_ar: e.target.value})}
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
                value={editingItem.description}
                onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
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
                value={editingItem.description_ar}
                onChange={(e) => setEditingItem({...editingItem, description_ar: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
                rows="3"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="category">
                {locale === 'ar' ? 'الفئة' : 'Category'} *
              </label>
              <select
                id="category"
                value={editingItem.category}
                onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {getTranslatedCategory(category)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="price">
                {locale === 'ar' ? 'السعر (ريال سعودي)' : 'Price (SAR)'} *
              </label>
              <input
                type="number"
                id="price"
                value={editingItem.price}
                onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="serves">
                {locale === 'ar' ? 'يخدم (عدد الأشخاص)' : 'Serves (People)'} *
              </label>
              <input
                type="number"
                id="serves"
                value={editingItem.serves}
                onChange={(e) => setEditingItem({...editingItem, serves: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
                min="1"
                required
              />
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingItem.active}
                  onChange={(e) => setEditingItem({...editingItem, active: e.target.checked})}
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
                setEditingItem(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {locale === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            
            <button
              onClick={handleSaveItem}
              className="px-4 py-2 bg-nile-blue text-white rounded-lg hover:bg-blue-700"
            >
              {locale === 'ar' ? 'حفظ' : 'Save'}
            </button>
          </div>
        </div>
      )}
      
      {/* Menu Items Table */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {locale === 'ar' ? 'لا توجد عناصر في قائمة التموين' : 'No catering menu items found'}
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
                  {locale === 'ar' ? 'الفئة' : 'Category'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'ar' ? 'السعر' : 'Price'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === 'ar' ? 'يخدم' : 'Serves'}
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
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {locale === 'ar' ? item.name_ar : item.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {locale === 'ar' ? item.name : item.name_ar}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getTranslatedCategory(item.category)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.price} SAR
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.serves} {locale === 'ar' ? 'أشخاص' : 'people'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.active 
                        ? (locale === 'ar' ? 'نشط' : 'Active') 
                        : (locale === 'ar' ? 'غير نشط' : 'Inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="text-nile-blue hover:text-blue-700 mr-3"
                    >
                      {locale === 'ar' ? 'تعديل' : 'Edit'}
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
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
