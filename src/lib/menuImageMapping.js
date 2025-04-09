// Menu Image Mapping Utility
// This file maps menu items to their corresponding images

// Define image categories
const categoryImages = {
  'Hot Beverage': '/images/HotHibiscus.jpeg',
  'Cold Beverage': '/images/IMG_2874.PNG',
  'Desert': '/images/NileDose Cafe-125.jpg',
  'Extras': '/images/NileDose Cafe-136.jpg',
  'Winter Menu': '/images/NileDose Cafe-143.jpg'
};

// Define subcategory images
const subcategoryImages = {
  'Tea': '/images/greentea.jpeg',
  'Hot Coffee': '/images/espresso.jpg',
  'Cold Coffee': '/images/IMG_2870.PNG',
  'Mojitos Smoothies': '/images/IMG_3060.PNG',
  'Sweets': '/images/NileDose Cafe-118.jpg',
  'Add': '/images/NileDose Cafe-136.jpg',
  'Winter Drinks': '/images/NileDose Cafe-143.jpg'
};

// Define specific item images
const itemImages = {
  // Tea items
  'Shay Muganan Small': '/images/greentea.jpeg',
  'شاي مقنن صغير': '/images/greentea.jpeg',
  'Shay Muqanan Larg': '/images/greentea.jpeg',
  'شاي مقنن كبير': '/images/greentea.jpeg',
  'Milk Tea': '/images/NileDose Cafe-140.jpg',
  'شاي بلبن': '/images/NileDose Cafe-140.jpg',
  'Tea': '/images/greentea.jpeg',
  'شاي ساده': '/images/greentea.jpeg',
  'Green Tea': '/images/greentea.jpeg',
  'شاي اخضر': '/images/greentea.jpeg',
  'Hot Hibiscus': '/images/HotHibiscus.jpeg',
  'كركدي ساخن شيريا': '/images/HotHibiscus.jpeg',
  'Ginger': '/images/ginger-tea-recipe.webp',
  'زنجبيل': '/images/ginger-tea-recipe.webp',
  
  // Coffee items
  'Espresso': '/images/espresso.jpg',
  'اسبريسو': '/images/espresso.jpg',
  'Caramel Macchiato': '/images/Caramel Macchiato.jpeg',
  'كراميل ماكياتو': '/images/Caramel Macchiato.jpeg',
  'Turkish Coffee': '/images/NileDose Cafe-141.jpg',
  'قهوة تركي': '/images/NileDose Cafe-141.jpg',
  'Sudanese Coffee': '/images/NileDose Cafe-141.jpg',
  'قهوة سودانية': '/images/NileDose Cafe-141.jpg',
  
  // Cold beverages
  'Iced Latte': '/images/IMG_2870.PNG',
  'لاتيه مثلج': '/images/IMG_2870.PNG',
  'Iced Mocha': '/images/IMG_2874.PNG',
  'موكا مثلجة': '/images/IMG_2874.PNG',
  'Cold Brew': '/images/IMG_2875.PNG',
  'كولد برو': '/images/IMG_2875.PNG',
  
  // Mojitos and Smoothies
  'Mojito': '/images/IMG_3060.PNG',
  'موهيتو': '/images/IMG_3060.PNG',
  'Smoothie': '/images/IMG_3079.PNG',
  'سموذي': '/images/IMG_3079.PNG',
  
  // Desserts
  'Basbousa': '/images/NileDose Cafe-125.jpg',
  'بسبوسة': '/images/NileDose Cafe-125.jpg',
  'Fateer': '/images/NileDose Cafe-118.jpg',
  'فطيرة': '/images/NileDose Cafe-118.jpg',
  
  // Winter menu
  'Hot Chocolate': '/images/NileDose Cafe-143.jpg',
  'شوكولاتة ساخنة': '/images/NileDose Cafe-143.jpg',
  'Winter Tea': '/images/NileDose Cafe-147.jpg',
  'شاي الشتاء': '/images/NileDose Cafe-147.jpg'
};

// Function to get image for a menu item
export function getMenuItemImage(item, category, subcategory) {
  // First try to find a direct match by name
  if (item.Name && itemImages[item.Name]) {
    return itemImages[item.Name];
  }
  
  // Then try Arabic name
  if (item.ArabicName && itemImages[item.ArabicName]) {
    return itemImages[item.ArabicName];
  }
  
  // If no direct match, try subcategory
  if (subcategory && subcategoryImages[subcategory]) {
    return subcategoryImages[subcategory];
  }
  
  // If no subcategory match, try category
  if (category && categoryImages[category]) {
    return categoryImages[category];
  }
  
  // Default fallback image
  return '/images/Logo.png';
}

export default {
  getMenuItemImage,
  categoryImages,
  subcategoryImages,
  itemImages
};
