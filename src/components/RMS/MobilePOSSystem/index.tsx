"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  LayoutGrid,
  Search,
  X,
  ChevronUp,
  ChevronDown,
  Wifi,
  User,
  Send,
  Coffee,
  Trash2,
  Utensils,
  GlassWater,
  IceCream,
  AlignJustify,
  ClipboardList, // آیکون جدید دفترچه
  Check, // آیکون تیک برای انتخاب‌ها
} from "lucide-react";
import Fullscreen from "@/components/Layout/Header/Fullscreen";
import DarkMode from "@/components/Layout/Header/DarkMode";

// --- Types & Interfaces ---

interface ModifierOption {
  name: string;
  price: number;
}

interface ModifierGroup {
  title: string;
  options: ModifierOption[];
  multiSelect?: boolean;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: React.ReactNode;
  modifiers?: ModifierGroup[];
  isAvailable: boolean;
  stock?: number;
}

interface CartItem extends Product {
  cartId: string;
  quantity: number;
  selectedModifiers: { [key: string]: string[] };
  totalPrice: number;
  note?: string; // فیلد توضیحات
}

interface Table {
  id: number;
  name: string;
  capacity: number;
  status: "free" | "occupied" | "cleaning";
  startTime: Date | null;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  parentId: string | null;
}

// اینترفیس برای درخواست‌های رایج (Mock Data)
interface CommonRequest {
  id: number;
  text: string;
}

// ------------------------------------
// --- Mock Data ---
// ------------------------------------

// لیست درخواست‌های رایج که از دیتابیس می‌آید
const COMMON_REQUESTS: CommonRequest[] = [
  { id: 1, text: "سس کنار غذا سرو شود" },
  { id: 2, text: "بدون پیاز" },
  { id: 3, text: "پخت مدیوم (Medium)" },
  { id: 4, text: "پخت کامل (Well Done)" },
  { id: 5, text: "بدون یخ" },
  { id: 6, text: "خیلی داغ سرو شود" },
  { id: 7, text: "تند (Spicy)" },
  { id: 8, text: "با شیر کم چرب" },
];

const CATEGORIES: Category[] = [
  { id: "all", name: "همه", icon: <AlignJustify size={20} />, parentId: null },
  {
    id: "main_food",
    name: "غذای اصلی",
    icon: <Utensils size={20} />,
    parentId: null,
  },
  {
    id: "hot_bar",
    name: "بار گرم",
    icon: <Coffee size={20} />,
    parentId: null,
  },
  {
    id: "cold_bar",
    name: "بار سرد",
    icon: <GlassWater size={20} />,
    parentId: null,
  },
  {
    id: "dessert_bar",
    name: "دسر",
    icon: <IceCream size={20} />,
    parentId: null,
  },

  { id: "burger", name: "همبرگر", icon: null, parentId: "main_food" },
  { id: "pizza", name: "پیتزا", icon: null, parentId: "main_food" },
  { id: "pasta", name: "پاستا", icon: null, parentId: "main_food" },
  { id: "sandwich", name: "ساندویچ", icon: null, parentId: "main_food" },
  { id: "steak", name: "استیک", icon: null, parentId: "main_food" },
  { id: "appetizer", name: "پیش غذا", icon: null, parentId: "main_food" },

  { id: "coffee", name: "قهوه اسپرسو", icon: null, parentId: "hot_bar" },
  { id: "tea", name: "چای و دمنوش", icon: null, parentId: "hot_bar" },

  { id: "smoothie", name: "اسموتی", icon: null, parentId: "cold_bar" },
  { id: "soda", name: "نوشابه", icon: null, parentId: "cold_bar" },

  { id: "cake", name: "کیک", icon: null, parentId: "dessert_bar" },
  { id: "ice_cream", name: "بستنی", icon: null, parentId: "dessert_bar" },
];

const PRODUCTS: Product[] = [
  {
    id: 101,
    name: "پیتزا پپرونی",
    price: 180000,
    category: "pizza",
    image: (
      <img
        src="https://placehold.co/150x150/111/fff?text=Pizza"
        className="w-full h-full object-cover"
        alt="پیتزا"
      />
    ),
    isAvailable: true,
    stock: 2,
    modifiers: [
      {
        title: "سایز",
        options: [
          { name: "کوچک", price: 0 },
          { name: "متوسط", price: 40000 },
          { name: "بزرگ", price: 80000 },
        ],
        multiSelect: false,
      },
    ],
  },
  {
    id: 102,
    name: "چیز برگر کلاسیک",
    price: 145000,
    category: "burger",
    image: (
      <img
        src="https://placehold.co/150x150/800000/ffffff?text=Burger"
        className="w-full h-full object-cover"
        alt="برگر"
      />
    ),
    isAvailable: true,
    stock: 10,
    modifiers: [
      {
        title: "پخت گوشت",
        options: [
          { name: "مدیوم", price: 0 },
          { name: "ولدان", price: 0 },
        ],
      },
    ],
  },
  {
    id: 202,
    name: "پاستا آلفردو",
    price: 150000,
    category: "pasta",
    image: (
      <img
        src="https://placehold.co/150x150/228B22/ffffff?text=Pasta"
        className="w-full h-full object-cover"
        alt="پاستا"
      />
    ),
    isAvailable: true,
    stock: 5,
  },
  {
    id: 401,
    name: "اسپرسو دبل",
    price: 65000,
    category: "coffee",
    image: (
      <img
        src="https://placehold.co/150x150/696969/ffffff?text=Espresso"
        className="w-full h-full object-cover"
        alt="اسپرسو"
      />
    ),
    isAvailable: true,
    stock: 20,
  },
];

const INITIAL_TABLES: Table[] = [
  { id: 1, name: "میز ۱", capacity: 4, status: "free", startTime: null },
  {
    id: 2,
    name: "میز ۲",
    capacity: 2,
    status: "occupied",
    startTime: new Date(),
  },
  { id: 3, name: "میز ۳", capacity: 6, status: "cleaning", startTime: null },
  { id: 4, name: "میز ۴", capacity: 4, status: "free", startTime: null },
  { id: 5, name: "میز ۵", capacity: 2, status: "free", startTime: null },
  { id: 6, name: "میز ۶", capacity: 8, status: "occupied", startTime: new Date() },
];

// --- Components ---

/**
 * ProductCard Updated
 * تغییرات: دکمه افزودن تقسیم شده (یکی برای افزودن سریع، یکی برای توضیحات)
 */
const ProductCard: React.FC<{
  product: Product;
  onOpenNoteModal: (
    product: Product,
    modifiers: { [key: string]: string[] }
  ) => void;
  onAdd: (
    product: Product,
    modifiers: { [key: string]: string[] },
    note?: string
  ) => void;
}> = ({ product, onOpenNoteModal, onAdd }) => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fa-IR").format(price);

  const mainModifierGroup = product.modifiers?.[0];

  const [selectedOption, setSelectedOption] = useState<ModifierOption | null>(
    mainModifierGroup ? mainModifierGroup.options[0] : null
  );

  const currentPrice =
    product.price + (selectedOption ? selectedOption.price : 0);

  // تابع کمکی برای ساختن آبجکت مودیفایرها
  const getModifiers = () => {
    const modifiers: { [key: string]: string[] } = {};
    if (mainModifierGroup && selectedOption) {
      modifiers[mainModifierGroup.title] = [selectedOption.name];
    }
    return modifiers;
  };

  const handleQuickAdd = () => {
    onAdd(product, getModifiers(), undefined);
  };

  const handleOpenNote = () => {
    onOpenNoteModal(product, getModifiers());
  };

  return (
    <div
      className={`
        bg-[#E5E5E5] dark:bg-[#1E1E1E] p-3 rounded-2xl relative flex flex-col gap-3 w-full h-auto
        ${
          !product.isAvailable ? "opacity-60 grayscale pointer-events-none" : ""
        }
      `}
    >
      {/* Grid: Image & Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <h3 className="text-black dark:text-white font-extrabold text-base leading-tight text-right line-clamp-2">
              {product.name}
            </h3>
          </div>
          {mainModifierGroup && (
            <div className="flex flex-wrap gap-1.5 content-start">
              {mainModifierGroup.options.map((opt, idx) => {
                const isSelected = selectedOption?.name === opt.name;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedOption(opt)}
                    className={`
                        text-xs font-bold py-1 px-2 rounded-lg border transition-all w-full text-center
                        ${
                          isSelected
                            ? "bg-[#F5710C] text-white border-[#F5710C]"
                            : "bg-transparent text-black dark:text-white border-[#F5710C]"
                        }
                      `}
                  >
                    {opt.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="aspect-square w-full rounded-xl overflow-hidden shadow-sm bg-gray-300 relative">
          {product.image}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        </div>
      </div>

      {/* Footer: Price, Buttons, Stock */}
      <div className="flex flex-col gap-2 mt-auto">
        <div className="flex items-center justify-end gap-1">
          <span className="text-xs text-left text-black dark:text-white">
            تومان
          </span>
          <span className="text-black dark:text-white text-left font-black text-xl">
            {formatPrice(currentPrice)}
          </span>
        </div>

        {/* Action Buttons Row */}
        <div className="flex gap-2 h-11">
          {/* Notebook Button (برای توضیحات) */}
          <button
            onClick={handleOpenNote}
            disabled={!product.isAvailable}
            className="w-14 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-xl flex justify-center items-center shadow-sm active:scale-95 transition-transform border border-gray-300 dark:border-gray-600 hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:text-orange-600"
            title="افزودن توضیحات"
          >
            <ClipboardList size={20} />
          </button>

          {/* Add Button (سریع) */}
          <button
            onClick={handleQuickAdd}
            disabled={!product.isAvailable}
            className="flex-1 bg-[#F5710C] text-white rounded-xl font-extrabold text-lg shadow-md active:scale-[0.98] transition-transform hover:b flex justify-center items-center"
          >
            افزودن
          </button>
        </div>

        {product.stock !== undefined && (
          <div className="text-[11px] text-black dark:text-white font-medium">
            موجودی: {product.stock} عدد
          </div>
        )}
      </div>
    </div>
  );
};

const TableDrawer: React.FC<any> = ({
  isTableDrawerOpen,
  setIsTableDrawerOpen,
  tables,
  selectedTable,
  handleTableSelect,
  getElapsedTime,
}) => {
  return (
    <div
      className={`absolute inset-0 z-40 transition-opacity duration-300 ${
        isTableDrawerOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-[#D6D5D5] backdrop-blur-sm"
        onClick={() => setIsTableDrawerOpen(false)}
      />
      <div
        className={`absolute top-0 right-0 w-3/4 max-w-sm h-full bg-[#D6D5D5] dark:bg-[#121214] shadow-2xl transform transition-transform duration-300 flex flex-col ${
          isTableDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center bg-[#D6D5D5] dark:bg-[#121214]">
          <h2 className="font-bold text-lg flex items-center gap-2 text-gray-800 dark:text-white">
            <LayoutGrid size={20} /> وضعیت سالن
          </h2>
          <button
            onClick={() => setIsTableDrawerOpen(false)}
            className="p-2 text-gray-500 hover:bg-gray-200 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {tables.map((table: Table) => (
            <div
              key={table.id}
              onClick={() => handleTableSelect(table)}
              className={`flex justify-between items-center p-4 rounded-xl border-2 cursor-pointer transition-all bg-white border-gray-200 dark:bg-[#1e1e20] dark:border-gray-700 dark:text-gray-100 ${
                selectedTable?.id === table.id
                  ? "ring-2 ring-orange-500 border-transparent"
                  : "hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex flex-col">
                <span className="font-bold text-lg text-gray-800 dark:text-white">
                  {table.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {table.capacity} نفره
                </span>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span
                  className={`text-sm font-bold px-3 py-1 rounded-lg ${
                    table.status === "occupied"
                      ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                  }`}
                >
                  {table.status === "occupied" ? "اشغال" : "آزاد"}
                </span>

                {table.status === "occupied" && (
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                    {getElapsedTime(table.startTime)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function MobilePOS() {
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isTableDrawerOpen, setIsTableDrawerOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  const [activeParentCategory, setActiveParentCategory] =
    useState<string>("all");
  const [activeSubCategory, setActiveSubCategory] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartExpanded, setIsCartExpanded] = useState(false);

  // --- استیت‌های مربوط به مودال توضیحات محصول ---
  const [isProductNoteModalOpen, setIsProductNoteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [currentModifiers, setCurrentModifiers] = useState<{
    [key: string]: string[];
  }>({});
  const [selectedCommonNotes, setSelectedCommonNotes] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState("");
  // ----------------------------------------------

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // -- Handlers for Modal --

  const handleOpenProductNoteModal = (
    product: Product,
    modifiers: { [key: string]: string[] }
  ) => {
    setCurrentProduct(product);
    setCurrentModifiers(modifiers);
    setSelectedCommonNotes([]); // ریست کردن انتخاب‌ها
    setCustomNote("");
    setIsProductNoteModalOpen(true);
  };

  const handleCloseProductNoteModal = () => {
    setIsProductNoteModalOpen(false);
    setCurrentProduct(null);
    setCurrentModifiers({});
    setSelectedCommonNotes([]);
    setCustomNote("");
  };

  const handleToggleCommonNote = (text: string) => {
    setSelectedCommonNotes((prev) =>
      prev.includes(text) ? prev.filter((t) => t !== text) : [...prev, text]
    );
  };

  const handleAddProductWithNotes = () => {
    if (!currentProduct) return;

    // ترکیب متن‌های رایج انتخاب شده با متن دستی
    const allNotesArray = [...selectedCommonNotes];
    if (customNote.trim()) {
      allNotesArray.push(customNote.trim());
    }
    const finalNote = allNotesArray.length > 0 ? allNotesArray.join("، ") : undefined;

    handleAddToCartFromCard(currentProduct, currentModifiers, finalNote);
    handleCloseProductNoteModal();
  };

  // -- Handlers for Cart --

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientY;
    const deltaY = touchStart - touchEnd;
    const threshold = 50;

    if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0) {
        setIsCartExpanded(true);
      } else {
        setIsCartExpanded(false);
      }
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fa-IR").format(price);

  const getElapsedTime = (startTime: Date | null) => {
    if (!startTime) return "";
    const diff = Math.floor(
      (currentTime.getTime() - startTime.getTime()) / 60000
    );
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")} دقیقه`;
  };

  const handleParentCategorySelect = (parentId: string) => {
    setActiveParentCategory(parentId);
    setActiveSubCategory("");
    setSearchQuery("");
  };

  const handleSubCategorySelect = (subId: string) => {
    setActiveSubCategory(subId);
    setSearchQuery("");
  };

  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
    setIsTableDrawerOpen(false);
  };

  // --- افزودن به سبد خرید (اصلاح شده برای پذیرش Note) ---
  const handleAddToCartFromCard = (
    product: Product,
    modifiers: { [key: string]: string[] },
    note?: string
  ) => {
    let extraPrice = 0;
    if (product.modifiers) {
      product.modifiers.forEach((group) => {
        const selectedOptions = modifiers[group.title] || [];
        selectedOptions.forEach((optName) => {
          const opt = group.options.find((o) => o.name === optName);
          if (opt) extraPrice += opt.price;
        });
      });
    }

    const finalUnitPrice = product.price + extraPrice;
    const modString = JSON.stringify(modifiers);
    // برای اینکه آیتم‌های با توضیحات متفاوت جدا شوند، note را هم در شناسه دخیل می‌کنیم (اختیاری)
    // اما معمولا در پوز فروشگاهی، آیتم‌های یکسان تجمیع می‌شوند مگر اینکه note فرق کند.
    // در اینجا برای سادگی شناسه را بر اساس محصول+مودیفایر+توضیحات می‌سازیم
    const cartId = `${product.id}-${modString}-${note || ""}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartId === cartId);
      if (existing) {
        return prev.map((item) =>
          item.cartId === cartId
            ? {
                ...item,
                quantity: item.quantity + 1,
                totalPrice: (item.quantity + 1) * finalUnitPrice,
              }
            : item
        );
      } else {
        return [
          ...prev,
          {
            ...product,
            cartId,
            quantity: 1,
            selectedModifiers: modifiers,
            totalPrice: finalUnitPrice,
            note: note,
          },
        ];
      }
    });
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(
      (prev) =>
        prev
          .map((item) => {
            if (item.cartId === cartId) {
              const newQty = item.quantity + delta;
              if (newQty <= 0) return null;
              const unitPrice = item.totalPrice / item.quantity;
              return {
                ...item,
                quantity: newQty,
                totalPrice: newQty * unitPrice,
              };
            }
            return item;
          })
          .filter(Boolean) as CartItem[]
    );
  };

  const handleCheckout = () => {
    if (!selectedTable) {
      setIsTableDrawerOpen(true);
      return;
    }
    if (cart.length === 0) return;
    console.log("Order:", { tableId: selectedTable.id, items: cart });
    setCart([]);
    setIsCartExpanded(false);
    setTables((prev) =>
      prev.map((t) =>
        t.id === selectedTable.id
          ? { ...t, status: "occupied", startTime: new Date() }
          : t
      )
    );
  };

  // -- Memoized Data --
  const parentCategories = useMemo(() => {
    return CATEGORIES.filter((c) => c.parentId === null);
  }, []);

  const subCategories = useMemo(() => {
    if (activeParentCategory === "all") {
      return CATEGORIES.filter((c) => c.parentId !== null);
    }
    return CATEGORIES.filter((c) => c.parentId === activeParentCategory);
  }, [activeParentCategory]);

  const filteredProducts = useMemo(() => {
    let products = PRODUCTS;
    if (searchQuery) {
      products = products.filter((p) => p.name.includes(searchQuery));
    } else {
      if (activeParentCategory !== "all") {
        if (activeSubCategory) {
          products = products.filter((p) => p.category === activeSubCategory);
        } else {
          const childIds = CATEGORIES.filter(
            (c) => c.parentId === activeParentCategory
          ).map((c) => c.id);
          products = products.filter((p) => childIds.includes(p.category));
        }
      } else if (activeSubCategory) {
        products = products.filter((p) => p.category === activeSubCategory);
      }
    }
    return products;
  }, [activeParentCategory, activeSubCategory, searchQuery]);

  const cartTotals = useMemo(() => {
    const total = cart.reduce((acc, item) => acc + item.totalPrice, 0);
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    return { total, count };
  }, [cart]);

  // --- Render ---

  return (
    <div
      className="w-full h-screen bg-[#ffffff] dark:bg-[#121214] flex flex-col font-sans text-black dark:text-white"
      dir="rtl"
    >
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-3 bg-[#ffffff] dark:bg-[#121214] border-b boreder-black dark:border-white shadow-md z-20 shrink-0">
        <div className="flex items-center gap-2">
          <User size={20} className="text-black dark:text-white" /> گارسون
        </div>
        <div className="flex items-center gap-2">
          <Fullscreen />
          <DarkMode />
        </div>
        <div className="flex items-center gap-2">
          <Wifi size={20} className="text-green-600" />
          <button
            onClick={() => setIsTableDrawerOpen(true)}
            className="bg-transparent text-[#2b2c32] dark:text-white px-3 py-1.5 rounded-lg text-sm font-bold active:scale-95 transition-transform flex items-center gap-1"
          >
            <LayoutGrid size={24} className="text-[#2b2c32] dark:text-white" />
            <span>{selectedTable ? selectedTable.name : "انتخاب میز"}</span>
          </button>
        </div>
      </header>

      {/* Categories & Search */}
      <div className="bg-[#ffffff] dark:bg-[#121214] shadow-sm z-10 shrink-0">
        <div className="px-4 py-3">
          <div className="relative">
            <Search
              size={20}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black dark:text-white"
            />
            <input
              type="text"
              placeholder="جستجو در منو ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-1 pr-10 pl-4 border border-black dark:border-white rounded-xl bg-gray-50 dark:bg-[#424347] focus:ring-0 focus:border-orange-500 text-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Level 1: Parent Categories */}
        <div className="flex overflow-x-auto px-4 pb-4 gap-3 no-scrollbar">
          {parentCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleParentCategorySelect(cat.id)}
              className={`
                flex flex-col items-center justify-center w-[65px] h-[65px] rounded-xl transition-all border shrink-0
                ${
                  activeParentCategory === cat.id
                    ? "bg-[#F5710C] text-white border-[#F5710C] shadow-lg"
                    : "bg-white dark:bg-[#111113] text-black dark:text-white border-orange-400 hover:bg-orange-50"
                }
              `}
            >
              <div className="mb-1">{cat.icon}</div>
              <span className="text-sm font-bold">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Level 2: Sub Categories */}
        <div className="bg-[#ffffff] dark:bg-[#121214] border-t border-gray-500">
          <div className="flex overflow-x-auto px-4 gap-6 no-scrollbar">
            <button
              onClick={() => handleSubCategorySelect("")}
              className={`
                    py-4 text-sm font-bold whitespace-nowrap border-b-[3px] transition-all
                    ${
                      activeSubCategory === ""
                        ? "border-[#F5710C] text-[#F5710C]"
                        : "border-transparent text-black dark:text-white/80"
                    }
                `}
            >
              همه
            </button>
            {subCategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => handleSubCategorySelect(sub.id)}
                className={`
                    py-4 text-sm font-bold whitespace-nowrap border-b-[3px] transition-all
                    ${
                      activeSubCategory === sub.id
                        ? "border-[#F5710C] text-[#F5710C]"
                        : "border-transparent text-black dark:text-white/80"
                    }
                `}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <main className="flex-1 overflow-y-auto p-4 pb-32 bg-[#ffffff] dark:bg-[#121214]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenNoteModal={handleOpenProductNoteModal}
              onAdd={handleAddToCartFromCard}
            />
          ))}
        </div>
      </main>

      {/* Drawers & Modals */}
      <TableDrawer
        isTableDrawerOpen={isTableDrawerOpen}
        setIsTableDrawerOpen={setIsTableDrawerOpen}
        tables={tables}
        selectedTable={selectedTable}
        handleTableSelect={handleTableSelect}
        getElapsedTime={getElapsedTime}
      />

      {/* --- Product Note Modal (مودال توضیحات محصول) --- */}
      {isProductNoteModalOpen && currentProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={handleCloseProductNoteModal}
        >
          <div
            className="bg-[#ffffff] dark:bg-[#1e1e20] rounded-2xl shadow-2xl w-full max-w-lg p-6 m-4 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                <ClipboardList size={24} className="text-orange-500" />
                <span>{currentProduct.name}</span>
              </h3>
              <button
                onClick={handleCloseProductNoteModal}
                className="text-gray-400 hover:text-red-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* بخش درخواست‌های رایج */}
              <div className="mb-6">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">
                  درخواست‌های رایج:
                </p>
                <div className="flex flex-wrap gap-2">
                  {COMMON_REQUESTS.map((req) => {
                    const isSelected = selectedCommonNotes.includes(req.text);
                    return (
                      <button
                        key={req.id}
                        onClick={() => handleToggleCommonNote(req.text)}
                        className={`
                          px-3 py-2 rounded-xl text-sm font-bold transition-all border flex items-center gap-2
                          ${
                            isSelected
                              ? "bg-orange-500 text-white border-orange-500 shadow-md transform scale-105"
                              : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:border-orange-300"
                          }
                        `}
                      >
                        {isSelected && <Check size={16} />}
                        {req.text}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* بخش توضیحات متنی */}
              <div className="mb-2">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">
                  یادداشت سفارشی:
                </p>
                <textarea
                  className="w-full p-4 h-32 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-black dark:text-white resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                  placeholder="توضیحات خاص خود را اینجا بنویسید..."
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={handleCloseProductNoteModal}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleAddProductWithNotes}
                className="flex-[2] py-3 bg-[#F5710C] text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
              >
                ثبت و افزودن به سبد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Bottom Sheet */}
      <div
        className={`absolute bottom-0 left-0 w-full bg-[#F3F3F3] dark:bg-[#111113] shadow-[0_-5px_30px_rgba(0,0,0,0.3)] rounded-t-3xl border-t border-gray-700 flex flex-col transition-all duration-500 z-30 ease-in-out ${
          isCartExpanded ? "h-[90%]" : "h-[85px]"
        }`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="px-6 py-4 flex justify-between items-center cursor-pointer shrink-0"
          onClick={() => setIsCartExpanded(!isCartExpanded)}
        >
          <div className="flex flex-col">
            <div className="flex items-center text-xs text-black dark:text-white font-medium mb-1">
              <div
                className={`w-full border p-2 rounded-lg mr-2 ${
                  selectedTable ? "border-[#05731F]" : "border-[#AE0303]"
                }`}
                >
                میز: {selectedTable ? selectedTable.name : "انتخاب نشده"}
              </div>
            </div>
            <div className="flex items-baseline gap-1 text-[#F5710C]">
              <span className="text-xl font-black">
                {formatPrice(cartTotals.total)}
              </span>
              <span className="text-xs text-[#F5710C]">تومان</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full flex items-center justify-center transition-colors bg-[#FFAC6D] text-[#ffffff]">
                {isCartExpanded ? (
                  <ChevronDown size={24} />
                ) : (
                  <ChevronUp size={24} />
                )}
              </div>
              {cartTotals.count > 0 && !isCartExpanded && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-[#F5710C] text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold border-2 border-gray-800 shadow-sm animate-pulse">
                  {cartTotals.count}
                </span>
              )}
            </div>
            {!isCartExpanded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckout();
                }}
                disabled={cartTotals.count === 0 || !selectedTable}
                className={`bg-orange-500 text-white px-6 py-3 rounded-xl text-lg font-black shadow-lg shadow-orange-700/50 transition-colors flex items-center gap-2 ${
                  cartTotals.count === 0 || !selectedTable
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-orange-600"
                }`}
              >
                ثبت سفارش
              </button>
            )}
          </div>
        </div>

        {/* Cart Details */}
        <div
          className={`flex-1 flex flex-col overflow-hidden bg-[#ffffff] dark:bg-[#121214] rounded-t-3xl transition-opacity duration-300 ${
            isCartExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex-1 overflow-y-auto px-6 pb-20 pt-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-black dark:text-white">
                <Coffee size={48} className="mb-2 opacity-20" />
                <p>سبد خرید خالی است</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.cartId}
                    className="flex justify-between items-start py-4 border-b border-dashed border-gray-200"
                  >
                    <div className="flex-1">
                      <div className="font-bold text-black dark:text-white text-lg">
                        {item.name}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(item.selectedModifiers).map(
                          ([key, values]) =>
                            values.map((val) => (
                              <span
                                key={val}
                                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 px-2 py-0.5 rounded"
                              >
                                {val}
                              </span>
                            ))
                        )}
                      </div>
                      {/* نمایش توضیحات ثبت شده در سبد */}
                      {item.note && (
                        <div className="mt-2 flex items-start gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg border border-amber-100 dark:border-amber-800">
                            <ClipboardList size={14} className="shrink-0 mt-0.5"/>
                            <span>{item.note}</span>
                        </div>
                      )}

                      <div className="text-sm text-orange-600 font-mono mt-2 font-bold">
                        {formatPrice(item.totalPrice)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white dark:bg-[#121214] border border-gray-200 rounded-xl p-1 shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.cartId, -1)}
                        className="w-14 h-14 rounded-lg text-red-500 text-3xl hover:bg-red-50 flex items-center justify-center transition-colors"
                      >
                        {item.quantity === 1 ? <Trash2 size={24} /> : "-"}
                      </button>
                      <span className="font-bold text-lg w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartId, 1)}
                        className="w-14 h-14 rounded-lg text-green-600 text-2xl hover:bg-green-50 flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-6 bg-[#ffffff] dark:bg-[#121214] border-t border-gray-100">
            <div className="flex justify-between items-center mb-4 text-sm text-black dark:text-white">
              <span>جمع کل اقلام ({cartTotals.count})</span>
              <span className="font-bold text-black dark:text-white text-xl">
                {formatPrice(cartTotals.total)} تومان
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={cartTotals.count === 0 || !selectedTable}
              className={`w-full bg-orange-500 text-white py-4 rounded-xl font-black text-xl shadow-sm shadow-orange-200 transition-all active:scale-[0.99] flex items-center justify-center gap-2 ${
                cartTotals.count === 0 || !selectedTable
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-orange-600"
              }`}
            >
              <Send size={20} /> ارسال به آشپزخانه
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}