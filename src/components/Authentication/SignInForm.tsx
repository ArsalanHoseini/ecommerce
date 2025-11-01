"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

const SignInForm: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [activeTab, setActiveTab] = useState<"password" | "sms">("password");
  const [smsCode, setSmsCode] = useState("");
  const [isSendingSms, setIsSendingSms] = useState(false);

  useEffect(() => {
    const phoneFromParam = searchParams.get("phone") || "";
    setPhone(phoneFromParam);
  }, [searchParams]);

  const handleEditPhone = () => {
    router.push("/authentication/enter-phone");
  };

  const handleSendSms = async () => {
    if (!phone) return;

    setIsSendingSms(true);
    try {
      // TODO: به بک‌اند درخواست ارسال SMS بفرستید
      // نمونه fetch:
      // await fetch("/api/send-sms", { method: "POST", body: JSON.stringify({ phone }) });

      console.log("درخواست ارسال SMS برای شماره:", phone);

      alert("کد تایید به شماره شما ارسال شد.");
    } catch (err) {
      console.error(err);
      alert("خطا در ارسال کد، دوباره تلاش کنید.");
    } finally {
      setIsSendingSms(false);
    }
  };

  return (
    <div className="auth-main-content bg-white dark:bg-[#0a0e19] py-[60px] md:py-[80px] lg:py-[135px]">
      <div className="mx-auto px-[12.5px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1255px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] items-center">
          {/* تصویر سمت چپ */}
          <div className="xl:ltr:-mr-[25px] xl:rtl:-ml-[25px] 2xl:ltr:-mr-[45px] 2xl:rtl:-ml-[45px] rounded-[25px] order-2 lg:order-2">
            <Image
              src="/images/sign-in.jpg"
              alt="sign-in-image"
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
                ورود به حساب کاربری
              </h1>
              <p className="font-medium lg:text-md text-[#445164] dark:text-gray-400">
                خوش آمدید! لطفا وارد حساب کاربری خود شوید
              </p>
            </div>

            {/* تب‌ها */}
            <div className="flex mb-[20px] border-b border-gray-200 dark:border-[#172036]">
              <button
                className={`flex-1 py-[10px] text-center font-medium transition-all ${
                  activeTab === "password"
                    ? "border-b-2 border-primary-500 text-primary-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("password")}
              >
                ورود با پسورد
              </button>
              <button
                className={`flex-1 py-[10px] text-center font-medium transition-all ${
                  activeTab === "sms"
                    ? "border-b-2 border-primary-500 text-primary-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("sms")}
              >
                ورود با SMS
              </button>
            </div>

            {/* شماره موبایل و ویرایش */}
            {phone && (
              <div className="mb-[15px] flex items-center gap-[10px]">
                <input
                  type="text"
                  value={phone}
                  readOnly
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-100 dark:bg-[#172036] px-[17px] block w-full outline-0 transition-all"
                />
                <button
                  type="button"
                  onClick={handleEditPhone}
                  className="h-[55px] px-[15px] rounded-md bg-primary-500 text-white hover:bg-primary-400 transition-all"
                >
                  ویرایش
                </button>
              </div>
            )}

            {/* محتوای تب‌ها */}
            {activeTab === "password" && (
              <>
                <div className="mb-[15px] relative" id="passwordHideShow">
                  <label className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                    گذرواژه
                  </label>
                  <input
                    type="password"
                    className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    id="password"
                    placeholder="گدرواژه خود را وارد کنید"
                  />
                  <button
                    className="absolute text-lg ltr:right-[20px] rtl:left-[20px] bottom-[12px] transition-all hover:text-primary-500"
                    id="toggleButton"
                    type="button"
                  >
                    <i className="ri-eye-off-line"></i>
                  </button>
                </div>

                <Link
                  href="/authentication/forgot-password"
                  className="inline-block text-primary-500 transition-all font-semibold hover:underline mb-[20px]"
                >
                  فراموشی گذرواژه؟
                </Link>
              </>
            )}

            {activeTab === "sms" && (
              <>
                <div className="mb-[15px] relative">
                  <label className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                    کد تایید پیامکی
                  </label>
                  <input
                    type="text"
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value)}
                    className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    placeholder="کد ارسال شده به شماره شما"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendSms}
                  disabled={isSendingSms}
                  className={`mb-[20px] w-full rounded-md py-[12px] px-[25px] text-white font-medium transition-all ${
                    isSendingSms ? "bg-gray-400" : "bg-primary-500 hover:bg-primary-400"
                  }`}
                >
                  {isSendingSms ? "در حال ارسال..." : "ارسال پیامک "}
                </button>
              </>
            )}

            <button
              type="submit"
              className="md:text-md block w-full text-center transition-all rounded-md font-medium mt-[10px] md:mt-[15px] py-[12px] px-[25px] text-white bg-primary-500 hover:bg-primary-400"
            >
              <span className="flex items-center justify-center gap-[5px]">
                <i className="material-symbols-outlined">login</i>
                ورود به حساب کاربری
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
