// src/components/menu/EnhancedMenuDisplay.jsx
import React, { useState } from 'react';
import './MenuDisplay.css';

const EnhancedMenuDisplay = ({ locale, menuData }) => {
  const [activeCategory, setActiveCategory] = useState(0);
  
  // Check if menuData exists and has categories
  if (!menuData || !menuData.categories || menuData.categories.length === 0) {
    console.error('Menu data is missing or invalid:', menuData);
    return (
      <div className="container mx-auto px-4 text-center">
        <p className="text-xl text-red-500">
          {locale === 'ar' ? 'عفواً، لا يمكن تحميل بيانات القائمة' : 'Sorry, menu data could not be loaded'}
        </p>
      </div>
    );
  }
  
  const handleCategoryClick = (index) => {
    setActiveCategory(index);
  };
  
  // Get the name based on locale
  const getCategoryName = (category) => {
    return locale === 'ar' ? category.name_ar : category.name;
  };
  
  const getItemName = (item) => {
    return locale === 'ar' ? item.name_ar : item.name;
  };
  
  const getItemDescription = (item) => {
    return locale === 'ar' ? item.description_ar : item.description;
  };
  
  // Get image path for menu item
  const getMenuItemImage = (item) => {
    if (item.image) {
      return `/images/menu/${item.image}`;
    }
    return '/images/menu/default-item.jpg';
  };
  
  // Render menu items
  const renderMenuItems = (items) => {
    return items.map((item, index) => (
      <div key={item.id || index} className="menu-item bg-white rounded-lg shadow-md overflow-hidden">
        <div className="menu-item-image">
          <img 
            src={getMenuItemImage(item)} 
            alt={getItemName(item)}
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="menu-item-content p-4">
          <h3 className="text-xl font-bold mb-2">{getItemName(item)}</h3>
          <p className="text-gray-600 mb-4">{getItemDescription(item)}</p>
          <div className="flex justify-between items-center">
            <span className="text-nile-blue font-bold text-lg">{item.price} SAR</span>
            <button className="bg-nile-beige text-nile-blue px-4 py-2 rounded hover:bg-opacity-80 transition">
              {locale === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    ));
  };
  
  return (
    <div className="container mx-auto px-4">
      {/* Category Navigation */}
      <div className="category-nav flex overflow-x-auto mb-8 pb-2">
        {menuData.categories.map((category, index) => (
          <button
            key={index}
            className={`category-btn whitespace-nowrap px-6 py-3 mx-2 rounded-full ${
              activeCategory === index ? 'bg-nile-blue text-white' : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => handleCategoryClick(index)}
          >
            {getCategoryName(category)}
          </button>
        ))}
      </div>
      
      {/* Menu Items Grid */}
      <div className="menu-items-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderMenuItems(menuData.categories[activeCategory].items)}
      </div>
    </div>
  );
};

export default EnhancedMenuDisplay;
