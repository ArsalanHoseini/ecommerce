"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
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
  Phone,
  Home,
  Edit,
  Save,
  FileText,
  Eye,
} from "lucide-react";

import { IoIosRestaurant } from "react-icons/io";

// --- Types & Constants ---
type PriceModifierType = "percentage" | "fixed";
type TableType = "physical" | "custom";
type TableStatus = "free" | "occupied" | "cleaning" | "takeout";

// تایپ جدید برای مدیریت ویوی سایدبار
type ViewMode = "hall" | "categories" | "orders" | "takeout";

// --- NEW INTERFACES FOR VARIANTS & MODIFIERS ---
interface Variant {
  id: string;
  name: string;
  price: number;
}

interface Modifier {
  id: string;
  name: string;
  price: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  stock?: number;
  variants?: Variant[]; // اضافه شده: لیست سایزها
}

interface PriceModifier {
  amount: number;
  type: PriceModifierType;
}

interface OrderItem extends Product {
  // برای آیتم‌های سفارش، شناسه یکتا نیاز داریم تا آیتم‌های با سایز متفاوت قاطی نشوند
  // اما برای حفظ ساختار کد شما، از ترکیب id و variant استفاده میکنیم
  uid?: string;
  quantity: number;
  itemDiscount?: PriceModifier;
  description?: string;
  selectedVariant?: Variant; // اضافه شده: سایز انتخاب شده
  selectedModifiers?: Modifier[]; // اضافه شده: لیست افزودنی‌ها
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
  isDraft?: boolean;
  deliveryFee?: number;
}

// وضعیت‌های سفارش مشخص‌تر
type OrderStatus = "در حال پخت" | "آماده" | "تحویل داده شده" | "لغو شده";

interface OrderDisplay {
  id: number;
  tableId: number;
  tableTitle: string;
  items: OrderItem[];
  status: OrderStatus;
  time: string;
  total: number;
  customerName?: string;
  phoneNumber?: string;
}

interface PriceModifierModalProps {
  title: string;
  initialModifier?: PriceModifier;
  onClose: () => void;
  onApply: (modifier: PriceModifier) => void;
  onRemove: () => void;
}

interface TakeoutDetails {
  customerName: string;
  phoneNumber: string;
  address: string;
  deliveryFee: number;
  orderId: number;
}

const TAKEAWAY_TABLE_ID = 999;
const TAX_RATE = 0.09;

// --- Mock Data ---

// --- NEW: MOCK MODIFIERS ---
const AVAILABLE_MODIFIERS: Modifier[] = [
  { id: "m1", name: "پنیر اضافه", price: 25000 },
  { id: "m2", name: "سس قارچ", price: 15000 },
  { id: "m3", name: "سس سیر", price: 10000 },
  { id: "m4", name: "نان اضافه", price: 5000 },
  { id: "m5", name: "فلفل هالوپینو", price: 12000 },
];

const CATEGORIES = [
  { id: "all", name: "همه", icon: <LayoutGrid size={20} /> },
  { id: "hot-drink", name: "نوشیدنی گرم", icon: <Coffee size={20} /> },
  { id: "main-course", name: "غذای اصلی", icon: <Utensils size={20} /> },
  { id: "dessert", name: "دسر و کیک", icon: <ChefHat size={20} /> },
];

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "لاته",
    price: 65000,
    category: "hot-drink",
    image: "☕",
    stock: 10,
  },
  {
    id: 2,
    name: "اسپرسو",
    price: 45000,
    category: "hot-drink",
    image: "☕",
    stock: 15,
  },
  {
    id: 3,
    name: "موکا",
    price: 70000,
    category: "hot-drink",
    image: "🍫",
    stock: 8,
  },
  {
    id: 4,
    name: "چای ماسالا",
    price: 55000,
    category: "hot-drink",
    image: "🍵",
    stock: 20,
  },
  {
    id: 5,
    name: "پاستا",
    price: 180000,
    category: "main-course",
    image: "🍝",
    stock: 5,
  },
  {
    id: 6,
    name: "برگر کلاسیک",
    price: 210000,
    category: "main-course",
    image: "🍔",
    stock: 12,
  },
  {
    id: 7,
    name: "پیتزا پپرونی",
    price: 240000,
    category: "main-course",
    image: "🍕",
    stock: 7,
    // --- NEW: VARIANTS ADDED ---
    variants: [
      { id: "small", name: "کوچک", price: 190000 },
      { id: "medium", name: "متوسط", price: 240000 },
      { id: "large", name: "بزرگ", price: 320000 },
    ],
  },
  {
    id: 8,
    name: "سالاد سزار",
    price: 160000,
    category: "main-course",
    image: "🥗",
    stock: 9,
  },
  { id: 9, name: "چیزکیک", price: 90000, category: "dessert", image: "🍰" },
  { id: 10, name: "براونی", price: 85000, category: "dessert", image: "🍪" },
];

// --- Helpers ---
const formatPrice = (price: number) =>
  new Intl.NumberFormat("fa-IR").format(Math.max(0, Math.round(price))) +
  " تومان";
const formatNumber = (num: number) =>
  new Intl.NumberFormat("fa-IR").format(num);

const normalizeSearch = (s: string) =>
  s
    .toString()
    .trim()
    .replace(/ي/g, "ی") // عربی -> فارسی
    .replace(/ك/g, "ک")
    .toLowerCase();

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
};

// --- PriceModifierModal Component (unchanged) ---
const PriceModifierModal: React.FC<PriceModifierModalProps> = ({
  title,
  initialModifier,
  onClose,
  onApply,
  onRemove,
}) => {
  const [amount, setAmount] = useState(initialModifier?.amount || 0);
  const [type, setType] = useState<PriceModifierType>(
    initialModifier?.type || "percentage"
  );

  useEffect(() => {
    setAmount(initialModifier?.amount || 0);
    setType(initialModifier?.type || "percentage");
  }, [initialModifier]);

  const handleApply = () => {
    if (amount <= 0) return;
    onApply({ amount, type });
    onClose();
  };

  const handleRemove = () => {
    onRemove();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-[#ffffff] dark:bg-[#000000] rounded-xl p-6 w-96 text-black dark:text-white"
        dir="rtl"
      >
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
                className={`flex-1 py-2 rounded-lg ${
                  type === "percentage"
                    ? "bg-[#F5710C] text-white"
                    : "bg-[#D6D5D5] dark:bg-[#1E1E1E] text-black dark:text-white"
                }`}
              >
                درصدی
              </button>
              <button
                onClick={() => setType("fixed")}
                className={`flex-1 py-2 rounded-lg ${
                  type === "fixed"
                    ? "bg-[#F5710C] text-white"
                    : "bg-[#D6D5D5] dark:bg-[#1E1E1E] text-black dark:text-white"
                }`}
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
            disabled={amount <= 0}
            className={`flex-1 py-3 rounded-lg ${
              amount <= 0
                ? "bg-gray-400 text-gray-200"
                : "bg-[#2154D4] text-white"
            }`}
          >
            اعمال
          </button>
        </div>
      </div>
    </div>
  );
};

// --- NEW: Variant Selection Modal ---
const VariantSelectionModal: React.FC<{
  product: Product;
  onClose: () => void;
  onSelect: (variant: Variant) => void;
}> = ({ product, onClose, onSelect }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div
        className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 w-full max-w-sm shadow-2xl"
        dir="rtl"
      >
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
          <h3 className="text-xl font-bold text-black dark:text-white">
            انتخاب سایز: {product.name}
          </h3>
          <button onClick={onClose}>
            <X className="text-black dark:text-white" />
          </button>
        </div>
        <div className="space-y-3">
          {product.variants?.map((variant) => (
            <button
              key={variant.id}
              onClick={() => onSelect(variant)}
              className="w-full flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 hover:bg-orange-100 dark:hover:bg-gray-700 rounded-xl transition-all border border-transparent hover:border-orange-500 text-black dark:text-white"
            >
              <span className="font-bold text-lg">{variant.name}</span>
              <span className="text-orange-600 dark:text-orange-400 font-bold">
                {formatNumber(variant.price)} تومان
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- NEW: Modifiers Selection Modal ---
const ModifiersSelectionModal: React.FC<{
  item: OrderItem;
  onClose: () => void;
  onUpdate: (modifiers: Modifier[]) => void;
}> = ({ item, onClose, onUpdate }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    item.selectedModifiers?.map((m) => m.id) || []
  );

  const toggleModifier = (modId: string) => {
    setSelectedIds((prev) =>
      prev.includes(modId)
        ? prev.filter((id) => id !== modId)
        : [...prev, modId]
    );
  };

  const handleSave = () => {
    const newModifiers = AVAILABLE_MODIFIERS.filter((m) =>
      selectedIds.includes(m.id)
    );
    onUpdate(newModifiers);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div
        className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 w-full max-w-md shadow-2xl flex flex-col max-h-[80vh]"
        dir="rtl"
      >
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3 shrink-0">
          <div>
            <h3 className="text-xl font-bold text-black dark:text-white">
              افزودنی‌های محصول
            </h3>
            <p className="text-sm text-gray-500">
              {item.name}{" "}
              {item.selectedVariant ? `(${item.selectedVariant.name})` : ""}
            </p>
          </div>
          <button onClick={onClose}>
            <X className="text-black dark:text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 mb-4 pr-1">
          {AVAILABLE_MODIFIERS.map((mod) => (
            <div
              key={mod.id}
              onClick={() => toggleModifier(mod.id)}
              className={`flex justify-between items-center p-3 rounded-lg cursor-pointer border transition-all ${
                selectedIds.includes(mod.id)
                  ? "bg-orange-50 border-orange-500 dark:bg-orange-900/20 dark:border-orange-500"
                  : "bg-gray-50 border-transparent dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    selectedIds.includes(mod.id)
                      ? "bg-orange-500 border-orange-500"
                      : "border-gray-400 bg-white dark:bg-transparent"
                  }`}
                >
                  {selectedIds.includes(mod.id) && (
                    <CheckCircle size={14} className="text-white" />
                  )}
                </div>
                <span className="font-bold text-black dark:text-white">
                  {mod.name}
                </span>
              </div>
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                +{formatNumber(mod.price)}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-[#2154D4] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shrink-0 shadow-lg"
        >
          ثبت تغییرات
        </button>
      </div>
    </div>
  );
};

// --- OrderDetailsModal Component (unchanged) ---
const OrderDetailsModal: React.FC<{
  order: OrderDisplay;
  onClose: () => void;
  onEdit: (orderId: number) => void;
  onSave: (order: OrderDisplay) => void;
}> = ({ order, onClose, onEdit, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<OrderDisplay>(order);
  const [tempItems, setTempItems] = useState<OrderItem[]>(order.items);

  useEffect(() => {
    setEditedOrder(order);
    setTempItems(order.items);
  }, [order]);

  const handleSave = () => {
    const updatedOrder = {
      ...editedOrder,
      items: tempItems,
      total: tempItems.reduce((s, i) => s + i.price * i.quantity, 0),
    };
    onSave(updatedOrder);
    setIsEditing(false);
  };

  const updateItemQuantity = (itemId: number, change: number) => {
    if (!isEditing) return;

    setTempItems((prev) =>
      prev
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(1, item.quantity + change) }
            : item
        )
        .filter((it) => it.quantity > 0)
    );
  };

  const calculateTotal = () => {
    return tempItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl dark:bg-gray-800 dark:text-white"
        dir="rtl"
      >
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ClipboardList size={24} /> جزئیات سفارش #{order.id}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              میز: {order.tableTitle} | زمان: {order.time}
            </p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600"
              >
                <Edit size={18} /> ویرایش
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
              >
                <Save size={18} /> ذخیره
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-2"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* اطلاعات سفارش */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-1">
              <Users size={16} />
              <span className="font-bold">مشتری:</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editedOrder.customerName || ""}
                onChange={(e) =>
                  setEditedOrder((prev) => ({
                    ...prev,
                    customerName: e.target.value,
                  }))
                }
                className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-orange-500"
                placeholder="نام مشتری"
              />
            ) : (
              <p>{order.customerName || "ندارد"}</p>
            )}
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-1">
              <FileText size={16} />
              <span className="font-bold">وضعیت:</span>
            </div>
            {isEditing ? (
              <select
                value={editedOrder.status}
                onChange={(e) =>
                  setEditedOrder((prev) => ({
                    ...prev,
                    status: e.target.value as OrderStatus,
                  }))
                }
                className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-orange-500"
              >
                <option value="در حال پخت">در حال پخت</option>
                <option value="آماده">آماده</option>
                <option value="تحویل داده شده">تحویل داده شده</option>
                <option value="لغو شده">لغو شده</option>
              </select>
            ) : (
              <p>{order.status}</p>
            )}
          </div>
        </div>

        {/* آیتم‌های سفارش */}
        <div className="mb-6">
          <h4 className="font-bold mb-3 flex items-center gap-2">
            <Menu size={18} /> آیتم‌های سفارش
          </h4>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {tempItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-lg">{item.image}</span>
                  </div>
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatNumber(item.price)} تومان
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateItemQuantity(item.id, -1)}
                        className="w-8 h-8 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full flex items-center justify-center"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold min-w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateItemQuantity(item.id, 1)}
                        className="w-8 h-8 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <span className="font-bold">تعداد: {item.quantity}</span>
                  )}
                  <span className="font-bold text-lg">
                    {formatNumber(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* جمع کل */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">جمع کل:</span>
            <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatNumber(calculateTotal())} تومان
            </span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              onEdit(order.tableId);
              onClose();
            }}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Eye size={18} /> مشاهده در پنل اصلی
          </button>
          <button
            onClick={onClose}
            className="w-1/4 bg-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors dark:bg-gray-700 dark:text-gray-300"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

// --- TakeoutInfoModal (unchanged) ---
const TakeoutInfoModal: React.FC<{
  details: TakeoutDetails;
  setDetails: React.Dispatch<React.SetStateAction<TakeoutDetails>>;
  onClose: () => void;
  onContinue: () => void;
  isEditing?: boolean;
}> = ({ details, setDetails, onClose, onContinue, isEditing = false }) => {
  const updateField = (field: keyof TakeoutDetails, value: string | number) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl dark:bg-gray-800 dark:text-white"
        dir="rtl"
      >
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Truck size={24} />{" "}
            {isEditing ? "ویرایش سفارش بیرون‌بر" : "ثبت سفارش بیرون‌بر جدید"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
            <Users size={20} className="text-orange-500" />
            <input
              type="text"
              value={details.customerName}
              onChange={(e) => updateField("customerName", e.target.value)}
              placeholder="نام و نام خانوادگی مشتری"
              className="flex-1 bg-transparent focus:outline-none text-black dark:text-white"
            />
          </div>

          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
            <Phone size={20} className="text-orange-500" />
            <input
              type="tel"
              value={details.phoneNumber}
              onChange={(e) => updateField("phoneNumber", e.target.value)}
              placeholder="شماره تماس"
              className="flex-1 bg-transparent focus:outline-none text-black dark:text-white"
            />
          </div>

          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
            <MapPin size={20} className="text-orange-500" />
            <textarea
              rows={2}
              value={details.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="آدرس دقیق ارسال"
              className="flex-1 bg-transparent focus:outline-none resize-none text-black dark:text-white"
            />
          </div>
        </div>

        <div className="mt-6 p-3 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex justify-between items-center font-bold">
          <span className="text-black dark:text-orange-300">هزینه ارسال:</span>
          <input
            type="number"
            value={details.deliveryFee}
            onChange={(e) =>
              updateField("deliveryFee", parseInt(e.target.value || "0"))
            }
            className="w-1/3 bg-transparent text-right font-bold text-orange-600 dark:text-orange-200 focus:outline-none"
          />
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onContinue}
            disabled={
              !details.customerName || !details.phoneNumber || !details.address
            }
            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
          >
            {isEditing ? "بروزرسانی" : "ادامه به پرداخت"}
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
  // state
  const [viewMode, setViewMode] = useState<ViewMode>("takeout");

  const [tables, setTables] = useState<Table[]>(() => [
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
      deliveryFee: 250000,
    },
  ]);

  const [allSessions, setAllSessions] = useState<Table[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [itemToDiscountId, setItemToDiscountId] = useState<number | null>(null);

  const [showReceipt, setShowReceipt] = useState(false);
  const [cashPayment, setCashPayment] = useState(0);
  const [cardToCardPayment, setCardToCardPayment] = useState(0);
  const [device2Payment, setDevice2Payment] = useState(0);

  const [showTakeoutModal, setShowTakeoutModal] = useState(false);
  const [takeoutDetails, setTakeoutDetails] = useState<TakeoutDetails>({
    customerName: "",
    phoneNumber: "",
    address: "",
    deliveryFee: 250000,
    orderId: TAKEAWAY_TABLE_ID,
  });

  const [allOrders, setAllOrders] = useState<OrderDisplay[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDisplay | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [isEditingTakeout, setIsEditingTakeout] = useState(false);

  // --- NEW STATES FOR MODALS ---
  const [variantModalData, setVariantModalData] = useState<{
    show: boolean;
    product: Product | null;
  }>({ show: false, product: null });
  const [modifierModalData, setModifierModalData] = useState<{
    show: boolean;
    item: OrderItem | null;
  }>({ show: false, item: null });

  // برای چاپ فیش
  const receiptRef = useRef<HTMLDivElement>(null);

  // derived
  const activeSession = useMemo(
    () => tables.find((t) => t.id === activeSessionId),
    [tables, activeSessionId]
  );
  const isTakeoutActive = activeSession?.id === TAKEAWAY_TABLE_ID;

  // initialize sessions once on mount and whenever tables changes
  useEffect(() => {
    setAllSessions(tables);

    // generate orders list (non-destructive)
    const generatedOrders: OrderDisplay[] = tables
      .filter((table) => table.orders.length > 0)
      .map((table) => ({
        id: table.id + 1000,
        tableId: table.id,
        tableTitle: table.title || `میز ${table.id}`,
        items: table.orders,
        status: table.status === "occupied" ? "در حال پخت" : "آماده",
        time: table.startTime
          ? table.startTime.toLocaleTimeString("fa-IR")
          : new Date().toLocaleTimeString("fa-IR"),
        total: table.orders.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        customerName: table.type === "custom" ? "مشتری بیرون‌بر" : undefined,
      }));

    setAllOrders(generatedOrders);

    // only set default active session when there is none
    setActiveSessionId((prev) => (prev === null ? TAKEAWAY_TABLE_ID : prev));
  }, [tables]);

  // Time tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getElapsedSeconds = (start: Date | null) =>
    start
      ? Math.floor((currentTime.getTime() - new Date(start).getTime()) / 1000)
      : 0;

  // --- Calculation with table-level deliveryFee ---
  // --- Updated: Now includes Variant Price & Modifiers Price ---
  const calculateOrderSummary = useCallback((table: Table) => {
    const subTotal = table.orders.reduce((acc, item) => {
      // قیمت پایه = اگر واریانت دارد، قیمت واریانت، وگرنه قیمت خود محصول
      const basePrice = item.selectedVariant
        ? item.selectedVariant.price
        : item.price;
      // جمع هزینه مخلفات
      const modifiersTotal = item.selectedModifiers
        ? item.selectedModifiers.reduce((sum, mod) => sum + mod.price, 0)
        : 0;

      const itemTotalPriceSingle = basePrice + modifiersTotal;
      const itemTotal = itemTotalPriceSingle * item.quantity;

      let discountedItemTotal = itemTotal;
      if (item.itemDiscount) {
        if (item.itemDiscount.type === "percentage") {
          discountedItemTotal =
            itemTotal * (1 - item.itemDiscount.amount / 100);
        } else {
          discountedItemTotal = Math.max(
            0,
            itemTotal - item.itemDiscount.amount
          );
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

    // محاسبه صحیح تخفیف کل
    let totalDiscountAmount = 0;
    if (table.totalDiscount) {
      if (table.totalDiscount.type === "percentage") {
        // تخفیف درصدی باید روی کل قبل از تخفیف (شامل تخفیف‌های آیتم و حق سرویس) اعمال شود
        totalDiscountAmount =
          totalBeforeDiscount * (table.totalDiscount.amount / 100);
      } else {
        // تخفیف مبلغی
        totalDiscountAmount = table.totalDiscount.amount;
      }
    }

    const totalAfterDiscount = Math.max(
      0,
      totalBeforeDiscount - totalDiscountAmount
    );
    const taxAmount = totalAfterDiscount * TAX_RATE;
    let grandTotal = totalAfterDiscount + taxAmount;

    let deliveryFee = table.deliveryFee ?? 0; // use table specific fee
    if (table.type === "custom") {
      grandTotal += deliveryFee;
    }

    return {
      subTotal,
      serviceChargeAmount,
      totalDiscountAmount,
      totalAfterDiscount,
      taxAmount,
      grandTotal,
      deliveryFee,
    };
  }, []);

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

  // Payments safe clamps
  const totalPaid = cashPayment + cardToCardPayment + device2Payment;
  const remainingAmount = Math.max(0, summary.grandTotal - totalPaid);

  const printReceipt = () => {
    if (!receiptRef.current) return;

    const printContent = receiptRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fa" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <title>فیش پرداخت</title>

        <style>
          @page {
            size: 70mm auto;
            margin: 0;
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Vazirmatn, sans-serif;
          }

          html, body {
            width: 70mm;
            height: auto;
            overflow: hidden;
            background: #fff;
            color: #000;
          }

          body {
            padding: 4mm 5mm; /* محتوا ~6 سانت */
            font-size: 11px;
            line-height: 1.5;
          }

          .receipt {
            width: 100%;
            height: auto;
          }

          .receipt-header {
            text-align: center;
            margin-bottom: 4mm;
            padding-bottom: 2mm;
            border-bottom: 1px dashed #000;
          }

          .receipt-header h1 {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 2mm;
          }

          .receipt-info {
            font-size: 14px;
            margin-bottom: 4mm;
            padding-bottom: 2mm;
            border-bottom: 1px dashed #000;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 4mm;
          }

          th {
            font-size: 14px;
            font-weight: 700;
            padding: 2mm 0;
            border-bottom: 1px solid #000;
          }

          td {
            font-size: 14px;
            padding: 2mm 0;
            border-bottom: 1px dashed #ccc;
          }

          .receipt-totals {
            margin-top: 4mm;
            padding-top: 2mm;
            border-top: 2px dashed #000;
          }

          .receipt-totals div {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2mm;
            font-size: 14px;
            font-weight: 700;
          }

          .receipt-footer {
            text-align: center;
            margin-top: 5mm;
            padding-top: 3mm;
            border-top: 1px dashed #000;
            font-size: 9px;
          }

          .app-name {
            margin-top: 3mm;
            font-size: 10px;
            font-weight: 700;
          }

          .bottom-space {
            height: 10mm; /* ۱ سانت فضای خالی */
          }

          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-left { text-align: left; }

          .item-description {
            font-size: 14px;
            color: #666;
            font-style: italic;
            margin-top: 3mm;
          }
        </style>
      </head>

      <body>
        <div class="receipt">
          ${printContent}

          <div class="receipt-footer">
            <div class="app-name">URSM</div>
          </div>

          <div class="bottom-space"></div>
        </div>

        <script>
          window.onload = () => {
            window.print();
            window.onafterprint = () => window.close();
          };
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  // --- Actions ---
  const handleTableSelect = (tableId: number) => setActiveSessionId(tableId);

  const applyModifier = (
    modifier: PriceModifier,
    type: "service" | "discount"
  ) => {
    if (activeSessionId === null) return;
    setTables((prev) =>
      prev.map((table) =>
        table.id === activeSessionId
          ? {
              ...table,
              ...(type === "service"
                ? { serviceCharge: modifier }
                : { totalDiscount: modifier }),
            }
          : table
      )
    );
  };

  const applyItemDiscount = (modifier: PriceModifier) => {
    if (activeSessionId === null || itemToDiscountId === null) return;

    setTables((prev) =>
      prev.map((table) => {
        if (table.id === activeSessionId) {
          const updatedOrders = table.orders.map((item) =>
            item.id === itemToDiscountId
              ? { ...item, itemDiscount: modifier }
              : item
          );
          return { ...table, orders: updatedOrders };
        }
        return table;
      })
    );

    setItemToDiscountId(null);
  };

  // --- NEW: Add to Order Logic with Variants ---
  const handleProductClick = (product: Product) => {
    // اگر محصول واریانت دارد، مدال را باز کن
    if (product.variants && product.variants.length > 0) {
      setVariantModalData({ show: true, product });
    } else {
      // اگر ندارد، مستقیم اضافه کن
      addToOrder(product);
    }
  };

  const addToOrder = (product: Product, variant?: Variant) => {
    if (activeSessionId === null) return;

    setTables((prev) =>
      prev.map((table) => {
        if (table.id === activeSessionId) {
          // بررسی موجودیت آیتم کاملا مشابه (شناسه محصول + شناسه واریانت)
          const existingIndex = table.orders.findIndex(
            (o) =>
              o.id === product.id &&
              o.selectedVariant?.id === variant?.id &&
              (!o.selectedModifiers || o.selectedModifiers.length === 0) // برای سادگی، اگر مادیفایر داشت آیتم جدید میسازیم
          );

          let newOrders = [...table.orders];

          if (existingIndex > -1) {
            // افزایش تعداد
            newOrders[existingIndex] = {
              ...newOrders[existingIndex],
              quantity: newOrders[existingIndex].quantity + 1,
            };
          } else {
            // آیتم جدید
            const newItem: OrderItem = {
              ...product,
              uid: Math.random().toString(36).substr(2, 9), // شناسه یکتا برای کلید ریکت
              quantity: 1,
              selectedVariant: variant,
              selectedModifiers: [],
            };
            newOrders.push(newItem);
          }

          const newStatus =
            table.status === "free" && table.type !== "custom"
              ? "occupied"
              : table.status;
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
    setVariantModalData({ show: false, product: null });
  };

  const updateQuantity = (productUid: string | number, change: number) => {
    if (activeSessionId === null) return;

    setTables((prev) =>
      prev.map((table) => {
        if (table.id === activeSessionId) {
          // تغییر: استفاده از uid اگر موجود بود، وگرنه id برای سازگاری عقبگرد
          const newOrders = table.orders
            .map((o) => {
              const isMatch = o.uid
                ? o.uid === productUid
                : o.id === productUid;
              return isMatch
                ? { ...o, quantity: Math.max(0, o.quantity + change) }
                : o;
            })
            .filter((o) => o.quantity > 0);

          const newStatus =
            newOrders.length === 0 && table.type !== "custom"
              ? "free"
              : table.status;
          return { ...table, orders: newOrders, status: newStatus };
        }
        return table;
      })
    );
  };

  // --- NEW: Update Modifiers ---
  const updateItemModifiers = (itemUid: string, modifiers: Modifier[]) => {
    if (activeSessionId === null) return;
    setTables((prev) =>
      prev.map((table) => {
        if (table.id === activeSessionId) {
          return {
            ...table,
            orders: table.orders.map((o) =>
              o.uid === itemUid ? { ...o, selectedModifiers: modifiers } : o
            ),
          };
        }
        return table;
      })
    );
  };

  const updateDescription = (itemUid: string | number, desc: string) => {
    if (activeSessionId === null) return;

    setTables((prev) =>
      prev.map((table) => {
        if (table.id === activeSessionId) {
          const newOrders = table.orders.map((o) => {
            const isMatch = o.uid ? o.uid === itemUid : o.id === itemUid;
            return isMatch ? { ...o, description: desc } : o;
          });
          return { ...table, orders: newOrders };
        }
        return table;
      })
    );
  };

  const finalizePayment = () => {
    // simple validation
    if (remainingAmount > 0) {
      alert("مبلغ پرداخت کامل وارد نشده است.");
      return;
    }

    alert(`پرداخت انجام شد.`);
    setCashPayment(0);
    setCardToCardPayment(0);
    setDevice2Payment(0);
    setShowReceipt(false);

    if (activeSessionId === null) return;

    setTables((prev) =>
      prev.map((table) => {
        if (table.id === activeSessionId) {
          return {
            ...table,
            orders: [],
            status: table.type === "custom" ? "takeout" : "free",
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
    else if (field === "cardToCard")
      setCardToCardPayment((prev) => prev + amount);
    else if (field === "device2") setDevice2Payment((prev) => prev + amount);
  };

  const handleCheckout = () => {
    if (!activeSession) return;

    // بیرون بر: مستقیم برو به صفحه تسویه
    if (activeSession.type === "custom") {
      setShowReceipt(true);
      return;
    }

    // میز سالن
    setShowReceipt(true);
  };

  const createNewTakeoutOrder = () => {
    const newTakeoutId = Math.max(0, ...tables.map((t) => t.id)) + 1;
    const newTakeoutTable: Table = {
      id: newTakeoutId,
      type: "custom",
      title: `بیرون‌بر جدید`,
      status: "takeout",
      startTime: new Date(),
      orders: [],
      guestCount: 1,
      isDraft: true,
      deliveryFee: 250000,
    };

    setTables((prev) => [...prev, newTakeoutTable]);
    setActiveSessionId(newTakeoutId);
    setViewMode("takeout");
    setIsEditingTakeout(true);

    setTakeoutDetails({
      customerName: "",
      phoneNumber: "",
      address: "",
      deliveryFee: 250000,
      orderId: newTakeoutId,
    });
    // disabled: no auto modal
  };

  const editTakeoutOrder = (tableId: number) => {
    const table = tables.find((t) => t.id === tableId);
    if (table) {
      setActiveSessionId(tableId);
      setIsEditingTakeout(true);
      setTakeoutDetails({
        customerName: (table as any).customerName ?? "",
        phoneNumber: (table as any).phoneNumber ?? "",
        address: (table as any).address ?? "",
        deliveryFee: table.deliveryFee ?? 250000,
        orderId: tableId,
      });
      // disabled: no auto modal
    }
  };

  const saveOrder = (order: OrderDisplay) => {
    setAllOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));

    setTables((prev) =>
      prev.map((table) => {
        if (table.id === order.tableId) {
          return {
            ...table,
            orders: order.items,
            title: order.tableTitle,
            status:
              order.items.length > 0
                ? "occupied"
                : table.type === "custom"
                ? "takeout"
                : "free",
            startTime: table.startTime ?? new Date(),
          };
        }
        return table;
      })
    );
  };

  const continueTakeoutToPayment = () => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === takeoutDetails.orderId
          ? {
              ...table,
              title: `بیرون‌بر - ${takeoutDetails.customerName}`,
              isDraft: false,
              deliveryFee: takeoutDetails.deliveryFee,
            }
          : table
      )
    );

    setShowTakeoutModal(false);
    setIsEditingTakeout(false);
    setShowReceipt(true);
  };

  // --- Search & Filter (useMemo) ---
  const filteredProducts = useMemo(() => {
    const q = normalizeSearch(searchQuery);
    return PRODUCTS.filter((p) => {
      if (selectedCategory !== "all" && p.category !== selectedCategory)
        return false;
      if (!q) return true;
      return (
        normalizeSearch(p.name).includes(q) ||
        normalizeSearch(p.category).includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  // --- Render ---
  if (!activeSession)
    return (
      <div className="flex items-center justify-center h-screen">
        میز فعال یافت نشد
      </div>
    );

  return (
    <div
      className="flex h-[85vh] w-full bg-[#FFFFFF] dark:bg-[#121212] text-white font-sans overflow-hidden "
      dir="rtl"
    >
      {/* --- RIGHT SIDEBAR: Tables & Nav (Combined) --- */}
      <div className="flex w-[380px] h-full">
        {/* Rightmost Navigation Strip */}
        <nav className="w-22 bg-[#D6D5D5] dark:bg-[#1E1E1E] flex flex-col items-center py-4 gap-6 rounded-xl m-3">
          <button
            onClick={() => setViewMode("categories")}
            className={`flex flex-col items-center gap-1 transition-colors ${
              viewMode === "categories"
                ? "bg-[#F5710C] text-white rounded-lg m-1 p-1"
                : "text-[#2B2C32] dark:text-white"
            }`}
          >
            <Menu size={28} />
            <span className="text-[14px]">دسته بندی</span>
          </button>

          <button
            onClick={() => setViewMode("orders")}
            className={`flex flex-col items-center gap-1 transition-colors ${
              viewMode === "orders"
                ? "bg-[#F5710C] text-white rounded-lg m-1 p-1"
                : "text-[#2B2C32] dark:text-white"
            }`}
          >
            <ClipboardList size={28} />
            <span className="text-[14px]">سفارشات</span>
          </button>

          <button
            onClick={() => {
              setViewMode("takeout");
              handleTableSelect(TAKEAWAY_TABLE_ID);
            }}
            className={`flex flex-col items-center gap-1 transition-colors ${
              viewMode === "takeout"
                ? "bg-[#F5710C] text-white rounded-lg m-1 p-1"
                : "text-[#2B2C32] dark:text-white"
            }`}
          >
            <Truck size={28} />
            <span className="text-[14px]">بیرون بر</span>
          </button>

          <button
            onClick={() => {
              setViewMode("hall");
              if (activeSessionId === TAKEAWAY_TABLE_ID) {
                const firstPhysicalTable = tables.find(
                  (t) => t.type === "physical"
                );
                if (firstPhysicalTable) {
                  handleTableSelect(firstPhysicalTable.id);
                }
              }
            }}
            className={`flex flex-col items-center gap-1 transition-colors ${
              viewMode === "hall"
                ? "bg-[#F5710C] text-white rounded-lg m-1 p-1"
                : "text-[#2B2C32] dark:text-white"
            }`}
          >
            <IoIosRestaurant size={28} />
            <span className="text-[14px]">وضعیت سالن</span>
          </button>
        </nav>

        {/* Table List / Content Section */}
        <aside className="flex-1 bg-[#D6D5D5] dark:bg-[#1E1E1E] flex flex-col border-l border-gray-800 m-3 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700 shrink-0">
            <div className="flex items-center gap-2">
              {viewMode === "hall" && (
                <IoIosRestaurant
                  className="text-[#2B2C32] dark:text-[#FFFFFF]"
                  size={24}
                />
              )}
              {viewMode === "categories" && (
                <Menu
                  className="text-[#2B2C32] dark:text-[#FFFFFF]"
                  size={24}
                />
              )}
              {viewMode === "orders" && (
                <ClipboardList
                  className="text-[#2B2C32] dark:text-[#FFFFFF]"
                  size={24}
                />
              )}
              {viewMode === "takeout" && (
                <Truck
                  className="text-[#2B2C32] dark:text-[#FFFFFF]"
                  size={24}
                />
              )}

              <h2 className="text-xl font-bold text-[#2B2C32] dark:text-white">
                {viewMode === "hall" && "وضعیت سالن"}
                {viewMode === "categories" && "دسته‌بندی‌ها"}
                {viewMode === "orders" && "سفارشات فعال"}
                {viewMode === "takeout" && "بیرون بر"}
              </h2>
            </div>
          </div>

          {/* Dynamic Content based on viewMode */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {/* 1. Hall Status View */}
            {viewMode === "hall" &&
              allSessions
                .filter(
                  (table): table is Table & { type: "physical" } =>
                    table.type === "physical"
                )
                .map((table) => {
                  const tSummary = calculateOrderSummary(table);
                  const isOccupied = table.status === "occupied";
                  const elapsed = getElapsedSeconds(table.startTime);
                  return (
                    <button
                      key={table.id}
                      onClick={() => handleTableSelect(table.id)}
                      className={`w-full rounded-xl p-4 transition-all relative flex flex-col justify-between h-32
                    ${
                      activeSessionId === table.id
                        ? "ring-2 ring-[#2B2C32] dark:ring-[#FFFFFF] bg-[#FDE7D6] dark:bg-[#2B2C32] "
                        : "bg-[#FFFFFF] dark:bg-[#111113]"
                    }
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

            {/* 2. Categories View */}
            {viewMode === "categories" && (
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
                    <div
                      className={`p-2 rounded-full ${
                        selectedCategory === cat.id
                          ? "bg-white/20"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      {cat.icon}
                    </div>
                    <span className="font-bold text-lg">{cat.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* 3. Orders View - نمایش سفارشات قابل کلیک */}
            {viewMode === "orders" && (
              <div className="space-y-3">
                {allOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-[#111113] p-4 rounded-xl flex flex-col gap-2 border-l-4 border-orange-500 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowOrderDetails(true);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-[#2B2C32] dark:text-white">
                          {order.tableTitle}
                        </span>
                        {order.customerName && (
                          <span className="text-xs text-gray-500 mr-2">
                            {" "}
                            - {order.customerName}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {order.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {order.items.map((item) => item.name).join("، ")}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          order.status === "آماده"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="font-bold text-sm text-[#2B2C32] dark:text-white">
                        {formatNumber(order.total)} تومان
                      </span>
                    </div>
                  </div>
                ))}

                {allOrders.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <ClipboardList
                      size={48}
                      className="mx-auto mb-3 opacity-50"
                    />
                    <p>هیچ سفارشی ثبت نشده است</p>
                  </div>
                )}
              </div>
            )}

            {/* 4. Takeout View */}
            {viewMode === "takeout" && (
              <>
                <button
                  onClick={createNewTakeoutOrder}
                  className="w-full bg-green-600 text-white p-4 rounded-xl mb-4 flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                >
                  <Plus size={20} />
                  ثبت بیرون‌بر جدید
                </button>

                {tables
                  .filter((table) => table.type === "custom")
                  .map((table) => {
                    const tSummary = calculateOrderSummary(table);
                    return (
                      <div
                        key={table.id}
                        className={`bg-white dark:bg-[#111113] p-4 rounded-xl flex flex-col gap-2 cursor-pointer hover:shadow-lg transition-all ${
                          activeSessionId === table.id
                            ? "ring-2 ring-orange-500"
                            : ""
                        }`}
                        onClick={() => handleTableSelect(table.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              table.isDraft
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            <Truck size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-bold text-[#2B2C32] dark:text-white">
                                  {table.title}
                                </h4>
                              </div>
                              <div className="flex gap-2">
                                {table.isDraft && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      editTakeoutOrder(table.id);
                                    }}
                                    className="text-xs bg-transparent text-orange-600 px-2 py-1 rounded "
                                  >
                                    ویرایش
                                  </button>
                                )}
                                <span className="text-xs text-gray-400">
                                  #{table.id}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                              <span>تعداد آیتم‌ها: {table.orders.length}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2 border-t border-gray-100 pt-2 dark:border-gray-700">
                          <span
                            className={`text-xs font-bold ${
                              table.isDraft
                                ? "text-yellow-600"
                                : "text-blue-600"
                            }`}
                          >
                            {table.isDraft ? "پیش‌نویس" : "آماده ارسال"}
                          </span>
                          <span className="text-sm font-bold text-[#2B2C32] dark:text-white">
                            {formatNumber(tSummary.grandTotal)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </>
            )}
          </div>

          {/* Status Footer */}
          {viewMode === "hall" && (
            <div className="flex justify-between px-6 py-2 text-xs text-[#2B2C32] dark:text-white bg-[#D6D5D5] dark:bg-[#1E1E1E] shrink-0">
              <span>
                اشغال:{" "}
                {allSessions.filter((t) => t.status === "occupied").length}
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
                      {product.variants ? (
                        <span className="text-orange-600 dark:text-orange-400">
                          انتخاب سایز
                        </span>
                      ) : (
                        <span>
                          {formatNumber(product.price)}{" "}
                          <span className="text-sm text-black dark:text-white">
                            تومان
                          </span>
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleProductClick(product)}
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
              <span>
                {isTakeoutActive
                  ? "ارسال"
                  : `${activeSession?.guestCount || 0} نفر`}
              </span>
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
                key={item.uid || item.id}
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
                        {formatNumber(
                          (item.selectedVariant
                            ? item.selectedVariant.price
                            : item.price) * item.quantity
                        )}
                      </span>
                    </div>

                    {/* Variant & Modifiers Display */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.selectedVariant && (
                        <span className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 px-2 py-0.5 rounded">
                          {item.selectedVariant.name}
                        </span>
                      )}
                      {item.selectedModifiers &&
                        item.selectedModifiers.map((mod) => (
                          <span
                            key={mod.id}
                            className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 px-1.5 py-0.5 rounded"
                          >
                            + {mod.name}
                          </span>
                        ))}
                    </div>

                    <div className="flex-1 flex justify-between items-end mt-2">
                      <button
                        onClick={() => setItemToDiscountId(item.id)}
                        className="text-[16px] flex items-center gap-0.5 text-black dark:text-white bg-transparent rounded"
                      >
                        <Tag size={12} /> تخفیف آیتم
                      </button>
                      <div className="flex justify-between items-center gap-1 bg-[#FFFEF1] rounded-xl">
                        <button
                          onClick={() => updateQuantity(item.uid || item.id, 1)}
                          className="w-9 h-9 bg-[#05731F] rounded flex items-center justify-center text-white m-2"
                        >
                          <Plus size={22} />
                        </button>
                        <span className="font-bold bg-white text-black w-7 h-7 flex items-center justify-center rounded text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.uid || item.id, -1)
                          }
                          className="w-9 h-9 bg-[#AE0303] rounded flex items-center justify-center text-white m-2"
                        >
                          <Minus size={22} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Input & Modifier Button */}
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={item.description || ""}
                    onChange={(e) =>
                      updateDescription(item.uid || item.id, e.target.value)
                    }
                    placeholder={`توضیحات: ${item.name}`}
                    className="flex-1 bg-[#FFDbbd] text-[#000000] text-xs px-3 py-2 rounded-lg focus:outline-none"
                  />
                  {/* دکمه افزودن مخلفات */}
                  <button
                    onClick={() => setModifierModalData({ show: true, item })}
                    className="bg-[#D6D5D5] hover:bg-orange-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-black dark:text-white p-2 rounded-lg"
                    title="افزودنی‌ها"
                  >
                    <Utensils size={18} />
                  </button>
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
            <span className="text-black dark:text-white font-bold">
              قابل پرداخت:
            </span>
            <span className="text-xl font-black text-black dark:text-white">
              {formatNumber(summary.grandTotal)} تومان
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleCheckout}
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
      {/* --- NEW: Injected Modals --- */}
      {variantModalData.show && variantModalData.product && (
        <VariantSelectionModal
          product={variantModalData.product}
          onClose={() => setVariantModalData({ show: false, product: null })}
          onSelect={(variant) => addToOrder(variantModalData.product!, variant)}
        />
      )}

      {modifierModalData.show && modifierModalData.item && (
        <ModifiersSelectionModal
          item={modifierModalData.item}
          onClose={() => setModifierModalData({ show: false, item: null })}
          onUpdate={(mods) =>
            updateItemModifiers(modifierModalData.item!.uid!, mods)
          }
        />
      )}

      {showServiceModal && (
        <PriceModifierModal
          title="حق سرویس"
          initialModifier={activeSession?.serviceCharge}
          onClose={() => setShowServiceModal(false)}
          onApply={(m) => applyModifier(m, "service")}
          onRemove={() =>
            applyModifier({ amount: 0, type: "fixed" }, "service")
          }
        />
      )}
      {showDiscountModal && (
        <PriceModifierModal
          title="تخفیف کل"
          initialModifier={activeSession?.totalDiscount}
          onClose={() => setShowDiscountModal(false)}
          onApply={(m) => applyModifier(m, "discount")}
          onRemove={() =>
            applyModifier({ amount: 0, type: "fixed" }, "discount")
          }
        />
      )}
      {itemToDiscountId && (
        <PriceModifierModal
          title="تخفیف آیتم"
          initialModifier={
            activeSession?.orders.find((i) => i.id === itemToDiscountId)
              ?.itemDiscount
          }
          onClose={() => setItemToDiscountId(null)}
          onApply={applyItemDiscount}
          onRemove={() => applyItemDiscount({ amount: 0, type: "fixed" })}
        />
      )}

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setShowOrderDetails(false)}
          onEdit={(tableId) => {
            handleTableSelect(tableId);
            setViewMode("hall");
          }}
          onSave={saveOrder}
        />
      )}

      {/* Takeout Info Modal */}
      {showTakeoutModal && (
        <TakeoutInfoModal
          details={takeoutDetails}
          setDetails={setTakeoutDetails}
          onClose={() => {
            setShowTakeoutModal(false);
            setIsEditingTakeout(false);
          }}
          onContinue={continueTakeoutToPayment}
          isEditing={isEditingTakeout}
        />
      )}

      {/* --- RECEIPT MODAL --- */}
      {showReceipt && activeSession && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] dark:bg-gray-800 dark:text-gray-100">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50 print:hidden dark:bg-gray-700 dark:border-gray-700">
              <h3 className="font-bold text-lg dark:text-gray-100">
                پرداخت و تسویه حساب
              </h3>
              <button
                onClick={() => setShowReceipt(false)}
                className="text-slate-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* سمت چپ: فیش */}
              <div
                ref={receiptRef}
                className="w-1/3 p-6 overflow-y-auto border-l dark:border-gray-700"
              >
                <div className="font-mono text-sm">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-black mb-2 text-black dark:text-white">
                      کافه رستوران یوتاب
                    </h1>
                    <p className=" text-xs text-black dark:text-white">
                      خیابان آزادی، پلاک ۱۱۰
                    </p>
                    <p className=" text-xs mt-1 text-black dark:text-white">
                      021-88888888
                    </p>
                  </div>

                  <div className="border-b-2 border-dashed border-slate-300 pb-4 mb-4 space-y-1 text-black dark:text-white dark:border-gray-600">
                    <div className="flex justify-between">
                      <span>{new Date().toLocaleTimeString("fa-IR")}</span>
                      <br />
                      <span>
                        {isTakeoutActive
                          ? "نوع سفارش: بیرون‌بر"
                          : `میز: ${activeSessionId}`}
                      </span>
                    </div>
                    {isTakeoutActive && (
                      <div className="text-xs text-orange-500 border-t pt-1 mt-1 border-dotted">
                        <p className="font-bold">
                          {takeoutDetails.customerName} -{" "}
                          {takeoutDetails.phoneNumber}
                        </p>
                        <p className="truncate">{takeoutDetails.address}</p>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>شماره فاکتور:</span>{" "}
                      <span>#{Math.floor(Math.random() * 10000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>صندوق‌دار:</span> <span>علی محمدی</span>
                    </div>
                  </div>

                  <table className="w-full text-right mb-6 text-black dark:text-white">
                    <thead>
                      <tr className="border-b dark:border-gray-600">
                        <th className="py-2">شرح</th>
                        <th className="py-2 text-center">تعداد</th>
                        <th className="py-2 text-left">مبلغ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeSession.orders.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-slate-100 dark:border-gray-700"
                        >
                          <td className="py-2 text-wrap">
                            <div>
                              {item.name}{" "}
                              {item.selectedVariant
                                ? `(${item.selectedVariant.name})`
                                : ""}
                            </div>
                            {item.selectedModifiers &&
                              item.selectedModifiers.length > 0 && (
                                <div className="text-[10px] text-gray-500">
                                  {item.selectedModifiers
                                    .map((m) => m.name)
                                    .join("، ")}
                                </div>
                              )}
                            {item.description && (
                              <div className="item-description">
                                توضیح: {item.description}
                              </div>
                            )}
                            {item.itemDiscount &&
                              item.itemDiscount.amount > 0 && (
                                <div className="text-xs text-red-500">
                                  (-{item.itemDiscount.amount}
                                  {item.itemDiscount.type === "percentage"
                                    ? "%"
                                    : "ت"}
                                  )
                                </div>
                              )}
                          </td>
                          <td className="py-2 text-center">{item.quantity}</td>
                          <td className="py-2 text-left">
                            {(
                              (item.selectedVariant
                                ? item.selectedVariant.price
                                : item.price) *
                                item.quantity +
                              (item.selectedModifiers
                                ? item.selectedModifiers.reduce(
                                    (s, m) => s + m.price,
                                    0
                                  )
                                : 0) *
                                item.quantity
                            ).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="space-y-2 font-bold text-black dark:text-white">
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
                        <span>
                          {formatPrice(summary.totalDiscountAmount * -1)}
                        </span>
                      </div>
                    )}
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
                      <span className="text-green-600 dark:text-green-400">
                        {formatPrice(summary.grandTotal)}
                      </span>
                    </div>

                    {(cashPayment > 0 ||
                      cardToCardPayment > 0 ||
                      device2Payment > 0) && (
                      <div className="mt-4 pt-4 border-t border-slate-300 dark:border-gray-600">
                        <h4 className="font-bold mb-2 text-black dark:text-white">
                          روش‌های پرداخت:
                        </h4>
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
                  <h4 className="font-bold text-lg dark:text-gray-100">
                    ورودی‌های پرداخت
                  </h4>

                  {/* پرداخت نقدی */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                        پرداخت نقدی
                      </label>
                    </div>
                    <div className="flex justify-between items-center">
                      <input
                        type="number"
                        value={cashPayment}
                        onChange={(e) => setCashPayment(Number(e.target.value))}
                        placeholder="مبلغ پرداخت نقدی"
                        className="w-1/2 p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 border-gray-500 dark:text-gray-100"
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
                        onChange={(e) =>
                          setCardToCardPayment(Number(e.target.value))
                        }
                        placeholder="مبلغ پرداخت کارت به کارت"
                        className="w-1/2 p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 border-gray-500 dark:text-gray-100"
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
                        onChange={(e) =>
                          setDevice2Payment(Number(e.target.value))
                        }
                        placeholder="مبلغ پرداخت با دستگاه ۲"
                        className="w-1/2 p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 border-gray-500 dark:text-gray-100"
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
                    <span className="font-medium dark:text-gray-300">
                      جمع پرداخت‌ها:
                    </span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(totalPaid)}
                    </span>
                  </div>

                  <div className="flex justify-between text-lg">
                    <span className="font-medium dark:text-gray-300">
                      مبلغ قابل پرداخت:
                    </span>
                    <span className="font-bold dark:text-gray-100">
                      {formatPrice(summary.grandTotal)}
                    </span>
                  </div>

                  <div
                    className={`flex justify-between text-xl font-bold border-t pt-3 ${
                      remainingAmount === 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
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
                      بستن حساب
                    </button>
                    {/* دکمه چاپ فیش 6 سانتی */}
                    <button
                      onClick={printReceipt}
                      className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Printer size={18} />
                      پرینت فیش
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
