"use client";

import Link from "next/link";
import { useState } from "react";

// 1. آدرس API
const API_URL =
  process.env.NEXT_PUBLIC_POST_CREATE_USERS_API_URL ||
  "https://api.utab.site/users";

// 2. تعریف رابط (Interface) برای داده‌های فرم
interface UserData {
  name: string;
  password: string;
  mobile: string;
  role: string;
}

const AddUserForm: React.FC = () => {
  // 3. استیت برای داده‌های فرم
  const [formData, setFormData] = useState<UserData>({
    name: "",
    password: "",
    mobile: "",
    role: "user"
  });

  // 4. استیت‌های مربوط به وضعیت ارسال
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 5. استیت برای نمایش/مخفی کردن رمز عبور
  const [showPassword, setShowPassword] = useState(false);

  // 7. هندلر عمومی برای تغییر ورودی‌ها
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "role") {
      const roleValue = value === "admin" ? "admin" : "user";
      setFormData((prev) => ({ ...prev, role: roleValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 8. تابع اصلی ارسال فرم به API
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const payload = {
      name: formData.name,
      password: formData.password,
      mobile: formData.mobile,
      role: formData.role
    };

    // 🚀 کنسول لاگ برای دیباگ کردن JSON ارسالی
    console.log("Payload ارسالی به API:", payload);

    if (!payload.name || !payload.password || !payload.mobile) {
      setError("لطفاً فیلدهای نام، رمز عبور و شماره تلفن را پر کنید.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // مدیریت خطای هوشمند
        const contentType = response.headers.get("content-type");
        let errorMessage;

        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage =
            errorData.message || JSON.stringify(errorData.message || errorData);
        } else {
          const errorText = await response.text();
          errorMessage = `سرور یک پاسخ غیر JSON بازگرداند (وضعیت: ${
            response.status
          }). پاسخ اولیه: ${errorText.substring(0, 150)}...`;
        }
        throw new Error(errorMessage);
      }

      // موفقیت‌آمیز
      const result = await response.json();
      setSuccess("کاربر با موفقیت افزوده شد! 🥳");
      console.log("Success:", result);

      // ریست کردن فرم
      setFormData({
        name: "",
        password: "",
        mobile: "",
        role: ""
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("خطای ناشناخته‌ای رخ داده است.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... (بخش نمایش خطا و موفقیت ) ... */}
      {success && (
        <div className="bg-success-100 border border-success-400 text-success-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">موفقیت: </strong>
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      {error && (
        <div className="bg-danger-100 border border-danger-400 text-danger-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">خطا: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="xl:grid xl:grid-cols-5 2xl:grid-cols-3 gap-[25px]">
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
                    رمز عبور
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="رمز عبور را وارد کنید"
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
                {/* ایمیل  */}
                <div className="mb-[20px] sm:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    ایمیل
                  </label>
                  <input
                    readOnly
                    type="email"
                    placeholder="ایمیل کاربر را وارد کنید (غیرفعال)"
                    className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] 
                    bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 
                    dark:placeholder:text-gray-400 focus:border-primary-500"
                  />
                </div>
                {/* شماره تلفن (mobile) */}
                <div className="mb-[20px] sm:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    شماره تلفن
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="(09123456789)  شماره تلفن کاربر را وارد کنید"
                    className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036]
                    bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500
                    dark:placeholder:text-gray-400 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ... (بخش سطح دسترسی ) ... */}
        <div className="xl:col-span-2 2xl:col-span-1">
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">سطح دسترسی کاربر</h5>
              </div>
            </div>
            <div className="trezo-card-content">
              <select
                name="role"
                value={formData.role === "admin" ? "admin" : "user"}
                onChange={handleChange}
                className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] 
                bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500"
              >
                <option value="user">مشتری (user)</option>
                <option value="admin">مدیر (admin)</option>
                <option value="2" disabled>
                  پشتیبان (غیرفعال)
                </option>
                <option value="3" disabled>
                  کارشناس محتوا (غیرفعال)
                </option>
                <option value="4" disabled>
                  کاربر ویژه (غیرفعال)
                </option>
                <option value="5" disabled>
                  توسعه‌دهنده (غیرفعال)
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ... (بخش دکمه‌ها) ... */}
      <div className="trezo-card mb-[25px]">
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
                {isSubmitting ? "hourglass_empty" : "add"}
              </i>
              {isSubmitting ? "در حال ارسال..." : "افزودن کاربر"}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddUserForm;