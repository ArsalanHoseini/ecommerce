"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Refund {
  id: string;
  customer: string;
  avatar: string;
  date: string;
  orderReturned: number;
  orderRefunded: number;
  orderReplaced: number;
  totalRefunded: number;
  totalReplaced: number;
}

const initialRefunds: Refund[] = [
  {
    id: "#999",
    customer: "اولیویر خان",
    avatar: "/images/users/user6.jpg",
    date: "۱۹ ژوئن ۲۰۲۴",
    orderReturned: 2,
    orderRefunded: 1,
    orderReplaced: 0,
    totalRefunded: 42.0,
    totalReplaced: 50.0,
  },
  {
    id: "#998",
    customer: "مارسیا بیکر",
    avatar: "/images/users/user7.jpg",
    date: "۱۹ ژوئن ۲۰۲۴",
    orderReturned: 1,
    orderRefunded: 1,
    orderReplaced: 0,
    totalRefunded: 32.0,
    totalReplaced: 54.0,
  },
  {
    id: "#997",
    customer: "کارولین بارنز",
    avatar: "/images/users/user8.jpg",
    date: "۱۸ ژوئن ۲۰۲۴",
    orderReturned: 2,
    orderRefunded: 7,
    orderReplaced: 4,
    totalRefunded: 53.0,
    totalReplaced: 67.0,
  },
  {
    id: "#996",
    customer: "دونا میلر",
    avatar: "/images/users/user9.jpg",
    date: "۱۷ ژوئن ۲۰۲۴",
    orderReturned: 3,
    orderRefunded: 1,
    orderReplaced: 2,
    totalRefunded: 42.0,
    totalReplaced: 56.0,
  },
  {
    id: "#995",
    customer: "باربارا کراس",
    avatar: "/images/users/user10.jpg",
    date: "۱۷ ژوئن ۲۰۲۴",
    orderReturned: 5,
    orderRefunded: 2,
    orderReplaced: 7,
    totalRefunded: 24.0,
    totalReplaced: 45.0,
  },
  {
    id: "#994",
    customer: "ربکا بلاک",
    avatar: "/images/users/user11.jpg",
    date: "۱۶ ژوئن ۲۰۲۴",
    orderReturned: 5,
    orderRefunded: 6,
    orderReplaced: 2,
    totalRefunded: 53.0,
    totalReplaced: 67.0,
  },
  {
    id: "#993",
    customer: "جیمز ترنر",
    avatar: "/images/users/user12.jpg",
    date: "۱۵ ژوئن ۲۰۲۴",
    orderReturned: 2,
    orderRefunded: 3,
    orderReplaced: 1,
    totalRefunded: 31.0,
    totalReplaced: 40.0,
  },
  {
    id: "#992",
    customer: "سوفیا مارتین",
    avatar: "/images/users/user13.jpg",
    date: "۱۴ ژوئن ۲۰۲۴",
    orderReturned: 6,
    orderRefunded: 4,
    orderReplaced: 3,
    totalRefunded: 65.0,
    totalReplaced: 72.0,
  },
  {
    id: "#991",
    customer: "اما کالینز",
    avatar: "/images/users/user14.jpg",
    date: "۱۳ ژوئن ۲۰۲۴",
    orderReturned: 2,
    orderRefunded: 1,
    orderReplaced: 0,
    totalRefunded: 22.0,
    totalReplaced: 30.0,
  },
  {
    id: "#990",
    customer: "بنجامین اسکات",
    avatar: "/images/users/user15.jpg",
    date: "۱۲ ژوئن ۲۰۲۴",
    orderReturned: 4,
    orderRefunded: 2,
    orderReplaced: 1,
    totalRefunded: 50.0,
    totalReplaced: 55.0,
  },
  {
    id: "#989",
    customer: "ایزابلا چانگ",
    avatar: "/images/users/user16.jpg",
    date: "۱۱ ژوئن ۲۰۲۴",
    orderReturned: 3,
    orderRefunded: 1,
    orderReplaced: 2,
    totalRefunded: 40.0,
    totalReplaced: 60.0,
  },
  {
    id: "#988",
    customer: "لوکاس تامپسون",
    avatar: "/images/users/user17.jpg",
    date: "۱۰ ژوئن ۲۰۲۴",
    orderReturned: 1,
    orderRefunded: 0,
    orderReplaced: 1,
    totalRefunded: 15.0,
    totalReplaced: 20.0,
  },
  {
    id: "#987",
    customer: "النور فاستر",
    avatar: "/images/users/user18.jpg",
    date: "۰۹ ژوئن ۲۰۲۴",
    orderReturned: 2,
    orderRefunded: 2,
    orderReplaced: 1,
    totalRefunded: 30.0,
    totalReplaced: 40.0,
  },
  {
    id: "#986",
    customer: "نوح پترسون",
    avatar: "/images/users/user19.jpg",
    date: "۰۸ ژوئن ۲۰۲۴",
    orderReturned: 5,
    orderRefunded: 3,
    orderReplaced: 2,
    totalRefunded: 55.0,
    totalReplaced: 65.0,
  },
  {
    id: "#985",
    customer: "هارپر مور",
    avatar: "/images/users/user20.jpg",
    date: "۰۷ ژوئن ۲۰۲۴",
    orderReturned: 1,
    orderRefunded: 1,
    orderReplaced: 0,
    totalRefunded: 10.0,
    totalReplaced: 15.0,
  },
  {
    id: "#984",
    customer: "میسون رابرتس",
    avatar: "/images/users/user21.jpg",
    date: "۰۶ ژوئن ۲۰۲۴",
    orderReturned: 3,
    orderRefunded: 2,
    orderReplaced: 1,
    totalRefunded: 33.0,
    totalReplaced: 44.0,
  },
  {
    id: "#983",
    customer: "آوا ویلیامز",
    avatar: "/images/users/user22.jpg",
    date: "۰۵ ژوئن ۲۰۲۴",
    orderReturned: 4,
    orderRefunded: 3,
    orderReplaced: 2,
    totalRefunded: 45.0,
    totalReplaced: 58.0,
  },
  {
    id: "#982",
    customer: "الیجاه رید",
    avatar: "/images/users/user23.jpg",
    date: "۰۴ ژوئن ۲۰۲۴",
    orderReturned: 2,
    orderRefunded: 1,
    orderReplaced: 1,
    totalRefunded: 20.0,
    totalReplaced: 25.0,
  },
  {
    id: "#981",
    customer: "مدیسون کارتر",
    avatar: "/images/users/user24.jpg",
    date: "۰۳ ژوئن ۲۰۲۴",
    orderReturned: 5,
    orderRefunded: 4,
    orderReplaced: 3,
    totalRefunded: 60.0,
    totalReplaced: 75.0,
  },
  {
    id: "#980",
    customer: "جکسون بنت",
    avatar: "/images/users/user25.jpg",
    date: "۰۲ ژوئن ۲۰۲۴",
    orderReturned: 1,
    orderRefunded: 0,
    orderReplaced: 0,
    totalRefunded: 5.0,
    totalReplaced: 10.0,
  },
];

const RefundsTable: React.FC = () => {
  const [refunds] = useState<Refund[]>(initialRefunds);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const refundsPerPage = 10;

  const filteredRefunds = refunds.filter(
    (refund) =>
      refund.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.id.includes(searchTerm) ||
      refund.date.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredRefunds.length / refundsPerPage);
  const paginatedRefunds = filteredRefunds.slice(
    (currentPage - 1) * refundsPerPage,
    currentPage * refundsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="جستجو..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    شناسه
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                    مشتری
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                    تاریخ
                  </th>
                  <th className="font-medium ltr:text-right rtl:text-left px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                    تعداد سفارش بازگشتی
                  </th>
                  <th className="font-medium ltr:text-right rtl:text-left px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                    تعداد سفارش مسترد شده
                  </th>
                  <th className="font-medium ltr:text-right rtl:text-left px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                    تعداد سفارش جایگزین
                  </th>
                  <th className="font-medium ltr:text-right rtl:text-left px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                    کل مسترد شده
                  </th>
                  <th className="font-medium ltr:text-right rtl:text-left px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                    کل جایگزین شده
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {paginatedRefunds.length > 0 ? (
                  paginatedRefunds.map((refund) => (
                    <tr key={refund.id}>
                      <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        {refund.id}
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <div className="flex items-center">
                          <div className="w-[40px] rounded-full">
                            <Image
                              src={refund.avatar}
                              alt={refund.customer}
                              className="inline-block rounded-full"
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="ltr:ml-[12px] rtl:mr-[12px]">
                            <span className="block font-medium">
                              {refund.customer}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        {refund.date}
                      </td>

                      <td className="text-gray-500 dark:text-gray-400 ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        {refund.orderReturned}
                      </td>

                      <td className="text-gray-500 dark:text-gray-400 ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        {refund.orderRefunded}
                      </td>

                      <td className="text-gray-500 dark:text-gray-400 ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        {refund.orderReplaced}
                      </td>

                      <td className="text-gray-500 dark:text-gray-400 ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        ${refund.totalRefunded.toFixed(2)}
                      </td>

                      <td className="text-gray-500 dark:text-gray-400 ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        ${refund.totalReplaced.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      نتیجه‌ای یافت نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] py-[12px] md:py-[14px] rounded-b-md border-l border-r border-b border-gray-100 dark:border-[#172036] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              نمایش {paginatedRefunds.length} از {filteredRefunds.length} نتیجه
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px]">
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
                <li key={index} className="inline-block mx-[2px]">
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

              <li className="inline-block mx-[2px]">
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

export default RefundsTable;
