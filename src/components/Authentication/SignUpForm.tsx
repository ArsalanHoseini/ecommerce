// components/Authentication/SignUpForm.tsx
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react'; 
import api from '../../services/api'; 
import Cookies from 'js-cookie'; 

interface SignUpFormProps {
    phone: string;
    onBack: () => void;
    onSuccess: () => void; // برای بستن مودال پس از ثبت نام موفق
}

export default function SignUpForm({ phone, onBack, onSuccess }: SignUpFormProps) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // ❌ حذف: نیازی به state برای step نیست، چون مستقیماً ثبت نام می‌کنیم.
    // const [step, setStep] = useState<'SEND_SMS' | 'VERIFY_AND_REGISTER'>('VERIFY_AND_REGISTER');
    
    // 🚧 حذف: فیلد smsCode را به یک متغیر خالی تبدیل می‌کنیم چون در UI استفاده نمی‌شود.
    const smsCode = ''; 

    const REGISTER_API_URL = process.env.NEXT_PUBLIC_POST_REGISTER_API_URL;

    // ❌ حذف: تابع handleSendSms حذف شد.
    
    // 5. ثبت نام نهایی و ورود خودکار
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (name.length < 2) {
             setError('لطفاً نام خود را وارد کنید.');
             setIsLoading(false);
             return;
        }

        if (password.length < 6) {
            setError('رمز عبور باید حداقل ۶ کاراکتر باشد.');
            setIsLoading(false);
            return;
        }

        if (!REGISTER_API_URL) {
            setError('خطا: آدرس API ثبت نام تنظیم نشده است.');
            setIsLoading(false);
            return;
        }

        try {
            console.log(`ثبت نام نهایی برای: ${phone}`);
            
            // 7. استفاده از api.js (Axios) با بدنه کامل
            const response = await api.post(REGISTER_API_URL, {
                mobile: phone, 
                name, 
                password, 
                // email: '' // اگر فیلد ایمیل اجباری نیست، نیازی به ارسال آن نیست
            });

            // ✅ اصلاح کلیدی: بررسی و ذخیره 'accessToken' به جای 'token'
            if (response.data && response.data.accessToken) {
                Cookies.set('access_token', response.data.accessToken, { expires: 7, secure: process.env.NODE_ENV === 'production' });
                onSuccess(); // بستن مودال و ورود خودکار
            } else {
                setError(response.data.message || 'ثبت نام موفقیت آمیز نبود.');
            }

        } catch (err: any) { 
            // مدیریت خطای Axios
            setError(err.response?.data?.message || 'خطا در ارتباط با سرور رخ داد.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderFormContent = () => {
        // چون مرحله‌بندی نداریم، مستقیماً فرم ثبت نام نهایی را برمی‌گردانیم
        return (
            <form onSubmit={handleSubmit}>
                
                {/* فیلد نام */}
                <div className="mb-[15px] relative">
                    <label htmlFor="name" className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                        نام
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                        disabled={isLoading}
                        placeholder=""
                    />
                </div>
                
                {/* فیلد رمز عبور */}
                <div className="mb-[15px] relative">
                    <label htmlFor="password" className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                        رمز عبور (حداقل 8 کاراکتر)
                    </label>
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
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {/* فیلد کد تایید پیامکی (غیرفعال) */}
                <div className="mb-[15px] relative">
                    <label htmlFor="smsCode" className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                        کد تایید پیامکی (فعلاً غیر فعال)
                    </label>
                    <input
                        type="text"
                        id="smsCode"
                        value={smsCode}
                        className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                        disabled={true} 
                        placeholder="فعلاً نیازی نیست"
                        maxLength={6}
                    />
                </div>
                
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <button
                    type="submit"
                    // اعتبارسنجی دکمه
                    disabled={isLoading || password.length < 6 || name.length < 2}
                    className="md:text-md block w-full text-center transition-all rounded-md font-medium my-[20px] md:my-[25px] py-[12px] px-[25px] text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                    {isLoading ? 'در حال ثبت نام...' : 'ثبت نام نهایی و ورود'}
                </button>
            </form>
        );
    };

    return (
        <div 
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
                        <h1 className="!font-semibold !text-[22px] md:!text-xl lg!text-2xl !mb-[5px] md:!mb-[7px]">
                            ثبت نام در سامانه
                        </h1>
                        <button 
                            type="button" 
                            onClick={onBack} 
                            className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            &larr; تغییر شماره تلفن ({phone})
                        </button>
                    </div>

                    {renderFormContent()}
                </div>
            </div>
        </div>
    );
}