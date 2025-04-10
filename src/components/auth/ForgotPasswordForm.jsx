import { useState } from 'react';
import { getTranslations } from '../../i18n/utils';
import { resetPassword } from '../../lib/auth';

export default function ForgotPasswordForm({ locale }) {
  const t = getTranslations(locale);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { success, error } = await resetPassword(email);
      
      if (!success) {
        throw new Error(error);
      }
      
      // Reset password email sent successfully
      setSuccess(true);
    } catch (err) {
      setError(locale === 'ar' 
        ? 'حدث خطأ أثناء إرسال بريد إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى.' 
        : 'An error occurred while sending the password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="text-xl font-bold text-green-700 mb-2">
          {locale === 'ar' ? 'تم إرسال بريد إعادة تعيين كلمة المرور!' : 'Password Reset Email Sent!'}
        </h3>
        <p className="text-green-600 mb-4">
          {locale === 'ar' 
            ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من بريدك الإلكتروني لإكمال عملية إعادة تعيين كلمة المرور.' 
            : 'A password reset link has been sent to your email. Please check your email to complete the password reset process.'}
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
        {locale === 'ar' ? 'نسيت كلمة المرور' : 'Forgot Password'}
      </h2>
      
      <p className="text-gray-600 mb-6 text-center">
        {locale === 'ar' 
          ? 'أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور الخاصة بك.' 
          : 'Enter your email and we will send you a link to reset your password.'}
      </p>
      
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            ? (locale === 'ar' ? 'جاري الإرسال...' : 'Sending...') 
            : (locale === 'ar' ? 'إرسال رابط إعادة التعيين' : 'Send Reset Link')}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <a 
          href={locale === 'ar' ? '/login' : '/en/login'} 
          className="text-nile-blue hover:underline"
        >
          {locale === 'ar' ? 'العودة إلى تسجيل الدخول' : 'Back to Login'}
        </a>
      </div>
    </div>
  );
}
