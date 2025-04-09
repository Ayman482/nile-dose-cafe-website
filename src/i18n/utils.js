import ar from './ar';
import en from './en';

export const getTranslations = (locale) => {
  switch (locale) {
    case 'en':
      return en;
    case 'ar':
    default:
      return ar;
  }
};

export const getLocaleFromUrl = (url) => {
  const pathname = url.pathname;
  if (pathname.startsWith('/en/')) {
    return 'en';
  }
  return 'ar'; // Default to Arabic
};

export const getLocalizedPath = (path, locale) => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // If path already has locale prefix, remove it
  let pathWithoutLocale = cleanPath;
  if (cleanPath.startsWith('en/')) {
    pathWithoutLocale = cleanPath.substring(3);
  } else if (cleanPath.startsWith('ar/')) {
    pathWithoutLocale = cleanPath.substring(3);
  }
  
  // Add new locale prefix if not default
  if (locale === 'en') {
    return `/en/${pathWithoutLocale}`;
  }
  
  // For default locale (ar), don't add prefix
  return `/${pathWithoutLocale}`;
};
