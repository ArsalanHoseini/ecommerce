'use client';

import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation'; // در محیط Canvas خطای 'Could not resolve' می‌دهد.
import { Lock, Smartphone, ArrowRight, RefreshCcw, CheckCircle } from 'lucide-react'; 

// Mock useRouter for Canvas Environment
// برای حل خطای 'Could not resolve "next/navigation"' در محیط Canvas، از یک شبیه‌ساز ساده استفاده می‌شود.
const useRouter = () => ({
  replace: (path: string) => {
    console.log(`[MOCK] Redirecting to: ${path}`);
    // در محیط واقعی Next.js، این خط توسط ایمپورت بالا جایگزین می‌شود.
    // اگر نیاز به ریدایرکت واقعی بود، می‌توان از window.location.replace(path) استفاده کرد.
  },
});

const StaffLogIn = () => {
  // استفاده از Mocked useRouter
  const router = useRouter(); 
  
  // State های کلی
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State های نمایش توکن و موفقیت
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [displayToken, setDisplayToken] = useState('');

  // State های فرم
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  // State های مربوط به OTP
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [timer, setTimer] = useState(0);

  // چک کردن کوکی در هنگام لود
  useEffect(() => {
    const token = getCookie('staff_auth');
    if (token) {
      // استفاده از router.replace برای جلوگیری از بازگشت به صفحه لاگین
      router.replace('/'); 
    }
  }, [router]);

  // مدیریت تایمر معکوس
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // هندل کردن لاگین با رمز عبور
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // آدرس لاگین با رمز عبور را از متغیر محیطی قدیمی یا پیش فرض (auth/login) استفاده می کنیم
    const loginUrl = process.env.NEXT_PUBLIC_POST_STAFF_LOGIN_API_URL;
    if (!loginUrl) {
      setError('خطای پیکربندی: آدرس API لاگین یافت نشد.');
      setLoading(false);
      return;
    }

    try {
      // شبیه‌سازی فراخوانی API
      const res = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password }),
      });

      if (!res.ok) {
        // خواندن پیام خطا از بدنه پاسخ API
        const errorBody = await res.json();
        throw new Error(errorBody.message || 'خطا در ورود به سیستم');
      }

      const data = await res.json();
      handleSuccessLogin(data);
    } catch (err: any) {
      setError(err.message || 'خطا در برقراری ارتباط');
    } finally {
      setLoading(false);
    }
  };

  // مرحله 1: درخواست کد OTP
  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    // اعتبارسنجی ساده شماره موبایل
    if (mobile.length !== 11 || !mobile.startsWith('09')) {
        setError('لطفا شماره موبایل معتبر (۱۱ رقم) وارد کنید');
        return;
    }
    setLoading(true);
    setError('');
    
    // استفاده از متغیر محیطی جدید برای ارسال کد پیامکی
    const sendOtpUrl = process.env.NEXT_PUBLIC_POST_SEND_SMS_LOGIN_API_URL;
    if (!sendOtpUrl) {
      setError('خطای پیکربندی: آدرس API ارسال کد پیامکی یافت نشد.');
      setLoading(false);
      return;
    }

    try {
      // درخواست به بک‌اند NestJS برای ارسال کد. Payload: { mobile: string }
      const res = await fetch(sendOtpUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });

      if (!res.ok) {
        // خواندن پیام خطا از بدنه پاسخ API
        const errorBody = await res.json();
        
        // ** منطق اضافه شده برای نمایش خطای عدم وجود کاربر **
        // فرض می‌کنیم NestJS در صورت عدم وجود کاربر، یک کد خطای 4xx یا پیام خاصی برمی‌گرداند.
        // پیام خطا (message) مستقیماً به کاربر نمایش داده می‌شود.
        throw new Error(errorBody.message || 'خطا در ارسال کد تایید');
      }

      setOtpStep('verify');
      setTimer(120); // 2 دقیقه زمان
      setError(''); // پاک کردن ارور در صورت موفقیت
    } catch (err: any) {
      setError(err.message || 'مشکلی در ارسال کد پیش آمده است');
    } finally {
      setLoading(false);
    }
  };

  // مرحله 2: تایید کد OTP
  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // استفاده از متغیر محیطی جدید برای تایید کد پیامکی
    const checkOtpUrl = process.env.NEXT_PUBLIC_POST_CHECK_SMS_CODE_LOGIN_API_URL;
    if (!checkOtpUrl) {
      setError('خطای پیکربندی: آدرس API تایید کد پیامکی یافت نشد.');
      setLoading(false);
      return;
    }

    try {
      // درخواست به بک‌اند NestJS برای تایید کد. 
      // Payload: { mobile: string, otpcod: string } (مطابق با درخواست کاربر)
      const res = await fetch(checkOtpUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otpcode: otpCode }), // استفاده از otpcod
      });

      if (!res.ok) {
        // خواندن پیام خطا از بدنه پاسخ API
        const errorBody = await res.json();
        throw new Error(errorBody.message || 'خطا در تایید کد');
      }

      const data = await res.json();
      handleSuccessLogin(data);
    } catch (err: any) {
      setError(err.message || 'خطا در تایید کد');
    } finally {
      setLoading(false);
    }
  };

  // تابع مشترک برای ذخیره کوکی، نمایش توکن و ریدارکت
  const handleSuccessLogin = (data: any) => {
    // فرض: data شامل توکن (accessToken) و اطلاعات کاربر است
    const token = data.accessToken || JSON.stringify(data); // فرض بر این است که توکن در accessToken است

    // 1. ذخیره توکن در کوکی (کل داده‌های لاگین)
    setCookie('staff_auth', JSON.stringify(data), 7);
    
    // 2. نمایش توکن و پیام موفقیت
    setDisplayToken(token);
    setLoginSuccess(true);
    setError('');

    // 3. تاخیر در هدایت برای نمایش پیام موفقیت (3 ثانیه)
    setTimeout(() => {
        router.replace('/'); 
    }, 3000); 
  };

  // توابع کوکی (Helper) - برای ذخیره سازی ساده احراز هویت
  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  };

  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  };

  // فرمت کردن زمان تایمر (02:00)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] text-gray-800 p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-[400px] overflow-hidden transition-all duration-300">
        
        {/* Header Section */}
        <div className="pt-8 pb-6 px-8 text-center bg-white">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">خوش آمدید</h2>
          <p className="text-gray-500 text-sm">لطفا برای ورود به پنل رستوران اقدام کنید</p>
        </div>

        {/* Content - Conditional based on login success */}
        {loginSuccess ? (
             <div className="px-8 pb-8 pt-4 animate-fadeIn">
                <div className="text-center bg-green-50 p-6 rounded-2xl border border-green-100 mb-6">
                    <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-800 mb-1">ورود موفقیت‌آمیز!</h3>
                    <p className="text-green-700 text-sm">در حال انتقال به پنل مدیریت...</p>
                </div>
                
                {/* Token Display Area */}
                <div className="bg-gray-100 p-4 rounded-xl break-all text-xs text-left dir-ltr shadow-inner">
                    <p className="font-semibold text-gray-700 mb-1">Access Token (برای دیباگ):</p>
                    <p className="text-gray-800 font-mono text-[10px] sm:text-xs">
                        {displayToken}
                    </p>
                </div>

                <button
                    onClick={() => router.replace('/')}
                    className="w-full py-3 mt-6 rounded-xl bg-black text-white font-bold text-sm hover:bg-gray-800 transition-all active:scale-95"
                >
                    انتقال فوری به پنل
                </button>
            </div>
        ) : (
          <>
            {/* Tabs Switcher */}
            <div className="px-8 mb-6">
              <div className="flex p-1 bg-gray-100 rounded-xl relative">
                <button
                  onClick={() => { setLoginMethod('password'); setError(''); setOtpStep('request'); }}
                  className={`flex-1 flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-all z-10 ${
                    loginMethod === 'password' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Lock size={16} className="ml-2" />
                  رمز عبور
                </button>
                <button
                  onClick={() => { setLoginMethod('otp'); setError(''); setPassword(''); }}
                  className={`flex-1 flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-all z-10 ${
                    loginMethod === 'otp' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Smartphone size={16} className="ml-2" />
                  کد پیامکی
                </button>
              </div>
            </div>

            {/* Forms Container */}
            <div className="px-8 pb-8">
              
              {/* LOGIN WITH PASSWORD */}
              {loginMethod === 'password' && (
                <form onSubmit={handlePasswordLogin} className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 mr-1">شماره موبایل</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-left dir-ltr placeholder:text-right"
                      placeholder="0912..."
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                      required
                      maxLength={11}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 mr-1">رمز عبور</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-left dir-ltr placeholder:text-right"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium text-center">{error}</div>}

                  <button
                    type="submit"
                    disabled={loading || mobile.length !== 11 || password.length < 6}
                    className="w-full py-4 rounded-xl bg-black text-white font-bold text-sm hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? <RefreshCcw className="animate-spin mr-2" size={18} /> : 'ورود به حساب'}
                  </button>
                </form>
              )}

              {/* LOGIN WITH OTP */}
              {loginMethod === 'otp' && (
                <div className="animate-fadeIn">
                  {otpStep === 'request' ? (
                    // --- مرحله درخواست کد ---
                    <form onSubmit={requestOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 mr-1">شماره موبایل</label>
                        <input
                          type="tel"
                          className="w-full px-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-left dir-ltr placeholder:text-right"
                          placeholder="0912..."
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                          autoFocus
                          required
                          maxLength={11}
                          disabled={loading}
                        />
                      </div>
                      
                      {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium text-center">{error}</div>}

                      <button
                        type="submit"
                        disabled={loading || mobile.length !== 11}
                        className="w-full py-4 rounded-xl bg-black text-white font-bold text-sm hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
                      >
                         {loading ? 'در حال ارسال...' : 'دریافت کد تایید'}
                         {!loading && <ArrowRight size={16} className="mr-2 rotate-180" />}
                      </button>
                    </form>
                  ) : (
                    // --- مرحله تایید کد ---
                    <form onSubmit={verifyOtp} className="space-y-4">
                      <div className="text-center mb-4">
                        <p className="text-sm text-gray-500 mb-1">کد ارسال شده به {mobile} را وارد کنید</p>
                        <button 
                            type="button" 
                            onClick={() => { setOtpStep('request'); setTimer(0); setError(''); }} 
                            className="text-xs text-blue-600 font-medium hover:underline"
                        >
                            ویرایش شماره
                        </button>
                      </div>

                      <input
                        type="text"
                        maxLength={6} // طول کد 6 رقم است
                        className="w-full px-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-center text-2xl tracking-[0.5em] font-mono"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="— — — — — —" // Placeholder برای 6 رقم تنظیم شد
                        autoFocus
                        required
                        disabled={loading}
                      />

                      <div className="flex justify-between items-center text-xs">
                        {timer > 0 ? (
                            <span className="text-gray-400 font-mono">{formatTime(timer)} تا ارسال مجدد</span>
                        ) : (
                            <button 
                                type="button" 
                                onClick={requestOtp}
                                disabled={loading}
                                className="text-black font-semibold hover:underline flex items-center disabled:text-gray-400"
                            >
                                <RefreshCcw size={12} className="ml-1" />
                                ارسال مجدد کد
                            </button>
                        )}
                        {/* Placeholder برای فضا */}
                        <span className="text-gray-400"></span> 
                      </div>

                      {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium text-center">{error}</div>}

                      <button
                        type="submit"
                        disabled={loading || otpCode.length < 6} // شرط غیرفعال بودن دکمه برای 6 رقم تنظیم شد
                        className="w-full py-4 rounded-xl bg-black text-white font-bold text-sm hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
                      >
                         {loading ? 'در حال بررسی...' : 'تایید و ورود'}
                         {!loading && <CheckCircle size={16} className="mr-2" />}
                      </button>
                    </form>
                  )}
                </div>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default StaffLogIn;