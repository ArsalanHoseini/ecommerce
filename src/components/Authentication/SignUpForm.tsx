"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [isSendingSms, setIsSendingSms] = useState(false);

  useEffect(() => {
    const phoneFromParam = searchParams.get("phone") || "";
    setPhone(phoneFromParam);
  }, [searchParams]);

  const handleEditPhone = () => {
    router.push("/authentication/enter-phone"); // مسیر صفحه قبل برای ویرایش شماره
  };

  const handleSendSms = async () => {
    if (!phone) return;

    setIsSendingSms(true);
    try {
      // TODO: ارسال SMS به بک‌اند
      console.log("ارسال SMS به شماره:", phone);
      alert("کد تایید به شماره شما ارسال شد.");
    } catch (err) {
      console.error(err);
      alert("خطا در ارسال کد، دوباره تلاش کنید.");
    } finally {
      setIsSendingSms(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !fullName || !password || !smsCode) {
      alert("لطفاً تمام فیلدها را تکمیل کنید.");
      return;
    }

    // TODO: ثبت نام کاربر با API
    console.log({ phone, fullName, password, smsCode });
    alert("ثبت نام با موفقیت انجام شد!");

    router.push(`/authentication/sign-in?phone=${encodeURIComponent(phone)}`);
  };

  return (
    <div className="auth-main-content bg-white dark:bg-[#0a0e19] py-[60px] md:py-[80px] lg:py-[120px] xl:py-[135px]">
      <div className="mx-auto px-[12.5px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1255px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] items-center">
          {/* تصویر سمت چپ */}
          <div className="xl:ltr:-mr-[25px] xl:rtl:-ml-[25px] 2xl:ltr:-mr-[45px] 2xl:rtl:-ml-[45px] rounded-[25px] order-2 lg:order-2">
            <Image
              src="/images/sign-up.jpg"
              alt="sign-up-image"
              className="rounded-[25px]"
              width={646}
              height={804}
            />
          </div>

          {/* فرم سمت راست */}
          <div className="xl:ltr:pl-[90px] xl:rtl:pr-[90px] 2xl:ltr:pl-[120px] 2xl:rtl:pr-[120px] order-1 lg:order-1">
            <Image
              src="/images/Utab-fainally.png"
              alt="logo"
              className="inline-block dark:hidden"
              width={142}
              height={38}
            />
            <Image
              src="/images/Utab-OFOGHI.png"
              alt="logo"
              className="hidden dark:inline-block"
              width={142}
              height={38}
            />

            <div className="my-[17px] md:my-[25px]">
              <h1 className="!font-semibold !text-[22px] md:!text-xl lg:!text-2xl !mb-[5px] md:!mb-[7px]">
                ثبت نام
              </h1>
              <p className="font-medium lg:text-md text-[#445164] dark:text-gray-400">
                شماره موبایل شما: {phone || "وارد نشده"}  
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* شماره موبایل با ویرایش و ارسال SMS */}
              <div className="mb-[15px] flex items-center gap-[10px]">
                <input
                  type="tel"
                  value={phone}
                  readOnly
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                />
                <button
                  type="button"
                  onClick={handleEditPhone}
                  className="h-[55px] px-[15px] rounded-md bg-gray-400 text-white hover:bg-gray-500 transition-all"
                >
                  ویرایش
                </button>
                <button
                  type="button"
                  onClick={handleSendSms}
                  disabled={isSendingSms}
                  className={`h-[55px] px-[15px] rounded-md ${
                    isSendingSms ? "bg-gray-400" : "bg-primary-500 hover:bg-primary-400"
                  } text-white transition-all`}
                >
                  {isSendingSms ? "در حال ارسال..." : "ارسال SMS"}
                </button>
              </div>

              {/* کد تایید SMS */}
              <div className="mb-[15px] relative">
                <label className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                  کد تایید SMS
                </label>
                <input
                  type="text"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="کد ارسال شده"
                />
              </div>

              {/* نام کامل */}
              <div className="mb-[15px] relative">
                <label className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                  نام کامل
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="نام و نام خانوادگی"
                />
              </div>

              {/* پسورد */}
              <div className="mb-[15px] relative">
                <label className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                  پسورد
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="رمز عبور"
                />
              </div>

              <button
                type="submit"
                className="md:text-md block w-full text-center transition-all rounded-md font-medium my-[20px] md:my-[25px] py-[12px] px-[25px] text-white bg-primary-500 hover:bg-primary-400"
              >
                ثبت نام
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
