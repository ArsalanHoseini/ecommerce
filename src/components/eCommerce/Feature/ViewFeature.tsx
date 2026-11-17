"use client";

import React, { useState, useEffect } from "react";
// import Link from "next/link"; // حذف شد: استفاده از تگ <a> به دلیل خطای کامپایل در محیط شبیه‌سازی

// تعریف تایپ‌ها
interface FeatureValue {
  id: number;
  value: string;
}

interface FeatureData {
  id: string;
  name: string;
}

interface ViewFeatureProps {
  id: string;
}

const ViewFeature: React.FC<ViewFeatureProps> = ({ id }) => {
  // --- استیت‌های اصلی ویژگی و مقادیر ---
  const [data, setData] = useState<FeatureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState<FeatureValue[]>([]); // --- استیت‌های مربوط به مدیریت مودال مقادیر ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newValueTitle, setNewValueTitle] = useState("");
  const [editingValueId, setEditingValueId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(5); // شبیه‌سازی دریافت اطلاعات از API و مقداردهی اولیه

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const initialValues: FeatureValue[] = [
        { id: 1, value: "قرمز" },
        { id: 2, value: "آبی" },
        { id: 3, value: "سبز" },
        { id: 4, value: "زرد" },
      ];
      setData({
        id: id,
        name: "رنگ",
      });
      setValues(initialValues);
      const maxId =
        initialValues.length > 0
          ? Math.max(...initialValues.map((v) => v.id))
          : 0;
      setNextId(maxId + 1);
      setLoading(false);
    }, 1000);
  }, [id]); // --- توابع مدیریت مودال و عملیات CRUD مقادیر ---

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewValueTitle("");
    setEditingValueId(null);
  }; // باز کردن مودال برای افزودن
  const handleAddValueClick = () => {
    setEditingValueId(null);
    setNewValueTitle("");
    setIsModalOpen(true);
  }; // باز کردن مودال برای ویرایش

  const handleEditValue = (valueId: number) => {
    const valueToEdit = values.find((v) => v.id === valueId);
    if (valueToEdit) {
      setEditingValueId(valueId);
      setNewValueTitle(valueToEdit.value);
      setIsModalOpen(true);
    }
  }; // مدیریت ثبت (افزودن یا ویرایش)
  const handleSubmitValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValueTitle.trim()) return;

    if (editingValueId !== null) {
      // عملیات ویرایش
      setValues((prev) =>
        prev.map((item) =>
          item.id === editingValueId ? { ...item, value: newValueTitle } : item
        )
      );
    } else {
      // عملیات افزودن
      setValues((prev) => [...prev, { id: nextId, value: newValueTitle }]);
      setNextId((prev) => prev + 1); // افزایش ID برای آیتم بعدی
    }

    handleCloseModal();
  }; // مدیریت حذف با پیام تایید (استفاده از window.confirm)

  const handleDeleteValue = (valueId: number, valueName: string) => {
    // توجه: در محیط Immersive، استفاده از window.confirm به دلیل iFrame محدودیت دارد.
    // بهتر است از یک Modal سفارشی استفاده شود. اینجا برای سادگی از window.confirm استفاده شده است.
    if (
      window.confirm(
        `آیا مطمئن هستید که می‌خواهید مقدار "${valueName}" را حذف کنید؟ این عمل غیرقابل بازگشت است.`
      )
    ) {
      setValues((prev) => prev.filter((v) => v.id !== valueId));
      console.log(`مقدار ${valueId} حذف شد.`);
    }
  }; // --- رندرینگ ---

  if (loading) {
    return (
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[25px] rounded-xl text-center shadow-lg">
               {" "}
        <span className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></span>
               {" "}
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          در حال دریافت اطلاعات ویژگی...
        </p>
             {" "}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[25px] rounded-xl text-center text-red-500 shadow-lg">
                اطلاعاتی یافت نشد.      {" "}
      </div>
    );
  }

  return (
    <>
           {" "}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-xl shadow-lg">
        <div className="trezo-card-header mb-[20px] pb-[15px] border-b border-gray-200 dark:border-[#1c2541] flex items-center justify-between">
          <h3 className="trezo-card-title text-2xl font-bold text-black dark:text-white">
            ویژگی: <span className="text-primary-500">{data.name}</span>
          </h3>

          <a
            href="/admin/ecommerce/feature"
            className="inline-flex items-center justify-center w-[42px] h-[42px] rounded-full 
             bg-gray-100 text-gray-600 
             dark:bg-[#1b2a4b] dark:text-gray-300
             hover:bg-gray-200 hover:text-black 
             dark:hover:bg-[#243558] dark:hover:text-white
             transition-all shadow-sm"
            title="بازگشت"
          >
            <i className="material-symbols-outlined !text-[22px]">arrow_back</i>
          </a>
        </div>

        <div className="trezo-card-content">
          {/* ⭐ چیدمان جدید دو ستونی */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 🌐 بخش راست — اطلاعات کلی */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-gray-50 dark:bg-[#111c33] p-6 rounded-xl border border-gray-200 dark:border-[#1c2541] shadow-sm">
                <h4 className="text-lg font-semibold border-b pb-2 mb-4 border-gray-200 dark:border-[#1c2541] text-black dark:text-white">
                  اطلاعات کلی
                </h4>

                <ul className="space-y-4">
                  <li className="flex items-center justify-between text-black dark:text-white">
                    <span className="text-gray-500 dark:text-gray-400">
                      شناسه:
                    </span>
                    <span className="font-mono font-semibold text-primary-500">
                      {data.id}
                    </span>
                  </li>
                  <li className="flex items-center justify-between text-black dark:text-white">
                    <span className="text-gray-500 dark:text-gray-400">
                      نام ویژگی:
                    </span>
                    <span className="font-semibold">{data.name}</span>
                  </li>

                  <li className="flex items-center justify-between border-t pt-4 mt-2 text-black dark:text-white border-gray-200 dark:border-[#1c2541]">
                    <span className="text-gray-500 dark:text-gray-400">
                      تعداد مقادیر:
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm bg-primary-500/10 text-primary-600 dark:text-primary-400">
                      {values.length} عدد
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 📋 بخش چپ — جدول */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-black dark:text-white">
                  مدیریت مقادیر ویژگی
                </h4>

                <button
                  onClick={handleAddValueClick}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 shadow-md transition-all"
                >
                  <i className="material-symbols-outlined !text-[18px]">add</i>
                  افزودن مقدار
                </button>
              </div>

              {/* جدول جدید — طراحی حرفه‌ای‌تر */}
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-[#1c2541] shadow">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-[#111c33] text-black dark:text-white">
                      <th className="px-5 py-3 text-right">شناسه</th>
                      <th className="px-5 py-3 text-right">مقدار</th>
                      <th className="px-5 py-3 text-right w-[130px]">عملیات</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 dark:divide-[#1c2541] text-black dark:text-white">
                    {values.length > 0 ? (
                      values.map((val) => (
                        <tr
                          key={val.id}
                          className="hover:bg-gray-50 dark:hover:bg-[#1b2a4b] transition"
                        >
                          <td className="px-5 py-3 text-gray-500 dark:text-gray-400 w-[60px]">
                            {val.id}
                          </td>

                          <td className="px-5 py-3 font-medium">{val.value}</td>

                          <td className="px-5 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditValue(val.id)}
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition"
                              >
                                <i className="material-symbols-outlined !text-[20px]">
                                  edit
                                </i>
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteValue(val.id, val.value)
                                }
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition"
                              >
                                <i className="material-symbols-outlined !text-[20px]">
                                  delete
                                </i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="text-center py-6 text-gray-500 dark:text-gray-400"
                        >
                          هیچ مقداری یافت نشد.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
            {/* --- مودال افزودن/ویرایش مقدار --- */}     {" "}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none p-4">
                   {" "}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={handleCloseModal}
          ></div>
                             {" "}
          <div className="relative w-full max-w-[450px] mx-auto z-[1000] transition-all transform scale-100 opacity-100 animate-slide-in-up">
                       {" "}
            <div className="relative flex flex-col w-full bg-white dark:bg-[#0c1427] border border-gray-100 dark:border-[#172036] rounded-xl shadow-2xl outline-none focus:outline-none overflow-hidden">
                                         {" "}
              <div className="flex items-center justify-between px-6 py-5 border-b border-solid border-gray-100 dark:border-[#172036]">
                               {" "}
                <h3 className="text-xl font-bold text-black dark:text-white">
                                   {" "}
                  {editingValueId !== null
                    ? `ویرایش مقدار: ${newValueTitle}`
                    : `افزودن مقدار جدید`}
                                 {" "}
                </h3>
                               {" "}
                <button
                  className="p-2 ml-auto bg-transparent border-0 text-black dark:text-white opacity-60 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-[#1c2a4f] rounded-full transition-all leading-none outline-none focus:outline-none flex items-center justify-center"
                  onClick={handleCloseModal}
                >
                                   {" "}
                  <i className="material-symbols-outlined !text-[24px]">
                    close
                  </i>
                                 {" "}
                </button>
                             {" "}
              </div>
                           {" "}
              <div className="relative p-6 flex-auto">
                               {" "}
                <form onSubmit={handleSubmitValue}>
                                   {" "}
                  <div className="mb-[25px]">
                                       {" "}
                    <label className="mb-[10px] block text-black dark:text-white font-medium text-base">
                                            عنوان مقدار ویژگی                  
                       {" "}
                    </label>
                                       {" "}
                    <div className="relative">
                                             {" "}
                      <i className="material-symbols-outlined absolute ltr:left-[15px] rtl:right-[15px] top-1/2 -translate-y-1/2 !text-[22px] text-gray-400 dark:text-gray-500">
                                                  tag                        {" "}
                      </i>
                                             {" "}
                      <input
                        type="text"
                        className="h-[55px] rounded-lg text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-50 dark:bg-[#15203c] ltr:pl-[45px] rtl:pr-[45px] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-base font-medium"
                        placeholder="مثلاً: قرمز، سایز بزرگ"
                        value={newValueTitle}
                        onChange={(e) => setNewValueTitle(e.target.value)}
                        autoFocus
                      />
                                         {" "}
                    </div>
                                     {" "}
                    <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                                          عنوان یکتا و قابل فهم برای این ویژگی
                      را وارد کنید.                  {" "}
                    </p>
                                   {" "}
                  </div>
                                   {" "}
                  <div className="flex items-center justify-end gap-[12px] pt-4 border-t border-gray-100 dark:border-[#172036]">
                                       {" "}
                    <button
                      className="bg-transparent hover:bg-gray-50 dark:hover:bg-[#15203c] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#172036] font-medium py-3 px-6 rounded-lg transition-all"
                      type="button"
                      onClick={handleCloseModal}
                    >
                                            انصراف                    {" "}
                    </button>
                                       {" "}
                    <button
                      className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0 flex items-center justify-center"
                      type="submit"
                    >
                                           {" "}
                      {editingValueId !== null ? "ذخیره تغییرات" : "ثبت مقدار"} 
                                         {" "}
                      <i className="material-symbols-outlined !text-[20px] ltr:ml-2 rtl:mr-2">
                                               {" "}
                        {editingValueId !== null ? "save" : "add"}             
                               {" "}
                      </i>
                                         {" "}
                    </button>
                                     {" "}
                  </div>
                                 {" "}
                </form>
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
      )}
         {" "}
    </>
  );
};

export default ViewFeature;
