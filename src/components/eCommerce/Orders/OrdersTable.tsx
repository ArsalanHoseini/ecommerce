"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import OrderStatusModalButton from "./OrderStatusModalButton";

// تعریف نوع سفارش
type Order = {
  orderId: string;
  customer: string;
  customerImage: string;
  items: number;
  created: string;
  total: string;
  vendor: string;
  status: string;
  viewLink: string;
};

const OrdersTable: React.FC = () => {
  // مقداردهی اولیه سفارش‌ها
  const [orders, setOrders] = useState<Order[]>([
    {
      orderId: "#JAN-2345",
      customer: "سارا جانسون",
      customerImage: "/images/users/user1.jpg",
      items: 120,
      created: "۱۲ ژوئن ۲۰۲۴",
      total: "۱۰,۴۹۰ دلار",
      vendor: "دنیس متیوز",
      status: "ارسال شد",
      viewLink: "/admin/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-1323",
      customer: "مایکل اسمیت",
      customerImage: "/images/users/user2.jpg",
      items: 62,
      created: "۱۱ ژوئن ۲۰۲۴",
      total: "۶,۵۷۵ دلار",
      vendor: "کاترین ترنر",
      status: "تایید شد",
      viewLink: "/admin/ecommerce/order-details/",
    },
    {
      orderId: "#DEC-1234",
      customer: "امیلی براون",
      customerImage: "/images/users/user3.jpg",
      items: 49,
      created: "۱۰ ژوئن ۲۰۲۴",
      total: "۱۲,۸۷۰ دلار",
      vendor: "جان والدز",
      status: "در انتظار",
      viewLink: "/admin/ecommerce/order-details/",
    },
    {
      orderId: "#DEC-1098",
      customer: "اشلی دیویس",
      customerImage: "/images/users/user5.jpg",
      items: 82,
      created: "۰۸ ژوئن ۲۰۲۴",
      total: "۴,۶۸۰ دلار",
      vendor: "سوزان رادر",
      status: "رد شد",
      viewLink: "/admin/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-2346",
      customer: "جان دو",
      customerImage: "/images/users/user4.jpg",
      items: 25,
      created: "۰۷ ژوئن ۲۰۲۴",
      total: "۳,۲۵۰ دلار",
      vendor: "جرج ویلیامز",
      status: "ارسال شد",
      viewLink: "/admin/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-2347",
      customer: "جسیکا آدامز",
      customerImage: "/images/users/user6.jpg",
      items: 75,
      created: "۰۶ ژوئن ۲۰۲۴",
      total: "۵,۳۰۰ دلار",
      vendor: "دنیل کوک",
      status: "تایید شد",
      viewLink: "/admin/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-2348",
      customer: "اولیویا مارتین",
      customerImage: "/images/users/user7.jpg",
      items: 90,
      created: "۰۵ ژوئن ۲۰۲۴",
      total: "۸,۲۴۰ دلار",
      vendor: "مایکل وایت",
      status: "در انتظار",
      viewLink: "/admin/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-2349",
      customer: "اتان لی",
      customerImage: "/images/users/user8.jpg",
      items: 150,
      created: "۰۴ ژوئن ۲۰۲۴",
      total: "۱۵,۵۰۰ دلار",
      vendor: "پال گرین",
      status: "ارسال شد",
      viewLink: "/admin/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-2350",
      customer: "سوفیا ترنر",
      customerImage: "/images/users/user9.jpg",
      items: 60,
      created: "۰۳ ژوئن ۲۰۲۴",
      total: "۶,۰۰۰ دلار",
      vendor: "آلیس هریس",
      status: "تایید شد",
      viewLink: "/admin/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-2351",
      customer: "لیام جکسون",
      customerImage: "/images/users/user10.jpg",
      items: 80,
      created: "۰۲ ژوئن ۲۰۲۴",
      total: "۷,۱۲۰ دلار",
      vendor: "رابرت کلارک",
      status: "در انتظار",
      viewLink: "/admin/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-2352",
      customer: "آوا واکر",
      customerImage: "/images/users/user11.jpg",
      items: 110,
      created: "۰۱ ژوئن ۲۰۲۴",
      total: "۹,۸۰۰ دلار",
      vendor: "استیون لوئیس",
      status: "ارسال شد",
      viewLink: "/admin/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-2353",
      customer: "ایزابلا هال",
      customerImage: "/images/users/user12.jpg",
      items: 35,
      created: "۳۱ مه ۲۰۲۴",
      total: "۲,۸۵۰ دلار",
      vendor: "ویلیام نلسون",
      status: "تایید شد",
      viewLink: "/admin/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-2354",
      customer: "لوکاس یانگ",
      customerImage: "/images/users/user13.jpg",
      items: 140,
      created: "۳۰ مه ۲۰۲۴",
      total: "۱۲,۳۰۰ دلار",
      vendor: "دیوید کینگ",
      status: "در انتظار",
      viewLink: "/admin/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-2355",
      customer: "میسون اسکات",
      customerImage: "/images/users/user14.jpg",
      items: 200,
      created: "۲۹ مه ۲۰۲۴",
      total: "۱۹,۵۰۰ دلار",
      vendor: "توماس آدامز",
      status: "ارسال شد",
      viewLink: "/admin/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-2356",
      customer: "شارلوت پرز",
      customerImage: "/images/users/user15.jpg",
      items: 160,
      created: "۲۸ مه ۲۰۲۴",
      total: "۱۴,۸۰۰ دلار",
      vendor: "مری مور",
      status: "تایید شد",
      viewLink: "/admin/ecommerce/order-details/",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("همه"); // فیلتر وضعیت
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // تابع جستجو و فیلتر
  const handleFilter = (query: string, status: string) => {
    let filtered = orders.filter(
      (order) =>
        order.orderId.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.vendor.toLowerCase().includes(query)
    );

    if (status !== "همه") {
      filtered = filtered.filter((order) => order.status === status);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    handleFilter(query, statusFilter);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setStatusFilter(status);
    handleFilter(searchQuery, status);
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = (orderId: string) => {
    const updatedOrders = orders.filter((order) => order.orderId !== orderId);
    setOrders(updatedOrders);
    handleFilter(searchQuery, statusFilter);
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between gap-[10px]">
          <div className="trezo-card-title">
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="جستجوی سفارش..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] rtl:pl-[13px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
          </div>

          {/* فیلتر وضعیت اضافه شد */}
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="h-[36px] rounded-md border border-gray-200 dark:bg-[#15203c] dark:text-white dark:border-[#172036] px-[10px]"
          >
            <option value="همه">همه وضعیت‌ها</option>
            <option value="ارسال شد">ارسال شد</option>
            <option value="تایید شد">تایید شد</option>
            <option value="در انتظار">در انتظار</option>
            <option value="رد شد">رد شد</option>
          </select>
        </div>

        {/* جدول سفارش‌ها */}
        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full table-fixed border-collapse">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="w-[120px] font-medium px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] text-right whitespace-nowrap first:rounded-tl-md">
                    شناسه سفارش
                  </th>
                  <th className="w-[180px] font-medium px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] text-right whitespace-nowrap">
                    مشتری
                  </th>
                  <th className="w-[110px] font-medium px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] text-right whitespace-nowrap">
                    تعداد کالا
                  </th>
                  <th className="w-[130px] font-medium px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] text-right whitespace-nowrap">
                    تاریخ ثبت
                  </th>
                  <th className="w-[130px] font-medium px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] text-right whitespace-nowrap">
                    مبلغ کل
                  </th>
                  <th className="w-[150px] font-medium px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] text-right whitespace-nowrap">
                    فروشنده
                  </th>
                  <th className="w-[120px] font-medium px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] text-right whitespace-nowrap">
                    وضعیت
                  </th>
                  <th className="w-[110px] font-medium px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] text-center whitespace-nowrap">
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {currentOrders.map((order, index) => (
                  <tr key={index}>
                    <td className="px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] text-right">
                      {order.orderId}
                    </td>

                    <td className="px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] text-right">
                      <div className="flex items-center">
                        <div className="w-[40px] h-[40px] rounded-md overflow-hidden">
                          <Image
                            src={order.customerImage}
                            alt="تصویر مشتری"
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div className="ltr:ml-[12px] rtl:mr-[12px]">
                          <span className="block font-medium">
                            {order.customer}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] text-right">
                      {order.items}
                    </td>

                    <td className="px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] text-right">
                      {order.created}
                    </td>

                    <td className="px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] text-right">
                      {order.total}
                    </td>

                    <td className="px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] text-right">
                      {order.vendor}
                    </td>

                    <td className="px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] text-right">
                      <span
                        className={`px-[8px] py-[3px] inline-block rounded-sm font-medium text-xs dark:bg-[#15203c] ${
                          order.status === "ارسال شد"
                            ? "bg-success-100 text-success-600"
                            : order.status === "تایید شد"
                            ? "bg-primary-50 text-primary-500"
                            : order.status === "در انتظار"
                            ? "bg-warning-50 text-warning-500"
                            : "bg-danger-100 text-danger-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={order.viewLink}
                          className="flex items-center justify-center w-10 h-10 rounded-full text-primary-500 hover:bg-primary-50 dark:hover:bg-zinc-800 transition"
                          title="مشاهده سفارش"
                        >
                          <i className="material-symbols-outlined text-[22px] leading-none">
                            visibility
                          </i>
                        </Link>

                        <button
                          type="button"
                          className="flex items-center justify-center w-10 h-10 rounded-full text-primary-500 hover:bg-primary-50 dark:hover:bg-zinc-800 transition"
                          title="تغییر وضعیت سفارش"
                        >
                          <OrderStatusModalButton
                            orderId={order.orderId}
                            initialStatus={order.status}
                            onStatusUpdated={() => {}}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* صفحه‌بندی */}
          <div className="px-[20px] py-[12px] md:py-[14px] rounded-b-md border-l border-r border-b border-gray-100 dark:border-[#172036] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              نمایش {startIndex + 1} تا {startIndex + currentOrders.length} از
              مجموع {filteredOrders.length} سفارش
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_right
                  </i>
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                >
                  <button
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                      currentPage === index + 1
                        ? "bg-primary-500 text-white border-primary-500"
                        : "border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersTable;
