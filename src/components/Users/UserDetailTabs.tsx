// D:/Utab/ecommerce/src/components/Users/UserDetailTabs.tsx
// این فایل یک نمای جزئیات کاربری تمیز و مینیمال با پشتیبانی از Dark Mode و Modal پیاده‌سازی می‌کند.

import React, { useState, useMemo } from 'react';

// --- ۱. تعاریف رابط‌ها (Interfaces) ---

// ساختار تراکنش‌ها
interface Transaction {
    id: string;
    amount: number;
    type: 'خرید' | 'برگشت' | 'شارژ';
    date: string;
    status: 'موفق' | 'ناموفق' | 'در انتظار';
}

// ساختار سبد خرید
interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    addedDate: string;
}

// ساختار سفارشات
interface Order {
    orderId: string;
    date: string;
    totalAmount: number;
    status: 'تحویل داده شده' | 'در حال پردازش' | 'لغو شده';
    itemsCount: number;
}

// ساختار تیکت‌ها
interface Ticket {
    ticketId: string;
    subject: string;
    status: 'بسته شده' | 'در انتظار پاسخ مشتری' | 'در انتظار پاسخ کارشناس';
    lastUpdate: string;
}

// ساختار نشانی‌ها
interface Address {
    addressId: string;
    title: string;
    addressLine: string;
    city: string;
    postalCode: string;
}

// ساختار دیدگاه‌ها
interface Review {
    reviewId: string;
    productName: string;
    rating: 1 | 2 | 3 | 4 | 5;
    date: string;
    content: string;
}

// Props مورد نیاز کامپوننت جامع
interface UserDetailTabsProps {
    transactions: Transaction[];
    cartItems: CartItem[];
    orders: Order[];
    tickets: Ticket[];
    addresses: Address[];
    reviews: Review[];
    onQuantityChange: (productId: string, newQuantity: number) => void;
    onSendInvoice: () => void;
    onAddItemToCart: (item: Omit<CartItem, 'addedDate'>) => void;
}

// فهرست کامل تب‌ها
const userProfileTabs = [
    'سبد خرید',
    'تاریخچه سفارشات',
    'تاریخچه تراکنش‌ها',
    'تاریخچه تیکت‌ها',
    'نشانی‌ها',
    'تاریخچه دیدگاه‌ها'
] as const;

type TabType = typeof userProfileTabs[number];

// --- ۲. کامپوننت‌های کمکی پایه ---

// کامپوننت ساده SVG برای آیکون‌ها
const IconComponent: React.FC<{ name: string, className?: string }> = ({ name, className = "w-4 h-4" }) => {
    let svgContent: React.ReactNode;
    // آیکون‌های Lucid/Feather برای ظاهر مینیمال
    switch (name) {
        case 'ShoppingCart': svgContent = (<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />); break;
        case 'Send': svgContent = (<path d="m22 2-7 20-4-9-9-4Z" />); break;
        case 'RefreshCcw': svgContent = (<path d="M1 4v6h6M23 20v-6h-6M20.4 9a10 10 0 0 0-14-3.7l-4.7 4.7M3.6 15a10 10 0 0 0 14 3.7l4.7-4.7" />); break;
        case 'CreditCard': svgContent = (<><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></>); break;
        case 'CheckCircle': svgContent = (<><circle cx="12" cy="12" r="10" /><polyline points="16 12 10 18 8 16" /></>); break;
        case 'XCircle': svgContent = (<><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></>); break;
        case 'Clock': svgContent = (<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>); break;
        case 'MapPin': svgContent = (<path d="M12 17.5l-6-6c-3.3-3.3-3.3-8.6 0-12s8.6-3.3 12 0 3.3 8.6 0 12l-6 6zM12 11.5m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0"/>); break;
        case 'Star': svgContent = (<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />); break;
        case 'MessageSquare': svgContent = (<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>); break;
        case 'Plus': svgContent = (<><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></>); break;
        case 'X': svgContent = (<><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></>); break;
        default: svgContent = null;
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            {svgContent}
        </svg>
    );
};

// تابع برای دریافت رنگ و آیکون وضعیت (عمومی)
const getStatusInfo = (status: string) => {
    switch (status) {
        case 'موفق':
        case 'تحویل داده شده':
        case 'بسته شده':
            return { iconName: 'CheckCircle', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', ring: 'ring-green-500' };
        case 'ناموفق':
        case 'لغو شده':
            return { iconName: 'XCircle', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', ring: 'ring-red-500' };
        case 'در انتظار':
        case 'در حال پردازش':
        case 'در انتظار پاسخ مشتری':
        case 'در انتظار پاسخ کارشناس':
            return { iconName: 'Clock', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', ring: 'ring-amber-500' };
        default:
            return { iconName: 'Clock', color: 'bg-gray-100 text-gray-600 dark:bg-gray-900/40 dark:text-gray-400', ring: 'ring-gray-500' };
    }
};

// کامپوننت‌های کمکی برای جداول و استایل
const Th: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = '' }) => (
    <th className={`px-5 py-4 rtl:text-right ltr:text-left text-sm font-bold text-gray-600 uppercase tracking-wider dark:text-gray-300 ${className}`}>{children}</th>
);
const Td: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = '' }) => (
    <td className={`px-5 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 ${className}`}>{children}</td>
);
const TdStatus: React.FC<{ status: string; statusInfo: ReturnType<typeof getStatusInfo> }> = ({ status, statusInfo }) => (
    <td className="px-5 py-4 whitespace-nowrap text-sm">
        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${statusInfo.color}`}>
            <IconComponent name={statusInfo.iconName} className="w-3.5 h-3.5 ltr:mr-1.5 rtl:ml-1.5"/>
            {status}
        </span>
    </td>
);
const NoData: React.FC<{ text: string }> = ({ text }) => (
    <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 mt-6 shadow-inner">
        <IconComponent name="XCircle" className="w-8 h-8 mx-auto mb-3 text-gray-400 dark:text-gray-600"/>
        <p className='text-lg font-medium'>{text}</p>
    </div>
);


// --- ۳. کامپوننت Modal و AddProductModal ---

// محصولات تستی برای افزودن
const mockProducts = [
    { productId: 'P007', name: 'لپ‌تاپ گیمینگ قدرتمند', price: 65000000 },
    { productId: 'P008', name: 'موس بی‌سیم ارگونومیک', price: 950000 },
    { productId: 'P009', name: 'کابل شارژ فست', price: 80000 },
    { productId: 'P010', name: 'هارد اکسترنال ۱ ترابایت', price: 2800000 },
];

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-gray-900/90 backdrop-blur-sm transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-[#0c1427] rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-out"
                onClick={(e) => e.stopPropagation()} 
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="بستن"
                    >
                        <IconComponent name="X" className="w-5 h-5" />
                    </button>
                </div>
                {/* Modal Body */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: UserDetailTabsProps['onAddItemToCart'];
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [selectedProductId, setSelectedProductId] = useState(mockProducts[0].productId);
    const [quantity, setQuantity] = useState(1);

    const selectedProduct = useMemo(() => 
        mockProducts.find(p => p.productId === selectedProductId), 
        [selectedProductId]
    );

    const handleAdd = () => {
        if (selectedProduct && quantity > 0) {
            onAdd({ 
                productId: selectedProduct.productId, 
                name: selectedProduct.name, 
                price: selectedProduct.price, 
                quantity 
            });
            setQuantity(1); 
            onClose(); 
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="افزودن محصول جدید به سبد خرید"
        >
            <div className="space-y-6">
                {/* انتخاب محصول */}
                <div>
                    <label htmlFor="product-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">محصول مورد نظر:</label>
                    <div className="relative">
                        <select
                            id="product-select"
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer"
                        >
                            {mockProducts.map((p) => (
                                <option key={p.productId} value={p.productId}>
                                    {p.name} ({p.price.toLocaleString()} تومان)
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700 dark:text-gray-300 rtl:right-0 rtl:left-auto">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                {/* تعداد */}
                <div>
                    <label htmlFor="quantity-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تعداد:</label>
                    <input
                        id="quantity-input"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                </div>
                
                {/* اطلاعات محصول انتخاب شده */}
                {selectedProduct && (
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-inner">
                        <p className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-1">
                            <span>قیمت واحد:</span> 
                            <span className="font-semibold text-gray-900 dark:text-white">{selectedProduct.price.toLocaleString()} تومان</span>
                        </p>
                        <p className="flex justify-between text-lg font-bold text-indigo-600 dark:text-indigo-400 pt-2 border-t border-indigo-200 dark:border-indigo-800">
                            <span>جمع کل:</span> 
                            <span>{(selectedProduct.price * quantity).toLocaleString()} تومان</span>
                        </p>
                    </div>
                )}

                {/* دکمه افزودن */}
                <button
                    onClick={handleAdd}
                    disabled={quantity <= 0 || !selectedProduct}
                    className="w-full flex items-center justify-center space-x-2 space-x-reverse bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition duration-300 shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                    <IconComponent name="Plus" className="w-5 h-5 rtl:ml-2 ltr:mr-2"/>
                    <span>افزودن به سبد</span>
                </button>
            </div>
        </Modal>
    );
};

// --- ۴. توابع رندرینگ برای هر تب (با استایل مینیمال و زیبا) ---

const renderTransactionTable = (data: Transaction[]) => {
    // منطق نمایش جدول تراکنش‌ها
    const getTransactionTypeInfo = (type: Transaction['type']) => {
        switch (type) {
            case 'خرید': return { iconName: 'ShoppingCart', color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30' };
            case 'برگشت': return { iconName: 'RefreshCcw', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' };
            case 'شارژ': return { iconName: 'CreditCard', color: 'text-green-600 bg-green-100 dark:bg-green-900/30' };
            default: return { iconName: 'CreditCard', color: 'text-gray-600 bg-gray-100 dark:bg-gray-800' };
        }
    };
    
    if (data.length === 0) return <NoData text="هیچ تراکنشی برای نمایش وجود ندارد." />;

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <Th>شناسه</Th><Th>نوع</Th><Th className="text-left">مبلغ</Th><Th>تاریخ</Th><Th>وضعیت</Th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-[#0c1427] divide-y divide-gray-100 dark:divide-gray-800">
                    {data.map((t) => {
                        const typeInfo = getTransactionTypeInfo(t.type);
                        const statusInfo = getStatusInfo(t.status);
                        return (
                            <tr key={t.id} className="hover:bg-indigo-50/50 dark:hover:bg-gray-800/70 transition-colors">
                                <Td className="font-mono text-xs text-gray-500 dark:text-gray-400">{t.id}</Td>
                                <Td>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${typeInfo.color}`}>
                                        <IconComponent name={typeInfo.iconName} className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1"/>
                                        {t.type}
                                    </span>
                                </Td>
                                <Td className="font-bold text-gray-900 dark:text-white text-left">
                                    {t.amount.toLocaleString()} <span className="text-xs font-normal text-gray-500 dark:text-gray-400">تومان</span>
                                </Td>
                                <Td className='text-xs text-gray-500'>{t.date}</Td>
                                <TdStatus status={t.status} statusInfo={statusInfo} />
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

const renderCartTable = (
    data: CartItem[], 
    onQuantityChange: UserDetailTabsProps['onQuantityChange'], 
    onSendInvoice: UserDetailTabsProps['onSendInvoice'],
    onOpenModal: () => void 
) => {
    const subtotal = data.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div>
            {/* Header / Actions Block (Enhanced Design) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 shadow-md border border-indigo-100 dark:border-indigo-900/50 mb-6">
                <div className="flex flex-col mb-4 md:mb-0">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">جمع مبلغ سبد:</span>
                    <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                        {subtotal.toLocaleString()} 
                        <span className="text-lg font-medium text-gray-500 dark:text-gray-400 rtl:mr-1 ltr:ml-1">تومان</span>
                    </span> 
                </div>
                <div className="flex space-x-3 rtl:space-x-reverse w-full md:w-auto">
                    {/* NEW: دکمه باز کردن مودال - Primary */}
                    <button
                        onClick={onOpenModal}
                        className="flex-1 md:flex-none flex items-center justify-center space-x-2 space-x-reverse bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-5 rounded-xl transition duration-300 shadow-md shadow-indigo-500/30 text-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-[#0c1427]"
                    >
                        <IconComponent name="Plus" className="w-4 h-4 rtl:ml-2 ltr:mr-2"/>
                        <span>افزودن محصول</span>
                    </button>
                    {/* دکمه ارسال فاکتور با پیامک - Secondary (Success) */}
                    <button
                        onClick={onSendInvoice}
                        disabled={data.length === 0}
                        className="flex-1 md:flex-none flex items-center justify-center space-x-2 space-x-reverse bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-5 rounded-xl transition duration-300 shadow-md shadow-green-500/30 text-sm disabled:opacity-50 disabled:shadow-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-[#0c1427]"
                    >
                        <IconComponent name="Send" className="w-4 h-4 rtl:ml-2 ltr:mr-2"/>
                        <span>ارسال فاکتور</span>
                    </button>
                </div>
            </div>

            {data.length === 0 ? <NoData text="سبد خرید شما خالی است." /> : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <Th>نام محصول</Th>
                                <Th className="text-center">قیمت واحد</Th>
                                <Th className="text-center">تعداد</Th>
                                <Th className="text-center">جمع ردیف</Th>
                                <Th className="text-center">تاریخ افزودن</Th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-[#0c1427] divide-y divide-gray-100 dark:divide-gray-800">
                            {data.map((item) => (
                                <tr key={item.productId} className="hover:bg-indigo-50/50 dark:hover:bg-gray-800/70 transition-colors">
                                    <Td className="font-medium text-gray-900 dark:text-white max-w-xs truncate">{item.name}</Td>
                                    <Td className="text-center font-medium">{item.price.toLocaleString()} <span className="text-xs text-gray-500">تومان</span></Td>
                                    <Td className="text-center">
                                        {/* کنترل‌های افزایش/کاهش تعداد - Compact & Clear */}
                                        <div className="inline-flex items-center border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700/50">
                                            <button
                                                onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center text-lg text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-full transition"
                                                title="افزایش"
                                            >
                                                <IconComponent name="Plus" className="w-3.5 h-3.5"/>
                                            </button>
                                            <span className="font-bold text-gray-900 dark:text-white min-w-[24px] text-center text-md">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => onQuantityChange(item.productId, Math.max(1, item.quantity - 1))}
                                                disabled={item.quantity <= 1}
                                                className={`w-8 h-8 flex items-center justify-center text-lg rounded-full transition ${
                                                    item.quantity <= 1 
                                                        ? 'text-gray-400 cursor-not-allowed' 
                                                        : 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30'
                                                    }`}
                                                title="کاهش"
                                            >
                                                <span className='-mt-1'>—</span>
                                            </button>
                                        </div>
                                    </Td>
                                    <Td className="text-center font-bold text-lg text-indigo-600 dark:text-indigo-400">{(item.price * item.quantity).toLocaleString()} <span className="text-xs text-gray-500">تومان</span></Td>
                                    <Td className="text-center text-xs text-gray-500 dark:text-gray-400">{item.addedDate}</Td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const renderOrdersTable = (data: Order[]) => {
    if (data.length === 0) return <NoData text="هیچ سفارشی در تاریخچه ثبت نشده است." />;

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <Th>شناسه سفارش</Th><Th>تاریخ</Th><Th>تعداد اقلام</Th><Th className="text-left">مبلغ کل</Th><Th>وضعیت</Th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-[#0c1427] divide-y divide-gray-100 dark:divide-gray-800">
                    {data.map((order) => {
                        const statusInfo = getStatusInfo(order.status);
                        return (
                            <tr key={order.orderId} className="hover:bg-indigo-50/50 dark:hover:bg-gray-800/70 transition-colors">
                                <Td className="font-bold text-indigo-600 dark:text-indigo-400">{order.orderId}</Td>
                                <Td className='text-xs text-gray-500'>{order.date}</Td>
                                <Td className="font-semibold text-gray-900 dark:text-white">{order.itemsCount} قلم</Td>
                                <Td className="font-extrabold text-gray-900 dark:text-white text-left">{order.totalAmount.toLocaleString()} <span className="text-xs font-normal text-gray-500">تومان</span></Td>
                                <TdStatus status={order.status} statusInfo={statusInfo} />
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

const renderTicketsTable = (data: Ticket[]) => {
    if (data.length === 0) return <NoData text="هیچ تیکت فعالی در سیستم ندارید." />;

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <Th>شناسه تیکت</Th><Th>موضوع</Th><Th>آخرین به‌روزرسانی</Th><Th>وضعیت</Th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-[#0c1427] divide-y divide-gray-100 dark:divide-gray-800">
                    {data.map((ticket) => {
                        const statusInfo = getStatusInfo(ticket.status);
                        return (
                            <tr key={ticket.ticketId} className="hover:bg-indigo-50/50 dark:hover:bg-gray-800/70 transition-colors">
                                <Td className="font-medium text-indigo-600 dark:text-indigo-400">{ticket.ticketId}</Td>
                                <Td className="font-semibold text-gray-900 dark:text-white max-w-sm truncate">{ticket.subject}</Td>
                                <Td className='text-xs text-gray-500'>{ticket.lastUpdate}</Td>
                                <TdStatus status={ticket.status} statusInfo={statusInfo} />
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

const renderAddressesList = (data: Address[]) => {
    if (data.length === 0) return <NoData text="هیچ نشانی‌ای برای تحویل کالا ثبت نشده است." />;

    return (
        <div className="grid md:grid-cols-2 gap-6 mt-4">
            {data.map((address) => (
                <div 
                    key={address.addressId} 
                    className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl transition-shadow hover:shadow-2xl hover:border-indigo-400 dark:hover:border-indigo-600"
                >
                    <h4 className="flex items-center text-xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-3 border-b border-indigo-100 dark:border-indigo-900 pb-2">
                        <IconComponent name="MapPin" className="w-6 h-6 ltr:mr-2 rtl:ml-2 text-red-500" />
                        {address.title}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                        {address.addressLine}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
                        <div className='flex justify-start flex-col'>
                            <span className='text-xs font-light'>شهر:</span>
                            <span className="font-semibold text-gray-700 dark:text-gray-300 mt-1">{address.city}</span>
                        </div>
                        <div className='flex justify-end flex-col text-left rtl:text-right'>
                            <span className='text-xs font-light'>کد پستی:</span>
                            <span className="font-mono font-semibold text-gray-700 dark:text-gray-300 mt-1">{address.postalCode}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const renderReviewsList = (data: Review[]) => {
    if (data.length === 0) return <NoData text="تاکنون هیچ دیدگاهی برای محصولات ثبت نکرده‌اید." />;

    return (
        <div className="grid gap-6 mt-4">
            {data.map((review) => (
                <div 
                    key={review.reviewId} 
                    className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
                >
                    <div className="flex justify-between items-start mb-3">
                        <h5 className="text-lg font-bold text-gray-900 dark:text-white">{review.productName}</h5>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center text-sm text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <IconComponent 
                                        key={i} 
                                        name="Star" 
                                        className={`w-5 h-5 fill-current ${i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">امتیاز: {review.rating}/5</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 border-b border-dashed border-gray-100 dark:border-gray-700 pb-2">تاریخ ثبت: {review.date}</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic border-r-4 border-indigo-200 dark:border-indigo-800 pr-3">
                        {review.content}
                    </p>
                </div>
            ))}
        </div>
    );
};


// --- ۵. کامپوننت اصلی (UserDetailTabs) ---
const UserDetailTabs: React.FC<UserDetailTabsProps> = ({ 
    transactions, 
    cartItems, 
    orders, 
    tickets, 
    addresses, 
    reviews,
    onQuantityChange, 
    onSendInvoice,
    onAddItemToCart
}) => { 
    
    // مدیریت وضعیت تب فعال
    const [activeTab, setActiveTab] = useState<TabType>('سبد خرید'); 
    // مدیریت وضعیت مودال افزودن محصول
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // تابع اصلی برای رندر محتوای فعال تب
    const renderTabContent = (tab: TabType) => {
        switch (tab) {
            case 'تاریخچه تراکنش‌ها':
                return renderTransactionTable(transactions); 
            case 'سبد خرید':
                // ارسال تابع باز کردن مودال به رندر سبد خرید
                return renderCartTable(cartItems, onQuantityChange, onSendInvoice, () => setIsAddModalOpen(true));
            case 'تاریخچه سفارشات':
                return renderOrdersTable(orders);
            case 'تاریخچه تیکت‌ها':
                return renderTicketsTable(tickets);
            case 'نشانی‌ها':
                return renderAddressesList(addresses);
            case 'تاریخچه دیدگاه‌ها':
                return renderReviewsList(reviews);
            default: 
                return <NoData text="محتوایی برای این تب موجود نیست." />;
        }
    };

    return (
        <div className="w-full">
            {/* ۱. نوار تب‌های زیبا و مینیمال (Tab Navigation) */}
            <div className="mb-8 border-b border-gray-200 dark:border-gray-800">
                <nav className="-mb-px flex space-x-4 space-x-reverse overflow-x-auto p-1" aria-label="Tabs">
                    {userProfileTabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
                                whitespace-nowrap py-3 px-5 rounded-lg text-sm font-semibold transition-colors duration-200
                                ${
                                    activeTab === tab
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' // تب فعال: رنگ اصلی و سایه
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800' // تب غیر فعال
                                }
                            `}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* ۲. محتوای تب فعال */}
            <div className="py-2">
                {renderTabContent(activeTab)}
            </div>

            {/* ۳. مودال افزودن محصول */}
            <AddProductModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onAdd={onAddItemToCart} 
            />
        </div>
    );
};

export default UserDetailTabs;