"use client";

import Profile from "@/components/Users/Profile";

import UserDetailTabs from "@/components/Users/UserDetailTabs";

import Link from "next/link";

import { useParams } from "next/navigation";

// --- ۱. تعریف رابط‌های داده‌ای کامل ---

interface UserDetail {
  id: string;

  idName: string;

  name: string;

  role: string;

  profileImage: string;

  phoneNumber: string;

  walletBalance: number;

  loyaltyPoints: number;

  userLevel: string;

  nationalId: string;

  gender: "مرد" | "زن" | "دیگر";

  email: string;

  dateOfBirth: string;

  isBlocked: boolean;

  billingEmail: string;

  deliveryAddress: string;

  language: string;

  lastTransaction: string;
}

// ساختار داده‌های تراکنش (تب ۳)

interface Transaction {
  id: string;

  amount: number;

  type: "خرید" | "برگشت" | "شارژ";

  date: string;

  status: "موفق" | "ناموفق" | "در انتظار";
}

// ساختار داده‌های سبد خرید (تب ۱)

interface CartItem {
  productId: string;

  name: string;

  price: number;

  quantity: number;

  addedDate: string;
}

// ساختار داده‌های سفارشات (تب ۲)

interface Order {
  orderId: string;

  date: string;

  totalAmount: number;

  status: "تحویل داده شده" | "در حال پردازش" | "لغو شده";

  itemsCount: number;
}

// ساختار داده‌های تیکت‌ها (تب ۴)

interface Ticket {
  ticketId: string;

  subject: string;

  status: "بسته شده" | "در انتظار پاسخ مشتری" | "در انتظار پاسخ کارشناس";

  lastUpdate: string;
}

// ساختار داده‌های نشانی‌ها (تب ۵)

interface Address {
  addressId: string;

  title: string;

  addressLine: string;

  city: string;

  postalCode: string;
}

// ساختار داده‌های دیدگاه‌ها (تب ۶)

interface Review {
  reviewId: string;

  productName: string;

  rating: 1 | 2 | 3 | 4 | 5;

  date: string;

  content: string;
}

export default function Page() {
  const params = useParams();

  const id = params.id as string; // id کاربر از مسیر گرفته می‌شود

  // --- ۲. داده‌های آزمایشی کامل برای همه تب‌ها ---

  const mockUser: UserDetail = {
    id: id,

    idName: `${id.substring(0, 8)}`,

    name: "علی احمدی",

    role: "مشتری ویژه",

    profileImage: "https://placehold.co/65x65/6366f1/ffffff?text=U",

    phoneNumber: "09123456789",

    walletBalance: 4200000,

    loyaltyPoints: 1250,

    userLevel: "طلایی",

    nationalId: "1234567890",

    gender: "مرد",

    email: `ali.ahmadi@user.com`,

    dateOfBirth: "1368/11/04",

    isBlocked: false,

    billingEmail: `bill.ali@user.com`,

    deliveryAddress: "تهران، خیابان سهروردی شمالی، پلاک ۵۰، واحد ۳",

    language: "فارسی",

    lastTransaction: "#JAN-2024-0045",
  };

  // داده‌های تب 'تاریخچه تراکنش‌ها'

  const mockTransactions: Transaction[] = [
    {
      id: "T001",
      amount: 450000,
      type: "خرید",
      date: "1402/10/01",
      status: "موفق",
    },

    {
      id: "T002",
      amount: 150000,
      type: "شارژ",
      date: "1402/10/05",
      status: "موفق",
    },

    {
      id: "T003",
      amount: 980000,
      type: "خرید",
      date: "1402/10/10",
      status: "ناموفق",
    },

    {
      id: "T004",
      amount: 200000,
      type: "برگشت",
      date: "1402/10/15",
      status: "موفق",
    },
  ];

  // داده‌های تب 'سبد خرید'

  const mockCart: CartItem[] = [
    {
      productId: "P101",
      name: "لپتاپ گیمینگ ایسوس",
      price: 55000000,
      quantity: 1,
      addedDate: "1403/05/20",
    },

    {
      productId: "P102",
      name: "ماوس وایرلس لاجیتک",
      price: 1200000,
      quantity: 2,
      addedDate: "1403/05/25",
    },

    {
      productId: "P103",
      name: "کیبورد مکانیکال RGB",
      price: 3800000,
      quantity: 1,
      addedDate: "1403/06/01",
    },
  ];

  // داده‌های تب 'تاریخچه سفارشات'

  const mockOrders: Order[] = [
    {
      orderId: "O-2024-5432",
      date: "1402/09/15",
      totalAmount: 8500000,
      itemsCount: 3,
      status: "تحویل داده شده",
    },

    {
      orderId: "O-2024-9876",
      date: "1403/01/22",
      totalAmount: 120000,
      itemsCount: 1,
      status: "در حال پردازش",
    },

    {
      orderId: "O-2024-1122",
      date: "1403/04/05",
      totalAmount: 5000000,
      itemsCount: 2,
      status: "لغو شده",
    },
  ];

  // داده‌های تب 'تاریخچه تیکت‌ها'

  const mockTickets: Ticket[] = [
    {
      ticketId: "TK-1001",
      subject: "مشکل در بازگشت وجه سفارش O-2024-1122",
      status: "در انتظار پاسخ کارشناس",
      lastUpdate: "1403/06/05",
    },

    {
      ticketId: "TK-1002",
      subject: "سوال در مورد موجودی محصول P500",
      status: "بسته شده",
      lastUpdate: "1403/05/01",
    },
  ];

  // داده‌های تب 'نشانی‌ها'

  const mockAddresses: Address[] = [
    {
      addressId: "A001",
      title: "خانه (اصلی)",
      addressLine: "تهران، خیابان ولیعصر، کوچه نسترن، پلاک ۲۴، واحد ۱",
      city: "تهران",
      postalCode: "1431945678",
    },

    {
      addressId: "A002",
      title: "محل کار",
      addressLine: "کرج، میدان شهدا، برج میلاد، طبقه دهم",
      city: "کرج",
      postalCode: "3131812345",
    },
  ];

  // داده‌های تب 'تاریخچه دیدگاه‌ها'

  const mockReviews: Review[] = [
    {
      reviewId: "R789",
      productName: "هارد اکسترنال ۱ ترابایت",
      rating: 5,
      date: "1403/02/10",
      content: "کیفیت ساخت عالی و سرعت انتقال داده بسیار بالا.",
    },

    {
      reviewId: "R123",
      productName: "هدفون بلوتوثی SONY",
      rating: 3,
      date: "1402/12/01",
      content: "بیس ضعیف‌تر از حد انتظار بود، اما باتری خوبی دارد.",
    },
  ];

  // --- ۳. توابع مدیریتی کاربر (Profile) ---

  const handleDelete = (userId: string) => {
    console.log(`[ACTION] حذف کاربر با شناسه: ${userId}`);

    // منطق حذف کاربر...
  };

  const handleToggleBlock = (userId: string, isBlocked: boolean) => {
    console.log(
      `[ACTION] تغییر وضعیت مسدودسازی کاربر ${userId} به ${
        !isBlocked ? "مسدود شده" : "آزاد شده"
      }`
    );

    // منطق تماس API برای مسدود/آزادسازی...
  };

  // --- ۴. توابع مدیریتی سبد خرید (UserDetailTabs - برای رفع خطای کامپایلر) ---

  // تابع Mock برای تغییر تعداد یک آیتم در سبد خرید

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    console.log(
      `[Mock Action] Changing quantity for product ${productId} to ${newQuantity}`
    );

    // منطق تماس API به NestJS برای به‌روزرسانی سبد خرید
  };

  // تابع Mock برای ارسال فاکتور یا اطلاعیه از طریق پیامک

  const handleSendInvoice = () => {
    console.log("[Mock Action] Sending invoice via SMS/Email.");

    // منطق تماس API به NestJS برای ارسال اطلاعیه
  };

  // تابع Mock برای افزودن دستی یک محصول به سبد خرید

  const handleAddItemToCart = (item: Omit<CartItem, "addedDate">) => {
    console.log(
      `[Mock Action] Adding new item to cart: ${item.name} x ${item.quantity}`
    );

    // منطق تماس API به NestJS برای افزودن محصول
  };

  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <ol className="breadcrumb mt-[12px] md:mt-0 flex flex-wrap">
          <li className="breadcrumb-item  relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0 flex items-center">
            <Link
              href="/dashboard/ecommerce/"
              className=" relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500 flex items-center"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg top-1/2 -translate-y-1/2 text-primary-500">
                home
              </i>

              <span className="ltr:ml-2 rtl:mr-2">داشبورد</span>
            </Link>

          </li>

          <li className="breadcrumb-item  relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0 flex items-center">
            کاربران

          </li>

          <li className="breadcrumb-item  relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0 flex items-center">
            لیست کاربران
          </li>
        </ol>

        <h5 className="!mb-0">{mockUser.idName}</h5>
      </div>

      <div className="lg:grid lg:grid-cols-4 gap-[25px]">
        <div className="lg:col-span-1">
          {/* ارسال propsهای مورد نیاز به Profile */}

          <Profile
            user={mockUser}
            onDelete={handleDelete}
            onToggleBlock={handleToggleBlock}
          />
        </div>

        <div className="lg:col-span-3">
          {/* ارسال داده‌های کامل به کامپوننت UserDetailTabs به همراه توابع Mock برای اکشن‌ها */}

          <UserDetailTabs
            transactions={mockTransactions}
            cartItems={mockCart}
            orders={mockOrders}
            tickets={mockTickets}
            addresses={mockAddresses}
            reviews={mockReviews}
            // پراپ‌های اکشن جدید

            onQuantityChange={handleQuantityChange}
            onSendInvoice={handleSendInvoice}
            onAddItemToCart={handleAddItemToCart}
          />
        </div>
      </div>
    </>
  );
}
