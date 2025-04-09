import { useState, useEffect } from 'react';
import { getTranslations } from '../../i18n/utils';
import { getMenuItemImage } from '../../lib/menuImageMapping';
import '../../styles/brand-colors.css';
import '../../styles/cairo-font.css';

export default function EnhancedMenuDisplay({ locale, menuData }) {
  const t = getTranslations(locale);
  const [activeCategory, setActiveCategory] = useState('Hot Beverage');
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Set initial subcategory when component mounts or category changes
  useEffect(() => {
    if (menuData && menuData[activeCategory]) {
      const subcategories = Object.keys(menuData[activeCategory]);
      if (subcategories.length > 0) {
        setActiveSubcategory(subcategories[0]);
      }
    }
  }, [activeCategory, menuData]);
  
  // Handle search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setIsFiltering(false);
      return;
    }
    
    setIsFiltering(true);
    const results = [];
    
    // Search through all categories and subcategories
    Object.keys(menuData).forEach(category => {
      Object.keys(menuData[category]).forEach(subcategory => {
        const items = menuData[category][subcategory];
        
        items.forEach(item => {
          const nameMatch = item.Name && item.Name.toLowerCase().includes(searchTerm.toLowerCase());
          const arabicNameMatch = item.ArabicName && item.ArabicName.toLowerCase().includes(searchTerm.toLowerCase());
          
          if (nameMatch || arabicNameMatch) {
            results.push({
              ...item,
              category,
              subcategory
            });
          }
        });
      });
    });
    
    setFilteredItems(results);
  }, [searchTerm, menuData]);
  
  if (!menuData) {
    return <div className="text-center py-8">Loading menu...</div>;
  }
  
  const categories = Object.keys(menuData);
  
  // Get translated category name
  const getTranslatedCategory = (category) => {
    switch(category) {
      case 'Hot Beverage': return t.menu.categories.hotBeverage;
      case 'Cold Beverage': return t.menu.categories.coldBeverage;
      case 'Desert': return t.menu.categories.desert;
      case 'Extras': return t.menu.categories.extras;
      case 'Winter Menu': return t.menu.categories.winterMenu;
      default: return category;
    }
  };
  
  // Get translated subcategory name
  const getTranslatedSubcategory = (subcategory) => {
    switch(subcategory) {
      case 'Tea': return t.menu.subcategories.tea;
      case 'Hot Coffee': return t.menu.subcategories.hotCoffee;
      case 'Cold Coffee': return t.menu.subcategories.coldCoffee;
      case 'Mojitos Smoothies': return t.menu.subcategories.mojitosAndSmoothies;
      case 'Sweets': return t.menu.subcategories.sweets;
      case 'Add': return t.menu.subcategories.add;
      case 'Winter Drinks': return t.menu.subcategories.winterDrinks;
      default: return subcategory;
    }
  };
  
  // Get appropriate name based on locale
  const getItemName = (item) => {
    if (locale === 'ar' && item.ArabicName) {
      return item.ArabicName;
    }
    return item.Name;
  };
  
  // Render menu items
  const renderMenuItems = (items, category, subcategory) => {
    return items.map((item, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover-shadow">
        <div className="h-48 overflow-hidden">
          <img 
            src={getMenuItemImage(item, category, subcategory)} 
            alt={getItemName(item)} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <div className="p-4 flex-grow">
          <h3 className="text-xl font-bold mb-2 text-nile-blue">{getItemName(item)}</h3>
          {item['Cup Size '] && (
            <p className="text-gray-600 mb-1">{item['Cup Size ']}</p>
          )}
          {item['Caloris '] && (
            <p className="text-gray-600 mb-1">{item['Caloris ']} cal</p>
          )}
        </div>
        <div className="p-4 bg-nile-blue-pale border-t border-gray-100">
          <p className="text-nile-blue font-bold text-xl">
            {item['Final Price'] ? `${item['Final Price']} SAR` : ''}
          </p>
        </div>
      </div>
    ));
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder={locale === 'ar' ? "ابحث في القائمة..." : "Search menu..."}
              className="input-nile w-full py-3 px-4 pr-10 rtl:pl-10 rtl:pr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 rtl:left-0 rtl:right-auto flex items-center pr-3 rtl:pl-3 rtl:pr-0">
              <svg className="h-5 w-5 text-nile-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {!isFiltering && (
        <>
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
          
          {/* Subcategory Tabs */}
          {menuData[activeCategory] && (
            <div className="flex overflow-x-auto mb-8 pb-2">
              {Object.keys(menuData[activeCategory]).map((subcategory) => (
                <button
                  key={subcategory}
                  className={`px-4 py-2 mx-1 whitespace-nowrap ${
                    activeSubcategory === subcategory
                      ? 'bg-nile-beige text-nile-blue font-bold rounded-lg'
                      : 'text-gray-700 hover:text-nile-blue'
                  }`}
                  onClick={() => setActiveSubcategory(subcategory)}
                >
                  {getTranslatedSubcategory(subcategory)}
                </button>
              ))}
            </div>
          )}
          
          {/* Menu Items */}
          {activeSubcategory && menuData[activeCategory] && menuData[activeCategory][activeSubcategory] && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderMenuItems(menuData[activeCategory][activeSubcategory], activeCategory, activeSubcategory)}
            </div>
          )}
        </>
      )}
      
      {/* Search Results */}
      {isFiltering && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-nile-blue">
            {locale === 'ar' ? "نتائج البحث" : "Search Results"}
          </h2>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {locale === 'ar' ? "لا توجد نتائج مطابقة لبحثك" : "No items match your search"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderMenuItems(filteredItems, null, null)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
