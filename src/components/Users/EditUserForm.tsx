"use client";

import { useState, useEffect } from "react";
// import Image from "next/image"; // اگر بعداً می‌خواید از next/image استفاده کنید، uncomment کنید

type User = {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: number;
  password?: string;
  avatar?: string;
};

interface EditUserFormProps {
  user: User;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user }) => {
  // مدیریت state فیلدها
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState(0);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  // پر کردن اطلاعات اولیه
  useEffect(() => {
    setUsername(user.username || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setRole(user.role || 0);
    setPassword(user.password || "");
    if (user.avatar) {
      // می‌توانید avatar URL را به selectedImages اضافه کنید یا جدا نمایش دهید
    }
  }, [user]);

  // آپلود تصاویر
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  // حذف تصویر
  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // ارسال فرم
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      username,
      email,
      phone,
      role,
      password,
      selectedImages,
    };
    console.log("اطلاعات ارسال شده:", updatedUser);
    // اینجا می‌توانید API call بزنید
  };

  return (
    <form onSubmit={handleSubmit}>
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
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="شماره تلفن کاربر را وارد کنید"
                    className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036]
                      bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500
                      dark:placeholder:text-gray-400 focus:border-primary-500"
                  />
                </div>

                {/* آپلود تصاویر */}
                <div className="mb-[20px] sm:mb-0 col-span-2">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    آپلود تصویر
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-700 dark:text-gray-300
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary-500 file:text-white
                      hover:file:bg-primary-400 cursor-pointer"
                  />
                  <div className="flex flex-wrap mt-3 gap-2">
                    {selectedImages.map((file, index) => (
                      <div
                        key={index}
                        className="relative w-24 h-24 border rounded-md overflow-hidden"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
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
                  value={role}
                  onChange={(e) => setRole(Number(e.target.value))}
                  className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] 
                  bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500"
                >
                  <option value={0}>مشتری</option>
                  <option value={1}>مدیر</option>
                  <option value={2}>پشتیبان</option>
                  <option value={3}>کارشناس محتوا</option>
                  <option value={4}>کاربر ویژه</option>
                  <option value={5}>توسعه‌دهنده</option>
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
                بروزرسانی کاربر
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditUserForm;
