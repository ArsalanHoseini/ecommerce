"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const users = [
  {
    id: "JAN-158",
    name: "مارسیا بیکر",
    email: "marcia@trezo.com",
    location: "",
    phone: "+1 555-445-4455",
    projects: 6,
    joinDate: "01 دسامبر 2024",
    image: "/images/users/user6.jpg",
    role: 0,
  },
  {
    id: "JAN-325",
    name: "کارولین بارنز",
    email: "barnes@trezo.com",
    location: "شیکاگو",
    phone: "+1 555-455-9966",
    projects: 10,
    joinDate: "02 دسامبر 2024",
    image: "/images/users/user7.jpg",
    role: 0,
  },
  {
    id: "JAN-214",
    name: "جیمز اسمیت",
    email: "james@trezo.com",
    location: "نیویورک",
    phone: "+1 555-789-1234",
    projects: 5,
    joinDate: "03 دسامبر 2024",
    image: "/images/users/user8.jpg",
    role: 0,
  },
  {
    id: "JAN-402",
    name: "پاتریشیا جانسون",
    email: "patricia@trezo.com",
    location: "سان‌فرانسیسکو",
    phone: "+1 555-321-9876",
    projects: 7,
    joinDate: "04 دسامبر 2024",
    image: "/images/users/user9.jpg",
    role: 0,
  },
  {
    id: "JAN-518",
    name: "رابرت براون",
    email: "robert@trezo.com",
    location: "لس آنجلس",
    phone: "+1 555-654-3210",
    projects: 12,
    joinDate: "05 دسامبر 2024",
    image: "/images/users/user10.jpg",
    role: 0,
  },
  {
    id: "JAN-628",
    name: "امیلی دیویس",
    email: "emily@trezo.com",
    location: "سیاتل",
    phone: "+1 555-159-7532",
    projects: 9,
    joinDate: "06 دسامبر 2024",
    image: "/images/users/user11.jpg",
    role: 0,
  },
  {
    id: "JAN-731",
    name: "مایکل ویلسون",
    email: "michael@trezo.com",
    location: "هیوستون",
    phone: "+1 555-852-7413",
    projects: 8,
    joinDate: "07 دسامبر 2024",
    image: "/images/users/user12.jpg",
    role: 0,
  },
  {
    id: "JAN-845",
    name: "لیندا مور",
    email: "linda@trezo.com",
    location: "بوستون",
    phone: "+1 555-369-2581",
    projects: 11,
    joinDate: "08 دسامبر 2024",
    image: "/images/users/user13.jpg",
    role: 0,
  },
  {
    id: "JAN-956",
    name: "دیوید مارتینز",
    email: "david@trezo.com",
    location: "میامی",
    phone: "+1 555-951-7534",
    projects: 6,
    joinDate: "09 دسامبر 2024",
    image: "/images/users/user14.jpg",
    role: 0,
  },
  {
    id: "JAN-102",
    name: "سارا اندرسون",
    email: "sarah@trezo.com",
    location: "آستین",
    phone: "+1 555-357-9514",
    projects: 13,
    joinDate: "10 دسامبر 2024",
    image: "/images/users/user15.jpg",
    role: 0,
  },
  {
    id: "JAN-113",
    name: "ریچارد توماس",
    email: "richard@trezo.com",
    location: "دنور",
    phone: "+1 555-684-1593",
    projects: 4,
    joinDate: "11 دسامبر 2024",
    image: "/images/users/user16.jpg",
    role: 0,
  },
  {
    id: "JAN-224",
    name: "کارن وایت",
    email: "karen@trezo.com",
    location: "دالاس",
    phone: "+1 555-742-9516",
    projects: 14,
    joinDate: "12 دسامبر 2024",
    image: "/images/users/user17.jpg",
    role: 0,
  },
  {
    id: "JAN-335",
    name: "کریستوفر هریس",
    email: "chris@trezo.com",
    location: "فینیکس",
    phone: "+1 555-963-8521",
    projects: 7,
    joinDate: "13 دسامبر 2024",
    image: "/images/users/user18.jpg",
    role: 0,
  },
  {
    id: "JAN-446",
    name: "نانسی کلارک",
    email: "nancy@trezo.com",
    location: "سن دیگو",
    phone: "+1 555-357-2486",
    projects: 9,
    joinDate: "14 دسامبر 2024",
    image: "/images/users/user19.jpg",
    role: 0,
  },
  {
    id: "JAN-557",
    name: "متیو لوئیس",
    email: "matthew@trezo.com",
    location: "پورتلند",
    phone: "+1 555-753-6842",
    projects: 10,
    joinDate: "15 دسامبر 2024",
    image: "/images/users/user20.jpg",
    role: 0,
  },
  {
    id: "JAN-668",
    name: "باربارا واکر",
    email: "barbara@trezo.com",
    location: "فیلادلفیا",
    phone: "+1 555-852-3574",
    projects: 8,
    joinDate: "16 دسامبر 2024",
    image: "/images/users/user21.jpg",
    role: 0,
  },
  {
    id: "JAN-779",
    name: "استیون هال",
    email: "steven@trezo.com",
    location: "لاس وگاس",
    phone: "+1 555-741-3698",
    projects: 11,
    joinDate: "17 دسامبر 2024",
    image: "/images/users/user22.jpg",
    role: 0,
  },
  {
    id: "JAN-880",
    name: "جسیکا یانگ",
    email: "jessica@trezo.com",
    location: "اورلاندو",
    phone: "+1 555-951-2587",
    projects: 5,
    joinDate: "18 دسامبر 2024",
    image: "/images/users/user23.jpg",
    role: 1,
  }, // ادمین
  {
    id: "JAN-991",
    name: "دنیل کینگ",
    email: "daniel@trezo.com",
    location: "مینیاپولیس",
    phone: "+1 555-357-6548",
    projects: 12,
    joinDate: "19 دسامبر 2024",
    image: "/images/users/user24.jpg",
    role: 1,
  }, // ادمین
  {
    id: "JAN-105",
    name: "آلیس مورگان",
    email: "alice@trezo.com",
    location: "لاس آنجلس",
    phone: "+1 555-258-9631",
    projects: 9,
    joinDate: "20 دسامبر 2024",
    image: "/images/users/user25.jpg",
    role: 0,
  },
  {
    id: "JAN-116",
    name: "جان آدامز",
    email: "john@trezo.com",
    location: "نیویورک",
    phone: "+1 555-147-2583",
    projects: 7,
    joinDate: "21 دسامبر 2024",
    image: "/images/users/user26.jpg",
    role: 0,
  },
];

const UsersListTable: React.FC = () => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState(0); // عدد پیش‌فرض: مشتری

  // فیلتر بر اساس جستجو و سطح دسترسی
  const filteredUsers = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchQuery.toLowerCase())) &&
      user.role === roleFilter
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleDelete = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      alert(`حذف کاربر  < ${user.name} > با شناسه: ${id} (فعلاً فقط نمایش)`);
    }
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 items-center">
          {/* فیلتر سطح دسترسی */}
          <select
            className="h-[36px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-2 text-black dark:text-white"
            value={roleFilter}
            onChange={(e) => setRoleFilter(Number(e.target.value))}
          >
            <option value={0}>مشتری</option>
            <option value={1}>ادمین</option>
            <option value={2}>مدیریت پروژه</option>
            <option value={3}>تحلیل داده</option>
            <option value={4}>تیم ورک</option>
            <option value={5}>توسعه وب</option>
          </select>

          {/* جستجوی کاربران */}
          <form className="relative sm:w-[265px]">
            <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
              <i className="material-symbols-outlined !text-[20px]">search</i>
            </label>
            <input
              type="text"
              placeholder="جستجوی کاربر..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] rtl:pl-[13px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
            />
          </form>
        </div>

        <div>
          <Link
            href="/users/add-user"
            className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
          >
            <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
              <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                add
              </i>
              افزودن کاربر جدید
            </span>
          </Link>
        </div>
      </div>

      <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
        {/* جدول کاربران */}
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead className="text-black dark:text-white">
              <tr>
                <th className="px-[20px] py-[11px] bg-primary-50 dark:bg-[#15203c]">
                  شناسه
                </th>
                <th className="px-[20px] py-[11px] bg-primary-50 dark:bg-[#15203c]">
                  کاربر
                </th>
                <th className="px-[20px] py-[11px] bg-primary-50 dark:bg-[#15203c]">
                  ایمیل
                </th>
                <th className="px-[20px] py-[11px] bg-primary-50 dark:bg-[#15203c]">
                  تلفن
                </th>
                <th className="px-[20px] py-[11px] bg-primary-50 dark:bg-[#15203c]">
                  سفارشات
                </th>
                <th className="px-[20px] py-[11px] bg-primary-50 dark:bg-[#15203c]">
                  تاریخ عضویت
                </th>
                <th className="px-[20px] py-[11px] bg-primary-50 dark:bg-[#15203c]">
                  عملیات
                </th>
              </tr>
            </thead>

            <tbody className="text-black dark:text-white">
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-[20px] py-[17px] border-b border-gray-100 dark:border-[#172036]">
                    #{user.id}
                  </td>
                  <td className="px-[20px] py-[17px] border-b border-gray-100 dark:border-[#172036]">
                    <div className="flex items-center">
                      <div className="w-[40px] rounded-full">
                        <Image
                          src={user.image}
                          className="inline-block rounded-full"
                          alt="تصویر کاربر"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="ltr:ml-[12px] rtl:mr-[12px]">
                        <span className="block font-medium">{user.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-[20px] py-[17px] border-b border-gray-100 dark:border-[#172036]">
                    {user.email}
                  </td>
                  <td className="px-[20px] py-[17px] border-b border-gray-100 dark:border-[#172036]">
                    {user.phone}
                  </td>
                  <td className="px-[20px] py-[17px] border-b border-gray-100 dark:border-[#172036]">
                    {user.projects}
                  </td>
                  <td className="px-[20px] py-[17px] border-b border-gray-100 dark:border-[#172036]">
                    {user.joinDate}
                  </td>
                  <td className="px-[20px] py-[17px] border-b border-gray-100 dark:border-[#172036]">
                    <div className="flex items-center gap-[9px]">
                      <Link href={`/admin/users/view/${user.id}`}>
                        <button className="text-primary-500">
                          <i className="material-symbols-outlined !text-md">
                            visibility
                          </i>
                        </button>
                      </Link>
                      <Link href={`/admin/users/edit/${user.id}`}>
                        <button className="text-gray-500 dark:text-gray-400">
                          <i className="material-symbols-outlined !text-md">
                            edit
                          </i>
                        </button>
                      </Link>
                      <button
                        className="text-danger-500"
                        onClick={() => handleDelete(user.id)}
                      >
                        <i className="material-symbols-outlined !text-md">
                          delete
                        </i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* پیجینگ */}
        <div className="px-[20px] md:px-[25px] pt-[12px] md:pt-[14px] sm:flex sm:items-center justify-between">
          <p className="!mb-0 !text-sm">
            نمایش {startIndex + 1} تا{" "}
            {Math.min(startIndex + itemsPerPage, filteredUsers.length)} از{" "}
            {filteredUsers.length} کاربر
          </p>
          <ol className="mt-[10px] sm:mt-0 flex gap-1">
            <li>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="w-[31px] h-[31px] rounded-md border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white"
              >
                <i className="material-symbols-outlined">chevron_right</i>
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index}>
                <button
                  className={`w-[31px] h-[31px] rounded-md border border-gray-100 dark:border-[#172036] ${
                    currentPage === index + 1
                      ? "bg-primary-500 text-white border-primary-500"
                      : ""
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="w-[31px] h-[31px] rounded-md border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white"
              >
                <i className="material-symbols-outlined">chevron_left</i>
              </button>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default UsersListTable;
