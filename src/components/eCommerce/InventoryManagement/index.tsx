'use client';

import React, { useState, useMemo, ReactNode } from 'react';

// --- تایپ‌های مورد نیاز ---

// پراپ‌های آیکون
type ChevronProps = {
  className?: string;
};

// پراپ‌های آیتم آکاردئون
type AccordionItemProps = {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onClick: () => void;
};

// نوع داده‌های متغیرها (مثال: { 'رنگ': ['قرمز'] })
type Variants = {
  [key: string]: string[];
};

// نوع داده‌های یک ترکیب (مثال: { 'رنگ': 'قرمز', 'رم': '16' })
type Combination = {
  [key: string]: string;
};

// نوع داده‌های فرم
type FormData = {
  warehouse: string;
  warranty: string;
  price: string;
  discountPrice: string;
  discountExpiry: string;
  stock: string;
  minPurchase: number;
  maxPurchase: number;
  weight: string;
  shippingTime: string;
  purchasePrice: string;
  authenticity: 'original' | 'copy';
  status: 'new' | 'used' | 'refurbished';
};

// نوع داده‌های آیتم موجودی در state - شامل فیلد جدید imageUrl
type InventoryItem = {
  variant: Combination;
  formData: FormData;
  imageUrl: string; // فیلد جدید برای آدرس تصویر
};

// --- کامپوننت‌ها و توابع ---

// ایکون Chevron (برای آکاردئون)
const ChevronDown = ({ className }: ChevronProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={`h-5 w-5 text-gray-500 transition-transform ${className || ''}`}
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

// کامپوننت آکاردئون ساده برای مدیریت فرم‌ها
const AccordionItem = ({ title, children, isOpen, onClick }: AccordionItemProps) => {
  return (
    // استایل مینیمال: حاشیه نازک و گوشه‌های گرد ملایم
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-3 transition-all duration-200">
      <button
        onClick={onClick}
        className={`w-full flex justify-between items-center p-4 transition-colors duration-200 ${
          isOpen
            ? 'bg-gray-100 dark:bg-gray-700 text-sky-700 dark:text-sky-400'
            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        <span className="font-bold text-lg">{title}</span>
        <ChevronDown className={`transform ${isOpen ? 'rotate-180 text-sky-600' : 'rotate-0'}`} />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {/* پس‌زمینه برای محتوای باز شده */}
        {isOpen && <div className="p-5 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">{children}</div>}
      </div>
    </div>
  );
};

// تابع کمکی برای ایجاد تمام ترکیبات ممکن از متغیرها
const getVariantCombinations = (variants: Variants): Combination[] => {
  const keys = Object.keys(variants);
  if (keys.length === 0) return [{}];

  const result: Combination[] = [];

  const combine = (index: number, currentCombination: Combination) => {
    if (index === keys.length) {
      result.push(currentCombination);
      return;
    }

    const currentKey = keys[index];
    const currentValues = variants[currentKey];

    for (const value of currentValues) {
      combine(index + 1, { ...currentCombination, [currentKey]: value });
    }
  };

  combine(0, {});
  return result;
};

// کامپوننت اصلی مدیریت موجودی
export default function InventoryManagement() {
  // تعریف استاتیک متغیرها با محتوای فارسی
  const staticVariants: Variants = {
    'رنگ': ['نارنجی', 'آبی'],
    'رم': ['12', '16'],
    'حافظه': ['256', '512'],
  };

  // ایجاد لیست ترکیبات
  const variantCombinations = useMemo(() => getVariantCombinations(staticVariants), []);

  // مقدار اولیه برای هر فرم
  const initialFormData: FormData = {
    warehouse: '',
    warranty: '',
    price: '',
    discountPrice: '',
    discountExpiry: '',
    stock: '',
    minPurchase: 1,
    maxPurchase: 10,
    weight: '',
    shippingTime: '',
    purchasePrice: '',
    authenticity: 'original',
    status: 'new',
  };

  // ساختار state اصلی، شامل imageUrl
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(() =>
    variantCombinations.map((variant) => ({
      variant,
      formData: { ...initialFormData },
      imageUrl: '', // مقدار اولیه برای آدرس تصویر
    }))
  );

  // state برای مدیریت باز بودن آیتم‌های آکاردئون
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  
  // هندلر برای تغییر مقادیر فرم (به جز تصویر)
  const handleFormChange = (index: number, field: keyof FormData, value: string) => {
    const updatedData = [...inventoryData];
    const formData = updatedData[index].formData;

    if (field === 'minPurchase' || field === 'maxPurchase') {
      formData[field] = parseInt(value, 10) || 0;
    } else if (field === 'authenticity') {
      formData[field] = value as 'original' | 'copy';
    } else if (field === 'status') {
      formData[field] = value as 'new' | 'used' | 'refurbished';
    } else {
      formData[field] = value;
    }

    setInventoryData(updatedData);
  };
  
  // هندلر اختصاصی برای تغییر آدرس تصویر
  const handleImageChange = (index: number, url: string) => {
    const updatedData = [...inventoryData];
    updatedData[index].imageUrl = url;
    setInventoryData(updatedData);
  };

  // هندلر برای باز و بسته کردن آکاردئون
  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  // تابع برای نمایش زیبای عنوان متغیر
  const formatVariantTitle = (variant: Combination) => {
    return Object.entries(variant)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' - ');
  };
  
  // تابع برای ذخیره نهایی
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // این قسمت صرفاً برای نمایش در کنسول است و در برنامه واقعی به API NestJS ارسال می‌شود
    console.log('داده‌های نهایی موجودی:', JSON.stringify(inventoryData, null, 2));
  };

  return (
    // پس‌زمینه بسیار روشن برای ظاهری مینیمال
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-100">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-sky-600 dark:text-sky-400 border-b pb-4 border-gray-100 dark:border-gray-800">
          مدیریت موجودی کالا
        </h1>
        
        {inventoryData.length === 0 ? (
          <p>هیچ متغیری برای ایجاد موجودی تعریف نشده است.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {inventoryData.map((item, index) => (
                <AccordionItem
                  key={index}
                  title={formatVariantTitle(item.variant)}
                  isOpen={openAccordion === index}
                  onClick={() => toggleAccordion(index)}
                >
                  {/* بخش جدید: تصویر کالا (به صورت یکپارچه در Grid) */}
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 mb-6 border-b pb-4 border-gray-100 dark:border-gray-800">
                    <label className="block text-lg font-bold mb-3 text-sky-600 dark:text-sky-400">
                      تصویر کالا
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
                      {/* ناحیه پیش‌نمایش */}
                      <div className="w-20 h-20 flex-shrink-0 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-700">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="پیش‌نمایش تصویر" className="w-full h-full object-cover" onError={(e) => {
                            // در صورت عدم بارگذاری تصویر، یک آیکون نمایش دهد
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) parent.innerHTML = '<svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
                          }}/>
                        ) : (
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 18h.01M6 6h.01"></path></svg>
                        )}
                      </div>
                      
                      {/* فیلد شبیه‌سازی آپلود */}
                      <div className="flex-grow w-full">
                        <input
                          type="text" // استفاده از ورودی متنی برای شبیه‌سازی آپلود فایل
                          value={item.imageUrl}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          placeholder="لینک مستقیم تصویر کالا را وارد کنید (شبیه‌سازی آپلود)"
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 text-gray-900 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                            این تصویر فقط برای متغیر **{formatVariantTitle(item.variant)}** اعمال می‌شود.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* گرید فرم برای سایر آیتم‌ها */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* انبار */}
                    <div className="col-span-1">
                      <label htmlFor={`warehouse-${index}`} className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                        انبار
                      </label>
                      <select
                        id={`warehouse-${index}`}
                        value={item.formData.warehouse}
                        onChange={(e) => handleFormChange(index, 'warehouse', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 text-gray-900 dark:text-white"
                      >
                        <option value="">انتخاب انبار...</option>
                        <option value="main">انبار اصلی</option>
                        <option value="secondary">انبار دوم</option>
                      </select>
                    </div>

                    {/* گارانتی */}
                    <div className="col-span-1">
                      <label htmlFor={`warranty-${index}`} className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                        نوع گارانتی
                      </label>
                      <input
                        type="text"
                        id={`warranty-${index}`}
                        value={item.formData.warranty}
                        onChange={(e) => handleFormChange(index, 'warranty', e.target.value)}
                        placeholder="مثال: ۱۸ ماهه آوات"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    {/* قیمت */}
                    <div className="col-span-1">
                      <label htmlFor={`price-${index}`} className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                        قیمت (تومان)
                      </label>
                      <input
                        type="number"
                        id={`price-${index}`}
                        value={item.formData.price}
                        onChange={(e) => handleFormChange(index, 'price', e.target.value)}
                        placeholder="0"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* قیمت بعد از تخفیف */}
                    <div className="col-span-1">
                      <label htmlFor={`discountPrice-${index}`} className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                        قیمت بعد از تخفیف (اختیاری)
                      </label>
                      <input
                        type="number"
                        id={`discountPrice-${index}`}
                        value={item.formData.discountPrice}
                        onChange={(e) => handleFormChange(index, 'discountPrice', e.target.value)}
                        placeholder="0"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* تاریخ اعتبار تخفیف */}
                    <div className="col-span-1">
                      <label htmlFor={`discountExpiry-${index}`} className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                        تاریخ اعتبار تخفیف
                      </label>
                      <input
                        type="date"
                        id={`discountExpiry-${index}`}
                        value={item.formData.discountExpiry}
                        onChange={(e) => handleFormChange(index, 'discountExpiry', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    {/* تعداد موجودی */}
                    <div className="col-span-1">
                      <label htmlFor={`stock-${index}`} className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                        تعداد موجودی
                      </label>
                      <input
                        type="number"
                        id={`stock-${index}`}
                        value={item.formData.stock}
                        onChange={(e) => handleFormChange(index, 'stock', e.target.value)}
                        placeholder="0"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* حداقل خرید */}
                    <div className="col-span-1">
                      <label htmlFor={`minPurchase-${index}`} className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                        حداقل تعداد خرید
                      </label>
                      <input
                        type="number"
                        id={`minPurchase-${index}`}
                        value={item.formData.minPurchase}
                        min="1"
                        onChange={(e) => handleFormChange(index, 'minPurchase', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    {/* حداکثر خرید */}
                    <div className="col-span-1">
                      <label htmlFor={`maxPurchase-${index}`} className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                        حداکثر تعداد خرید
                      </label>
                      <input
                        type="number"
                        id={`maxPurchase-${index}`}
                        value={item.formData.maxPurchase}
                        min="1"
                        onChange={(e) => handleFormChange(index, 'maxPurchase', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* وزن کالا (گرم) */}
                    <div className="col-span-1">
                      <label htmlFor={`weight-${index}`} className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                        وزن کالا (گرم)
                      </label>
                      <input
                        type="number"
                        id={`weight-${index}`}
                        value={item.formData.weight}
                        placeholder="مثال: 180"
                        onChange={(e) => handleFormChange(index, 'weight', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* زمان ارسال */}
                    <div className="col-span-1">
                      <label htmlFor={`shippingTime-${index}`} className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                        زمان ارسال
                      </label>
                      <input
                        type="text"
                        id={`shippingTime-${index}`}
                        value={item.formData.shippingTime}
                        placeholder="مثال: ۲ روز کاری"
                        onChange={(e) => handleFormChange(index, 'shippingTime', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* قیمت خرید */}
                    <div className="col-span-1">
                      <label htmlFor={`purchasePrice-${index}`} className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                        قیمت خرید (تومان)
                      </label>
                      <input
                        type="number"
                        id={`purchasePrice-${index}`}
                        value={item.formData.purchasePrice}
                        placeholder="0"
                        onChange={(e) => handleFormChange(index, 'purchasePrice', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    {/* اصالت کالا */}
                    <div className="col-span-1">
                      <label htmlFor={`authenticity-${index}`} className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                        اصالت کالا
                      </label>
                      <select
                        id={`authenticity-${index}`}
                        value={item.formData.authenticity}
                        onChange={(e) => handleFormChange(index, 'authenticity', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 text-gray-900 dark:text-white"
                      >
                        <option value="original">اصل (Original)</option>
                        <option value="copy">غیراصل (Copy)</option>
                      </select>
                    </div>
                    
                    {/* وضعیت کالا */}
                    <div className="col-span-1">
                      <label htmlFor={`status-${index}`} className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                        وضعیت کالا
                      </label>
                      <select
                        id={`status-${index}`}
                        value={item.formData.status}
                        onChange={(e) => handleFormChange(index, 'status', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 text-gray-900 dark:text-white"
                      >
                        <option value="new">نو (New)</option>
                        <option value="used">کارکرده (Used)</option>
                        <option value="refurbished">بازسازی شده (Refurbished)</option>
                      </select>
                    </div>

                  </div>
                </AccordionItem>
              ))}
            </div>

            {/* دکمه ذخیره نهایی */}
            <div className="mt-10 flex justify-end">
              <button
                type="submit"
                // رنگ تأکیدی آبی آسمانی و استایل تخت (Flat)
                className="px-8 py-3 bg-sky-600 text-white rounded-lg font-bold text-lg shadow-md hover:bg-sky-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sky-200 dark:focus:ring-sky-800"
              >
                ذخیره تمام تغییرات
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}