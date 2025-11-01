"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const customersData = [
  {
    orderId: "#JAN-121",
    status: "در انتظار",
    amount: "۶,۸۵۵ $",
    rewards: "۱۲ $",
    date: "۱۴ ژانویه ۲۰۲۴",
  },
  {
    orderId: "#JAN-120",
    status: "موفق",
    amount: "۲۵۸ $",
    rewards: "۹ $",
    date: "۱۳ ژانویه ۲۰۲۴",
  },
  {
    orderId: "#JAN-119",
    status: "رد شده",
    amount: "۳,۸۹۰ $",
    rewards: "۱۱ $",
    date: "۱۲ ژانویه ۲۰۲۴",
  },
  {
    orderId: "#JAN-118",
    status: "موفق",
    amount: "۲,۵۰۰ $",
    rewards: "۲۳.۴۲ $",
    date: "۱۱ ژانویه ۲۰۲۴",
  },
  {
    orderId: "#JAN-117",
    status: "موفق",
    amount: "۸,۲۰۰ $",
    rewards: "۱۰.۸۴ $",
    date: "۱۰ ژانویه ۲۰۲۴",
  },
  {
    orderId: "#JAN-116",
    status: "رد شده",
    amount: "۶۴۰ $",
    rewards: "۳.۲۱ $",
    date: "۰۹ ژانویه ۲۰۲۴",
  },
  {
    orderId: "#JAN-115",
    status: "موفق",
    amount: "۹,۱۰۰ $",
    rewards: "۴۳.۲۱ $",
    date: "۰۸ ژانویه ۲۰۲۴",
  },
  {
    orderId: "#JAN-114",
    status: "در انتظار",
    amount: "۵۰۰ $",
    rewards: "۲ $",
    date: "۰۷ ژانویه ۲۰۲۴",
  },
];

const TransactionHistory: React.FC<{ name: string }> = ({ name }) => {
  const [selectedOption, setSelectedOption] = useState<string>("هفته گذشته");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`گزینه انتخاب شده: ${option}`);
  };

  // Table pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const totalPages = Math.ceil(customersData.length / perPage);

  const indexOfLastTransaction = currentPage * perPage;
  const indexOfFirstTransaction = indexOfLastTransaction - perPage;
  const currentTransactions = customersData.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const handlePaginationClick = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handlePrevClick = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextClick = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <h5 className="!mb-0">{name} - تاریخچه تراکنش‌ها</h5>

        <div className="trezo-card-subtitle">
          <Menu as="div" className="trezo-card-dropdown relative">
            <MenuButton className="trezo-card-dropdown-btn inline-block transition-all hover:text-primary-500">
              <span className="inline-block relative ltr:pr-[17px] rtl:pl-[17px]">
                {selectedOption}
                <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
              </span>
            </MenuButton>

            <MenuItems className="transition-all bg-white shadow-3xl rounded-md top-full absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none">
              {["روز گذشته", "هفته گذشته", "ماه گذشته", "سال گذشته"].map(
                (option) => (
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
                )
              )}
            </MenuItems>
          </Menu>
        </div>
      </div>

      <div className="trezo-card-content">
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead className="text-black dark:text-white">
              <tr>
                <th className="px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c]">
                  شناسه سفارش
                </th>
                <th className="px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c]">
                  وضعیت
                </th>
                <th className="px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c]">
                  مبلغ
                </th>
                <th className="px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c]">
                  امتیاز
                </th>
                <th className="px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c]">
                  تاریخ
                </th>
              </tr>
            </thead>

            <tbody className="text-black dark:text-white">
              {currentTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td className="px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-500 dark:text-gray-400">
                      {transaction.orderId}
                    </span>
                  </td>
                  <td className="px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                    <span
                      className={`px-[8px] py-[3px] inline-block rounded-sm font-medium text-xs ${
                        transaction.status === "در انتظار"
                          ? "bg-warning-50 dark:bg-[#15203c] text-warning-500"
                          : transaction.status === "موفق"
                          ? "bg-primary-50 dark:bg-[#15203c] text-primary-500"
                          : "bg-danger-50 dark:bg-[#15203c] text-danger-500"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                    {transaction.amount}
                  </td>
                  <td className="px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                    {transaction.rewards}
                  </td>
                  <td className="px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-500 dark:text-gray-400">
                      {transaction.date}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-[20px] py-[12px] md:py-[14px] rounded-b-md border-l border-r border-b border-gray-100 dark:border-[#172036] sm:flex sm:items-center justify-between">
          <p className="!mb-0 !text-sm">
            نمایش {indexOfFirstTransaction + 1} تا {indexOfLastTransaction} از{" "}
            {customersData.length} نتیجه
          </p>

          <ol className="mt-[10px] sm:mt-0 flex">
            <li>
              <button
                onClick={handlePrevClick}
                className="w-[31px] h-[31px] rounded-md border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white"
              >
                <i className="material-symbols-outlined">chevron_right</i>
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index}>
                <button
                  onClick={() => handlePaginationClick(index + 1)}
                  className={`w-[31px] h-[31px] rounded-md border ${
                    currentPage === index + 1
                      ? "border-primary-500 bg-primary-500 text-white"
                      : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white"
                  }`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={handleNextClick}
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

export default TransactionHistory;
