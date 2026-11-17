"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  LayoutGrid,
  Coffee,
  Utensils,
  ChefHat,
  Trash2,
  Printer,
  CreditCard,
  Banknote,
  Search,
  MoreVertical,
  Tag,
  Percent,
  X,
  DollarSign,
  Users,
  Clock,
  Menu,
  ClipboardList,
  Truck,
  Plus,
  Minus,
  Monitor,
  Calculator,
  MapPin, 
  CheckCircle, 
  Phone, // Added for Takeout Modal
  Home, // Added for Takeout Modal
} from "lucide-react";

// --- Types & Constants ---
type PriceModifierType = "percentage" | "fixed";
type TableType = "physical" | "custom";
type TableStatus = "free" | "occupied" | "cleaning" | "takeout";

// تایپ جدید برای مدیریت ویوی سایدبار
type ViewMode = "hall" | "categories" | "orders" | "takeout";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  stock?: number;
}

interface OrderItem extends Product {
  quantity: number;
  itemDiscount?: PriceModifier;
  description?: string;
}

interface PriceModifier {
  amount: number;
  type: PriceModifierType;
}

interface Table {
  id: number;
  type?: TableType;
  title?: string;
  status: TableStatus;
  startTime: Date | null;
  orders: OrderItem[];
  guestCount: number;
  serviceCharge?: PriceModifier;
  totalDiscount?: PriceModifier;
}

interface Session {
  id: number;
  tables: Table[];
  createdAt: Date;
  type?: TableType;
  title?: string;
}

interface PriceModifierModalProps {
  title: string;
  initialModifier?: PriceModifier;
  onClose: () => void;
  onApply: (modifier: PriceModifier) => void;
  onRemove: () => void;
}

// تایپ برای جزئیات سفارش بیرون‌بر
interface TakeoutDetails {
    customerName: string;
    phoneNumber: string;
    address: string;
    deliveryFee: number; // هزینه ارسال
}

const TAKEAWAY_TABLE_ID = 999;
const TAX_RATE = 0.09;

// --- Interfaces ---
interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

// --- Mock Data ---
const CATEGORIES: Category[] = [
  { id: "all", name: "همه", icon: <LayoutGrid size={20} /> },
  { id: "hot-drink", name: "نوشیدنی گرم", icon: <Coffee size={20} /> },
  { id: "main-course", name: "غذای اصلی", icon: <Utensils size={20} /> },
  { id: "dessert", name: "دسر و کیک", icon: <ChefHat size={20} /> },
];

const PRODUCTS: Product[] = [
  { id: 1, name: "لاته", price: 65000, category: "hot-drink", image: "☕", stock: 10 },
  { id: 2, name: "اسپرسو", price: 45000, category: "hot-drink", image: "☕", stock: 15 },
  { id: 3, name: "موکا", price: 70000, category: "hot-drink", image: "🍫", stock: 8 },
  { id: 4, name: "چای ماسالا", price: 55000, category: "hot-drink", image: "🍵", stock: 20 },
  { id: 5, name: "پاستا", price: 180000, category: "main-course", image: "🍝", stock: 5 },
  { id: 6, name: "برگر کلاسیک", price: 210000, category: "main-course", image: "🍔", stock: 12 },
  { id: 7, name: "پیتزا پپرونی", price: 240000, category: "main-course", image: "🍕", stock: 7 },
  { id: 8, name: "سالاد سزار", price: 160000, category: "main-course", image: "🥗", stock: 9 },
  { id: 9, name: "چیزکیک", price: 90000, category: "dessert", image: "🍰" },
  { id: 10, name: "براونی", price: 85000, category: "dessert", image: "🍪" },
];

// --- Mock Data for Sidebar Views ---
const MOCK_ACTIVE_ORDERS = [
  { id: 101, table: "میز ۱", items: "همبرگر مخصوص، سیب زمینی", status: "در حال پخت", time: "12:30", price: "250,000" },
  { id: 102, table: "میز ۳", items: "پیتزا پپرونی", status: "آماده", time: "12:45", price: "180,000" },
  { id: 103, table: "میز ۵", items: "سالاد سزار", status: "در صف", time: "12:50", price: "120,000" },
];

const MOCK_DELIVERY_ORDERS = [
  { id: 201, customer: "علی رضایی", address: "شیراز، خیابان ارم", status: "پیک اعزام شد", courier: "اسنپ باکس" },
  { id: 202, customer: "سارا احمدی", address: "شیراز، معالی آباد", status: "در حال آماده‌سازی", courier: "پیک رستوران" },
];

// --- Helper Functions ---
const formatPrice = (price: number) =>
  new Intl.NumberFormat("fa-IR").format(Math.max(0, Math.round(price))) + " تومان";

const formatNumber = (num: number) => new Intl.NumberFormat("fa-IR").format(num);

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

// --- PriceModifierModal Component (No change) ---
const PriceModifierModal: React.FC<PriceModifierModalProps> = ({
  title,
  initialModifier,
  onClose,
  onApply,
  onRemove,
}) => {
  const [amount, setAmount] = useState(initialModifier?.amount || 0);
  const [type, setType] = useState<PriceModifierType>(initialModifier?.type || "percentage");

  const handleApply = () => {
    onApply({ amount, type });
    onClose();
  };

  const handleRemove = () => {
    onRemove();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#ffffff] dark:bg-[#000000] rounded-xl p-6 w-96 text-black dark:text-white" dir="rtl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="text-black dark:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-black dark:text-white mb-2">نوع</label>
            <div className="flex gap-2">
              <button
                onClick={() => setType("percentage")}
                className={`flex-1 py-2 rounded-lg ${type === "percentage" ? "bg-[#F5710C] text-white" : "bg-[#D6D5D5] dark:bg-[#1E1E1E] text-black dark:text-white"}`}
              >
                درصدی
              </button>
              <button
                onClick={() => setType("fixed")}
                className={`flex-1 py-2 rounded-lg ${type === "fixed" ? "bg-[#F5710C] text-white" : "bg-[#D6D5D5] dark:bg-[#1E1E1E] text-black dark:text-white"}`}
              >
                مبلغ ثابت
              </button>
            </div>
          </div>

          <div>
            <label className="block text-black dark:text-white mb-2">
              مقدار {type === "percentage" ? "(درصد)" : "(تومان)"}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-[#D6D5D5] dark:bg-[#1E1E1E]  text-black dark:text-white p-3 rounded-lg"
              min="0"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={handleRemove}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg "
          >
            حذف
          </button>
          <button
            onClick={handleApply}
            className="flex-1 bg-[#2154D4] text-white py-3 rounded-lg "
          >
            اعمال
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Takeout Info Modal Component ---
const TakeoutInfoModal: React.FC<{
    details: TakeoutDetails;
    setDetails: React.Dispatch<React.SetStateAction<TakeoutDetails>>;
    onClose: () => void;
    onContinue: () => void;
}> = ({ details, setDetails, onClose, onContinue }) => {
    
    // تابع کمکی برای آپدیت فیلدها
    const updateField = (field: keyof TakeoutDetails, value: string | number) => {
        setDetails(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl dark:bg-gray-800 dark:text-white" dir="rtl">
                <div className="flex justify-between items-center mb-6 border-b pb-3">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Truck size={24} /> جزئیات سفارش بیرون‌بر
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* نام مشتری */}
                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <Users size={20} className="text-orange-500" />
                        <input
                            type="text"
                            value={details.customerName}
                            onChange={(e) => updateField('customerName', e.target.value)}
                            placeholder="نام و نام خانوادگی مشتری"
                            className="flex-1 bg-transparent focus:outline-none text-black dark:text-white"
                        />
                    </div>

                    {/* شماره تماس */}
                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <Phone size={20} className="text-orange-500" />
                        <input
                            type="tel"
                            value={details.phoneNumber}
                            onChange={(e) => updateField('phoneNumber', e.target.value)}
                            placeholder="شماره تماس"
                            className="flex-1 bg-transparent focus:outline-none text-black dark:text-white"
                        />
                    </div>

                    {/* آدرس */}
                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <MapPin size={20} className="text-orange-500" />
                        <textarea
                            rows={2}
                            value={details.address}
                            onChange={(e) => updateField('address', e.target.value)}
                            placeholder="آدرس دقیق ارسال"
                            className="flex-1 bg-transparent focus:outline-none resize-none text-black dark:text-white"
                        />
                    </div>
                </div>
                
                {/* هزینه ارسال */}
                <div className="mt-6 p-3 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex justify-between items-center font-bold">
                    <span className="text-black dark:text-orange-300">هزینه ارسال (Mock):</span>
                    <span className="text-orange-600 dark:text-orange-200">{formatPrice(details.deliveryFee)}</span>
                </div>

                <div className="flex gap-3 mt-8">
                    <button
                        onClick={onContinue}
                        className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
                        disabled={!details.customerName || !details.phoneNumber || !details.address}
                    >
                        ادامه به پرداخت
                    </button>
                    <button
                        onClick={onClose}
                        className="w-1/4 bg-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-400 transition-colors dark:bg-gray-700 dark:text-gray-300"
                    >
                        انصراف
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Main Component ---
export default function POSSystem() {
  // --- State Initialization ---
  
  // وضعیت پیش‌فرض روی بیرون‌بر (Takeout) تنظیم شد.
  const [viewMode, setViewMode] = useState<ViewMode>("takeout"); 

  const [tables, setTables] = useState<Table[]>([
    ...Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      type: "physical" as TableType,
      title: `میز ${i + 1}`,
      status: "free" as TableStatus,
      startTime: null,
      orders: [],
      guestCount: Math.floor(Math.random() * 4) + 2,
    })),
    {
      id: TAKEAWAY_TABLE_ID,
      type: "custom" as TableType,
      title: "بیرون بر",
      status: "takeout" as TableStatus,
      startTime: new Date(),
      orders: [],
      guestCount: 1,
    },
  ]);

  const [allSessions, setAllSessions] = useState<Table[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(PRODUCTS);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [itemToDiscountId, setItemToDiscountId] = useState<number | null>(null);

  const [showReceipt, setShowReceipt] = useState(false);
  const [cashPayment, setCashPayment] = useState(0);
  const [cardToCardPayment, setCardToCardPayment] = useState(0);
  const [device2Payment, setDevice2Payment] = useState(0);

  // Stateهای جدید برای مدیریت مودال بیرون‌بر
  const [showTakeoutModal, setShowTakeoutModal] = useState(false);
  const [takeoutDetails, setTakeoutDetails] = useState<TakeoutDetails>({
      customerName: 'نام مشتری',
      phoneNumber: '0912xxxxxxx',
      address: 'آدرس مشتری برای ارسال',
      deliveryFee: 250000, // Mock: 25,000 تومان هزینه ارسال
  });


  const activeSession = tables.find((t) => t.id === activeSessionId);
  const isTakeoutActive = activeSession?.id === TAKEAWAY_TABLE_ID;

  // Initialize allSessions و تنظیم سشن اولیه روی بیرون بر
  useEffect(() => {
    setAllSessions(tables);
    if (tables.length > 0) {
      // تنظیم سشن فعال اولیه به سشن بیرون‌بر
      setActiveSessionId(activeSessionId ?? TAKEAWAY_TABLE_ID);
    }
  }, [tables]);

  // Filter products (No change)
  useEffect(() => {
    let filtered = PRODUCTS;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (product) =>
          product.name.includes(searchQuery) || product.category.includes(searchQuery)
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getElapsedSeconds = (start: Date | null) =>
    start ? Math.floor((currentTime.getTime() - new Date(start).getTime()) / 1000) : 0;

  const calculateOrderSummary = useCallback((table: Table) => {
    const subTotal = table.orders.reduce((acc, item) => {
      const itemTotal = item.price * item.quantity;
      let discountedItemTotal = itemTotal;
      if (item.itemDiscount) {
        if (item.itemDiscount.type === "percentage") {
          discountedItemTotal = itemTotal * (1 - item.itemDiscount.amount / 100);
        } else {
          discountedItemTotal = Math.max(0, itemTotal - item.itemDiscount.amount);
        }
      }
      return acc + discountedItemTotal;
    }, 0);

    const serviceChargeAmount = table.serviceCharge
      ? table.serviceCharge.type === "percentage"
        ? subTotal * (table.serviceCharge.amount / 100)
        : table.serviceCharge.amount
      : 0;

    const totalBeforeDiscount = subTotal + serviceChargeAmount;

    const totalDiscountAmount = table.totalDiscount
      ? table.totalDiscount.type === "percentage"
        ? totalBeforeDiscount * (table.totalDiscount.amount / 100)
        : table.totalDiscount.amount
      : 0;

    const totalAfterDiscount = Math.max(0, totalBeforeDiscount - totalDiscountAmount);
    const taxAmount = totalAfterDiscount * TAX_RATE;
    let grandTotal = totalAfterDiscount + taxAmount;
    
    // نکته: هزینه ارسال را در مودال پرداخت اضافه می‌کنیم، نه در این تابع.
    // اما برای نمایش صحیح در پنل، اینجا اضافه می‌کنیم.
    let deliveryFee = 0;
    if (table.id === TAKEAWAY_TABLE_ID) {
        deliveryFee = takeoutDetails.deliveryFee;
        grandTotal += deliveryFee;
    }


    return {
      subTotal,
      serviceChargeAmount,
      totalDiscountAmount,
      totalAfterDiscount,
      taxAmount,
      grandTotal,
      deliveryFee: deliveryFee, // اضافه کردن هزینه ارسال به Summary
    };
  }, [takeoutDetails.deliveryFee]);

  const summary = activeSession
    ? calculateOrderSummary(activeSession)
    : {
        subTotal: 0,
        serviceChargeAmount: 0,
        totalDiscountAmount: 0,
        totalAfterDiscount: 0,
        taxAmount: 0,
        grandTotal: 0,
        deliveryFee: 0,
      };

  const remainingAmount = summary.grandTotal - (cashPayment + cardToCardPayment + device2Payment);
  const totalPaid = cashPayment + cardToCardPayment + device2Payment;

  const handleTableSelect = (tableId: number) => {
    setActiveSessionId(tableId);
  };

  const applyModifier = (modifier: PriceModifier, type: "service" | "discount") => {
    if (!activeSessionId) return;

    setTables((prev) =>
      prev.map((table) => {
        if (table.id === activeSessionId) {
          if (type === "service") {
            return { ...table, serviceCharge: modifier };
          } else {
            return { ...table, totalDiscount: modifier };
          }
        }
        return table;
      })
    );
  };

  const applyItemDiscount = (modifier: PriceModifier) => {
    if (!activeSessionId || !itemToDiscountId) return;

    setTables((prev) =>
      prev.map((table) => {
        if (table.id === activeSessionId) {
          const updatedOrders = table.orders.map((item) => {
            if (item.id === itemToDiscountId) {
              return { ...item, itemDiscount: modifier };
            }
            return item;
          });
          return { ...table, orders: updatedOrders };
        }
        return table;
      })
    );

    setItemToDiscountId(null);
  };

  const addToOrder = (product: Product) => {
    if (!activeSessionId) return;

    setTables((prev) =>
      prev.map((table) => {
        if (table.id === activeSessionId) {
          const existing = table.orders.find((o) => o.id === product.id);
          const newOrders = existing
            ? table.orders.map((o) => (o.id === product.id ? { ...o, quantity: o.quantity + 1 } : o))
            : [...table.orders, { ...product, quantity: 1 }];

          const newStatus =
            table.status === "free" && table.type !== "custom" ? "occupied" : table.status;
          return {
            ...table,
            orders: newOrders,
            status: newStatus,
            startTime: table.startTime ?? new Date(),
          };
        }
        return table;
      })
    );
  };

  const updateQuantity = (productId: number, change: number) => {
    if (!activeSessionId) return;

    setTables((prev) =>
      prev.map((table) => {
        if (table.id === activeSessionId) {
          const newOrders = table.orders
            .map((o) =>
              o.id === productId ? { ...o, quantity: Math.max(0, o.quantity + change) } : o
            )
            .filter((o) => o.quantity > 0);

          const newStatus =
            newOrders.length === 0 && table.type !== "custom" ? "free" : table.status;
          return { ...table, orders: newOrders, status: newStatus };
        }
        return table;
      })
    );
  };

  const updateDescription = (itemId: number, desc: string) => {
    if (!activeSessionId) return;

    setTables((prev) =>
      prev.map((table) => {
        if (table.id === activeSessionId) {
          const newOrders = table.orders.map((o) =>
            o.id === itemId ? { ...o, description: desc } : o
          );
          return { ...table, orders: newOrders };
        }
        return table;
      })
    );
  };

  const finalizePayment = () => {
    alert(`پرداخت انجام شد. سفارش بیرون‌بر برای ${takeoutDetails.customerName} ثبت شد.`);
    setCashPayment(0);
    setCardToCardPayment(0);
    setDevice2Payment(0);
    setShowReceipt(false);

    if (!activeSessionId) return;

    setTables((prev) =>
      prev.map((table) => {
        if (table.id === activeSessionId) {
          return {
            ...table,
            orders: [],
            status: table.type === "custom" ? "takeout" : "free", // بیرون بر حالت خود را حفظ می‌کند
            startTime: null,
          };
        }
        return table;
      })
    );
  };

  const fillRemainingAmount = (field: "cash" | "cardToCard" | "device2") => {
    if (remainingAmount <= 0) return;
    const amount = remainingAmount;

    if (field === "cash") setCashPayment((prev) => prev + amount);
    else if (field === "cardToCard") setCardToCardPayment((prev) => prev + amount);
    else if (field === "device2") setDevice2Payment((prev) => prev + amount);
  };
  
  // لاجیک دکمه تسویه حساب
  const handleCheckout = () => {
    if (isTakeoutActive) {
      // اگر سفارش بیرون‌بر است، ابتدا مودال جزئیات را نمایش بده
      setShowTakeoutModal(true);
    } else {
      // برای سفارشات داخل سالن، مستقیماً به مودال پرداخت برو
      setShowReceipt(true);
    }
  };


  if (!activeSession)
    return <div className="flex items-center justify-center h-screen">میز فعال یافت نشد</div>;

  return (
    <div
      className="flex h-[85vh] w-full bg-[#FFFFFF] dark:bg-[#121212] text-white font-sans overflow-hidden "
      dir="rtl"
    >
      {/* --- RIGHT SIDEBAR: Tables & Nav (Combined) --- */}
      <div className="flex w-[380px] h-full">
        {/* Rightmost Navigation Strip (Darker) */}
        <nav className="w-22 bg-[#D6D5D5] dark:bg-[#1E1E1E] flex flex-col items-center py-4 gap-6 rounded-xl m-3">
          <div className="p-2 bg-orange-500 rounded-xl mb-4 shadow-lg shadow-orange-500/20">
            <LayoutGrid size={24} className="text-white" />
          </div>
          
          {/* دکمه‌های ناوبری با قابلیت کلیک */}
          <button 
            onClick={() => setViewMode('categories')}
            className={`flex flex-col items-center gap-1 transition-colors ${viewMode === 'categories' ? 'text-orange-500' : 'text-[#2B2C32] dark:text-white'}`}
          >
            <Menu size={32} />
            <span className="text-[16px]">دسته بندی</span>
          </button>
          
          <button 
             onClick={() => setViewMode('orders')}
             className={`flex flex-col items-center gap-1 transition-colors ${viewMode === 'orders' ? 'text-orange-500' : 'text-[#2B2C32] dark:text-white'}`}
          >
            <ClipboardList size={32} />
            <span className="text-[16px]">سفارشات</span>
          </button>
          
          {/* دکمه بیرون‌بر: تنظیم سشن فعال به بیرون‌بر */}
          <button 
             onClick={() => {
                setViewMode('takeout');
                handleTableSelect(TAKEAWAY_TABLE_ID); // انتخاب سشن بیرون‌بر
             }}
             className={`flex flex-col items-center gap-1 transition-colors ${viewMode === 'takeout' ? 'text-orange-500' : 'text-[#2B2C32] dark:text-white'}`}
          >
            <Truck size={32} />
            <span className="text-[16px]">بیرون بر</span>
          </button>
          
          {/* دکمه وضعیت سالن: تنظیم سشن فعال به اولین میز خالی یا اشغال */}
          <button 
             onClick={() => {
                setViewMode('hall');
                // اگر از بیرون‌بر به سالن می‌آید، اولین میز را انتخاب کن (یا فعال فعلی)
                if (activeSessionId === TAKEAWAY_TABLE_ID) {
                    const firstPhysicalTable = tables.find(t => t.type === 'physical');
                    if (firstPhysicalTable) {
                        handleTableSelect(firstPhysicalTable.id);
                    }
                }
             }}
             className={`flex flex-col items-center gap-1 transition-colors ${viewMode === 'hall' ? 'text-orange-500' : 'text-[#2B2C32] dark:text-white'}`}
          >
            <LayoutGrid size={32} />
            <span className="text-[16px]">وضعیت سالن</span>
          </button>
        </nav>
        
        {/* Table List / Content Section */}
        <aside className="flex-1 bg-[#D6D5D5] dark:bg-[#1E1E1E] flex flex-col border-l border-gray-800 m-3 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700 shrink-0">
            <div className="flex items-center gap-2">
              {viewMode === 'hall' && <LayoutGrid className="text-[#2B2C32] dark:text-[#FFFFFF]" size={24} />}
              {viewMode === 'categories' && <Menu className="text-[#2B2C32] dark:text-[#FFFFFF]" size={24} />}
              {viewMode === 'orders' && <ClipboardList className="text-[#2B2C32] dark:text-[#FFFFFF]" size={24} />}
              {viewMode === 'takeout' && <Truck className="text-[#2B2C32] dark:text-[#FFFFFF]" size={24} />}
              
              <h2 className="text-xl font-bold text-[#2B2C32] dark:text-white">
                {viewMode === 'hall' && "وضعیت سالن"}
                {viewMode === 'categories' && "دسته‌بندی‌ها"}
                {viewMode === 'orders' && "سفارشات فعال"}
                {viewMode === 'takeout' && "بیرون بر"}
              </h2>
            </div>
          </div>

          {/* Dynamic Content based on viewMode */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
            
            {/* 1. Hall Status View (Your Original Code) */}
            {viewMode === 'hall' && allSessions
              .filter((table): table is Table & { type: "physical" } => table.type === "physical")
              .map((table) => {
                const tSummary = calculateOrderSummary(table);
                const isOccupied = table.status === "occupied";
                const elapsed = getElapsedSeconds(table.startTime);
                return (
                  <button
                    key={table.id}
                    onClick={() => handleTableSelect(table.id)}
                    className={`w-full rounded-xl p-4 transition-all relative flex flex-col justify-between h-32
                    ${activeSessionId === table.id
                        ? "ring-2 ring-[#2B2C32] dark:ring-[#FFFFFF] bg-[#FDE7D6] dark:bg-[#2B2C32] "
                        : "bg-[#FFFFFF] dark:bg-[#111113]"}
                  `}
                  >
                    <div className="flex justify-between w-full items-start">
                      <span className="text-xl font-bold text-[#2B2C32] dark:text-[#ffffff]">
                        {table.title}
                      </span>
                      <div className="flex items-center gap-2 text-[#747474] dark:text-[#D6D5D5] text-lg">
                        <Users size={24} />
                        <span>{formatNumber(table.guestCount)} نفر</span>
                      </div>
                    </div>

                    {isOccupied ? (
                      <div className="w-full flex flex-col gap-1">
                        <div className="text-left text-[#2B2C32] dark:text-[#FFFFFF] font-bold text-lg">
                          {formatNumber(tSummary.grandTotal)} T
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="bg-[#0035BA] text-[#FFFFFF] text-sm px-2 py-0.5 rounded-xl">
                            {formatNumber(table.orders.length)} آیتم
                          </span>
                          <span className="bg-[#AE0303] text-[#FFFFFF] text-sm px-2 py-0.5 rounded-xl flex items-center gap-1">
                            {formatTime(elapsed)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full flex justify-end mt-auto">
                        <span className="bg-[#05731F] text-[#FFFFFF] px-4 py-1 rounded-xl text-sm font-bold">
                          آزاد
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}

              {/* 2. Categories View (No change) */}
              {viewMode === 'categories' && (
                <div className="grid grid-cols-1 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full p-4 rounded-xl flex items-center gap-3 transition-colors ${
                        selectedCategory === cat.id 
                        ? "bg-orange-500 text-white" 
                        : "bg-white dark:bg-[#111113] text-[#2B2C32] dark:text-white"
                      }`}
                    >
                      <div className={`p-2 rounded-full ${selectedCategory === cat.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                        {cat.icon}
                      </div>
                      <span className="font-bold text-lg">{cat.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* 3. Orders View (Mock Data - No change) */}
              {viewMode === 'orders' && MOCK_ACTIVE_ORDERS.map((order) => (
                <div key={order.id} className="bg-white dark:bg-[#111113] p-4 rounded-xl flex flex-col gap-2 border-l-4 border-orange-500">
                  <div className="flex justify-between items-center">
                     <span className="font-bold text-[#2B2C32] dark:text-white">{order.table}</span>
                     <span className="text-xs text-gray-500">{order.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{order.items}</p>
                  <div className="flex justify-between items-center mt-1">
                     <span className={`text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800`}>{order.status}</span>
                     <span className="font-bold text-sm text-[#2B2C32] dark:text-white">{order.price}</span>
                  </div>
                </div>
              ))}

              {/* 4. Delivery View (Mock Data - No change in list) */}
              {viewMode === 'takeout' && MOCK_DELIVERY_ORDERS.map((del) => (
                <div key={del.id} className="bg-white dark:bg-[#111113] p-4 rounded-xl flex flex-col gap-2">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                       <Truck size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-[#2B2C32] dark:text-white">{del.customer}</h4>
                        <span className="text-xs text-gray-400">#{del.id}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                        <MapPin size={14} />
                        <span>{del.address}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 border-t border-gray-100 pt-2 dark:border-gray-700">
                     <span className="text-xs font-bold text-blue-600">{del.status}</span>
                     <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">{del.courier}</span>
                  </div>
                </div>
              ))}

          </div>

          {/* Status Footer (فقط در حالت سالن نمایش داده شود) */}
          {viewMode === 'hall' && (
            <div className="flex justify-between px-6 py-2 text-xs text-[#2B2C32] dark:text-white bg-[#D6D5D5] dark:bg-[#1E1E1E] shrink-0">
              <span>
                اشغال: {allSessions.filter((t) => t.status === "occupied").length}
              </span>
              <span>
                آزاد:{" "}
                {
                  allSessions.filter(
                    (t) => t.status === "free" && t.type === "physical"
                  ).length
                }
              </span>
            </div>
          )}
        </aside>
      </div>

      {/* --- MIDDLE AREA: Menu Grid --- */}
      <main className="flex-1 bg-[#FFFFFF] dark:bg-[#121214] flex flex-col p-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="جستجو در منو ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-1/2 bg-[#CFCFD0BD] text-black dark:bg-[#424347] dark:text-white pl-4 pr-10 py-3 rounded-xl border border-gray-700 focus:border-orange-500 focus:outline-none placeholder-gray-500"
          />
          <Search
            className="absolute right-3 top-3.5 text-gray-400"
            size={20}
          />
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 border border-black rounded-xl p-3">
          <div className="grid grid-cols-3 xl:grid-cols-4 gap-4 ">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#D6D5D5] dark:bg-[#1E1E1E] rounded-xl overflow-hidden  flex flex-col group relative"
              >
                {/* Image */}
                <div className="h-40 w-full overflow-hidden relative">
                  <div className="w-full h-full bg-[#D6D5D5] dark:bg-[#1E1E1E] flex items-center justify-center text-4xl p-3">
                    {product.image}
                  </div>
                  <div className="absolute inset-0 bg-transparent m-3 rounded-xl"></div>
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col gap-2">
                  <span className="text-black dark:text-white font-bold text-lg">
                    {product.name}
                  </span>
                  <div className="flex justify-between items-center text-black dark:text-white">
                    <span className="text-black dark:text-white font-bold">
                      {formatNumber(product.price)}{" "}
                      <span className="text-sm text-black dark:text-white">
                        تومان
                      </span>
                    </span>
                    
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => addToOrder(product)}
                      className="flex-1 bg-[#F5710C] text-white py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      افزودن
                    </button>
                  </div>
                  <div className="flex justify-between text-[10px] text-black dark:text-white mt-1">
                    <span>موجودی :</span>
                    <span>{product.stock || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* --- LEFT SIDEBAR: Order Details --- */}
      <aside className="w-[400px] bg-[#D6D5D5] dark:bg-[#1E1E1E] flex flex-col m-3 rounded-xl">
        {/* Header Order Info */}
        <div className="p-4 border-b border-black">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 text-black dark:text-white">
                {isTakeoutActive ? <Truck size={16} /> : <Users size={16} />}
              <span>{isTakeoutActive ? "ارسال" : `${activeSession?.guestCount || 0} نفر`}</span>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-black dark:text-white">
                {activeSession?.title || "بدون سفارش"}
              </h2>
              {isTakeoutActive && (
                 <span className="text-sm text-orange-600 dark:text-orange-400 font-bold">
                    {takeoutDetails.customerName}
                 </span>
              )}
              {!isTakeoutActive && (
                  <span className="text-sm text-black dark:text-white">
                    زمان:{" "}
                    {activeSession
                      ? formatTime(getElapsedSeconds(activeSession.startTime))
                      : "00:00"}
                  </span>
              )}
            </div>
            <button className="text-black dark:text-white">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Order Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          {activeSession?.orders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-black dark:text-white">
              <Monitor size={48} className="mb-2 opacity-50" />
              <p>هیچ آیتمی ثبت نشده</p>
            </div>
          ) : (
            activeSession?.orders.map((item) => (
              <div
                key={item.id}
                className="bg-transparent p-3 border-b border-gray-800"
              >
                <div className="flex gap-3">
                  {/* Quantity Controls */}
                  <div className="flex flex-col justify-between items-center gap-1">
                    <div className="w-16 h-16 rounded-lg bg-gray-700 flex items-center justify-center text-xl">
                      {item.image}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <h4 className="font-bold text-lg">{item.name}</h4>
                      <span className="text-[#2B2C32] dark:text-white font-bold text-lg bottom-5">
                        {formatNumber(item.price)}{" "}
                      </span>
                    </div>
                    <span className="text-lg text-[#2B2C32] dark:text-white">تومان</span>
                    <div className="flex-1 flex justify-between items-end">
                      <button
                        onClick={() => setItemToDiscountId(item.id)}
                        className="text-[16px] flex items-center gap-0.5 text-black dark:text-white bg-transparent rounded"
                      >
                        <Tag size={12} /> تخفیف آیتم
                      </button>
                      <div className="flex justify-between items-center gap-1 bg-[#FFFEF1] rounded-xl">
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-9 h-9 bg-[#05731F] rounded flex items-center justify-center text-white dark:text-white m-2"
                        >
                          <Plus size={22} />
                        </button>
                        <span className="font-bold bg-white text-black w-7 h-7 flex items-center justify-center rounded text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-9 h-9 bg-[#AE0303] rounded flex items-center justify-center text-white m-2"
                        >
                          <Minus size={22} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Input */}
                <div className="mt-3">
                  <input
                    type="text"
                    value={item.description || ""}
                    onChange={(e) => updateDescription(item.id, e.target.value)}
                    placeholder={`توضیحات: ${item.name}`}
                    className="w-full bg-[#FFDbbd] text-[#000000] text-xs px-3 py-2 rounded-lg focus:outline-none"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        <div className="bg-[#FFFFFF] dark:bg-[#111113] m-3 p-3 rounded-xl">
          {/* Modifier Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowServiceModal(true)}
              className="flex-1 bg-[#FFAC6D] text-black py-2 rounded-xl text-lg font-bold flex items-center justify-center gap-2"
            >
              <Percent size={16} />{" "}
              {activeSession?.serviceCharge
                ? `سرویس (${activeSession.serviceCharge.amount})`
                : "% سرویس (0 T)"}
            </button>
            <button
              onClick={() => setShowDiscountModal(true)}
              className="flex-1 bg-[#A1BCFF] text-black py-2 rounded-xl text-lg font-bold flex items-center justify-center gap-2"
            >
              <Tag size={16} />{" "}
              {activeSession?.totalDiscount
                ? `تخفیف (${activeSession.totalDiscount.amount})`
                : "تخفیف کل (0 T)"}
            </button>
          </div>

          {/* Calculation Lines */}
          <div className="space-y-1 text-xs text-black dark:text-white mb-3">
            <div className="flex justify-between">
              <span>جمع جز (پس از تخفیف آیتم):</span>
              <span>{formatNumber(summary.subTotal)} تومان</span>
            </div>
            {summary.deliveryFee > 0 && (
                <div className="flex justify-between text-blue-600 dark:text-blue-400 font-bold">
                    <span>هزینه ارسال:</span>
                    <span>{formatNumber(summary.deliveryFee)} تومان</span>
                </div>
            )}
            <div className="flex justify-between">
              <span>مالیات (9%):</span>
              <span>{formatNumber(summary.taxAmount)}</span>
            </div>
            {summary.serviceChargeAmount > 0 && (
              <div className="flex justify-between  text-blue-400">
                <span>حق سرویس:</span>
                <span>{formatNumber(summary.serviceChargeAmount)}</span>
              </div>
            )}
            {summary.totalDiscountAmount > 0 && (
              <div className="flex justify-between text-orange-500">
                <span>تخفیف کل:</span>
                <span>- {formatNumber(summary.totalDiscountAmount)}</span>
              </div>
            )}
          </div>

          {/* Total Dashed Line */}
          <div className="border-t-2 border-dashed border-gray-600 pt-3 flex justify-between items-center mb-4">
            <span className="text-black dark:text-white font-bold">قابل پرداخت:</span>
            <span className="text-xl font-black text-black dark:text-white">
              {formatNumber(summary.grandTotal)} تومان
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleCheckout} // استفاده از لاجیک جدید
              disabled={!activeSession || activeSession.orders.length === 0}
              className="flex-1 bg-[#2154D4] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard size={18} />
              تسویه حساب
            </button>
            <button
              onClick={() => alert("سفارش به آشپزخانه ارسال شد")}
              disabled={!activeSession || activeSession.orders.length === 0}
              className="flex-1 bg-[#F5710C] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer size={18} />
              ثبت سفارش
            </button>
          </div>
        </div>
      </aside>

      {/* --- Modals --- */}
      {showServiceModal && (
        <PriceModifierModal
          title="حق سرویس"
          initialModifier={activeSession?.serviceCharge}
          onClose={() => setShowServiceModal(false)}
          onApply={(m) => applyModifier(m, "service")}
          onRemove={() => applyModifier({ amount: 0, type: "fixed" }, "service")}
        />
      )}
      {showDiscountModal && (
        <PriceModifierModal
          title="تخفیف کل"
          initialModifier={activeSession?.totalDiscount}
          onClose={() => setShowDiscountModal(false)}
          onApply={(m) => applyModifier(m, "discount")}
          onRemove={() => applyModifier({ amount: 0, type: "fixed" }, "discount")}
        />
      )}
      {itemToDiscountId && (
        <PriceModifierModal
          title="تخفیف آیتم"
          initialModifier={
            activeSession?.orders.find((i) => i.id === itemToDiscountId)?.itemDiscount
          }
          onClose={() => setItemToDiscountId(null)}
          onApply={applyItemDiscount}
          onRemove={() => applyItemDiscount({ amount: 0, type: "fixed" })}
        />
      )}
      
      {/* --- New Takeout Info MODAL --- */}
      {showTakeoutModal && isTakeoutActive && (
        <TakeoutInfoModal
            details={takeoutDetails}
            setDetails={setTakeoutDetails}
            onClose={() => setShowTakeoutModal(false)}
            onContinue={() => {
                setShowTakeoutModal(false);
                setShowReceipt(true); // بعد از ثبت جزئیات، مودال پرداخت را باز کن
            }}
        />
      )}

      {/* --- RECEIPT MODAL --- */}
      {showReceipt && activeSession && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] dark:bg-gray-800 dark:text-gray-100">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50 print:hidden dark:bg-gray-700 dark:border-gray-700">
              <h3 className="font-bold text-lg dark:text-gray-100">پرداخت و تسویه حساب</h3>
              <button
                onClick={() => setShowReceipt(false)}
                className="text-slate-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* سمت چپ: فیش */}
              <div className="w-1/3 p-6 overflow-y-auto border-l dark:border-gray-700">
                <div className="font-mono text-sm">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-black mb-2 dark:text-white">کافه رستوران یوتاب</h1>
                    <p className="text-slate-500 text-xs dark:text-gray-400">خیابان آزادی، پلاک ۱۱۰</p>
                    <p className="text-slate-500 text-xs mt-1 dark:text-gray-400">021-88888888</p>
                  </div>

                  <div className="border-b-2 border-dashed border-slate-300 pb-4 mb-4 space-y-1 dark:border-gray-600">
                    <div className="flex justify-between">
                      <span>{isTakeoutActive ? "نوع سفارش: بیرون‌بر" : `میز: ${activeSessionId}`}</span>
                      <span>{new Date().toLocaleTimeString("fa-IR")}</span>
                    </div>
                    {isTakeoutActive && (
                       <div className="text-xs text-orange-500 border-t pt-1 mt-1 border-dotted">
                           <p className="font-bold">{takeoutDetails.customerName} - {takeoutDetails.phoneNumber}</p>
                           <p className="truncate">{takeoutDetails.address}</p>
                       </div>
                    )}
                    <div className="flex justify-between">
                      <span>شماره فاکتور:</span> <span>#{Math.floor(Math.random() * 10000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>صندوق‌دار:</span> <span>علی محمدی</span>
                    </div>
                  </div>

                  <table className="w-full text-right mb-6">
                    <thead>
                      <tr className="border-b dark:border-gray-600">
                        <th className="py-2">شرح</th>
                        <th className="py-2 text-center">تعداد</th>
                        <th className="py-2 text-left">مبلغ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeSession.orders.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100 dark:border-gray-700">
                          <td className="py-2 text-wrap">
                            {item.name}
                            {item.itemDiscount && item.itemDiscount.amount > 0 && (
                              <div className="text-xs text-red-500">
                                (-{item.itemDiscount.amount}
                                {item.itemDiscount.type === "percentage" ? "%" : "ت"})
                              </div>
                            )}
                          </td>
                          <td className="py-2 text-center">{item.quantity}</td>
                          <td className="py-2 text-left">{(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="space-y-2 font-bold">
                    <div className="flex justify-between">
                      <span>جمع کل اولیه:</span>
                      <span>{formatPrice(summary.subTotal)}</span>
                    </div>
                    {summary.serviceChargeAmount > 0 && (
                      <div className="flex justify-between text-yellow-600">
                        <span>حق سرویس:</span>
                        <span>{formatPrice(summary.serviceChargeAmount)}</span>
                      </div>
                    )}
                    {summary.totalDiscountAmount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>تخفیف کل:</span>
                        <span>{formatPrice(summary.totalDiscountAmount * -1)}</span>
                      </div>
                    )}
                    {/* نمایش هزینه ارسال در فیش */}
                    {isTakeoutActive && (
                        <div className="flex justify-between text-blue-600 dark:text-blue-400">
                            <span>هزینه ارسال:</span>
                            <span>{formatPrice(takeoutDetails.deliveryFee)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-slate-500 text-xs dark:text-gray-400">
                      <span>مالیات و عوارض:</span>
                      <span>{formatPrice(summary.taxAmount)}</span>
                    </div>
                    <div className="flex justify-between text-xl border-t-2 border-slate-800 pt-2 mt-2 dark:border-gray-100">
                      <span>مبلغ نهایی:</span>
                      <span className="text-green-600 dark:text-green-400">{formatPrice(summary.grandTotal)}</span>
                    </div>

                    {(cashPayment > 0 || cardToCardPayment > 0 || device2Payment > 0) && (
                      <div className="mt-4 pt-4 border-t border-slate-300 dark:border-gray-600">
                        <h4 className="font-bold mb-2 text-slate-700 dark:text-gray-300">روش‌های پرداخت:</h4>
                        <div className="space-y-1 text-sm">
                          {cashPayment > 0 && (
                            <div className="flex justify-between">
                              <span>💵 پرداخت نقدی:</span>
                              <span>{formatPrice(cashPayment)}</span>
                            </div>
                          )}
                          {cardToCardPayment > 0 && (
                            <div className="flex justify-between">
                              <span>💳 پرداخت کارت به کارت:</span>
                              <span>{formatPrice(cardToCardPayment)}</span>
                            </div>
                          )}
                          {device2Payment > 0 && (
                            <div className="flex justify-between">
                              <span>🏧 پرداخت با دستگاه شماره ۲:</span>
                              <span>{formatPrice(device2Payment)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold text-green-600 dark:text-green-400 border-t pt-2 mt-2">
                            <span>💰 جمع پرداخت‌ها:</span>
                            <span>{formatPrice(totalPaid)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 text-center text-xs text-slate-400 dark:text-gray-500">
                    <p>از دیدار مجدد شما خوشحال خواهیم شد</p>
                    <p className="mt-1">Powered by UtabPars RMS</p>
                  </div>
                </div>
              </div>

              {/* سمت راست: بخش پرداخت */}
              <div className="w-2/3 p-6 bg-slate-50 dark:bg-gray-700 flex flex-col">
                <div className="space-y-4 mb-6">
                  <h4 className="font-bold text-lg dark:text-gray-100">ورودی‌های پرداخت</h4>

                  {/* پرداخت نقدی */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-slate-700 dark:text-gray-300">پرداخت نقدی</label>
                    </div>
                    <div className="flex justify-between items-center">
                      <input
                        type="number"
                        value={cashPayment}
                        onChange={(e) => setCashPayment(Number(e.target.value))}
                        placeholder="مبلغ پرداخت نقدی"
                        className="w-1/2 p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
                      />
                      <button
                        onClick={() => fillRemainingAmount("cash")}
                        disabled={remainingAmount === 0}
                        className="text-s bg-blue-100 w-1/2 h-13 text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-200 hover:text--700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-900 dark:text-blue-300"
                      >
                        جایگذاری مبلغ مانده ({formatPrice(remainingAmount)})
                      </button>
                    </div>
                    {cashPayment > 0 && (
                      <div className="text-xs text-green-600 dark:text-green-400">
                        مبلغ وارد شده: {formatPrice(cashPayment)}
                      </div>
                    )}
                  </div>

                  {/* پرداخت کارت به کارت */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                        پرداخت کارت به کارت
                      </label>
                    </div>
                    <div className="flex justify-between items-center">
                      <input
                        type="number"
                        value={cardToCardPayment}
                        onChange={(e) => setCardToCardPayment(Number(e.target.value))}
                        placeholder="مبلغ پرداخت کارت به کارت"
                        className="w-1/2 p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
                      />
                      <button
                        onClick={() => fillRemainingAmount("cardToCard")}
                        disabled={remainingAmount === 0}
                        className="text-s bg-blue-100 w-1/2 h-13 text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-200 hover:text--700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-900 dark:text-blue-300"
                      >
                        جایگذاری مبلغ مانده ({formatPrice(remainingAmount)})
                      </button>
                    </div>
                    {cardToCardPayment > 0 && (
                      <div className="text-xs text-green-600 dark:text-green-400">
                        مبلغ وارد شده: {formatPrice(cardToCardPayment)}
                      </div>
                    )}
                  </div>

                  {/* پرداخت با دستگاه شماره ۲ */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                        پرداخت با دستگاه شماره ۲
                      </label>
                    </div>
                    <div className="flex justify-between items-center">
                      <input
                        type="number"
                        value={device2Payment}
                        onChange={(e) => setDevice2Payment(Number(e.target.value))}
                        placeholder="مبلغ پرداخت با دستگاه ۲"
                        className="w-1/2 p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
                      />
                      <button
                        onClick={() => fillRemainingAmount("device2")}
                        disabled={remainingAmount === 0}
                        className="text-s bg-blue-100 w-1/2 h-13 text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-200 hover:text--700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-900 dark:text-blue-300"
                      >
                        جایگذاری مبلغ مانده ({formatPrice(remainingAmount)})
                      </button>
                    </div>
                    {device2Payment > 0 && (
                      <div className="text-xs text-green-600 dark:text-green-400">
                        مبلغ وارد شده: {formatPrice(device2Payment)}
                      </div>
                    )}
                  </div>
                </div>

                {/* دکمه پرداخت با دستگاه اصلی */}
                <div className="flex justify-center mb-6">
                  <button
                    onClick={() => {
                      const devicePayment = remainingAmount;
                      setDevice2Payment((prev) => prev + devicePayment);
                    }}
                    disabled={remainingAmount === 0}
                    className="bg-purple-600 text-white py-4 px-8 rounded-xl font-bold flex items-center gap-3 hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Calculator size={24} />
                    پرداخت با دستگاه اصلی ({formatPrice(remainingAmount)})
                  </button>
                </div>

                {/* اطلاعات پرداخت */}
                <div className="mt-auto space-y-3 p-4 bg-white rounded-lg border dark:bg-gray-600 dark:border-gray-500">
                  <div className="flex justify-between text-lg">
                    <span className="font-medium dark:text-gray-300">جمع پرداخت‌ها:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{formatPrice(totalPaid)}</span>
                  </div>

                  <div className="flex justify-between text-lg">
                    <span className="font-medium dark:text-gray-300">مبلغ قابل پرداخت:</span>
                    <span className="font-bold dark:text-gray-100">{formatPrice(summary.grandTotal)}</span>
                  </div>

                  <div
                    className={`flex justify-between text-xl font-bold border-t pt-3 ${
                      remainingAmount === 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    <span>مانده پرداخت:</span>
                    <span>{formatPrice(remainingAmount)}</span>
                  </div>

                  {/* دکمه‌های پایین */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={finalizePayment}
                      disabled={remainingAmount > 0}
                      className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Banknote size={18} />
                      بستن حساب و چاپ رسید
                    </button>
                    <button
                      onClick={() => setShowReceipt(false)}
                      className="w-1/4 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300 transition-colors dark:bg-gray-500 dark:text-gray-100 dark:hover:bg-gray-400"
                    >
                      انصراف
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}