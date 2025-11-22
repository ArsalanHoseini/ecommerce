// app/authentication/enter-phone/page.tsx
'use client';

import React, { Suspense, useState } from 'react';
import GlassModal from '@/components/UI/GlassModal'; 
import LoginForm from '@/components/Authentication/LoginForm';
import { useRouter } from 'next/navigation';

// این کامپوننت برای نمایش در مودال استفاده می‌شود
function AuthModalWrapper() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(true);

    // تابع برای بستن مودال و بازگشت به صفحه قبلی
    const handleCloseModal = () => {
        setIsModalOpen(false);
        // به عقب برمی‌گردیم (صفحه‌ای که کاربر از آنجا آمده)
        router.back();
    };

    if (!isModalOpen) {
        return null; 
    }

    return (
        <GlassModal onClose={handleCloseModal}>
            {/* LoginForm مدیریت کل جریان احراز هویت (ENTER_PHONE -> SIGN_IN/SIGN_UP) را بر عهده دارد */}
            <LoginForm 
                onAuthSuccess={handleCloseModal} // بستن مودال پس از ورود/ثبت نام موفق
            />
        </GlassModal>
    );
}

// برای استفاده از useSearchParams/useRouter باید Suspense را اضافه کنیم.
export default function AuthenticationPage() {
    return (
        <Suspense fallback={
            // ✅ رفع خطای 2741: اضافه کردن onClose
            <GlassModal onClose={() => { /* در حالت بارگذاری نیازی به بستن نیست */ }}>
                <div 
                    // ✅ استایل شیشه‌ای کارت برای همخوانی با مودال
                    className="p-10 rounded-[25px] border border-white/20 dark:border-white/10 
                               bg-white/10 dark:bg-[#0a0e19]/50 backdrop-blur-md text-center"
                >
                    در حال بارگذاری احراز هویت...
                </div>
            </GlassModal>
        }>
            <AuthModalWrapper />
        </Suspense>
    );
}