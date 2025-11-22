"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- رابط‌های تعریف داده ---

interface ApiUserData {
  id: number;
  mobile: string;
  name: string;
  password?: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  statuscode: number;
  data: ApiUserData | null;
  message: string;
}

interface FormState {
  name: string;
  phone: string; // نگاشت شده به mobile در API
  role: number; // 0: user, 1: admin (برای استفاده در UI)
  password: string;
}

interface EditUserFormProps {
  userId: string | undefined; // می تواند undefined باشد
}

// --- توابع کمکی ---

/** تبدیل نقش رشته‌ای API به عدد مورد انتظار UI */
const apiRoleToFormRole = (apiRole: string): number => {
  return apiRole.toLowerCase() === "admin" ? 1 : 0;
};

/** تبدیل نقش عددی UI به رشته مورد انتظار API */
const formRoleToApiRole = (formRole: number): "admin" | "user" => {
  return formRole === 1 ? "admin" : "user";
};

// --- کامپوننت اصلی ---

const EditUserForm: React.FC<EditUserFormProps> = ({ userId }) => {
  const router = useRouter(); 
  
  // --- State های داده و فرم ---
  const [formData, setFormData] = useState<FormState>({
    name: "",
    phone: "",
    role: 0,
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  // چون منطق آپلود تصویر در EditUserForm کامل نیست و صرفاً برای استایل دهی بود، آن را نگه می‌داریم.
  const [selectedImages, setSelectedImages] = useState<File[]>([]); 

  // --- State های UX و API ---
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); 

  // --- 1. مرحله اول: دریافت اطلاعات کاربر (GET) ---

  useEffect(() => {
    console.log("دریافت اطلاعات برای User ID:", userId);

    if (!userId) {
      return;
    }

    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const getApiUrl = process.env.NEXT_PUBLIC_GET_ONE_USER_API_URL;
        if (!getApiUrl) {
          throw new Error(
            "خطا: متغیر NEXT_PUBLIC_GET_ONE_USER_API_URL تعریف نشده است."
          );
        }

        const finalUrl = getApiUrl.replace("{id}", userId);
        const response = await fetch(finalUrl);

        if (!response.ok) {
          throw new Error(`خطا در ارتباط با سرور: کد ${response.status}`);
        }

        const result: ApiResponse = await response.json();
        if (result.statuscode !== 200 || !result.data) {
          throw new Error(
            result.message || `خطا در دریافت اطلاعات کاربر با شناسه ${userId}`
          );
        }
        const data: ApiUserData = result.data; // پر کردن فیلدهای فرم با داده‌های دریافتی (GET)
        setFormData({
          name: data.name || "",
          phone: data.mobile || "", // mobile از API به phone در فرم
          role: apiRoleToFormRole(data.role),
          password: "",
        });
      } catch (err: any) {
        setError(`خطا در بارگیری: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]); 

  // --- مدیریت تغییرات ورودی‌ها ---

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(
      (prev) =>
        ({
          ...prev,
          [name]: name === "role" ? Number(value) : value,
        } as FormState)
    ); 
    setError(null);
    setSuccess(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  }; 

  // --- 2. مرحله دوم: ارسال اطلاعات ویرایش شده (PUT) ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const dataToSend = {
      name: formData.name,
      mobile: formData.phone,
      role: formRoleToApiRole(formData.role),
      ...(formData.password && { password: formData.password }),
    };
    try {
      const putApiUrl = process.env.NEXT_PUBLIC_PUT_UPDATE_USER_API_URL;
      if (!putApiUrl)
        throw new Error(
          "خطا: آدرس NEXT_PUBLIC_PUT_UPDATE_USER_API_URL تعریف نشده است."
        );
      if (!userId)
        throw new Error("خطا: شناسه کاربر برای به‌روزرسانی نامشخص است.");

      const finalUrl = putApiUrl.replace("{id}", userId!);
      const response = await fetch(finalUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend), // ارسال JSON در Body
      });

      const result: ApiResponse = await response.json();

      // 1. اگر پاسخ HTTP موفقیت‌آمیز نباشد
      if (!response.ok) {
        throw new Error(
          result.message || `خطا در ارتباط با سرور: کد ${response.status}`
        );
      } 
      // 2. اگر پاسخ HTTP موفقیت‌آمیز است اما statuscode داخلی API غیر 200 است

      if (result.statuscode !== 200) {
        throw new Error(result.message || "خطا در به‌روزرسانی اطلاعات کاربر.");
      } 
      
      // ✅ موفقیت
      const successMessage =
        result.message && result.message.length > 0
          ? result.message
          : "کاربر با موفقیت ویرایش و ذخیره شد.";

      setSuccess(successMessage + " (در حال هدایت به لیست...)"); 
      
      // ✅ هدایت به مسیر مورد نظر پس از 1.5 ثانیه
      setTimeout(() => {
        router.push("/admin/users/users-list");
      }, 1500);
    } catch (apiError: any) {
      // در صورت بروز هر خطایی (شبکه یا API)
      setError(`خطا در ذخیره سازی: ${apiError.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }; 

  // --- رندرینگ بر اساس وضعیت --- //

  // حالت انتظار برای userId
  if (isLoading && !userId) {
    return (
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md text-center">
        <p className="text-gray-500 flex items-center justify-center gap-2">
          <i className="material-symbols-outlined animate-spin">
            progress_activity
          </i>
          در حال انتظار برای بارگذاری شناسه کاربر از مسیر...           
        </p>
      </div>
    );
  } 

  // حالت بارگیری (پس از دریافت userId)
  if (isLoading) {
    return (
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md text-center">
        <p className="text-black dark:text-white flex items-center justify-center gap-2">
          <i className="material-symbols-outlined animate-spin">
            progress_activity
          </i>
          در حال بارگیری اطلاعات کاربر...           
        </p>
      </div>
    );
  } 

  // حالت خطای اولیه (دریافت داده) - از استایل 'danger' استفاده می‌شود.
  // این شرط، خطای در حین ارسال را پوشش نمی‌دهد، بلکه خطای اولیه بارگیری را نشان می‌دهد.
  if (error && !isSubmitting && !success) {
    return (
      <div className="bg-danger-100 border border-danger-400 text-danger-700 px-4 py-3 rounded relative mb-4">
        <strong className="font-bold"> بارگیری: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* بخش نمایش پیام موفقیت (در حین ارسال) */}
      {success && (
        <div className="bg-success-100 border border-success-400 text-success-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">موفقیت: </strong>
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      
      {/* بخش نمایش پیام خطا (در حین ارسال) - فقط خطاهای ارسالی را نمایش می‌دهد */}
      {error && isSubmitting && (
        <div className="bg-danger-100 border border-danger-400 text-danger-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">خطا در ارسال: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="xl:grid xl:grid-cols-5 2xl:grid-cols-3 gap-[25px]">
        {/* ستون اصلی فرم (نام، رمز، آیدی، موبایل) */}
        <div className="xl:col-span-3 2xl:col-span-2">
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-content">
              <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
                {/* نام کاربری (name) */}
                <div className="mb-[20px] sm:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    نام کاربری
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="نام کاربری را وارد کنید"
                    className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] 
                    bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 
                    dark:placeholder:text-gray-400 focus:border-primary-500"
                  />
                </div>
                
                {/* رمز عبور (password) */}
                <div className="mb-[20px] sm:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    رمز عبور (جدید)
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="برای تغییر، رمز عبور جدید را وارد کنید"
                    className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] 
                    bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 
                    dark:placeholder:text-gray-400 focus:border-primary-500"
                  />
                  <div className="flex items-center mt-2">
                    <input
                      id="showPassword"
                      type="checkbox"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                      className="w-4 h-4 accent-primary-500 cursor-pointer"
                    />
                    <label
                      htmlFor="showPassword"
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      نمایش رمز عبور
                    </label>
                  </div>
                </div>
                
                {/* شناسه (ID) - غیرقابل ویرایش */}
                <div className="mb-[20px] sm:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    شناسه کاربر (ID)
                  </label>
                  <input
                    readOnly
                    type="text"
                    name="id"
                    value={userId || "در حال دریافت..."}
                    placeholder="شناسه کاربر"
                    className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] 
                    bg-gray-100 dark:bg-[#172036] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 
                    dark:placeholder:text-gray-400 cursor-not-allowed"
                  />
                </div>
                
                {/* شماره تلفن (phone) */}
                <div className="mb-[20px] sm:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    شماره تلفن (mobile)
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(09123456789) شماره تلفن کاربر را وارد کنید"
                    className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036]
                    bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500
                    dark:placeholder:text-gray-400 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ستون کناری (سطح دسترسی و آواتار) */}
        <div className="xl:col-span-2 2xl:col-span-1">
          {/* بخش سطح دسترسی */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">سطح دسترسی کاربر</h5>
              </div>
            </div>
            <div className="trezo-card-content">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] 
                bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500"
              >
                <option value={0}>مشتری (user)</option>
                <option value={1}>مدیر (admin)</option>
                <option value={2} disabled>
                  پشتیبان (غیرفعال)
                </option>
                <option value={3} disabled>
                  کارشناس محتوا (غیرفعال)
                </option>
                <option value={4} disabled>
                  کاربر ویژه (غیرفعال)
                </option>
                <option value={5} disabled>
                  توسعه‌دهنده (غیرفعال)
                </option>
              </select>
            </div>
          </div>
          
          {/* بخش آپلود آواتار */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px]">
              <h5 className="!mb-0">آواتار کاربر</h5>
            </div>
            <div className="trezo-card-content">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100"
              />
              {selectedImages.length > 0 && (
                <div className="mt-4 p-3 border border-gray-200 dark:border-[#172036] rounded-md">
                  <p className="text-xs text-black dark:text-white mb-2">
                    فایل‌های انتخابی ({selectedImages.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="relative inline-block">
                        <span className="text-xs p-1 bg-gray-200 dark:bg-gray-700 rounded-md">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-[-8px] right-[-8px] bg-danger-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center leading-none"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                برای آپلود آواتار جدید، فایل را انتخاب کنید.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* بخش دکمه‌ها */}
      <div className="trezo-card mb-[25px] p-[20px] md:p-[25px] rounded-md bg-white dark:bg-[#0c1427]">
        <div className="trezo-card-content">
          <Link href="/admin/users/users-list">
            <button
              type="button"
              className="font-medium inline-block transition-all rounded-md md:text-md ltr:mr-[15px] 
              rtl:ml-[15px] py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500
              text-white hover:bg-danger-400"
            >
              انصراف
            </button>
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] 
            ${
              isSubmitting
                ? "bg-primary-300 cursor-not-allowed"
                : "bg-primary-500 hover:bg-primary-400"
            } text-white`}
          >
            <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
              <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                {isSubmitting ? "hourglass_empty" : "save"}
              </i>
              {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditUserForm;