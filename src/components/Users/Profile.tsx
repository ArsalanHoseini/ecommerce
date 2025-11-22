// D:/Utab/ecommerce/src/components/Users/Profile.tsx
// این فایل نمای جانبی (Sidebar) جزئیات کاربر را با آیکون‌های زیبا و اکشن‌های مدیریتی (Dropdown Menu) پیاده‌سازی می‌کند.

"use client";

import React, { useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

// --- ۱. تعاریف رابط‌ها (Interfaces) ---
interface UserDetail {
    id: string;
    name: string;
    email: string;
    role: string;
    isBlocked: boolean;
    
    profileImage?: string;
    phoneNumber?: string;
    deliveryAddress?: string;

    walletBalance?: number;
    loyaltyPoints?: number;
    userLevel?: string;
    nationalId?: string;
    gender?: 'مرد' | 'زن' | 'دیگر';
    dateOfBirth?: string;
    billingEmail?: string;
    language?: string;
    lastTransaction?: string;
}

interface ProfileProps {
    user: UserDetail;
    onDelete: (id: string) => void;
    onToggleBlock: (id: string, isBlocked: boolean) => void;
}

// --- ۲. کامپوننت آیکون SVG اینلاین (بهینه شده) ---
const IconComponent: React.FC<{ name: string, className?: string, strokeWidth?: number }> = ({ name, className = "w-5 h-5", strokeWidth = 2 }) => {
    let svgContent: React.ReactNode = null;

    // آیکون‌های Lucid/Feather
    switch (name) {
        case 'User': 
            svgContent = (<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>); break;
        case 'Lock': 
            svgContent = (<><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>); break;
        case 'Unlock': 
            svgContent = (<><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 8-4h.2M15 11V7a3 3 0 0 0-6 0v4"/></>); break;
        case 'Trash': 
            svgContent = (<><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></>); break;
        case 'Mail': 
            svgContent = (<><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.8 1.8 0 0 1-2.06 0L2 7"/></>); break;
        case 'Phone': 
            svgContent = <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.08 2h3a2 2 0 0 1 2 1.72 17.5 17.5 0 0 0 .8 4.75 2 2 0 0 1-.45 2.15L8.24 12.6c2.48 2.48 4.52 4.52 6.95 6.95l2.06-2.06a2 2 0 0 1 2.15-.45 17.5 17.5 0 0 0 4.75.8A2 2 0 0 1 22 16.92z"/>; break;
        case 'Home': 
            svgContent = (<><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>); break;
        case 'Wallet': 
            svgContent = (<><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/><path d="M16 7h4v5h-4z"/><line x1="12" y1="17" x2="12" y2="17"/></>); break;
        case 'Award': 
            svgContent = (<><circle cx="12" cy="8" r="7"/><polyline points="12 15 12 21 17 21 17 15"/><polyline points="12 15 12 21 7 21 7 15"/></>); break;
        case 'Calendar': 
            svgContent = (<><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>); break;
        case 'CreditCard': 
            svgContent = (<><rect width="22" height="16" x="1" y="4" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></>); break;
        case 'MessageCircle': 
            svgContent = (<><path d="M7.9 20.9l-2.7-2.7a2 2 0 0 1-.5-1.4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9.8a2 2 0 0 0-1.4.5z"/></>); break;
        case 'MoreVertical':
            svgContent = (<><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></>); break;
        case 'Tag': 
            svgContent = (<path d="M12.5 10.5l-8.5 8.5V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6.5z"/>); break;
        case 'Clipboard': // 🌟 اصلاح شده: استفاده از Fragment برای دو المان ریشه
            svgContent = (<>
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
            </>); 
            break;
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
            {svgContent}
        </svg>
    );
};


// --- ۳. کامپوننت Profile ---
const Profile: React.FC<ProfileProps> = ({ user, onDelete, onToggleBlock }) => {
    
    // وضعیت انتخابی منو (بیشتر برای دمو و دیباگ)
    const [selectedOption, setSelectedOption] = useState<string>("");

    // --- Action Handlers ---
    const handleBlockClick = () => {
        // تغییر وضعیت مسدودی و صدا زدن تابع والد
        onToggleBlock(user.id, user.isBlocked);
    };

    const handleDeleteClick = () => {
        // NOTE: در یک برنامه واقعی، از یک مودال تأیید به جای کنسول استفاده کنید.
        console.log(`Confirm deletion for user: ${user.name}`);
        onDelete(user.id);
    };

    const handleMenuSelect = (option: string) => {
        setSelectedOption(option);
        
        // اجرای عملیات بر اساس گزینه انتخابی
        switch (option) {
            case 'حذف کاربر':
                handleDeleteClick();
                break;
            case 'مسدود کردن کاربر':
            case 'رفع مسدودی کاربر':
                handleBlockClick();
                break;
            case 'مدیریت موجودی کیف پول':
                console.log(`Action: Redirecting to wallet management for ${user.name}`);
                // TODO: Add actual navigation logic here
                break;
            case 'ارسال تیکت جدید':
                console.log(`Action: Redirecting to new ticket creation for ${user.name}`);
                // TODO: Add actual navigation logic here
                break;
            case 'ویرایش پروفایل':
                console.log(`Action: Redirecting to profile edit page for ${user.name}`);
                // TODO: Add actual navigation logic here
                break;
            case 'مشاهده لاگ‌ها':
                console.log(`Action: Viewing logs for ${user.name}`);
                // TODO: Add actual navigation logic here
                break;
            default:
                break;
        }
    };
    
    // --- Utility Functions ---
    const formatCurrency = (value: number | undefined): string | undefined => {
        if (value === undefined || value === null) return undefined;
        // فرمت با واحد تومان و جداکننده هزارگان فارسی
        return value.toLocaleString('fa-IR') + ' تومان';
    };

    const StatusBadge: React.FC<{ isBlocked: boolean }> = ({ isBlocked }) => {
        return (
            <span className={`
                px-2 py-0.5 text-xs font-medium rounded-full shadow-sm border border-current
                ${
                    isBlocked
                        ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900'
                        : 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900'
                }
            `}>
                {isBlocked ? 'مسدود' : 'فعال'}
            </span>
        );
    };

    // کامپوننت آیتم اطلاعات با طراحی مینیمال و فشرده
    const InfoItem: React.FC<{ iconName: string, label: string, value: string | number | undefined }> = ({ iconName, label, value }) => {
        // نامشخص بودن مقدار را مدیریت کنید
        const displayValue = value === undefined || value === null || value === '' ? "نامشخص" : value;
        
        return (
            <div className="flex flex-col p-3 rounded-xl bg-gray-50 dark:bg-[#1a233b] h-full transition-all hover:shadow-lg hover:shadow-indigo-50/10 dark:hover:shadow-none hover:border-indigo-400 border border-transparent">
                <div className="flex items-center mb-1">
                    <IconComponent 
                        name={iconName} 
                        className="w-4 h-4 ltr:mr-2 rtl:ml-2 text-indigo-500 dark:text-indigo-400" 
                        strokeWidth={2}
                    />
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
                </div>
                <p className={`text-base font-bold truncate ${displayValue === 'نامشخص' ? 'text-gray-400 italic' : 'text-black dark:text-white'}`}>
                    {displayValue}
                </p>
            </div>
        );
    };

    // تعیین آواتار و فال‌بک (بهبود URL برای فال‌بک)
    const avatarSource = user.profileImage || `https://placehold.co/150x150/007bff/ffffff/png?text=${user.name.charAt(0).toUpperCase()}`;

    return (
        <div className="
            trezo-profile-card 
            bg-white dark:bg-[#0c1427] 
            p-6 rounded-2xl 
            shadow-2xl shadow-indigo-100/50 dark:shadow-none 
            border border-gray-100 dark:border-[#172036] 
            lg:sticky lg:top-6
            font-['Inter']
        ">
            
            {/* ۱. Header and Avatar - Combined with Dropdown */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200 dark:border-[#172036]">
                
                {/* User Info (Avatar, Name, Role) */}
                <div className="flex items-center">
                    <div className="relative ltr:mr-4 rtl:ml-4">
                        <img
                            className="w-16 h-16 object-cover rounded-full border-4 border-indigo-500/30 shadow-lg dark:border-indigo-800/50"
                            src={avatarSource}
                            alt={user.name}
                            onError={(e) => {
                                // فال‌بک در صورت عدم بارگذاری تصویر
                                e.currentTarget.onerror = null; 
                                e.currentTarget.src = `https://placehold.co/150x150/007bff/ffffff/png?text=${user.name.charAt(0).toUpperCase()}`;
                            }}
                        />
                        {/* Badge Positioned Cleanly */}
                        <div className="absolute ltr:-right-1 rtl:-left-1 bottom-0 translate-y-1/4">
                            <StatusBadge isBlocked={user.isBlocked} />
                        </div>
                    </div>
                    
                    <div className="flex flex-col">
                        <h3 className="text-xl font-extrabold text-black dark:text-white mb-0.5">{user.name}</h3>
                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{user.role}</p>
                    </div>
                </div>

                {/* Dropdown Menu (Headless UI) - Contains ALL Actions */}
                <Menu as="div" className="relative inline-block text-right">
                    <MenuButton className="p-2 -m-2 rounded-full text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <IconComponent name="MoreVertical" className="w-6 h-6" strokeWidth={2} />
                    </MenuButton>

                    <MenuItems
                        transition
                        className="absolute ltr:right-0 rtl:left-0 mt-2 w-64 origin-top-right divide-y divide-gray-100 dark:divide-[#172036] rounded-xl bg-white dark:bg-[#1a233b] shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 transition ease-out duration-100 transform data-[closed]:scale-95 data-[closed]:opacity-0"
                    >
                        {/* بخش اول: اقدامات عمومی */}
                        <div className="px-1 py-1">
                            {/* ویرایش پروفایل */}
                            <MenuItem>
                                {({ focus }) => (
                                    <button
                                        onClick={() => handleMenuSelect('ویرایش پروفایل')}
                                        className={`group flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                                            focus ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        <IconComponent name="User" className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                                        ویرایش پروفایل
                                    </button>
                                )}
                            </MenuItem>
                            {/* مشاهده لاگ‌ها */}
                            <MenuItem>
                                {({ focus }) => (
                                    <button
                                        onClick={() => handleMenuSelect('مشاهده لاگ‌ها')}
                                        className={`group flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                                            focus ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        <IconComponent name="Clipboard" className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                                        مشاهده لاگ‌ها
                                    </button>
                                )}
                            </MenuItem>
                        </div>

                        {/* بخش دوم: اقدامات اصلی مدیریت (Wallet, Ticket, Block) */}
                        <div className="px-1 py-1">
                            
                            {/* مدیریت موجودی کیف پول */}
                            <MenuItem>
                                {({ focus }) => (
                                    <button
                                        onClick={() => handleMenuSelect('مدیریت موجودی کیف پول')}
                                        className={`group flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                                            focus ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        <IconComponent name="Wallet" className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                                        مدیریت موجودی کیف پول
                                    </button>
                                )}
                            </MenuItem>
                            
                            {/* ارسال تیکت جدید */}
                            <MenuItem>
                                {({ focus }) => (
                                    <button
                                        onClick={() => handleMenuSelect('ارسال تیکت جدید')}
                                        className={`group flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                                            focus ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        <IconComponent name="MessageCircle" className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                                        ارسال تیکت جدید
                                    </button>
                                )}
                            </MenuItem>

                            {/* مسدود کردن/رفع مسدودی (Conditional Styles) */}
                            <MenuItem>
                                {({ focus }) => (
                                    <button
                                        onClick={() => handleMenuSelect(user.isBlocked ? 'رفع مسدودی کاربر' : 'مسدود کردن کاربر')}
                                        className={`group flex w-full items-center rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                                            user.isBlocked 
                                                ? (focus ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'text-green-600 dark:text-green-400')
                                                : (focus ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'text-amber-600 dark:text-amber-400')
                                        }`}
                                    >
                                        <IconComponent name={user.isBlocked ? 'Unlock' : 'Lock'} className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                                        {user.isBlocked ? 'رفع مسدودی کاربر' : 'مسدود کردن کاربر'}
                                    </button>
                                )}
                            </MenuItem>
                        </div>

                        {/* بخش سوم: اقدام خطر (Delete) */}
                        <div className="px-1 py-1">
                            <MenuItem>
                                {({ focus }) => (
                                    <button
                                        onClick={() => handleMenuSelect('حذف کاربر')}
                                        className={`group flex w-full items-center rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                                            focus ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 'text-red-600 dark:text-red-400'
                                        }`}
                                    >
                                        <IconComponent name="Trash" className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                                        حذف کاربر
                                    </button>
                                )}
                            </MenuItem>
                        </div>
                    </MenuItems>
                </Menu>
            </div>


            {/* ۲. Information Grids */}
            <div className="space-y-6">
                
                {/* Financial and Loyalty Block */}
                <div className="p-2">
                    <h4 className="font-bold text-lg text-indigo-700 dark:text-indigo-400 mb-4 flex items-center border-b border-indigo-100 dark:border-indigo-900/30 pb-2">
                        <IconComponent name="Wallet" className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                        مدیریت مالی و امتیازات
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoItem 
                            iconName="Wallet" 
                            label="موجودی کیف پول" 
                            value={formatCurrency(user.walletBalance)} 
                        />
                        <InfoItem 
                            iconName="Award" 
                            label="امتیازات باشگاه مشتریان" 
                            value={user.loyaltyPoints?.toLocaleString('fa-IR')}
                        />
                        <InfoItem 
                            iconName="Tag" 
                            label="سطح کاربری" 
                            value={user.userLevel}
                        /> 
                         <InfoItem 
                            iconName="CreditCard" 
                            label="آخرین تراکنش" 
                            value={user.lastTransaction}
                        />                      
                    </div>
                </div>

                {/* Contact and Identity Block */}
                <div className="p-2 pt-0">
                    <h4 className="font-bold text-lg text-gray-700 dark:text-gray-300 mb-4 flex items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                        <IconComponent name="User" className="w-5 h-5 ltr:mr-2 rtl:ml-2 text-primary-500" />
                        اطلاعات هویتی و تماس
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoItem iconName="Phone" label="شماره تماس" value={user.phoneNumber} />
                        <InfoItem iconName="CreditCard" label="کد ملی" value={user.nationalId} />
                        <InfoItem iconName="Calendar" label="تاریخ تولد" value={user.dateOfBirth} />
                        <InfoItem iconName="Tag" label="جنسیت" value={user.gender} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 pt-4">
                        <InfoItem iconName="Mail" label="ایمیل اصلی" value={user.email} />
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default Profile;