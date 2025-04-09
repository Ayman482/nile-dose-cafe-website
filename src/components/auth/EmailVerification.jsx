import { useState, useEffect } from 'react';
import { getTranslations } from '../../i18n/utils';
import { getCurrentUser, isEmailVerified, sendVerificationEmail } from '../../lib/auth';

export default function EmailVerification({ locale }) {
  const t = getTranslations(locale);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  
  useEffect(() => {
    async function checkVerification() {
      try {
        // Get current user
        const userResult = await getCurrentUser();
        if (!userResult.success) {
          throw new Error('User not found');
        }
        
        setUser(userResult.user);
        
        // Check if email is verified
        const verificationResult = await isEmailVerified();
        if (!verificationResult.success) {
          throw new Error('Failed to check verification status');
        }
        
        setVerified(verificationResult.verified);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    checkVerification();
  }, []);
  
  const handleResendVerification = async () => {
    if (!user || !user.email) return;
    
    setResendLoading(true);
    setResendSuccess(false);
    setError('');
    
    try {
      const result = await sendVerificationEmail(user.email);
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setResendSuccess(true);
    } catch (err) {
      setError(locale === 'ar' 
        ? 'فشل إرسال بريد التحقق. يرجى المحاولة مرة أخرى.' 
        : 'Failed to send verification email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto text-center">
        <p className="text-gray-600">
          {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
        </p>
      </div>
    );
  }
  
  if (verified) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center max-w-md mx-auto">
        <h3 className="text-xl font-bold text-green-700 mb-2">
          {locale === 'ar' ? 'تم التحقق من البريد الإلكتروني!' : 'Email Verified!'}
        </h3>
        <p className="text-green-600 mb-4">
          {locale === 'ar' 
            ? 'تم التحقق من بريدك الإلكتروني بنجاح. يمكنك الآن استخدام جميع ميزات الموقع.' 
            : 'Your email has been successfully verified. You can now use all features of the site.'}
        </p>
        <a 
          href={locale === 'ar' ? '/' : '/en/'} 
          className="text-nile-blue hover:underline"
        >
          {locale === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to Home'}
        </a>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-nile-blue text-center">
        {locale === 'ar' ? 'التحقق من البريد الإلكتروني' : 'Email Verification'}
      </h2>
      
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
        <p>
          {locale === 'ar' 
            ? 'لم يتم التحقق من بريدك الإلكتروني بعد. يرجى التحقق من بريدك الإلكتروني للعثور على رابط التحقق.' 
            : 'Your email has not been verified yet. Please check your email for the verification link.'}
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {resendSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {locale === 'ar' 
            ? 'تم إرسال بريد التحقق بنجاح. يرجى التحقق من بريدك الإلكتروني.' 
            : 'Verification email sent successfully. Please check your email.'}
        </div>
      )}
      
      <div className="text-center">
        <p className="mb-4 text-gray-600">
          {locale === 'ar' 
            ? `تم إرسال بريد التحقق إلى ${user?.email}. إذا لم تجد البريد، يرجى التحقق من مجلد البريد العشوائي أو إعادة إرسال بريد التحقق.` 
            : `A verification email has been sent to ${user?.email}. If you can't find the email, please check your spam folder or resend the verification email.`}
        </p>
        
        <button
          onClick={handleResendVerification}
          className="bg-nile-blue text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          disabled={resendLoading}
        >
          {resendLoading 
            ? (locale === 'ar' ? 'جاري الإرسال...' : 'Sending...') 
            : (locale === 'ar' ? 'إعادة إرسال بريد التحقق' : 'Resend Verification Email')}
        </button>
      </div>
      
      <div className="mt-6 text-center">
        <a 
          href={locale === 'ar' ? '/' : '/en/'} 
          className="text-nile-blue hover:underline"
        >
          {locale === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to Home'}
        </a>
      </div>
    </div>
  );
}
