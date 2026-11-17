"use client";

import React, { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

// اینترفیس برای مدیریت مقادیر در سمت کلاینت
interface ValueItem {
  tempId: number; // یک شناسه موقت برای React Key
  value: string;
}

const CreateFeature = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  // گرفتن شناسه ویژگی از URL
  const featureId = params.id as string;
  // گرفتن نام ویژگی از کوئری (اختیاری، جهت نمایش به کاربر)
  const featureName = searchParams.get("title") || "ویژگی جدید";

  // استیت برای نگهداری لیست مقادیر (پیش‌فرض یک اینپوت خالی دارد)
  const [values, setValues] = useState<ValueItem[]>([
    { tempId: Date.now(), value: "" },
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- افزودن اینپوت جدید (+) ---
  const handleAddInput = () => {
    setValues([...values, { tempId: Date.now(), value: "" }]);
  };

  // --- حذف اینپوت (-) ---
  const handleRemoveInput = (tempId: number) => {
    // اگر فقط یک اینپوت مانده بود، پاکش نکن یا فقط مقدارش را خالی کن (بسته به سلیقه)
    if (values.length === 1) {
      setValues([{ tempId: Date.now(), value: "" }]);
      return;
    }
    setValues(values.filter((item) => item.tempId !== tempId));
  };

  // --- تغییر متن اینپوت ---
  const handleInputChange = (tempId: number, text: string) => {
    const newValues = values.map((item) =>
      item.tempId === tempId ? { ...item, value: text } : item
    );
    setValues(newValues);
  };

  // --- ارسال به API ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // حذف مقادیر خالی قبل از ارسال
    const cleanValues = values
      .map((v) => v.value.trim())
      .filter((v) => v !== "");

    if (cleanValues.length === 0) {
      alert("لطفاً حداقل یک مقدار وارد کنید.");
      setIsSubmitting(false);
      return;
    }

    try {
      // >>>>>>>>>>>>>>>> بخش ارتباط با NestJS API <<<<<<<<<<<<<<<<
      console.log("Feature ID:", featureId);
      console.log("Values to save:", cleanValues);

      // مثال درخواست:
      /*
      const res = await fetch(`/api/features/${featureId}/values`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: cleanValues }),
      });
      */

      // شبیه‌سازی موفقیت
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // بازگشت به لیست ویژگی‌ها بعد از ثبت موفق
      router.push("/admin/features"); 
      
    } catch (error) {
      console.error("Error saving values:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
      
      {/* --- هدر صفحه --- */}
      <div className="trezo-card-header mb-[20px] border-b border-gray-100 dark:border-[#172036] pb-[15px] flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-black dark:text-white mb-1">
            مقادیر ویژگی: <span className="text-primary-500">{featureName}</span>
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            مقادیر زیرمجموعه (مثل قرمز، آبی، سبز) را وارد کنید.
          </p>
        </div>
        
        <button 
          onClick={() => router.back()}
          className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
        >
          <i className="material-symbols-outlined">arrow_back</i>
        </button>
      </div>

      {/* --- فرم مقادیر --- */}
      <div className="trezo-card-content max-w-[600px]">
        <form onSubmit={handleSubmit}>
          
          <div className="space-y-4 mb-8">
            {values.map((item, index) => (
              <div key={item.tempId} className="flex items-center gap-3 group">
                {/* شماره ردیف */}
                <span className="text-gray-400 text-sm w-[20px] pt-1">
                  {index + 1}.
                </span>

                {/* اینپوت */}
                <div className="relative flex-grow">
                  <input
                    type="text"
                    className="h-[50px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-50 dark:bg-[#15203c] px-[15px] block w-full outline-0 transition-all placeholder:text-gray-500 focus:border-primary-500 focus:bg-white dark:focus:bg-[#0c1427]"
                    placeholder={`مقدار ${index + 1} (مثلاً: ${index === 0 ? 'قرمز' : 'آبی'})`}
                    value={item.value}
                    onChange={(e) => handleInputChange(item.tempId, e.target.value)}
                    autoFocus={index === values.length - 1 && index > 0} // فوکوس خودکار روی اینپوت جدید
                  />
                </div>

                {/* دکمه حذف (-) */}
                <button
                  type="button"
                  onClick={() => handleRemoveInput(item.tempId)}
                  className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all dark:bg-red-500/10 dark:hover:bg-red-500"
                  title="حذف این مقدار"
                >
                  <i className="material-symbols-outlined !text-[20px]">remove</i>
                </button>
              </div>
            ))}
          </div>

          {/* --- دکمه افزودن (+) --- */}
          <div className="flex justify-center mb-8">
            <button
              type="button"
              onClick={handleAddInput}
              className="flex items-center gap-2 px-6 py-2 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-all"
            >
              <i className="material-symbols-outlined">add</i>
              <span>افزودن مقدار جدید</span>
            </button>
          </div>

          {/* --- دکمه‌های ذخیره --- */}
          <div className="flex items-center gap-4 pt-5 border-t border-gray-100 dark:border-[#172036]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-[12px] px-[30px] rounded-md transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  در حال ثبت...
                </>
              ) : (
                <>
                  <i className="material-symbols-outlined">check</i>
                  ثبت نهایی ویژگی‌ها
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="bg-transparent hover:bg-gray-50 dark:hover:bg-[#15203c] text-gray-600 dark:text-gray-300 font-medium py-[12px] px-[25px] rounded-md transition-all"
            >
              انصراف
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateFeature;