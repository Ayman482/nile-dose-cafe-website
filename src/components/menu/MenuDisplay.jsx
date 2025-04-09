import { useState, useEffect } from 'react';
import { getTranslations } from '../../i18n/utils';

export default function MenuDisplay({ locale, menuData }) {
  const t = getTranslations(locale);
  const [activeCategory, setActiveCategory] = useState('Hot Beverage');
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  
  // Set initial subcategory when component mounts or category changes
  useEffect(() => {
    if (menuData && menuData[activeCategory]) {
      const subcategories = Object.keys(menuData[activeCategory]);
      if (subcategories.length > 0) {
        setActiveSubcategory(subcategories[0]);
      }
    }
  }, [activeCategory, menuData]);
  
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
  
  // Find image for menu item
  const getItemImage = (itemName) => {
    // This is a placeholder function - in a real implementation, 
    // you would match item names to actual image paths
    const defaultImage = '/images/Logo.png';
    
    // Simple mapping for demo purposes
    const imageMap = {
      'Shay Muganan Small': '/images/greentea.jpeg',
      'شاي مقنن صغير': '/images/greentea.jpeg',
      'Hot Hibiscus': '/images/HotHibiscus.jpeg',
      'كركدي ساخن شيريا': '/images/HotHibiscus.jpeg',
      'Espresso': '/images/espresso.jpg',
      'اسبريسو': '/images/espresso.jpg',
    };
    
    return imageMap[itemName] || defaultImage;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
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
          {menuData[activeCategory][activeSubcategory].map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              <div className="h-48 overflow-hidden">
                <img 
                  src={getItemImage(item.Name)} 
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
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <p className="text-nile-blue font-bold text-xl">
                  {item['Final Price'] ? `${item['Final Price']} SAR` : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
