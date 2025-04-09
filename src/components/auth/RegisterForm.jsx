import { useState } from 'react';
import { getTranslations } from '../../i18n/utils';
import { registerUser } from '../../lib/auth';

export default function RegisterForm({ locale }) {
  const t = getTranslations(locale);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
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
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError(locale === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setError(locale === 'ar' ? 'يجب أن تكون كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    // Register user
    try {
      const { success, error } = await registerUser(
        formData.email,
        formData.password,
        {
          name: formData.name,
          phone: formData.phone
        }
      );
      
      if (!success) {
        throw new Error(error);
      }
      
      // Registration successful
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="text-xl font-bold text-green-700 mb-2">
          {locale === 'ar' ? 'تم التسجيل بنجاح!' : 'Registration Successful!'}
        </h3>
        <p className="text-green-600 mb-4">
          {locale === 'ar' 
            ? 'تم إرسال رابط التحقق إلى بريدك الإلكتروني. يرجى التحقق من بريدك الإلكتروني لإكمال عملية التسجيل.' 
            : 'A verification link has been sent to your email. Please check your email to complete the registration process.'}
        </p>
        <a 
          href={locale === 'ar' ? '/login' : '/en/login'} 
          className="text-nile-blue hover:underline"
        >
          {locale === 'ar' ? 'العودة إلى تسجيل الدخول' : 'Back to Login'}
        </a>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-nile-blue text-center">
        {t.auth.register}
      </h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="name">
            {t.auth.name}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
            required
          />
        </div>
        
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
          <label className="block text-gray-700 mb-2" htmlFor="phone">
            {t.auth.phone}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
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
        
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
            {t.auth.confirmPassword}
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nile-blue"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-nile-blue text-white py-3 px-4 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          {loading 
            ? (locale === 'ar' ? 'جاري التسجيل...' : 'Registering...') 
            : t.auth.register}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p>
          {t.auth.alreadyHaveAccount}{' '}
          <a 
            href={locale === 'ar' ? '/login' : '/en/login'} 
            className="text-nile-blue hover:underline"
          >
            {t.auth.login}
          </a>
        </p>
      </div>
    </div>
  );
}
