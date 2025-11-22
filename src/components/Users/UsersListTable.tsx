"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

// --- رابط‌های تعریف داده ---

// 1. رابط داده‌ای که از API دریافت می‌شود
interface ApiUser {
  id: number;
  mobile: string;
  name: string;
  role: string; // "admin" یا "user"
  createdAt: string; // فرمت ISO Date
  updatedAt: string;
}

// 2. رابط داده‌ای که کامپوننت انتظار دارد (بر اساس قالب)
interface ComponentUser {
  id: string; // شناسه برای استفاده در لینک‌ها و key
  name: string;
  email: string; // در API موجود نیست
  phone: string; // همان mobile در API
  image: string; // در API موجود نیست
  role: number; // 0 برای مشتری، 1 برای ادمین
  walletBalance: number | null; // در API موجود نیست
  joinDate: string; // فرمت شده createdAt
}

// --- آبجکت‌های کمکی ---

// آبجکت کمکی برای تبدیل شناسه نقش به نام خوانا
// **تغییر: اضافه شدن -1 برای نمایش 'همه' در فیلتر**
const roleMap: { [key: number]: string } = {
  "-1": "دیدن همه", // **مقدار جدید برای فیلتر کردن همه نقش‌ها**
  0: "مشتری",
  1: "ادمین",
  2: "مدیریت پروژه",
  3: "تحلیل داده",
  4: "تیم ورک",
  5: "توسعه وب",
};

/**
 * تابع کمکی برای تبدیل نقش دریافتی از API (رشته)
 * به شناسه نقش مورد انتظار کامپوننت (عدد)
 */
const apiRoleToComponentRole = (apiRole: string): number => {
  const roleLower = apiRole.toLowerCase();
  if (roleLower === "admin") {
    return 1; // 1 = ادمین
  }
  if (roleLower === "user") {
    return 0; // 0 = مشتری
  }
  return 0; // پیش‌فرض
};

/**
 * تابع کمکی برای فرمت کردن تاریخ ISO (از API)
 * به فرمت فارسی مورد انتظار قالب
 */
const formatJoinDate = (isoDate: string): string => {
  try {
    const date = new Date(isoDate);
    // فرمت: "01 دسامبر 2024"
    return date.toLocaleDateString("fa-IR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch (e) {
    return "تاریخ نامعتبر"; // بازگشت در صورت خطا
  }
};

// --- کامپوننت اصلی ---

const UsersListTable: React.FC = () => {
  // --- State های مدیریت داده ---
  const [users, setUsers] = useState<ComponentUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null); // State برای مدیریت حذف

  // --- State های موجود (UI) ---
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  // **تغییر: مقدار اولیه فیلتر نقش به -1 (دیدن همه)**
  const [roleFilter, setRoleFilter] = useState(-1); 

  // --- دریافت داده از API ---
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_GET_USERS_API_URL;
        if (!apiUrl) {
          throw new Error(
            "متغیر NEXT_PUBLIC_GET_USERS_API_URL تعریف نشده است"
          );
        }

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("خطا در ارتباط با سرور");
        }

        const result = await response.json();

        if (result.statusCode === 200 && Array.isArray(result.data)) {
          // *** مرحله تبدیل داده (Adapter) ***
          const transformedUsers: ComponentUser[] = result.data.map(
            (apiUser: ApiUser) => ({
              id: apiUser.id.toString(),
              name: apiUser.name || "بدون نام",
              phone: apiUser.mobile || "اطلاعات دریافت نشد",
              role: apiRoleToComponentRole(apiUser.role),
              joinDate: formatJoinDate(apiUser.createdAt),
              email: "اطلاعات دریافت نشد",
              walletBalance: null,
              image: "/images/users/user-placeholder.jpg",
            })
          );
          setUsers(transformedUsers);
        } else {
          throw new Error(result.message || "ساختار داده دریافتی نامعتبر است");
        }
      } catch (err: any) {
        setError(err.message || "یک خطای ناشناخته رخ داد");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // --- منطق فیلتر و برگه‌بندی (Pagination) ---

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      user.id.toLowerCase().includes(query) ||
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone.toLowerCase().includes(query);
      
    // **تغییر: اگر roleFilter برابر با -1 باشد، همه نقش‌ها را شامل می‌شود**
    const matchesRole = roleFilter === -1 || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

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

  // --- توابع کمکی (Helpers) ---

  // تابع کمکی برای استایل دهی به نقش‌ها
  const getRoleBadge = (roleId: number) => {
    // از آنجایی که roleMap کلیدهای رشته‌ای (برای -1) دارد، تبدیل کلید عددی به رشته ضروری است
    const roleName = roleMap[roleId] || roleMap[roleId.toString() as unknown as number] || "ناشناخته";
    
    // در این قسمت، برای جلوگیری از نمایش "دیدن همه" به عنوان یک نقش واقعی، باید بررسی شود.
    if (roleId === -1) {
        // این حالت نباید در جدول اتفاق بیفتد، اما برای ایمنی، یک متن خالی برگردانده می‌شود
        return null; 
    }
      
    let className = "px-2 py-0.5 rounded-full text-xs font-medium ";
    switch (roleId) {
      case 1: // ادمین
        className +=
          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        break;
      case 0: // مشتری
        className +=
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
        break;
      default:
        className +=
          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
    return <span className={className}>{roleName}</span>;
  };

  /**
   * تابع حذف کاربر (متصل به API)
   */
  const handleDelete = async (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    // 1. پیام تایید
    const confirmed = window.confirm(
      `آیا از حذف کاربر «${user.name}» با شناسه ${id} مطمئن هستید؟`
    );

    if (!confirmed) {
      return;
    }

    // 2. تنظیم وضعیت بارگیری
    setDeletingId(id);

    try {
      // 3. دریافت آدرس API
      const apiUrl = process.env.NEXT_PUBLIC_DELETE_USER_API_URL;
      if (!apiUrl) {
        throw new Error(
          "متغیر NEXT_PUBLIC_DELETE_USER_API_URL تعریف نشده است"
        );
      }

      const finalUrl = apiUrl.replace("{id}", id);

      // 4. فراخوانی API
      const response = await fetch(finalUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${your_token_here}`
        },
      });

      // 5. مدیریت پاسخ
      if (response.ok) {
        alert(`کاربر «${user.name}» با موفقیت حذف شد.`);

        // 5b. به‌روزرسانی UI
        setUsers((currentUsers) =>
          currentUsers.filter((u) => u.id !== id)
        );

        // 5c. مدیریت برگه‌بندی پس از حذف
        const totalAfterDelete = filteredUsers.length - 1;
        const newTotalPages = Math.ceil(totalAfterDelete / itemsPerPage);
        
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        } else if (totalAfterDelete === 0) {
            setCurrentPage(1);
        }
        
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "سرور قادر به حذف این کاربر نبود"
        );
      }
    } catch (err: any) {
      // 6. مدیریت خطای کلی
      alert(`خطا: ${err.message || "عملیات حذف با شکست مواجه شد"}`);
    } finally {
      // 7. پاک کردن وضعیت بارگیری
      setDeletingId(null);
    }
  };

  /**
   * تابع خروجی CSV (اکسل)
   */
  const exportToCSV = () => {
    const headers = [
      "شناسه",
      "نام",
      "ایمیل",
      "تلفن",
      "تاریخ عضویت",
      "کیف پول (تومان)",
      "سطح دسترسی",
    ].join(",");

    const csvRows = filteredUsers.map((user) => {
      // از آنجایی که roleMap کلیدهای رشته‌ای (برای -1) دارد، تبدیل کلید عددی به رشته ضروری است.
      // اما در اینج، user.role همیشه یک عدد 0 یا 1 یا... است و -1 نیست.
      const roleName = roleMap[user.role] || "ناشناخته";
      const wallet =
        user.walletBalance !== null
          ? user.walletBalance.toString()
          : "0";

      return [
        `#${user.id}`,
        user.name,
        user.email,
        user.phone,
        user.joinDate,
        wallet,
        roleName,
      ].join(",");
    });

    const csvContent = [headers, ...csvRows].join("\n");

    const blob = new Blob(
      [new Uint8Array([0xef, 0xbb, 0xbf]), csvContent],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Users-List-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- مدیریت وضعیت‌های بارگیری و خطا ---

  if (isLoading) {
    return (
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md text-center">
        <p className="text-black dark:text-white">
          در حال بارگیری اطلاعات کاربران...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md text-center">
        <p className="text-danger-500">خطا: {error}</p>
        <p className="text-gray-500 mt-2">
          لطفاً اتصال اینترنت خود و آدرس API را بررسی کنید.
        </p>
      </div>
    );
  }

  // --- رندر نهایی کامپوننت ---

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
      {/* هدر کارت: فیلترها و دکمه‌ها */}
      <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 items-center">
          {/* فیلتر سطح دسترسی */}
          <select
            className="h-[36px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-2 text-black dark:text-white"
            value={roleFilter}
            onChange={(e) => {
              // **تغییر: تبدیل مقدار به عدد**
              setRoleFilter(Number(e.target.value)); 
              setCurrentPage(1);
            }}
          >
            {/* **تغییر: تبدیل Object.entries به صورت صحیح برای roleMap** */}
            {Object.entries(roleMap).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>

          {/* جستجوی کاربران */}
          <form
            className="relative sm:w-[265px]"
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
              <i className="material-symbols-outlined !text-[20px]">search</i>
            </label>
            <input
              type="text"
              placeholder="جستجوی کاربر..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] rtl:pl-[13px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
            />
          </form>
        </div>

        {/* دکمه‌های عملیاتی */}
        <div className="flex gap-2 items-center mt-3 sm:mt-0">
          <button
            onClick={exportToCSV}
            disabled={filteredUsers.length === 0}
            className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-success-500 border border-success-500 hover:bg-success-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
              <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                download
              </i>
              خروجی اکسل
            </span>
          </button>
        </div>

        <div>
          <Link
            href="/admin/users/add-user"
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
                  تاریخ عضویت
                </th>
                <th className="px-[20px] py-[11px] bg-primary-50 dark:bg-[#15203c]">
                  کیف پول
                </th>
                <th className="px-[20px] py-[11px] bg-primary-50 dark:bg-[#15203c]">
                  سطح دسترسی
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
                    {user.id}
                  </td>
                  <td className="px-[20px] py-[17px] border-b border-gray-100 dark:border-[#172036]">
                    <div className="flex items-center">
                      <div className="w-[40px] h-[40px] rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                        <img
                          src={user.image}
                          className="inline-block w-full h-full object-cover"
                          alt="تصویر کاربر"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src =
                              "/images/admin.png";
                          }}
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
                    {user.joinDate}
                  </td>
                  <td className="px-[20px] py-[17px] border-b border-gray-100 dark:border-[#172036]">
                    {user.walletBalance !== null
                      ? `${user.walletBalance.toLocaleString("fa-IR")} تومان`
                      : "اطلاعات دریافت نشد"}
                  </td>
                  <td className="px-[20px] py-[17px] border-b border-gray-100 dark:border-[#172036]">
                    {getRoleBadge(user.role)}
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

                      {/* دکمه حذف به‌روزرسانی شده */}
                      <button
                        className="text-danger-500 disabled:opacity-50 disabled:cursor-wait"
                        onClick={() => handleDelete(user.id)}
                        disabled={deletingId === user.id}
                      >
                        <i className="material-symbols-outlined !text-md">
                          {deletingId === user.id ? "sync" : "delete"}
                        </i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* نمایش پیام در صورت خالی بودن */}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center p-5 text-gray-500"
                  >
                    {users.length === 0
                      ? "هیچ کاربری در سیستم ثبت نشده است."
                      : "هیچ کاربری با این فیلترها یافت نشد."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* پیجینگ */}
        {totalPages > 1 && (
          <div className="px-[20px] md:px-[25px] pt-[12px] md:pt-[14px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              نمایش {filteredUsers.length > 0 ? startIndex + 1 : 0} تا{" "}
              {Math.min(startIndex + itemsPerPage, filteredUsers.length)} از{" "}
              {filteredUsers.length} کاربر
            </p>
            <ol className="mt-[10px] sm:mt-0 flex gap-1">
              <li>
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="w-[31px] h-[31px] rounded-md border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white disabled:opacity-50"
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
                        : "hover:bg-primary-500 hover:text-white"
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
                  className="w-[31px] h-[31px] rounded-md border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white disabled:opacity-50"
                >
                  <i className="material-symbols-outlined">chevron_left</i>
                </button>
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersListTable;