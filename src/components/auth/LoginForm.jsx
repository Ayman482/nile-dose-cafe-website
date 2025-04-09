import { useState } from 'react';
import { getTranslations } from '../../i18n/utils';
import { loginUser } from '../../lib/auth';

export default function LoginForm({ locale }) {
  const t = getTranslations(locale);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { success, error } = await loginUser(
        formData.email,
        formData.password
      );
      
      if (!success) {
        throw new Error(error);
      }
      
      // Login successful - redirect to home page
      window.location.href = locale === 'ar' ? '/' : '/en/';
      
    } catch (err) {
      setError(locale === 'ar' 
        ? 'فشل تسجيل الدخول. يرجى التحقق من بريدك الإلكتروني وكلمة المرور.' 
        : 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-nile-blue text-center">
        {t.auth.login}
      </h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="email">
            {t.auth.email}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="password">
            {t.auth.password}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
            required
          />
        </div>
        
        <div className="flex justify-end">
          <a 
            href={locale === 'ar' ? '/forgot-password' : '/en/forgot-password'} 
            className="text-nile-blue hover:underline text-sm"
          >
            {t.auth.forgotPassword}
          </a>
        </div>
        
        <button
          type="submit"
          className="w-full bg-nile-blue text-white py-3 px-4 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          {loading 
            ? (locale === 'ar' ? 'جاري تسجيل الدخول...' : 'Logging in...') 
            : t.auth.login}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p>
          {t.auth.dontHaveAccount}{' '}
          <a 
            href={locale === 'ar' ? '/register' : '/en/register'} 
            className="text-nile-blue hover:underline"
          >
            {t.auth.register}
          </a>
        </p>
      </div>
    </div>
  );
}
