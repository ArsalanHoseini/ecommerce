"use client";

import { useState } from "react";
// import Image from "next/image";

const AddUserForm: React.FC = () => {
  // مدیریت آپلود عکس‌ها
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

  // کنترل نمایش یا مخفی‌سازی رمز عبور
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form>
      <div className="xl:grid xl:grid-cols-5 2xl:grid-cols-3 gap-[25px]">
        <div className="xl:col-span-3 2xl:col-span-2">
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-content">
              <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
                {/* نام کاربری */}
                <div className="mb-[20px] sm:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    نام کاربری
                  </label>
                  <input
                    type="text"
                    placeholder="نام کاربری را وارد کنید"
                    className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] 
                      bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 
                      dark:placeholder:text-gray-400 focus:border-primary-500"
                  />
                </div>

                {/* رمز عبور */}
                <div className="mb-[20px] sm:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    رمز عبور
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
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

                {/* ایمیل */}
                <div className="mb-[20px] sm:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    placeholder="ایمیل کاربر را وارد کنید"
                    className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] 
                      bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 
                      dark:placeholder:text-gray-400 focus:border-primary-500"
                  />
                </div>

                {/* شماره تلفن */}
                <div className="mb-[20px] sm:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    شماره تلفن
                  </label>
                  <input
                    type="text"
                    placeholder="شماره تلفن کاربر را وارد کنید"
                    className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036]
                      bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500
                      dark:placeholder:text-gray-400 focus:border-primary-500"
                  />
                </div>

                {/* آپلود تصویر */}
                <div className="mb-[20px] sm:mb-0">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    تصویر پروفایل
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full text-gray-500 dark:text-gray-300"
                  />
                  <div className="flex flex-wrap mt-2 gap-2">
                    {selectedImages.map((file, index) => (
                      <div
                        key={index}
                        className="relative w-16 h-16 border rounded-md overflow-hidden"
                      >
                        <span
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 cursor-pointer z-10"
                        >
                          ×
                        </span>
                        {/* پیش‌نمایش تصویر با URL.createObjectURL */}
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* سطح دسترسی */}
        <div className="xl:col-span-2 2xl:col-span-1">
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">سطح دسترسی کاربر</h5>
              </div>
            </div>
            <div className="trezo-card-content">
              <select
                className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] 
                  bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500"
              >
                <option value="0">مشتری</option>
                <option value="1">مدیر</option>
                <option value="2">پشتیبان</option>
                <option value="3">کارشناس محتوا</option>
                <option value="4">کاربر ویژه</option>
                <option value="5">توسعه‌دهنده</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* دکمه‌ها */}
      <div className="trezo-card mb-[25px]">
        <div className="trezo-card-content">
          <button
            type="button"
            className="font-medium inline-block transition-all rounded-md md:text-md ltr:mr-[15px] 
              rtl:ml-[15px] py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400"
          >
            انصراف
          </button>

          <button
            type="submit"
            className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] 
            bg-primary-500 text-white hover:bg-primary-400"
          >
            <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
              <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                add
              </i>
              افزودن کاربر
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddUserForm;
