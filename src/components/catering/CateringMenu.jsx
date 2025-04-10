import { useState, useEffect } from 'react';
import { getTranslations } from '../../i18n/utils';
import { getCateringMenu } from '../../lib/catering';

export default function CateringMenu({ locale, onAddToCart }) {
  const t = getTranslations(locale);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function loadCateringMenu() {
      try {
        const { success, data, error } = await getCateringMenu();
        
        if (!success) {
          throw new Error(error);
        }
        
        setMenu(data || []);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
        
        // Set initial active category
        if (uniqueCategories.length > 0) {
          setActiveCategory(uniqueCategories[0]);
        }
      } catch (err) {
        setError(locale === 'ar' 
          ? 'فشل تحميل قائمة التموين. يرجى المحاولة مرة أخرى.' 
          : 'Failed to load catering menu. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    loadCateringMenu();
  }, [locale]);
  
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
  
  // Get appropriate name based on locale
  const getItemName = (item) => {
    if (locale === 'ar' && item.name_ar) {
      return item.name_ar;
    }
    return item.name;
  };
  
  // Get appropriate description based on locale
  const getItemDescription = (item) => {
    if (locale === 'ar' && item.description_ar) {
      return item.description_ar;
    }
    return item.description;
  };
  
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
        </p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }
  
  if (menu.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          {locale === 'ar' ? 'لا توجد عناصر في قائمة التموين حاليًا.' : 'No items in the catering menu at the moment.'}
        </p>
      </div>
    );
  }
  
  return (
    <div>
      {/* Category Tabs */}
      <div className="flex overflow-x-auto mb-6 pb-2 border-b border-gray-200">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 mx-1 whitespace-nowrap ${
              activeCategory === category
                ? 'bg-nile-blue text-white rounded-t-lg'
                : 'text-gray-700 hover:text-nile-blue'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {getTranslatedCategory(category)}
          </button>
        ))}
      </div>
      
      {/* Menu Items */}
      <div className="space-y-6">
        {activeCategory && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-nile-blue">
              {getTranslatedCategory(activeCategory)}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menu
                .filter(item => item.category === activeCategory)
                .map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                    <div className="p-4 flex-grow">
                      <div className="flex justify-between">
                        <h4 className="text-lg font-bold mb-1">{getItemName(item)}</h4>
                        <span className="text-nile-blue font-bold">{item.price} SAR</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{getItemDescription(item)}</p>
                      <p className="text-gray-500 text-sm mb-3">
                        {locale === 'ar' ? `يخدم ${item.serves} أشخاص` : `Serves ${item.serves} people`}
                      </p>
                      <div className="mt-auto">
                        <button
                          onClick={() => onAddToCart(item)}
                          className="bg-nile-blue text-white py-1 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          {locale === 'ar' ? 'إضافة إلى الطلب' : 'Add to Order'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
