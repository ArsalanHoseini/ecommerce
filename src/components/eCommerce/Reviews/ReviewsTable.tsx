"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface Review {
  id: string;
  reviewer: string;
  email: string;
  avatar: string;
  rating: number;
  reviewText: string;
  productImg: string;
  productName: string;
  viewLink: string;
  date: string;
  time: string;
  status: "Pending" | "Published";
}

const initialReviews: Review[] = [
  {
    id: "#999",
    reviewer: "اولیویا کلارک",
    email: "olivia@trezo.com",
    avatar: "/images/users/user6.jpg",
    rating: 5,
    reviewText: "لورم ایپسوم متن ساختگی صنعت چاپ است.",
    productImg: "/images/products/product1.jpg",
    productName: "مچ‌بند هوشمند",
    viewLink: "/ecommerce/product-details/",
    date: "17 دسامبر 2024",
    time: "08:30 بعدازظهر",
    status: "Pending",
  },
  {
    id: "#998",
    reviewer: "زفیرف زینگ",
    email: "zephyr@trezo.com",
    avatar: "/images/users/user7.jpg",
    rating: 4.5,
    reviewText:
      "لورم ایپسوم از متن استاندارد صنعت چاپ از قرن ۱۵ استفاده می‌کند.",
    productImg: "/images/products/product2.jpg",
    productName: "هدفون",
    viewLink: "/ecommerce/product-details/",
    date: "16 دسامبر 2024",
    time: "10:11 بعدازظهر",
    status: "Pending",
  },
  {
    id: "#997",
    reviewer: "نوا نکتار",
    email: "nova@trezo.com",
    avatar: "/images/users/user8.jpg",
    rating: 4,
    reviewText:
      "این متن نه تنها پنج قرن را پشت سر گذاشته بلکه وارد تنظیمات الکترونیکی نیز شده است.",
    productImg: "/images/products/product3.jpg",
    productName: "آیفون ۱۵ پلاس",
    viewLink: "/ecommerce/product-details/",
    date: "15 دسامبر 2024",
    time: "11:11 صبح",
    status: "Pending",
  },
  {
    id: "#996",
    reviewer: "ایزابلا چانگ",
    email: "isabella@trezo.com",
    avatar: "/images/users/user9.jpg",
    rating: 3.5,
    reviewText:
      "این متن در دههٔ ۱۹۶۰ با انتشار ورقه‌های Letraset حاوی قطعات لورم ایپسوم محبوب شد.",
    productImg: "/images/products/product4.jpg",
    productName: "بلوتوث اسپیکر",
    viewLink: "/ecommerce/product-details/",
    date: "14 دسامبر 2024",
    time: "09:45 صبح",
    status: "Pending",
  },
  {
    id: "#995",
    reviewer: "آلینا بنت",
    email: "alina@trezo.com",
    avatar: "/images/users/user10.jpg",
    rating: 5,
    reviewText:
      "این یک حقیقت قدیمی است که خواننده با محتوای قابل خواندن صفحه منحرف خواهد شد.",
    productImg: "/images/products/product5.jpg",
    productName: "ایربادز نسل دوم",
    viewLink: "/ecommerce/product-details/",
    date: "13 دسامبر 2024",
    time: "07:15 بعدازظهر",
    status: "Published",
  },
  {
    id: "#994",
    reviewer: "لیام هارپر",
    email: "liam@trezo.com",
    avatar: "/images/users/user11.jpg",
    rating: 4.5,
    reviewText:
      "برخلاف باور عموم، لورم ایپسوم فقط یک متن تصادفی نیست.",
    productImg: "/images/products/product6.jpg",
    productName: "مچ‌بند هوشمند",
    viewLink: "/ecommerce/product-details/",
    date: "12 دسامبر 2024",
    time: "05:22 بعدازظهر",
    status: "Published",
  },
  {
    id: "#993",
    reviewer: "اما کالینز",
    email: "emma@trezo.com",
    avatar: "/images/users/user12.jpg",
    rating: 4,
    reviewText:
      "بسیاری از بسته‌های نشر رومیزی و ویرایشگرهای وب اکنون از لورم ایپسوم به‌عنوان متن نمونه پیش‌فرض استفاده می‌کنند.",
    productImg: "/images/products/product7.jpg",
    productName: "مچ‌بند هوشمند",
    viewLink: "/ecommerce/product-details/",
    date: "11 دسامبر 2024",
    time: "02:18 بعدازظهر",
    status: "Published",
  },
  {
    id: "#992",
    reviewer: "سوفیا مارتین",
    email: "sophia@trezo.com",
    avatar: "/images/users/user13.jpg",
    rating: 4,
    reviewText:
      "بخش استاندارد لورم ایپسوم که از قرن ۱۵۰۰ استفاده می‌شود در زیر برای علاقه‌مندان بازتولید شده است.",
    productImg: "/images/products/product1.jpg",
    productName: "مچ‌بند هوشمند",
    viewLink: "/ecommerce/product-details/",
    date: "10 دسامبر 2024",
    time: "01:45 بعدازظهر",
    status: "Published",
  },
  {
    id: "#991",
    reviewer: "جیمز ترنر",
    email: "james@trezo.com",
    avatar: "/images/users/user14.jpg",
    rating: 3,
    reviewText:
      "توزیع حروف تا حدی طبیعی است و با 'محتوا اینجا، محتوا آنجا' متفاوت است و به انگلیسی قابل خواندن شبیه می‌شود.",
    productImg: "/images/products/product1.jpg",
    productName: "مچ‌بند هوشمند",
    viewLink: "/ecommerce/product-details/",
    date: "09 دسامبر 2024",
    time: "10:05 صبح",
    status: "Published",
  },
  {
    id: "#990",
    reviewer: "بنجامین اسکات",
    email: "benjamin@trezo.com",
    avatar: "/images/users/user15.jpg",
    rating: 5,
    reviewText:
      "هدف استفاده از لورم ایپسوم این است که توزیع حروف تقریبا طبیعی باشد و قابل خواندن انگلیسی به نظر برسد.",
    productImg: "/images/products/product1.jpg",
    productName: "مچ‌بند هوشمند",
    viewLink: "/ecommerce/product-details/",
    date: "08 دسامبر 2024",
    time: "03:25 بعدازظهر",
    status: "Pending",
  },
];

const ReviewsTable: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const reviewsPerPage = 5;

  const handleDelete = (reviewId: string) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== reviewId)
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
        <div className="trezo-card-title">
          <form className="relative sm:w-[265px]">
            <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
              <i className="material-symbols-outlined !text-[20px]">search</i>
            </label>
            <input
              type="text"
              placeholder="جستجوی نظر..."
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
            <thead className="text-black dark:text-white bg-gray-50 dark:bg-[#15203c]">
              <tr>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                  شناسه
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  نویسنده
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  نظر
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  محصول
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  تاریخ
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  وضعیت
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  عملیات
                </th>
              </tr>
            </thead>

            <tbody className="text-black dark:text-white">
              {paginatedReviews.map((review) => (
                <tr
                  key={review.id}
                  className="border-b border-gray-100 dark:border-[#172036]"
                >
                  <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                    {review.id}
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                    <div className="flex items-center">
                      <div className="w-[40px] rounded-full">
                        <Image
                          src={review.avatar}
                          alt={review.reviewer}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </div>
                      <div className="ltr:ml-[12px] rtl:mr-[12px]">
                        <span className="font-medium">{review.reviewer}</span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">
                          {review.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                    <div className="leading-none flex items-center gap-[2px] text-lg text-[#ee8336]">
                      {Array.from({ length: 5 }, (_, i) => (
                        <i
                          key={i}
                          className={`ri-star${
                            i + 1 <= review.rating ? "-fill" : "-line"
                          }`}
                        ></i>
                      ))}
                    </div>
                    <p className="mt-[10px] w-[350px]">{review.reviewText}</p>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                    <div className="flex items-center">
                      <div className="rounded-md w-[40px]">
                        <Image
                          src={review.productImg}
                          className="inline-block rounded-md"
                          alt={review.productName}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="ltr:ml-[12px] rtl:mr-[12px]">
                        <Link
                          href={review.viewLink}
                          className="block font-medium md:text-[15px] transition-all hover:text-primary-500"
                        >
                          {review.productName}
                        </Link>
                      </div>
                    </div>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                    <span className="block">{review.date}</span>
                    <span className="block">{review.time}</span>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                    <span
                      className={`px-[8px] py-[3px] inline-block rounded-sm font-medium text-xs dark:bg-[#15203c] ${
                        review.status === "Published"
                          ? "bg-danger-50 text-danger-500"
                          : "bg-primary-50 text-primary-500"
                      }`}
                    >
                      {review.status === "Published" ? "منتشر شده" : "در انتظار"}
                    </span>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                    <div className="flex items-center gap-[9px]">
                      <button
                        type="button"
                        className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip"
                      >
                        <i className="material-symbols-outlined !text-md">
                          download_done
                        </i>
                      </button>

                      <button
                        type="button"
                        className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip"
                      >
                        <i className="material-symbols-outlined !text-md">
                          reply
                        </i>
                      </button>

                      <button
                        type="button"
                        className="text-danger-500 leading-none custom-tooltip"
                        onClick={() => handleDelete(review.id)}
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

        <div className="px-[20px] py-[12px] md:py-[14px] rounded-b-md border-l border-r border-b border-gray-100 dark:border-[#172036] sm:flex sm:items-center justify-between">
          <p className="!mb-0 !text-sm">
            نمایش {reviewsPerPage} از {reviews.length} نظر
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
  );
};

export default ReviewsTable;
