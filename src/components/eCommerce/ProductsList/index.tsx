"use client";

import React, { useState, useMemo, Fragment, useRef } from "react";
// 💡 استفاده از Headless UI برای دراپ‌داون، که برای استایل‌دهی مینیمال عالی است
import { Menu, Transition } from "@headlessui/react";

interface Product {
  id: string;
  name: string;
  date: string;
  lastUpdated: string;
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
  creator: string;
}

const initialProducts: Product[] = [
  {
    id: "#JAN-950",
    name: "دستبند هوشمند مدل FitBand X3",
    date: "۸ خرداد ۱۴۰۳",
    lastUpdated: "۲ مهر ۱۴۰۳",
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
    creator: "علی احمدی",
  },
  {
    id: "#JAN-951",
    name: "هدفون بی‌سیم مدل AirSound Z1",
    date: "۹ خرداد ۱۴۰۳",
    lastUpdated: "۱۵ شهریور ۱۴۰۳",
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
    creator: "سارا محمدی",
  },
  {
    id: "#JAN-952",
    name: "گوشی موبایل آیفون ۱۵ پلاس",
    date: "۱۰ خرداد ۱۴۰۳",
    lastUpdated: "۱ مهر ۱۴۰۳",
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
    creator: "رضا کریمی",
  },
  {
    id: "#JAN-953",
    name: "لپ‌تاپ ایسوس VivoBook 16",
    date: "۱۱ خرداد ۱۴۰۳",
    lastUpdated: "۲۹ شهریور ۱۴۰۳",
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
    creator: "علی احمدی",
  },
  {
    id: "#JAN-960",
    name: "مانیتور گیمینگ LG UltraGear 27",
    date: "۱۸ خرداد ۱۴۰۳",
    lastUpdated: "۳۰ شهریور ۱۴۰۳",
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
    creator: "جواد نادری",
  },
  {
    id: "#JAN-961",
    name: "ساعت هوشمند شیائومی Watch S3",
    date: "۱۹ خرداد ۱۴۰۳",
    lastUpdated: "۲۸ شهریور ۱۴۰۳",
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
    creator: "سارا محمدی",
  },
  {
    id: "#JAN-962",
    name: "هارد اکسترنال Seagate One Touch 2TB",
    date: "۲۰ خرداد ۱۴۰۳",
    lastUpdated: "۵ مهر ۱۴۰۳",
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
    creator: "رضا کریمی",
  },
  {
    id: "#JAN-964",
    name: "پرینتر چندکاره HP LaserJet Pro MFP",
    date: "۲۲ خرداد ۱۴۰۳",
    lastUpdated: "۱۰ مهر ۱۴۰۳",
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
    creator: "جواد نادری",
  },
  {
    id: "#JAN-963",
    name: "دوربین مداربسته Hikvision Turbo HD",
    date: "۲۱ خرداد ۱۴۰۳",
    lastUpdated: "۳ مهر ۱۴۰۳",
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
    creator: "سارا محمدی",
  },
  {
    id: "#FEB-874",
    name: "دوربین وای فای Xiaomi Smart",
    date: "۱۰ تیر ۱۴۰۳",
    lastUpdated: "۲۵ شهریور ۱۴۰۳",
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
    creator: "علی احمدی",
  },
  {
    id: "#MAR-562",
    name: "دوربین تحت شبکه Dahua IP",
    date: "۵ مرداد ۱۴۰۳",
    lastUpdated: "۷ مهر ۱۴۰۳",
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
    creator: "رضا کریمی",
  },
  {
    id: "#APR-431",
    name: "دوربین مدار بسته فول اچ دی Sony",
    date: "۱۵ تیر ۱۴۰۳",
    lastUpdated: "۱۱ مهر ۱۴۰۳",
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
    creator: "سارا محمدی",
  },
  {
    id: "#MAY-908",
    name: "دوربین مداربسته بی سیم TP-Link",
    date: "۲۵ خرداد ۱۴۰۳",
    lastUpdated: "۱۴ مهر ۱۴۰۳",
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
    creator: "جواد نادری",
  },
  {
    id: "#JUN-215",
    name: "دوربین امنیتی Reolink 4K",
    date: "۳۰ تیر ۱۴۰۳",
    lastUpdated: "۹ مهر ۱۴۰۳",
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
    creator: "رضا کریمی",
  },
  {
    id: "#JUL-332",
    name: "دوربین مدار بسته Mini PTZ",
    date: "۱۲ مرداد ۱۴۰۳",
    lastUpdated: "۴ مهر ۱۴۰۳",
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
    creator: "علی احمدی",
  },
  {
    id: "#AUG-421",
    name: "دوربین هوشمند Nest Cam",
    date: "۱۸ خرداد ۱۴۰۳",
    lastUpdated: "۱۳ مهر ۱۴۰۳",
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
    creator: "جواد نادری",
  },
  {
    id: "#SEP-539",
    name: "دوربین مداربسته حرفه‌ای Hikvision",
    date: "۲ مرداد ۱۴۰۳",
    lastUpdated: "۱۶ شهریور ۱۴۰۳",
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
    creator: "سارا محمدی",
  },
];

const CategoryDropdown: React.FC<{
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}> = ({ categories, selectedCategory, onSelect }) => {
  const currentLabel =
    selectedCategory === "" ? "همه دسته‌بندی‌ها" : selectedCategory;

  return (
    <Menu
      as="div"
      className="relative inline-block text-right ltr:ml-3 rtl:mr-3 z-10"
    >
      <Menu.Button className="inline-flex items-center justify-between w-full sm:w-[180px] h-[38px] rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#15203c] px-3 py-2 text-sm font-medium text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-primary-500">
        <span className="truncate">{currentLabel}</span>
        <i className="material-symbols-outlined !text-[20px] ltr:-mr-1 rtl:-ml-1 opacity-70">
          expand_more
        </i>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute ltr:right-0 rtl:left-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-[#15203c] shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-100 dark:border-gray-700">
          <div className="py-1 max-h-60 overflow-y-auto">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => onSelect("")}
                  className={`block w-full text-right px-4 py-2 text-sm ${
                    active
                      ? "bg-gray-100 dark:bg-gray-700"
                      : "text-gray-700 dark:text-gray-200"
                  } ${
                    selectedCategory === ""
                      ? "font-medium text-primary-500"
                      : ""
                  }`}
                >
                  همه دسته‌بندی‌ها
                </button>
              )}
            </Menu.Item>
            {categories.map((category) => (
              <Menu.Item key={category}>
                {({ active }) => (
                  <button
                    onClick={() => onSelect(category)}
                    className={`block w-full text-right px-4 py-2 text-sm ${
                      active
                        ? "bg-gray-100 dark:bg-gray-700"
                        : "text-gray-700 dark:text-gray-200"
                    } ${
                      selectedCategory === category
                        ? "font-medium text-primary-500"
                        : ""
                    }`}
                  >
                    {category}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const MinimalButton: React.FC<{
  href?: string;
  onClick?: () => void;
  icon: string;
  label: string;
  variant?: "primary" | "secondary" | "danger";
}> = ({ href = "#", onClick, icon, label, variant = "primary" }) => {
  const styles = {
    primary:
      "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500",
    danger:
      "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 focus:ring-red-500",
  };

  if (href === "#") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-2 transition-all rounded-md font-medium px-4 py-2 text-sm ${styles[variant]} focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-gray-900`}
      >
        <i className="material-symbols-outlined !text-[20px]">{icon}</i>
        <span>{label}</span>
      </button>
    );
  }

  return (
    <a
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`inline-flex items-center gap-2 transition-all rounded-md font-medium px-4 py-2 text-sm ${styles[variant]} focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-gray-900`}
    >
      <i className="material-symbols-outlined !text-[20px]">{icon}</i>
      <span>{label}</span>
    </a>
  );
};

const ProductsList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);

  // State برای مودال نمایش JSON
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalJson, setModalJson] = useState<string>("");

  // State برای مودال آپلود (Drag & Drop)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const productsPerPage = 10;

  const uniqueCategories = useMemo(() => {
    const categories = new Set(initialProducts.map((p) => p.category));
    return Array.from(categories).sort();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    setCurrentPage(1);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleDeleteProduct = (id: string) => {
    setProductsList(productsList.filter((product) => product.id !== id));
  };

  // Logic فیلترینگ
  const filteredProducts = productsList.filter((product) => {
    if (activeTab === 1 && product.status !== "منتشر شده") return false;
    if (activeTab === 2 && product.status !== "پیش‌نویس") return false;
    if (activeTab === 7 && product.stock !== 0) return false;

    if (selectedCategory !== "" && product.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const searchedProducts = filteredProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.creator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(searchedProducts.length / productsPerPage);
  const paginatedProducts = searchedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const tabs = [
    "همه محصولات",
    "منتشر شده",
    "پیش‌نویس‌ها",
    "درانتظار تایید",
    "پرفروش",
    "پربازدید",
    "دارای موجودی",
    "فاقد موجودی",
    "ناموجود",
  ];

  // ===== Export Excel =====
  const exportToExcel = async () => {
    const XLSX = await import("xlsx");
    const exportData = productsList.map((p) => ({
      "شناسه": p.id,
      "نام محصول": p.name,
      "سازنده": p.creator,
      "دسته‌بندی": p.category,
      "تاریخ": p.date,
      "آخرین بروزرسانی": p.lastUpdated,
      "قیمت": p.price,
      "موجودی": p.stock,
      "سفارشات": p.orders,
      "مقدار": p.amount,
      "امتیاز": p.rating,
      "بررسی‌ها": p.reviews,
      "وضعیت": p.status,
      "لینک محصول": p.viewLink,
      "آدرس تصویر": p.image,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    const filename = `products_export_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  // ===== منطق اصلی پردازش فایل (مشترک بین Drag و Input) =====
  const processFile = async (file: File) => {
    try {
      const XLSX = await import("xlsx");
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const json: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      const pretty = JSON.stringify(json, null, 2);
      
      setModalJson(pretty);
      setIsUploadModalOpen(false); // بستن مودال آپلود
      setIsModalOpen(true); // باز کردن مودال نمایش نتیجه
    } catch (err) {
      console.error(err);
      alert("خطا در خواندن فایل اکسل. مطمئن شوید فرمت صحیح است.");
    }
  };

  // هندلر انتخاب فایل از طریق Input
  const onFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    await processFile(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ===== Drag and Drop Handlers =====
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        // بررسی ساده فرمت فایل
        if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            processFile(file);
        } else {
            alert("لطفا فقط فایل اکسل آپلود کنید.");
        }
    }
  };

  // باز کردن مودال آپلود به جای کلیک مستقیم روی اینپوت
  const triggerUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  // تریگر کردن اینپوت مخفی داخل مودال
  const triggerFileSelect = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <>
      <div className="bg-white dark:bg-[#0c1427] rounded-lg shadow-sm p-4 md:p-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex rtl:space-x-reverse space-x-6 overflow-x-auto gap-4">
            {tabs.map((label, index) => (
              <button
                key={index}
                onClick={() => handleTabClick(index)}
                className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-all ${
                  activeTab === index
                    ? "border-primary-500 text-primary-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="products-tab-content pt-5">
          <div className="mb-5 md:flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 mb-4 md:mb-0">
              <form className="relative flex-1 max-w-xs">
                <label className="leading-none absolute ltr:left-3 rtl:right-3 text-gray-400 dark:text-gray-500 mt-px top-1/2 -translate-y-1/2">
                  <i className="material-symbols-outlined !text-[20px]">
                    search
                  </i>
                </label>
                <input
                  type="text"
                  placeholder="جستجوی محصول..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-50 border border-gray-300 h-[38px] text-sm rounded-md w-full block text-black pt-2 pb-2.5 ltr:pl-10 rtl:pr-10 placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-gray-700 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </form>

              <CategoryDropdown
                categories={uniqueCategories}
                selectedCategory={selectedCategory}
                onSelect={handleCategorySelect}
              />
            </div>

            <div className="flex items-center gap-3">
              <MinimalButton
                href="/"
                icon="download"
                label="افزودن از دیجیکالا"
                variant="secondary"
              />
              <MinimalButton
                href="/admin/ecommerce/create-product/"
                icon="add"
                label="افزودن محصول"
                variant="primary"
              />

              <MinimalButton
                icon="file_download"
                label="خروجی اکسل"
                onClick={exportToExcel}
                variant="secondary"
              />

              <MinimalButton
                icon="upload_file"
                label="بارگذاری اکسل"
                onClick={triggerUploadModal}
                variant="primary"
              />

              {/* اینپوت مخفی برای انتخاب فایل */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={onFilePicked}
                className="hidden"
              />
            </div>
          </div>

          <div className="trezo-card-content">
            <div className="rounded-lg border border-gray-100 dark:border-[#172036] overflow-hidden">
              <div className="table-responsive overflow-x-auto">
                <table className="w-full min-w-[1200px]">
                  <thead className="bg-gray-50 dark:bg-[#15203c] text-black dark:text-white">
                    <tr>
                      {[
                        "شناسه",
                        "محصول",
                        "سازنده",
                        "دسته‌بندی",
                        "آخرین بروزرسانی",
                        "موجودی",
                        "وضعیت",
                        "عملیات",
                      ].map((header, index) => (
                        <th
                          key={index}
                          className="font-medium text-right text-xs uppercase text-gray-500 dark:text-gray-400 px-4 py-3"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="text-black dark:text-white divide-y divide-gray-100 dark:divide-[#172036]">
                    {paginatedProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 dark:hover:bg-[#15203c]/50 transition-colors"
                      >
                        <td className="text-gray-500 px-4 py-3 text-sm">{product.id}</td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{ width: "40px", height: "40px" }}
                              className="rounded-md object-cover"
                            />
                            <div>
                              <a
                                href={product.viewLink}
                                className="font-medium text-sm text-black dark:text-white hover:text-primary-500"
                              >
                                {product.name}
                              </a>
                              <span className="block text-xs text-gray-500 mt-0.5">{product.date}</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">{product.creator}</td>

                        <td className="text-gray-500 dark:text-gray-400 px-4 py-3 text-sm">{product.category}</td>

                        <td className="text-gray-500 dark:text-gray-400 px-4 py-3 text-sm">{product.lastUpdated}</td>

                        <td className={"px-4 py-3"}>
                          <span
                            className={`px-3 py-1 rounded-full font-medium text-xs ${
                              product.stock === 0
                                ? "bg-orange-50 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400"
                                : "bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
                            }`}
                          >
                            {product.stock === 0 ? "ناموجود" : "موجود "}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full font-medium text-xs ${
                              product.status === "منتشر شده"
                                ? "bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
                                : "bg-orange-50 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <a
                              href={`/admin/ecommerce/manage-stock/${product.id}`}
                              className="text-gray-400 hover:text-blue-500 transition-colors"
                              title="مدیریت موجودی"
                            >
                              <i className="material-symbols-outlined !text-[22px]">inventory_2</i>
                            </a>
                            <a
                              href={`/admin/ecommerce/edit-product/${product.id}`}
                              className="text-gray-400 hover:text-green-500 transition-colors"
                              title="ویرایش"
                            >
                              <i className="material-symbols-outlined !text-[22px]">edit</i>
                            </a>
                            <button
                              type="button"
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              title="حذف"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <i className="material-symbols-outlined !text-[22px]">delete</i>
                            </button>
                            <a
                              href={product.viewLink}
                              className="text-gray-400 hover:text-primary-500 transition-colors"
                              title="مشاهده"
                            >
                              <i className="material-symbols-outlined !text-[22px]">visibility</i>
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-4 py-4 sm:flex sm:items-center justify-between">
              <p className="!text-sm text-gray-600 dark:text-gray-400">
                نمایش {paginatedProducts.length} از {searchedProducts.length} نتیجه
              </p>

              <ol className="mt-4 sm:mt-0 flex items-center gap-1">
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 transition-all hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <i className="material-symbols-outlined !text-[20px]">chevron_right</i>
                  </button>
                </li>

                {[...Array(totalPages)].map((_, index) => (
                  <li key={index}>
                    <button
                      className={`w-8 h-8 block rounded-full text-sm font-medium transition-all ${
                        currentPage === index + 1
                          ? "bg-primary-500 text-white"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}

                <li>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 transition-all hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <i className="material-symbols-outlined !text-[20px]">chevron_left</i>
                  </button>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* ===== مودال جدید: آپلود فایل (Drag & Drop) ===== */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto overflow-x-hidden flex justify-center items-center w-full h-full p-4">
            {/* پس زمینه تیره */}
            <div className="fixed inset-0 w-full h-full bg-black/40 transition-opacity" onClick={() => setIsUploadModalOpen(false)}></div>
            
            {/* محتوای مودال */}
            <div className="relative w-full max-w-lg bg-white dark:bg-[#0c1427] rounded-lg shadow-lg transition-all">
                <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-100 dark:border-[#172036]">
                    <h3 className="text-lg font-semibold text-black dark:text-white">
                        آپلود فایل اکسل محصولات
                    </h3>
                    <button 
                        onClick={() => setIsUploadModalOpen(false)}
                        className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        <i className="material-symbols-outlined">close</i>
                    </button>
                </div>

                <div className="p-4 md:p-5">
                    <div 
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={triggerFileSelect}
                        className={`
                            flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-[#15203c] hover:bg-gray-100 dark:hover:bg-[#1b2742] transition-all
                            ${dragActive ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10" : "border-gray-300 dark:border-gray-600"}
                        `}
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <i className={`material-symbols-outlined !text-[48px] mb-4 ${dragActive ? "text-primary-500" : "text-gray-400"}`}>
                                cloud_upload
                            </i>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">برای آپلود کلیک کنید</span> یا فایل را اینجا رها کنید
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                فرمت‌های مجاز: XLSX, XLS
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-100 dark:border-[#172036] gap-3">
                    <button 
                        onClick={() => setIsUploadModalOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none dark:bg-[#15203c] dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                        انصراف
                    </button>
                    <button 
                        onClick={triggerFileSelect}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 focus:outline-none"
                    >
                        انتخاب فایل
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* ===== مودال نمایش JSON استخراج شده ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
          <div className="relative max-w-3xl w-full bg-white dark:bg-[#061226] rounded-lg shadow-lg overflow-hidden max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">پیش‌نمایش داده‌ها</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-300">
                <i className="material-symbols-outlined">close</i>
              </button>
            </div>

            <div className="p-4 overflow-auto">
               <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-[#071427] p-3 rounded-md border border-gray-100 dark:border-gray-800">
                 {modalJson}
               </pre>
            </div>

            <div className="p-4 border-t dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-md bg-primary-500 text-white hover:bg-primary-600"
              >
                تایید و ادامه
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsList;