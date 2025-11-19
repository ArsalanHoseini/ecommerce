"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  date: string;
  category: string;
  viewLink: string;
  image: string;
  price: number;
  stock: number;
  orders: number;
  amount: number;
  rating: number;
  reviews: number;
  status: "منتشر شده" | "پیش‌نویس";
}

const initialProducts: Product[] = [
  {
    id: "#JAN-950",
    name: "دستبند هوشمند مدل FitBand X3",
    date: "۸ خرداد ۱۴۰۳",
    category: "گجت پوشیدنی",
    viewLink: "/admin/ecommerce/product-details",
    image: "/images/products/product1.jpg",
    price: 35.0,
    stock: 750,
    orders: 75,
    amount: 2625,
    rating: 5,
    reviews: 141,
    status: "منتشر شده",
  },
  {
    id: "#JAN-951",
    name: "هدفون بی‌سیم مدل AirSound Z1",
    date: "۹ خرداد ۱۴۰۳",
    category: "لوازم صوتی",
    viewLink: "/admin/ecommerce/product-details",
    image: "/images/products/product2.jpg",
    price: 49.0,
    stock: 825,
    orders: 25,
    amount: 1225,
    rating: 5,
    reviews: 69,
    status: "پیش‌نویس",
  },
  {
    id: "#JAN-952",
    name: "گوشی موبایل آیفون ۱۵ پلاس",
    date: "۱۰ خرداد ۱۴۰۳",
    category: "موبایل",
    viewLink: "/admin/ecommerce/product-details",
    image: "/images/products/product3.jpg",
    price: 99.0,
    stock: 0,
    orders: 55,
    amount: 5445,
    rating: 5,
    reviews: 99,
    status: "منتشر شده",
  },
  {
    id: "#JAN-953",
    name: "لپ‌تاپ ایسوس VivoBook 16",
    date: "۱۱ خرداد ۱۴۰۳",
    category: "رایانه و لپ‌تاپ",
    viewLink: "/admin/ecommerce/product-details",
    image: "/images/products/product4.jpg",
    price: 79.0,
    stock: 220,
    orders: 18,
    amount: 1422,
    rating: 4,
    reviews: 58,
    status: "منتشر شده",
  },
  {
    id: "#JAN-960",
    name: "مانیتور گیمینگ LG UltraGear 27",
    date: "۱۸ خرداد ۱۴۰۳",
    category: "مانیتور و نمایشگر",
    viewLink: "/admin/ecommerce/product-details",
    image: "/images/products/product11.jpg",
    price: 210.0,
    stock: 95,
    orders: 32,
    amount: 6720,
    rating: 5,
    reviews: 124,
    status: "منتشر شده",
  },
  {
    id: "#JAN-961",
    name: "ساعت هوشمند شیائومی Watch S3",
    date: "۱۹ خرداد ۱۴۰۳",
    category: "گجت پوشیدنی",
    viewLink: "/admin/ecommerce/product-details",
    image: "/images/products/product12.jpg",
    price: 65.0,
    stock: 310,
    orders: 42,
    amount: 2730,
    rating: 4,
    reviews: 88,
    status: "منتشر شده",
  },
  {
    id: "#JAN-962",
    name: "هارد اکسترنال Seagate One Touch 2TB",
    date: "۲۰ خرداد ۱۴۰۳",
    category: "ذخیره‌سازی اطلاعات",
    viewLink: "/admin/ecommerce/product-details",
    image: "/images/products/product13.jpg",
    price: 89.0,
    stock: 150,
    orders: 55,
    amount: 4895,
    rating: 5,
    reviews: 73,
    status: "پیش‌نویس",
  },
  {
    id: "#JAN-964",
    name: "پرینتر چندکاره HP LaserJet Pro MFP",
    date: "۲۲ خرداد ۱۴۰۳",
    category: "پرینتر و اسکنر",
    viewLink: "/admin/ecommerce/product-details",
    image: "/images/products/product15.jpg",
    price: 145.0,
    stock: 60,
    orders: 20,
    amount: 2900,
    rating: 5,
    reviews: 96,
    status: "منتشر شده",
  },
  {
    id: "#JAN-963",
    name: "دوربین مداربسته Hikvision Turbo HD",
    date: "۲۱ خرداد ۱۴۰۳",
    category: "امنیت و نظارت",
    viewLink: "/admin/ecommerce/product-details",
    image: "/images/products/product14.jpg",
    price: 59.0,
    stock: 270,
    orders: 33,
    amount: 1947,
    rating: 4,
    reviews: 47,
    status: "منتشر شده",
  },
  {
    id: "#FEB-874",
    name: "دوربین وای فای Xiaomi Smart",
    date: "۱۰ تیر ۱۴۰۳",
    category: "امنیت و نظارت",
    viewLink: "/admin/ecommerce/product-details",
    image: "/images/products/product15.jpg",
    price: 79.0,
    stock: 150,
    orders: 25,
    amount: 1975,
    rating: 4.5,
    reviews: 30,
    status: "منتشر شده",
  },
  {
    id: "#MAR-562",
    name: "دوربین تحت شبکه Dahua IP",
    date: "۵ مرداد ۱۴۰۳",
    category: "امنیت و نظارت",
    viewLink: "/admin/ecommerce/product-details",
    image: "/images/products/product16.jpg",
    price: 120.0,
    stock: 80,
    orders: 10,
    amount: 1200,
    rating: 4.2,
    reviews: 15,
    status: "منتشر شده",
  },
  {
    id: "#APR-431",
    name: "دوربین مدار بسته فول اچ دی Sony",
    date: "۱۵ تیر ۱۴۰۳",
    category: "امنیت و نظارت",
    viewLink: "/admin/ecommerce/product-details",
    image: "/images/products/product17.jpg",
    price: 99.0,
    stock: 200,
    orders: 40,
    amount: 3960,
    rating: 4.7,
    reviews: 52,
    status: "منتشر شده",
  },
  {
    id: "#MAY-908",
    name: "دوربین مداربسته بی سیم TP-Link",
    date: "۲۵ خرداد ۱۴۰۳",
    category: "امنیت و نظارت",
    viewLink: "/admin/ecommerce/product-details",
    image: "/images/products/product18.jpg",
    price: 65.0,
    stock: 120,
    orders: 20,
    amount: 1300,
    rating: 4.3,
    reviews: 28,
    status: "منتشر شده",
  },
  {
    id: "#JUN-215",
    name: "دوربین امنیتی Reolink 4K",
    date: "۳۰ تیر ۱۴۰۳",
    category: "امنیت و نظارت",
    viewLink: "/admin/ecommerce/product-details",
    image: "/images/products/product19.jpg",
    price: 150.0,
    stock: 60,
    orders: 15,
    amount: 2250,
    rating: 4.8,
    reviews: 20,
    status: "منتشر شده",
  },
  {
    id: "#JUL-332",
    name: "دوربین مدار بسته Mini PTZ",
    date: "۱۲ مرداد ۱۴۰۳",
    category: "امنیت و نظارت",
    viewLink: "/admin/ecommerce/product-details",
    image: "/images/products/product20.jpg",
    price: 85.0,
    stock: 100,
    orders: 18,
    amount: 1530,
    rating: 4.1,
    reviews: 22,
    status: "منتشر شده",
  },
  {
    id: "#AUG-421",
    name: "دوربین هوشمند Nest Cam",
    date: "۱۸ خرداد ۱۴۰۳",
    category: "امنیت و نظارت",
    viewLink: "/admin/ecommerce/product-details",
    image: "/images/products/product21.jpg",
    price: 130.0,
    stock: 90,
    orders: 12,
    amount: 1560,
    rating: 4.6,
    reviews: 25,
    status: "منتشر شده",
  },
  {
    id: "#SEP-539",
    name: "دوربین مداربسته حرفه‌ای Hikvision",
    date: "۲ مرداد ۱۴۰۳",
    category: "امنیت و نظارت",
    viewLink: "/admin/ecommerce/product-details",
    image: "/images/products/product22.jpg",
    price: 200.0,
    stock: 50,
    orders: 8,
    amount: 1600,
    rating: 4.9,
    reviews: 18,
    status: "منتشر شده",
  },
];

const ProductsList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const productsPerPage = 10;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    setCurrentPage(1);
  };

  const handleDeleteProduct = (id: string) => {
    setProductsList(productsList.filter((product) => product.id !== id));
  };

  // ✅ فیلتر بر اساس تب انتخاب‌شده
  const filteredProducts = productsList.filter((product) => {
    if (activeTab === 1) return product.status === "منتشر شده";
    if (activeTab === 2) return product.status === "پیش‌نویس";
    return true;
  });

  // ✅ جستجو هم‌زمان در نام و شناسه
  const searchedProducts = filteredProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(searchedProducts.length / productsPerPage);
  const paginatedProducts = searchedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-tabs products-tabs" id="trezo-tabs">
          {/* تب‌ها */}
          <ul className="products-list-navs mb-[10px] md:mb-[15px]">
            {["همه محصولات", "منتشر شده", "پیش‌نویس‌ها"].map((label, index) => (
              <li
                key={index}
                className="nav-item inline-block mb-[10px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0"
              >
                <button
                  onClick={() => handleTabClick(index)}
                  className={`nav-link block font-semibold transition-all rounded-md py-[10px] px-[22px] ${
                    activeTab === index
                      ? "bg-primary-500 text-white"
                      : "bg-gray-50 dark:bg-[#15203c] text-black dark:text-white"
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          <div className="products-tab-content">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
              <div className="trezo-card-title">
                <form className="relative sm:w-[265px]">
                  <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                    <i className="material-symbols-outlined !text-[20px]">
                      search
                    </i>
                  </label>
                  <input
                    type="text"
                    placeholder="جستجو بر اساس نام یا شناسه محصول..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
                  />
                </form>
              </div>

              <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
                <Link
                  href="/admin/ecommerce/create-product/"
                  className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
                >
                  <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                    <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                      add
                    </i>
                    افزودن محصول جدید
                  </span>
                </Link>
              </div>
            </div>

            {/* جدول محصولات */}
            <div className="trezo-card-content">
              <div className="table-responsive overflow-x-auto">
                <table className="w-full">
                  <thead className="text-black dark:text-white">
                    <tr>
                      {[
                        "شناسه",
                        "محصول",
                        "دسته‌بندی",
                        "قیمت",
                        "سفارش‌ها",
                        "موجودی",
                        "مجموع",
                        "امتیاز",
                        "وضعیت",
                        "عملیات",
                      ].map((header, index) => (
                        <th
                          key={index}
                          className="font-medium text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="text-black dark:text-white">
                    {paginatedProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="text-gray-500 px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                          {product.id}
                        </td>

                        <td className="px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                          <div className="flex items-center">
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="rounded-md"
                            />
                            <div className="mr-[12px]">
                              <Link
                                href={product.viewLink}
                                className="font-medium hover:text-primary-500"
                              >
                                {product.name}
                              </Link>
                              <span className="block text-sm text-gray-500">
                                {product.date}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>{product.category}</td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>{product.orders}</td>
                        <td
                          className={
                            product.stock === 0 ? "text-orange-500" : ""
                          }
                        >
                          {product.stock === 0 ? "ناموجود" : product.stock}
                        </td>
                        <td>${product.amount.toFixed(2)}</td>
                        <td>
                          {product.rating} ({product.reviews} نظر)
                        </td>
                        <td>
                          <span
                            className={`px-[8px] py-[3px] rounded-sm font-medium text-xs ${
                              product.status === "منتشر شده"
                                ? "bg-primary-50 text-primary-500"
                                : "bg-orange-100 text-orange-600"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-[9px]">
                            {/* مدیریت موجودی */}
                            <Link
                              href={`/admin/ecommerce/manage-stock/${product.id}`}
                              className="text-green-500"
                              title="مدیریت موجودی"
                            >
                              <i className="material-symbols-outlined">
                                inventory_2
                              </i>
                            </Link>
                            {/* ویرایش محصول */}
                            <Link
                              href={`/admin/ecommerce/edit-product/${product.id}`}
                              className="text-green-500"
                              title="ویرایش"
                            >
                              <i className="material-symbols-outlined">
                                edit
                              </i>
                            </Link>
                            {/* حذف محصول */}
                            <button
                              type="button"
                              className="text-danger-500"
                              title="حذف"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <i className="material-symbols-outlined">
                                delete
                              </i>
                            </button>
                            {/* مشاهده محصول */}
                            <Link
                              href={product.viewLink}
                              className="text-primary-500"
                              title="مشاهده"
                            >
                              <i className="material-symbols-outlined">
                                visibility
                              </i>
                            </Link>                          
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* صفحه‌بندی */}
              <div className="px-[20px] py-[12px] border-t border-gray-100 dark:border-[#172036] sm:flex sm:items-center justify-between">
                <p className="!text-sm">
                  نمایش {paginatedProducts.length} از {searchedProducts.length}{" "}
                  نتیجه
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
        </div>
      </div>
    </>
  );
};

export default ProductsList;
