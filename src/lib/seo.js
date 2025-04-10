// SEO optimization utilities for Nile Dose Cafe website
import { supabase } from './supabase';

/**
 * Generate SEO metadata for a page
 * @param {string} pageName - Name of the page
 * @param {string} locale - Locale (ar or en)
 * @returns {object} - SEO metadata
 */
export function generateSEOMetadata(pageName, locale) {
  const siteName = locale === 'ar' ? 'النيل دوز كافية' : 'Nile Dose Cafe';
  const siteSlogan = locale === 'ar' ? 'كافيه سوداني بنكهة عالمية' : 'Sudanese cafe with a global flavor';
  
  // Default metadata
  const defaultMetadata = {
    title: siteName,
    description: siteSlogan,
    keywords: locale === 'ar' 
      ? 'كافيه سوداني, مشروبات سودانية, قهوة سودانية, الرياض, مديدة, هبسكس, تمر هندي'
      : 'Sudanese cafe, Sudanese drinks, Sudanese coffee, Riyadh, Madida, Hibiscus, Tamarind',
    ogImage: '/images/nile-dose-social.jpg',
    ogType: 'website',
    twitterCard: 'summary_large_image'
  };
  
  // Page-specific metadata
  const pageMetadata = {
    home: {
      ar: {
        title: `${siteName} - ${siteSlogan}`,
        description: 'النيل دوز كافية يقدم مشروبات ومأكولات سودانية بطريقة عصرية في الرياض. استمتع بتجربة فريدة من نكهات السودان الأصيلة بلمسة عالمية.',
      },
      en: {
        title: `${siteName} - ${siteSlogan}`,
        description: 'Nile Dose Cafe offers Sudanese drinks and food with a modern twist in Riyadh. Enjoy a unique experience of authentic Sudanese flavors with a global touch.',
      }
    },
    menu: {
      ar: {
        title: `قائمة ${siteName} - مشروبات ومأكولات سودانية`,
        description: 'استكشف قائمة النيل دوز كافية المميزة من المشروبات السودانية التقليدية والمديدة بأنواعها والقهوة السودانية والمشروبات الباردة والحلويات.',
        keywords: 'قائمة كافيه سوداني, مشروبات سودانية, مديدة, هبسكس, تمر هندي, قهوة سودانية, الرياض'
      },
      en: {
        title: `${siteName} Menu - Sudanese Drinks and Food`,
        description: 'Explore Nile Dose Cafe\'s distinctive menu of traditional Sudanese drinks, various Madida options, Sudanese coffee, cold beverages, and desserts.',
        keywords: 'Sudanese cafe menu, Sudanese drinks, Madida, Hibiscus, Tamarind, Sudanese coffee, Riyadh'
      }
    },
    catering: {
      ar: {
        title: `خدمة التموين من ${siteName} - للمناسبات والحفلات`,
        description: 'خدمة تموين احترافية من النيل دوز كافية للمناسبات والحفلات. نقدم مشروبات ومأكولات سودانية أصيلة بلمسة عصرية لإضفاء طابع مميز على مناسبتك.',
        keywords: 'تموين كافيه سوداني, تموين حفلات, مشروبات سودانية للمناسبات, الرياض'
      },
      en: {
        title: `${siteName} Catering - For Events and Parties`,
        description: 'Professional catering service from Nile Dose Cafe for events and parties. We offer authentic Sudanese drinks and food with a modern twist to add a distinctive touch to your occasion.',
        keywords: 'Sudanese cafe catering, event catering, Sudanese drinks for events, Riyadh'
      }
    },
    loyalty: {
      ar: {
        title: `برنامج الولاء - ${siteName}`,
        description: 'انضم إلى برنامج الولاء من النيل دوز كافية واكسب النقاط مع كل طلب. استبدل نقاطك بمكافآت ومشروبات مجانية وخصومات حصرية.',
        keywords: 'برنامج ولاء كافيه سوداني, مكافآت, نقاط, خصومات, الرياض'
      },
      en: {
        title: `Loyalty Program - ${siteName}`,
        description: 'Join Nile Dose Cafe\'s loyalty program and earn points with every order. Redeem your points for rewards, free drinks, and exclusive discounts.',
        keywords: 'Sudanese cafe loyalty program, rewards, points, discounts, Riyadh'
      }
    },
    login: {
      ar: {
        title: `تسجيل الدخول - ${siteName}`,
        description: 'سجل دخولك إلى حساب النيل دوز كافية للوصول إلى برنامج الولاء وتتبع طلباتك وتحديث تفضيلاتك.',
      },
      en: {
        title: `Login - ${siteName}`,
        description: 'Log in to your Nile Dose Cafe account to access the loyalty program, track your orders, and update your preferences.',
      }
    },
    register: {
      ar: {
        title: `إنشاء حساب - ${siteName}`,
        description: 'أنشئ حسابًا في النيل دوز كافية للاستفادة من برنامج الولاء وتتبع طلباتك وتحديث تفضيلاتك.',
      },
      en: {
        title: `Create Account - ${siteName}`,
        description: 'Create an account at Nile Dose Cafe to benefit from the loyalty program, track your orders, and update your preferences.',
      }
    },
    admin: {
      ar: {
        title: `لوحة تحكم المدير - ${siteName}`,
        description: 'لوحة تحكم المدير للنيل دوز كافية. إدارة المحتوى، متابعة طلبات التموين، وإدارة برنامج الولاء.',
      },
      en: {
        title: `Admin Dashboard - ${siteName}`,
        description: 'Nile Dose Cafe admin dashboard. Manage content, follow up on catering orders, and manage the loyalty program.',
      }
    }
  };
  
  // Get metadata for the specified page and locale
  const metadata = pageMetadata[pageName]?.[locale] || {};
  
  // Merge with default metadata
  return {
    ...defaultMetadata,
    ...metadata
  };
}

/**
 * Generate structured data for the website (JSON-LD)
 * @param {string} locale - Locale (ar or en)
 * @returns {object} - Structured data
 */
export function generateStructuredData(locale) {
  const siteName = locale === 'ar' ? 'النيل دوز كافية' : 'Nile Dose Cafe';
  const siteSlogan = locale === 'ar' ? 'كافيه سوداني بنكهة عالمية' : 'Sudanese cafe with a global flavor';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    'name': siteName,
    'description': siteSlogan,
    'image': '/images/nile-dose-social.jpg',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Riyadh',
      'addressRegion': 'Riyadh Province',
      'addressCountry': 'SA'
    },
    'servesCuisine': 'Sudanese',
    'priceRange': '$$',
    'openingHours': 'Mo-Su 08:00-23:00',
    'telephone': '+966XXXXXXXXX',
    'menu': locale === 'ar' ? '/menu' : '/en/menu',
    'acceptsReservations': 'True'
  };
}

/**
 * Generate sitemap data for the website
 * @returns {Array} - Sitemap data
 */
export function generateSitemapData() {
  const baseUrl = 'https://niledosecafe.com';
  
  return [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/en', changefreq: 'weekly', priority: 1.0 },
    { url: '/menu', changefreq: 'weekly', priority: 0.9 },
    { url: '/en/menu', changefreq: 'weekly', priority: 0.9 },
    { url: '/catering', changefreq: 'weekly', priority: 0.8 },
    { url: '/en/catering', changefreq: 'weekly', priority: 0.8 },
    { url: '/loyalty', changefreq: 'monthly', priority: 0.7 },
    { url: '/en/loyalty', changefreq: 'monthly', priority: 0.7 },
    { url: '/login', changefreq: 'yearly', priority: 0.5 },
    { url: '/en/login', changefreq: 'yearly', priority: 0.5 },
    { url: '/register', changefreq: 'yearly', priority: 0.5 },
    { url: '/en/register', changefreq: 'yearly', priority: 0.5 }
  ].map(item => ({
    ...item,
    url: `${baseUrl}${item.url}`,
    lastmod: new Date().toISOString().split('T')[0]
  }));
}

/**
 * Generate robots.txt content
 * @returns {string} - Robots.txt content
 */
export function generateRobotsTxt() {
  return `
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/*

Sitemap: https://niledosecafe.com/sitemap.xml
  `.trim();
}

export default {
  generateSEOMetadata,
  generateStructuredData,
  generateSitemapData,
  generateRobotsTxt
};
