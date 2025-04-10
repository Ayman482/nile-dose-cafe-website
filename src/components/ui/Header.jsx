// Components for the header/navbar
import { useState } from 'react';
import { getTranslations, getLocalizedPath } from '../../i18n/utils';

export default function Header({ locale }) {
  const t = getTranslations(locale);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const switchLanguage = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    const currentPath = window.location.pathname;
    const newPath = getLocalizedPath(currentPath, newLocale);
    window.location.href = newPath;
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href={locale === 'ar' ? '/' : '/en/'} className="flex items-center">
          <img src="/images/Logo.png" alt="Nile Dose Cafe" className="h-12" />
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 rtl:space-x-reverse">
          <a href={locale === 'ar' ? '/' : '/en/'} className="text-nile-blue hover:text-blue-700 font-medium">
            {t.common.home}
          </a>
          <a href={locale === 'ar' ? '/menu' : '/en/menu'} className="text-nile-blue hover:text-blue-700 font-medium">
            {t.common.menu}
          </a>
          <a href={locale === 'ar' ? '/catering' : '/en/catering'} className="text-nile-blue hover:text-blue-700 font-medium">
            {t.common.catering}
          </a>
          <a href={locale === 'ar' ? '/loyalty' : '/en/loyalty'} className="text-nile-blue hover:text-blue-700 font-medium">
            {t.common.loyalty}
          </a>
          <a href={locale === 'ar' ? '/about' : '/en/about'} className="text-nile-blue hover:text-blue-700 font-medium">
            {t.common.about}
          </a>
        </nav>
        
        <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
          <button 
            onClick={switchLanguage}
            className="px-3 py-1 border border-nile-blue text-nile-blue rounded hover:bg-nile-blue hover:text-white transition-colors"
          >
            {t.common.language}
          </button>
          <a 
            href={locale === 'ar' ? '/login' : '/en/login'} 
            className="px-4 py-2 bg-nile-blue text-white rounded hover:bg-blue-700 transition-colors"
          >
            {t.common.login}
          </a>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-nile-blue"
          onClick={toggleMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-3">
              <a href={locale === 'ar' ? '/' : '/en/'} className="text-nile-blue hover:text-blue-700 py-2">
                {t.common.home}
              </a>
              <a href={locale === 'ar' ? '/menu' : '/en/menu'} className="text-nile-blue hover:text-blue-700 py-2">
                {t.common.menu}
              </a>
              <a href={locale === 'ar' ? '/catering' : '/en/catering'} className="text-nile-blue hover:text-blue-700 py-2">
                {t.common.catering}
              </a>
              <a href={locale === 'ar' ? '/loyalty' : '/en/loyalty'} className="text-nile-blue hover:text-blue-700 py-2">
                {t.common.loyalty}
              </a>
              <a href={locale === 'ar' ? '/about' : '/en/about'} className="text-nile-blue hover:text-blue-700 py-2">
                {t.common.about}
              </a>
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                <button 
                  onClick={switchLanguage}
                  className="px-3 py-1 border border-nile-blue text-nile-blue rounded hover:bg-nile-blue hover:text-white transition-colors self-start"
                >
                  {t.common.language}
                </button>
                <a 
                  href={locale === 'ar' ? '/login' : '/en/login'} 
                  className="px-4 py-2 bg-nile-blue text-white rounded hover:bg-blue-700 transition-colors self-start"
                >
                  {t.common.login}
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
