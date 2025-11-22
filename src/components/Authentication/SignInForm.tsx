'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react'; 
import Cookies from 'js-cookie'; 
import api from '../../services/api'; // ✅ ایمپورت سرویس Axios

interface SignInFormProps {
    phone: string; 
    onBack: () => void; 
    onSuccess: () => void; 
}

type AuthMethod = 'PASSWORD' | 'SMS_OTP';

export default function SignInForm({ phone, onBack, onSuccess }: SignInFormProps) {
    const [authMethod, setAuthMethod] = useState<AuthMethod>('PASSWORD');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // 1. ورود با رمز عبور 
    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        const API_URL = process.env.NEXT_PUBLIC_POST_LOGIN_API_URL;

        if (!API_URL) {
            setError('خطا: آدرس API ورود تنظیم نشده است.');
            setIsLoading(false);
            return;
        }

        try {
            console.log(`ورود با رمز عبور برای: ${phone} به آدرس: ${API_URL}`);
            
            // استفاده از api.post
            const response = await api.post(API_URL, { 
                mobile: phone, 
                password: password 
            });
            
            const data = response.data;

            // ✅ بررسی: کلید accessToken را چک می‌کنیم
            if (data && data.accessToken) {
                // ✅ ذخیره: مقدار accessToken را در access_token کوکی ذخیره می‌کنیم
                Cookies.set('access_token', data.accessToken, { 
                    expires: 7, 
                    secure: process.env.NODE_ENV === 'production' 
                });
                
                onSuccess();
            } else {
                setError(data.message || 'نام کاربری یا رمز عبور اشتباه است.');
            }

        } catch (err: any) { 
            // مدیریت خطای Axios
            setError(err.response?.data?.message || 'خطا در ارتباط با سرور رخ داد.');
        } finally {
            setIsLoading(false);
        }
    };
    
    // رندر محتوای فرم بر اساس روش انتخاب شده
    const renderAuthForm = () => {
        if (authMethod === 'PASSWORD') {
            return (
                <form onSubmit={handlePasswordLogin}>
                    <div className="mb-[15px] relative">
                        <label htmlFor="password" className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                            رمز عبور
                        </label>
                            {/* فیلد پسورد و دکمه نمایش/پنهان‌سازی */}
                        <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'} 
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                                disabled={isLoading}
                              />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    aria-label={showPassword ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                        </div>
                    </div>
                    
                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                    
                    <button
                        type="submit"
                        disabled={isLoading || password.length < 6}
                        className="md:text-md block w-full text-center transition-all rounded-md font-medium my-[20px] md:my-[25px] py-[12px] px-[25px] text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                        {isLoading ? 'در حال ورود...' : 'ورود با رمز عبور'}
                    </button>
                </form>
            );
        } else { // SMS_OTP
            // نمایش پیام غیر فعال بودن پیامکی
            return (
                <div className="py-6 px-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-300 dark:border-yellow-700 rounded-md text-center">
                    <p className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                        🚧 ورود با پیامک موقتاً غیر فعال است.
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                        لطفاً از روش **ورود با رمز عبور** استفاده کنید.
                    </p>
                    
                    <button
                        type="button"
                        onClick={() => { setAuthMethod('PASSWORD'); setError(''); }}
                        className="mt-4 text-sm text-primary-500 hover:text-primary-400 font-medium transition-colors"
                    >
                        بازگشت به ورود با رمز عبور
                    </button>
                </div>
            );
        }
    }


    return (
        <div 
            // استایل شیشه‌ای مات بر روی خود کارت
            className="p-6 md:p-10 rounded-[25px] border border-white/20 dark:border-white/10 shadow-xl
                       bg-white/10 dark:bg-[#0a0e19]/50 backdrop-blur-md" 
        >
            <div className="grid grid-cols-1 gap-[25px] items-center">
                <div className="col-span-1">
                    <Image
                        src="/images/Utab-fainally.png"
                        alt="logo"
                        className="inline-block dark:hidden"
                        width={142}
                        height={38}
                    />
                    <Image
                        src="/images/Utab-OFOGHI.png"
                        alt="logo"
                        className="hidden dark:inline-block"
                        width={142}
                        height={38}
                    />

                    <div className="my-[17px] md:my-[25px]">
                        <h1 className="!font-semibold !text-[22px] md:!text-xl lg:!text-2xl !mb-[5px] md:!mb-[7px]">
                            ورود به حساب کاربری
                        </h1>
                        
                        <button 
                            type="button" 
                            onClick={onBack} 
                            className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            &larr; تغییر شماره تلفن ({phone})
                        </button>
                    </div>
                    
                    {/* دکمه‌های سوئیچ بین روش‌ها */}
                    <div className="flex justify-start gap-4 mb-5">
                        <button
                            type="button"
                            onClick={() => { setAuthMethod('PASSWORD'); setError(''); }}
                            className={`text-sm py-1 px-3 rounded-full transition-all ${
                                authMethod === 'PASSWORD' 
                                ? 'bg-primary-500 text-white' 
                                : 'bg-gray-200 dark:bg-[#172036] text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#2a344a]'
                            }`}
                        >
                            ورود با رمز عبور
                        </button>
                           <button
                            type="button"
                            onClick={() => { setAuthMethod('SMS_OTP'); setError(''); }}
                             className={`text-sm py-1 px-3 rounded-full transition-all ${
                                authMethod === 'SMS_OTP' 
                                ? 'bg-primary-500 text-white' 
                                : 'bg-gray-200 dark:bg-[#172036] text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#2a344a]'
                            }`}
                        >
                            ورود با پیامک
                        </button>
                    </div>

                    {renderAuthForm()}
                    
                    {authMethod === 'PASSWORD' && (
                        <div className="text-center mt-4">
                            <Link 
                                href="/authentication/forgot-password" 
                                onClick={onSuccess} 
                                className="text-sm text-primary-500 hover:text-primary-400 transition-colors"
                            >
                                رمز عبور خود را فراموش کرده‌اید؟
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}