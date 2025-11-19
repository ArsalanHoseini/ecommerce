"use client";

import React, { useState } from "react";

type OrderStatus = "درحال پردازش" | "پرداخت شده" | "لغو شده" | "تحویل شده";

interface Props {
  orderId: string;
  initialStatus: OrderStatus | string;
  onStatusUpdated?: (newStatus: string) => void; // optional callback to update parent state
}

const statusOptions: OrderStatus[] = [
  "درحال پردازش",
  "پرداخت شده",
  "لغو شده",
  "تحویل شده",
];

export default function OrderStatusModalButton({
  orderId,
  initialStatus,
  onStatusUpdated,
}: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string>(initialStatus ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);

    try {
      // مثال درخواست PATCH — آدرس/بدنه را با API خودت هماهنگ کن
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "خطا در بروزرسانی وضعیت");
      }

      // اگر والد نیاز دارد وضعیت محلی را آپدیت کند
      onStatusUpdated?.(status);

      // بسته شدن مودال بعد از موفقیت
      setOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "خطا در بروزرسانی وضعیت");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* دکمه‌ای که قبلاً لینک بود — آیکون و tooltip مشابه نمونه شما */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-primary-500 leading-none custom-tooltip"
        aria-label="ویرایش وضعیت سفارش"
        title="ویرایش وضعیت سفارش"
      >
        <i className="material-symbols-outlined !text-md">edit</i>
      </button>

      {/* مودال ساده */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
        >
          {/* بک‌دراپ */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !saving && setOpen(false)}
          />

          {/* محتوی مودال */}
          <div className="relative z-10 w-full max-w-md rounded-lg bg-white dark:bg-[#0a0e19] shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">تغییر وضعیت سفارش</h3>

            <label className="block mb-2 text-sm font-medium">وضعیت</label>
            <select
              className="w-full h-12 rounded-md border px-3 mb-4 bg-white dark:bg-[#071025] text-black dark:text-white"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={saving}
            >
              {/* اگر وضعیت اولیه خارج از گزینه‌ها باشد، آن را هم نشان بده */}
              {!statusOptions.includes(status as OrderStatus) && (
                <option value={status}>{status}</option>
              )}
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {error && (
              <div className="text-sm text-red-500 mb-3">{error}</div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-md border hover:bg-gray-50 dark:hover:bg-zinc-800"
                disabled={saving}
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-md bg-primary-500 text-white disabled:opacity-60"
                disabled={saving}
              >
                {saving ? "درحال ذخیره..." : "ذخیره"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
