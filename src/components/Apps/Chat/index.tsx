"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const Chat: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`گزینه انتخاب‌شده: ${option}`);
  };

  const messages = [
    { id: 1, text: "هی اولیویا، فرصت کردی داشبورد جدید ادمین رو بررسی کنی؟", time: "۰۹:۱۰ صبح", sender: "user" },
    { id: 2, text: "اوه، یه بورد کانبان برای مدیریت وظایف داره. می‌تونی وظایف رو بین ستون‌ها بکشی — خیلی راحت و شهودیه.", time: "۰۹:۱۲ صبح", sender: "user" },
    { id: 3, text: "آره همونه! طراحی متریال خیلی تمیزی داره و ویژگی‌هاش هم قویه.", time: "۰۹:۱۵ صبح", sender: "user" },
    { id: 4, text: "عالیه! چه ویژگی‌هایی برات جالب بودن؟", time: "۰۹:۱۸ صبح", sender: "admin" },
    { id: 5, text: "بخش گزارش‌دهی خیلی تمیز و قابل فهم طراحی شده.", time: "۰۹:20 صبح", sender: "user" },
    { id: 6, text: "خیلی کاربردیه. بخش مدیریت وظایف چطوره؟", time: "۰۹:۲۵ صبح", sender: "admin" },
    { id: 7, text: "همه چیز به صورت کشیدن و رها کردن خیلی راحت انجام می‌شه.", time: "۰۹:۳۰ صبح", sender: "user" },
    { id: 8, text: "عالیه! همکاری تیمی چطور؟", time: "۰۹:۳۱ صبح", sender: "admin" },
    { id: 9, text: "می‌تونیم وظایف رو راحت به اعضا اختصاص بدیم و پیشرفت رو پیگیری کنیم.", time: "۰۹:۳۵ صبح", sender: "user" },
    { id: 10, text: "عالی، پس همه چیز مرتب و قابل استفاده است.", time: "۰۹:۳۸ صبح", sender: "admin" },
    { id: 11, text: "دقیقاً، داشبورد خیلی کارآمد طراحی شده.", time: "۰۹:۴۰ صبح", sender: "user" },
  ];

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header sm:flex items-center justify-between">
        <div className="trezo-card-title flex items-center">
          <div className="relative ltr:mr-[15px] rtl:ml-[15px]">
            <Image
              src="/images/users/user31.jpg"
              alt="تصویر کاربر"
              className="rounded-full w-[75px]"
              width={75}
              height={75}
            />
            <span className="absolute bg-success-500 w-[10px] h-[10px] rounded-full border-[2px] border-white dark:border-[#0c1427] bottom-[5px] ltr:right-[5px] rtl:left-[5px]"></span>
          </div>
          <div>
            <span className="font-semibold block text-black dark:text-white text-md">
              سارا اسمیت
            </span>
            <span className="mt-[2px]">اکنون فعال</span>
          </div>
        </div>

        <div className="trezo-card-subtitle mt-[15px] sm:mt-0 flex items-center gap-[15px]">
          <Menu as="div" className="trezo-card-dropdown relative">
            <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[20px] text-gray-500 dark:text-gray-400 hover:text-primary-500">
              <i className="ri-more-fill"></i>
            </MenuButton>

            <MenuItems className="transition-all bg-white shadow-3xl rounded-md top-full absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none">
              {["حذف", "مسدود کردن"].map((option) => (
                <MenuItem
                  key={option}
                  as="div"
                  className={`block w-full text-black cursor-pointer ltr:text-left rtl:text-right py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black ${
                    selectedOption === option ? "font-semibold" : ""
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>
      </div>

      <div className="trezo-card-content">
        <div className="border-t border-gray-100 dark:border-[#172036] mt-[20px] mb-[18px]"></div>

        <div className="chat-body h-[500px] overflow-y-scroll ltr:-mr-[25px] rtl:-ml-[25px]">
          <ul className="flex flex-col ltr:pl-[25px] rtl:pr-[25px] gap-[15px]">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className={`relative w-full md:w-[90%] ${
                  msg.sender === "user" ? "ltr:pl-[45px] rtl:pr-[45px]" : "ltr:text-right rtl:text-left md:rtl:text-left md:ltr:mr-auto rtl:ml-auto"
                }`}
              >
                {msg.sender === "user" && (
                  <Image
                    src="/images/users/user31.jpg"
                    alt="کاربر"
                    className="rounded-full top-0 ltr:left-0 rtl:right-0 absolute"
                    width={35}
                    height={35}
                  />
                )}
                <div className={`ltr:text-left rtl:text-right ${msg.sender === "admin" ? "ltr:text-right rtl:text-left" : ""}`}>
                  <p className={`py-[10px] px-[15px] inline-block ${
                    msg.sender === "user"
                      ? "bg-gray-50 dark:bg-[#15203c] ltr:rounded-r-md rtl:rounded-l-md"
                      : "bg-primary-500 text-white ltr:rounded-l-md rtl:rounded-l-md"
                  }`}>
                    {msg.text}
                  </p>
                  <span className="block text-xs ltr:text-left rtl:text-right mt-[7px]">{msg.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:flex gap-[20px] rounded-md p-[20px] bg-gray-50 dark:bg-[#15203c]">
          <div className="relative flex gap-[10px] items-center top-[2px]"></div>
          <div className="relative mt-[15px] md:mt-0 md:ltr:pr-[70px] md:rtl:pl-[70px] flex-auto">
            <button
              type="submit"
              className="md:absolute flex items-center justify-center ltr:right-0 rtl:left-0 rounded-sm transition-all bg-primary-500 text-white hover:bg-primary-400 md:top-1/2 md:-translate-y-1/2 w-[55px] h-[55px] mt-[15px] md:mt-0"
            >
              <i className="material-symbols-outlined rotate-180">send</i>
            </button>
            <input
              type="text"
              className="block w-full rounded-md bg-white dark:bg-[#0c1427] px-[15px] h-[55px] text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-1"
              placeholder="پیامت را بنویس..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
