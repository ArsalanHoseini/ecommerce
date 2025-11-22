"use client";

import React, { useState } from "react";
import Image from "next/image";

const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
      {/* هدر */}
      <div className="trezo-card-header mb-[20px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0 !text-md !font-medium">پیام‌ها</h5>
        </div>
      </div>

      {/* فرم جستجو */}
      <div className="trezo-card-content">
        <form className="relative mb-[20px]">
          <label className="absolute ltr:left-[13px] rtl:right-[13px] mt-[2px] text-black dark:text-white top-1/2 -translate-y-1/2">
            <i className="material-symbols-outlined !text-lg">search</i>
          </label>
          <input
            type="text"
            placeholder="جستجو"
            className="block w-full rounded-md text-black dark:text-white bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] focus:border-primary-500 h-[40px] outline-0 transition-all text-xs placeholder:text-gray-500 dark:placeholder:text-gray-400 ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[15px] rtl:pl-[15px]"
          />
        </form>

        {/* تب‌ها */}
        <div className="trezo-tabs" id="trezo-tabs">
          <ul className="chat-sidebar-navs flex border-b border-gray-100 dark:border-[#172036]">
            <li className="nav-item ltr:mr-[19px] rtl:ml-[19px] xl:ltr:mr-[30px] xl:rtl:ml-[30px] ltr:last:mr-0 rtl:last:ml-0">
              <button
                onClick={() => handleTabClick(0)}
                className={`nav-link font-medium relative pb-[8px] transition-all ${
                  activeTab === 0 ? "active" : ""
                }`}
              >
                همه پیام‌ها
              </button>
            </li>
            <li className="nav-item ltr:mr-[19px] rtl:ml-[19px] xl:ltr:mr-[30px] xl:rtl:ml-[30px] ltr:last:mr-0 rtl:last:ml-0">
              <button
                onClick={() => handleTabClick(1)}
                className={`nav-link font-medium relative pb-[8px] transition-all ${
                  activeTab === 1 ? "active" : ""
                }`}
              >
                پیام‌های خوانده‌نشده
              </button>
            </li>
          </ul>

          {/* محتوای تب‌ها */}
          <div className="chat-sidebar-tab-content">
            {activeTab === 0 && (
              <div className="ltr:-mr-[20px] rtl:-ml-[20px] md:ltr:-mr-[25px] md:rtl:-ml-[25px]">
                <div className="chat-users-list overflow-y-scroll h-[600px] ltr:pr-[25px] rtl:pl-[25px] pt-[20px]">
                  {/* نمونه پیام‌ها */}
                  {[
                    { name: "سارا اسمیت", img: "/images/users/user31.jpg", status: "در حال تایپ...", time: "همین الان", statusColor: "success-500" },
                    { name: "مایکل جانسون", img: "/images/users/user6.jpg", status: "فایل پیوست...", time: "۱۰:۲۰ صبح", statusColor: "orange-400" },
                    { name: "امیلی براون", img: "/images/users/user7.jpg", status: "پیام صوتی", time: "۹:۳۰ صبح", statusColor: "success-500" },
                    { name: "دیوید مارتینز", img: "/images/users/user8.jpg", status: "کار عالی...", time: "۳:۲۰ بعدازظهر", statusColor: "success-500" },
                  ].map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0"
                    >
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src={user.img}
                            alt={user.name}
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span
                            className={`absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-${user.statusColor} border-[2px] border-white dark:border-[#0c1427]`}
                          ></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">{user.name}</span>
                          <span className="block text-xs mt-[2px]">{user.status}</span>
                        </div>
                      </div>
                      <span className="text-xs block">{user.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="ltr:-mr-[20px] rtl:-ml-[20px] md:ltr:-mr-[25px] md:rtl:-ml-[25px]">
                <div className="chat-users-list overflow-y-scroll h-[600px] ltr:pr-[25px] rtl:pl-[25px] pt-[20px]">
                  {/* همین پیام‌ها را می‌توان برای تب خوانده‌نشده هم استفاده کرد */}
                  <p className="text-center text-gray-400 mt-[20px]">پیامی برای نمایش وجود ندارد.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
