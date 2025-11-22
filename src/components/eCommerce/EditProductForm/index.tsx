/**
 * این کامپوننت فرم ایجاد محصول است.
 * - از 'use client' برای تعاملات سمت کلاینت استفاده می‌کند.
 * - ✅ ویرایشگرهای متن با کامپوننت ماژولار RichTextEditor جایگزین شده‌اند.
 */
"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

// ====================================================================
// ✅ ایمپورت RichTextEditor از مسیر کامپوننت مشترک
// ====================================================================
import dynamic from "next/dynamic";

export const RichTextEditor = dynamic(
  () => import("@/components/RichTextEditor/RichTextEditor"), // مسیر کامپوننتت
  { ssr: false } // ❌ فقط کلاینت
);

// تعریف لیست تب‌ها
const tabs = [
  "اطلاعات کلی",
  "تنظیمات سئو",
  "تصاویر و مدیا",
  "مشخصات",
  "راهنمای محصول",
  "تب‌های محتوایی",
  "مدل قیمت گذاری",
];

const PRIMARY_COLOR = "indigo";

const CreateProductForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  // حالت توضیحات محصول
  const [productDescription, setProductDescription] = useState<string>(
    '<p style="text-align: right;"><strong>اینجا ویرایشگر حرفه‌ای بلاگ شما قرار دارد.</strong></p><p style="text-align: justify;">تمام ابزارهای مورد نیاز برای نوشتن بلاگ، شامل راستچین، جاستیفای، و امکان درج تصویر فعال هستند.</p>'
  );
  // حالت محتوای تب سفارشی
  const [customTabContent, setCustomTabContent] = useState<string>(
    "<p style='text-align: right;'>محتوای تب را اینجا وارد کنید...</p>"
  );
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // ❌ تنظیمات TinyMCE و ایمپورت‌های داینامیک قبلی کاملاً حذف شدند.

  // ... (کدهای استایلی Tailwind CSS - بدون تغییر)
  const minInputStyle = `min-input h-[54px] rounded-xl text-black dark:text-gray-100 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 block w-full outline-none transition-all duration-200 shadow-sm
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  focus:border-${PRIMARY_COLOR}-500 focus:ring-2 focus:ring-${PRIMARY_COLOR}-500/50`;

  const minLabelStyle =
    "min-label mb-2 text-gray-700 dark:text-gray-200 font-bold block text-sm";

  const minSelectStyle = `min-select h-[54px] rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 block w-full outline-none cursor-pointer transition-all shadow-sm
  focus:border-${PRIMARY_COLOR}-500 focus:ring-2 focus:ring-${PRIMARY_COLOR}-500/50`;

  const minCardStyle = `min-card bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-700/50 transition-all`;

  const minButtonStyle = `min-btn font-semibold w-full inline-flex items-center justify-center transition-all duration-300 rounded-xl text-lg py-3 px-6 shadow-lg transform active:scale-[0.98]`;

  // کامپوننت اطلاعات کلی
  const GeneralInfoInputs: React.FC = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* عنوان محصول و بقیه فیلدها */}
        <div className="mb-0">
          <label className={minLabelStyle}>عنوان محصول</label>
          <input
            type="text"
            className={minInputStyle}
            placeholder="مثلاً گوگل پیکسل 7 پرو"
          />
        </div>
        <div className="mb-0">
          <label className={minLabelStyle}>عنوان محصول لاتین</label>
          <input
            type="text"
            className={minInputStyle}
            placeholder="مثلاً Google Pixel 7 Pro"
          />
        </div>
        <div className="mb-0">
          <label className={minLabelStyle}>نام برند</label>
          <select className={minSelectStyle}>
            <option value={0}>انتخاب کنید</option>
            <option value={1}>Emburo</option>
            <option value={2}>Fediz</option>
          </select>
        </div>
        <div className="mb-0">
          <label className={minLabelStyle}>دسته بندی</label>
          <select className={minSelectStyle}>
            <option value={0}>انتخاب کنید</option>
            <option value={1}>Emburo</option>
            <option value={2}>Fediz</option>
          </select>
        </div>
        <div className="mb-0">
          <label className={minLabelStyle}>برچسب‌ها</label>
          <input
            type="text"
            className={minInputStyle}
            placeholder="مثلاً Google Pixel 7 Pro"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 mt-3">
        <div className="mb-0">
          <label className={minLabelStyle}>هشتار ها و توضیحات</label>
          <input type="text" className={minInputStyle} placeholder="مثلاً " />
        </div>
      </div>

      {/* توضیحات محصول (RichTextEditor) */}
      <div className="mt-6">
        {/* ✅ استفاده از RichTextEditor جدید */}
        <RichTextEditor
          onChange={setProductDescription}
          label="توضیحات محصول"
          height={500}
        />
      </div>
    </>
  );

  // ورودی‌های "تصاویر و مدیا" (بدون تغییر)
  const ImagesAndMediaInputs: React.FC = () => (
    <div className="space-y-6">
      <h6 className="text-xl font-bold text-gray-800 dark:text-gray-100 border-b pb-3 border-gray-200 dark:border-gray-700">
        تصاویر و مدیا
      </h6>

      {/* باکس آپلود فایل مدرن */}
      <div className="mb-5 sm:mb-0">
        <label className={minLabelStyle}>بارگذاری تصاویر محصول</label>

        <div
          id="fileUploader"
          className={`p-6 border-2 border-dashed border-${PRIMARY_COLOR}-400/50 dark:border-${PRIMARY_COLOR}-500/50 rounded-xl bg-${PRIMARY_COLOR}-50/50 dark:bg-gray-700/50 hover:border-${PRIMARY_COLOR}-500 transition-all cursor-pointer`}
        >
          <div className="relative flex flex-col items-center justify-center min-h-[150px]">
            <div className="flex flex-col items-center justify-center p-4">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full text-${PRIMARY_COLOR}-500 text-3xl ltr:mr-3 rtl:ml-3 bg-white dark:bg-gray-800 shadow-md`}
              >
                <i className="ri-upload-cloud-line"></i>
              </div>
              <p className="leading-relaxed text-center text-gray-600 dark:text-gray-300 mt-3">
                <strong
                  className={`text-${PRIMARY_COLOR}-600 dark:text-${PRIMARY_COLOR}-400 hover:text-${PRIMARY_COLOR}-700 transition-colors`}
                >
                  برای آپلود کلیک کنید
                </strong>
                <br /> یا فایل‌های خود را اینجا بکشید و رها کنید.
              </p>
            </div>

            <input
              type="file"
              id="fileInput"
              multiple
              accept="image/*"
              className="absolute top-0 left-0 right-0 bottom-0 z-10 opacity-0 cursor-pointer w-full h-full"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      {/* Image Previews */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
        <h6 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">
          پیش‌نمایش ({selectedImages.length})
        </h6>
        <div className="flex flex-wrap gap-4">
          {selectedImages.map((image, index) => (
            <div
              key={index}
              className="relative w-24 h-24 overflow-hidden rounded-xl shadow-md border-2 border-gray-200 dark:border-gray-700 transform hover:scale-[1.03] transition-transform duration-200"
            >
              <Image
                src={URL.createObjectURL(image)}
                alt={`product-preview-${index}`}
                fill
                style={{ objectFit: "cover" }}
                className="transition-opacity duration-300"
              />
              <button
                type="button"
                className="absolute top-[-10px] right-[-10px] bg-red-600 text-white w-7 h-7 flex items-center justify-center rounded-full text-md font-bold opacity-95 hover:opacity-100 transition-opacity rtl:right-auto rtl:left-[-10px] z-20 border-3 border-white dark:border-gray-800 shadow-lg"
                onClick={() => handleRemoveImage(index)}
                aria-label="حذف تصویر"
              >
                &times;
              </button>
            </div>
          ))}
          {selectedImages.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic py-2 px-1">
              هنوز تصویری آپلود نشده است.
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // ورودی‌های "تنظیمات سئو"
  const SeoSettingsInputs: React.FC = () => (
    <div className="space-y-6">
      <h6 className="text-xl font-bold text-gray-800 dark:text-gray-100 border-b pb-3 border-gray-200 dark:border-gray-700">
        تنظیمات سئو
      </h6>
      {/* مثال: عنوان سئو */}
      <div>
        <label className={minLabelStyle}>عنوان سئو (SEO Title)</label>
        <input
          type="text"
          className={minInputStyle}
          placeholder="عنوان صفحه برای موتورهای جستجو (حداکثر ۶۰ کاراکتر)"
        />
      </div>
      <div>
        <label className={minLabelStyle}> کلمات کلیدی (KeyWords)</label>
        <input type="text" className={minInputStyle} placeholder="" />
      </div>
      {/* مثال: توضیحات متا */}
      <div>
        <label className={minLabelStyle}>توضیحات متا (Meta Description)</label>
        <textarea
          className={`min-input-textarea h-[120px] p-4 ${minInputStyle.replace(
            "h-[54px]",
            "h-[120px]"
          )}`}
          placeholder="خلاصه محتوای صفحه برای نمایش در نتایج جستجو (حداکثر ۱۶۰ کاراکتر)"
        ></textarea>
      </div>
    </div>
  );

  // ورودی‌های "مشخصات"
  const SpecificationsInputs: React.FC = () => (
    <div className="space-y-6">
      <h6 className="text-xl font-bold text-gray-800 dark:text-gray-100 border-b pb-3 border-gray-200 dark:border-gray-700">
        مشخصات جدول
      </h6>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={minLabelStyle}>عنوان ویژگی</label>
          <input
            type="text"
            className={minInputStyle}
            placeholder="مثلاً ابعاد"
          />
        </div>
        <div>
          <label className={minLabelStyle}>مقدار ویژگی</label>
          <input
            type="text"
            className={minInputStyle}
            placeholder="مثلاً 20 * 15"
          />
        </div>
      </div>
      <button
        type="button"
        className={`text-sm font-semibold text-${PRIMARY_COLOR}-600 dark:text-${PRIMARY_COLOR}-400 hover:text-${PRIMARY_COLOR}-500 transition-colors flex items-center`}
      >
        <i className="ri-add-circle-line ml-2 text-xl"></i> افزودن ویژگی جدید
      </button>
    </div>
  );

  // ورودی‌های "راهنمای محصول"
  const ProductGuideInputs: React.FC = () => (
    <>
      <div className="mt-6">
        {/* ✅ استفاده از RichTextEditor جدید */}
        <RichTextEditor
          onChange={setProductDescription}
          label="توضیحات محصول"
          height={500}
        />
      </div>
    </>
  );

  // ورودی‌های "تب‌های محتوایی" - با RichTextEditor سفارشی شده
  const ContentTabsInputs: React.FC = () => (
    <div className="space-y-6">
      <h6 className="text-xl font-bold text-gray-800 dark:text-gray-100 border-b pb-3 border-gray-200 dark:border-gray-700">
        تب‌های محتوایی
      </h6>

      <div
        className={`${minCardStyle
          .replace("shadow-xl", "shadow-md")
          .replace("p-6", "p-5")} !mt-4`}
      >
        <div className="flex justify-between items-center mb-4">
          <h6 className="text-lg font-bold text-gray-700 dark:text-gray-200">
            تب محتوای ۱
          </h6>
          <button
            type="button"
            className="text-red-500 hover:text-red-600 transition-colors text-xl"
            aria-label="حذف تب"
          >
            <i className="ri-delete-bin-line"></i>
          </button>
        </div>
        <div className="mb-4">
          <label className={minLabelStyle}>عنوان تب سفارشی</label>
          <input
            type="text"
            className={minInputStyle}
            placeholder="مثلاً گارانتی و خدمات پس از فروش"
          />
        </div>
        <div>
          {/* ✅ استفاده از RichTextEditor جدید با تنظیمات سفارشی */}
          <RichTextEditor onChange={setCustomTabContent} height={300} />
        </div>
      </div>

      <button
        type="button"
        className={`text-sm font-semibold text-${PRIMARY_COLOR}-600 dark:text-${PRIMARY_COLOR}-400 hover:text-${PRIMARY_COLOR}-500 transition-colors flex items-center`}
      >
        <i className="ri-add-circle-line ml-2 text-xl"></i> افزودن تب جدید
      </button>
    </div>
  );

  // ورودی‌های "مدل قیمت گذاری"
  // ورودی‌های "مدل قیمت گذاری"
  const PricingModelInputs: React.FC = () => {
    const [subTab, setSubTab] = useState<"internet" | "phone">("internet");
    const [variants, setVariants] = useState<
      { name: string; values: string[] }[]
    >([]);
    const [newVariant, setNewVariant] = useState("");
    const [hasWarranty, setHasWarranty] = useState(false);
    const [phone, setPhone] = useState("");

    // افزودن متغیر جدید
    const addVariant = () => {
      if (newVariant.trim() === "") return;
      setVariants([...variants, { name: newVariant, values: [] }]);
      setNewVariant("");
    };

    // افزودن مقدار به متغیر خاص
    const addVariantValue = (index: number, value: string) => {
      if (!value.trim()) return;
      const updated = [...variants];
      updated[index].values.push(value);
      setVariants(updated);
    };

    return (
      <div className="space-y-6">
        <h6 className="text-xl font-bold text-gray-800 dark:text-gray-100 border-b pb-3 border-gray-200 dark:border-gray-700 mb-4">
          متغیرگذاری و فروش
        </h6>

        {/* 🔹 تب داخلی */}
        <div className="flex gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
          <button
            type="button"
            onClick={() => setSubTab("internet")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              subTab === "internet"
                ? `bg-${PRIMARY_COLOR}-600 text-white`
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            متغیرگذاری
          </button>
          <button
            type="button"
            onClick={() => setSubTab("phone")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              subTab === "phone"
                ? `bg-${PRIMARY_COLOR}-600 text-white`
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            استعلام موجودی و ثبت تلفنی
          </button>
        </div>

        {/* 🔸 محتوای تب‌ها */}
        {subTab === "internet" && (
          <div className="space-y-6">
            {/* فیلد افزودن متغیر */}
            <div>
              <label className={minLabelStyle}>افزودن مدل متغیر</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  className={`${minInputStyle} flex-1`}
                  placeholder="مثلاً رنگ، سایز،..."
                  value={newVariant}
                  onChange={(e) => setNewVariant(e.target.value)}
                />
                <button
                  type="button"
                  onClick={addVariant}
                  className={`bg-${PRIMARY_COLOR}-600 text-white px-4 rounded-xl font-bold hover:bg-${PRIMARY_COLOR}-700 transition`}
                >
                  +
                </button>
              </div>
            </div>

            {/* لیست متغیرها */}
            {variants.map((variant, index) => (
              <div
                key={index}
                className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <h6 className="font-bold text-gray-800 dark:text-gray-100 mb-3">
                  {variant.name}
                </h6>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className={`${minInputStyle} flex-1`}
                    placeholder={`افزودن مقدار برای ${variant.name}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addVariantValue(
                          index,
                          (e.target as HTMLInputElement).value
                        );
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                  />
                  <button
                    type="button"
                    className={`bg-${PRIMARY_COLOR}-600 text-white px-4 rounded-xl font-bold hover:bg-${PRIMARY_COLOR}-700 transition`}
                    onClick={(e) => {
                      const input = e.currentTarget
                        .previousSibling as HTMLInputElement;
                      addVariantValue(index, input.value);
                      input.value = "";
                    }}
                  >
                    +
                  </button>
                </div>

                {variant.values.length > 0 && (
                  <ul className="flex flex-wrap gap-2 mt-3">
                    {variant.values.map((v, i) => (
                      <li
                        key={i}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-lg text-sm"
                      >
                        {v}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* رادیو باتن گارانتی */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h6 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">
                وضعیت گارانتی
              </h6>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="warranty"
                    checked={hasWarranty}
                    onChange={() => setHasWarranty(true)}
                    className={`text-${PRIMARY_COLOR}-600 focus:ring-${PRIMARY_COLOR}-500`}
                  />
                  <span className="text-gray-700 dark:text-gray-200">دارد</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="warranty"
                    checked={!hasWarranty}
                    onChange={() => setHasWarranty(false)}
                    className={`text-${PRIMARY_COLOR}-600 focus:ring-${PRIMARY_COLOR}-500`}
                  />
                  <span className="text-gray-700 dark:text-gray-200">
                    ندارد
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 🔹 تب دوم (تلفنی) */}
        {subTab === "phone" && (
          <div className="space-y-6">
            {/* همان فیلدهای بالا */}
            <div>
              <label className={minLabelStyle}>مدل‌های متغیر</label>
              <p className="text-sm text-gray-500 mb-2">
                در تب قبل مدل ها را قرار دهید
              </p>
              {variants.length === 0 && (
                <div className="text-gray-400 dark:text-gray-500 text-sm italic">
                  هنوز متغیری ثبت نشده.
                </div>
              )}
            </div>

            {/* رادیو گارانتی */}
            <div>
              <h6 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">
                گارانتی
              </h6>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="warrantyPhone"
                    checked={hasWarranty}
                    onChange={() => setHasWarranty(true)}
                    className={`text-${PRIMARY_COLOR}-600 focus:ring-${PRIMARY_COLOR}-500`}
                  />
                  <span className="text-gray-700 dark:text-gray-200">دارد</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="warrantyPhone"
                    checked={!hasWarranty}
                    onChange={() => setHasWarranty(false)}
                    className={`text-${PRIMARY_COLOR}-600 focus:ring-${PRIMARY_COLOR}-500`}
                  />
                  <span className="text-gray-700 dark:text-gray-200">
                    ندارد
                  </span>
                </label>
              </div>
            </div>

            {/* فیلد شماره تماس */}
            <div>
              <label className={minLabelStyle}>شماره تماس برای مشتری</label>
              <input
                type="tel"
                className={minInputStyle}
                placeholder="مثلاً 09123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  // کامپوننت رندر کننده محتوای تب فعال
  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case "اطلاعات کلی":
        return <GeneralInfoInputs />;
      case "تنظیمات سئو":
        return <SeoSettingsInputs />;
      case "تصاویر و مدیا":
        return <ImagesAndMediaInputs />;
      case "مشخصات":
        return <SpecificationsInputs />;
      case "راهنمای محصول":
        return <ProductGuideInputs />;
      case "تب‌های محتوایی":
        return <ContentTabsInputs />;
      case "مدل قیمت گذاری":
        return <PricingModelInputs />;
      default:
        return <GeneralInfoInputs />;
    }
  }, [activeTab]);

  return (
    <div
      className="min-form-container bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-8 font-sans transition-colors duration-300"
      dir="rtl"
    >
      <div className="mx-auto max-w-[1400px]">
        <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 md:mb-10 border-b border-gray-200 dark:border-gray-800 pb-4">
          ایجاد محصول جدید
        </h3>
        <form>
          <div className="lg:grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <div className={`${minCardStyle}`}>
                <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-5 border-b pb-3 border-gray-200 dark:border-gray-700">
                  بخش‌ها
                </h4>
                <div className="trezo-card-content">
                  <nav className="flex flex-col space-y-2" aria-label="Tabs">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`w-full text-right px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-${PRIMARY_COLOR}-100/50 dark:hover:shadow-black/20 transform hover:scale-[1.01] ${
                          activeTab === tab
                            ? `bg-${PRIMARY_COLOR}-600 text-white shadow-${PRIMARY_COLOR}-500/50`
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white"
                        }`}
                        style={{ textAlign: "right" }}
                      >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              <div className={`${minCardStyle}`}>
                <div className="trezo-card-content flex flex-col space-y-3">
                  <button
                    type="submit"
                    className={`${minButtonStyle} bg-${PRIMARY_COLOR}-600 text-white hover:bg-${PRIMARY_COLOR}-700 shadow-${PRIMARY_COLOR}-500/50 dark:shadow-${PRIMARY_COLOR}-800/50`}
                  >
                    <i className="ri-add-line ml-2 text-xl"></i>
                    ثبت تغییرات محصول
                  </button>

                  <Link
                    href="/admin/ecommerce/products-list/"
                    className="w-full"
                  >
                    <button
                      type="button"
                      className={`${minButtonStyle} bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 shadow-none`}
                    >
                      انصراف
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className={`${minCardStyle}`}>
                <div className="trezo-card-header mb-6">
                  <div className="trezo-card-title">
                    <h5 className="!mb-0 text-2xl font-extrabold text-gray-800 dark:text-gray-100">
                      {activeTab}
                    </h5>
                  </div>
                </div>

                <div className="trezo-card-content">{renderTabContent()}</div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductForm;
