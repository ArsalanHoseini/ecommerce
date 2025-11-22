// components/Authentication/EnterPhoneForm.tsx
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import api from '../../services/api'; // 1. ایمپورت سرویس API (به جای fetch)

// ✅ تعریف رابط (Interface) برای پراپرتی‌ها
interface EnterPhoneProps {
    // تابعی که پس از بررسی شماره تلفن (وجود کاربر) فراخوانی می‌شود
    onCheck: (mobile: string, userExists: boolean) => void;
    // تابعی که برای ورود سریع (مثل مهمان) یا بستن مودال فراخوانی می‌شود
    onSuccess: () => void; 
}

export default function EnterPhoneForm({ onCheck, onSuccess }: EnterPhoneProps) {
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // آدرس API برای بررسی شماره تلفن (وجود کاربر)
    const CHECK_API_URL = process.env.NEXT_PUBLIC_POST_CHECK_PHONE_NUMBER_API_URL;
    
    // تابع اصلی بررسی شماره
    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (phone.length !== 11 || !phone.startsWith('09')) {
            setError('شماره تلفن نامعتبر است. (مثال: 0912xxxxxxx)');
            setIsLoading(false);
            return;
        }

        if (!CHECK_API_URL) {
            setError('خطا: آدرس API بررسی شماره تنظیم نشده است.');
            setIsLoading(false);
            return;
        }

        try {
            console.log(`بررسی شماره: ${phone} به آدرس: ${CHECK_API_URL}`);
            
            // 2. استفاده از سرویس api.js (Axios)
            const response = await api.post(CHECK_API_URL, {
                mobile: phone,
            });
            
            // 3. اصلاح منطق پاسخ (بر اساس Postman قبلی شما)
            // Axios پاسخ خام true/false را در data قرار می‌دهد
            const userExists = response.data.toString().toLowerCase() === 'true';
            
            // 4. فراخوانی تابع والد (صحیح بود)
            onCheck(phone, userExists);

        } catch (err: any) { // 5. مدیریت خطای Axios
            setError(err.response?.data?.message || 'خطا در ارتباط با سرور رخ داد.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div 
            // استایل شیشه‌ای مات (بدون تغییر)
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
                            شماره موبایل را وارد کنید
                        </h1>
                    </div>

                    <form onSubmit={handleCheck}>
                        <div className="mb-[15px] relative">
                            <label htmlFor="phone" className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                                شماره تلفن همراه
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 text-left ltr"
                                disabled={isLoading}
                                maxLength={11}
                                placeholder="مثال: 09123456789"
                                dir="ltr"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading || phone.length !== 11}
                            className="md:text-md block w-full text-center transition-all rounded-md font-medium my-[20px] md:my-[25px] py-[12px] px-[25px] text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                        >
                            {isLoading ? 'در حال بررسی...' : 'ادامه'}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <Link 
                            href="#" 
                            onClick={(e) => { e.preventDefault(); onSuccess(); }}
                            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                            ورود به عنوان مهمان
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}