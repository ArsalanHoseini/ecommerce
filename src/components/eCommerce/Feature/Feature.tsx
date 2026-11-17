"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface FeatureData {
  id: string;
  name: string;
}

const initialFeatures: FeatureData[] = [
  { id: "#101", name: "رنگ" },
  { id: "#102", name: "سایز" },
  { id: "#103", name: "جنس پارچه" },
  { id: "#104", name: "وزن" },
  { id: "#105", name: "گارانتی" },
];

const Feature: React.FC = () => {
  const router = useRouter();
  const [features, setFeatures] = useState<FeatureData[]>(initialFeatures);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFeatureTitle, setNewFeatureTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredFeatures = features.filter(
    (feature) =>
      feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.id.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredFeatures.length / itemsPerPage);
  const paginatedFeatures = filteredFeatures.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = (id: string) => {
    console.log("Delete item:", id);
  };

  // --- اصلاح شده: مسیر دقیق طبق ساختار پوشه شما ---
  const handleView = (id: string) => {
    const cleanId = id.replace("#", "");
    // تغییر مسیر به: admin/ecommerce/feature/view-feature/[id]
    router.push(`/admin/ecommerce/feature/view-feature/${cleanId}`);
  };

  const handleAddFeatureClick = () => {
    setEditingId(null);
    setNewFeatureTitle("");
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const featureToEdit = features.find((f) => f.id === id);
    if (featureToEdit) {
      setEditingId(id);
      setNewFeatureTitle(featureToEdit.name);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewFeatureTitle("");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureTitle.trim()) return;

    if (editingId) {
      // منطق ویرایش (به روز رسانی لیست)
      setFeatures((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, name: newFeatureTitle } : item
        )
      );
      handleCloseModal();
    } else {
      // منطق افزودن: هدایت به صفحه create
      // فرض بر این است که صفحه create در مسیر admin/ecommerce/feature/create است
      router.push(
        `/admin/ecommerce/feature/create?title=${encodeURIComponent(
          newFeatureTitle
        )}`
      );
      handleCloseModal();
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md z-0 relative">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="جستجو ویژگی..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
          </div>

          <div className="trezo-card-subtitle">
            <button
              type="button"
              onClick={handleAddFeatureClick}
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
            >
              <span className="flex items-center">
                <i className="material-symbols-outlined !text-[20px] ltr:mr-[5px] rtl:ml-[5px]">
                  add
                </i>
                افزودن ویژگی جدید
              </span>
            </button>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    شناسه
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                    نام ویژگی
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {paginatedFeatures.length > 0 ? (
                  paginatedFeatures.map((feature) => (
                    <tr key={feature.id}>
                      <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        {feature.id}
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="block font-medium">
                          {feature.name}
                        </span>
                      </td>
                      <td className="ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <div className="flex items-center ltr:justify-end rtl:justify-start gap-[10px]">
                          <button
                            onClick={() => handleView(feature.id)}
                            className="text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500"
                            title="مشاهده جزئیات"
                          >
                            <i className="material-symbols-outlined !text-[20px]">
                              visibility
                            </i>
                          </button>

                          <button
                            onClick={() => handleEdit(feature.id)}
                            className="text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500"
                          >
                            <i className="material-symbols-outlined !text-[20px]">
                              edit
                            </i>
                          </button>

                          <button
                            onClick={() => handleDelete(feature.id)}
                            className="text-red-500 transition-all hover:text-red-700"
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
                    <td colSpan={3} className="text-center py-4">
                      نتیجه‌ای یافت نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] py-[12px] md:py-[14px] rounded-b-md border-l border-r border-b border-gray-100 dark:border-[#172036] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              نمایش {paginatedFeatures.length} از {filteredFeatures.length}{" "}
              نتیجه
            </p>
            <ol className="mt-4 sm:mt-0 flex items-center gap-1">
              <li>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 transition-all hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  <i className="material-symbols-outlined !text-[20px]">
                    chevron_right
                  </i>
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
                  <i className="material-symbols-outlined !text-[20px]">
                    chevron_left
                  </i>
                </button>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={handleCloseModal}
          ></div>

          <div className="relative w-full max-w-[500px] mx-auto z-[1000] transition-all transform scale-100 opacity-100">
            <div className="relative flex flex-col w-full bg-white dark:bg-[#0c1427] border border-gray-100 dark:border-[#172036] rounded-xl shadow-2xl outline-none focus:outline-none overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-solid border-gray-100 dark:border-[#172036]">
                <h3 className="text-xl font-bold text-black dark:text-white">
                  {editingId ? "ویرایش ویژگی" : "ایجاد ویژگی جدید"}
                </h3>
                <button
                  className="p-2 ml-auto bg-transparent border-0 text-black dark:text-white opacity-60 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-[#1c2a4f] rounded-full transition-all leading-none outline-none focus:outline-none flex items-center justify-center"
                  onClick={handleCloseModal}
                >
                  <i className="material-symbols-outlined !text-[24px]">
                    close
                  </i>
                </button>
              </div>
              <div className="relative p-6 flex-auto">
                <form onSubmit={handleSubmit}>
                  <div className="mb-[25px]">
                    <label className="mb-[10px] block text-black dark:text-white font-medium text-base">
                      عنوان ویژگی را وارد کنید
                    </label>
                    <div className="relative">
                      <i className="material-symbols-outlined absolute ltr:left-[15px] rtl:right-[15px] top-1/2 -translate-y-1/2 !text-[22px] text-gray-400 dark:text-gray-500">
                        {editingId ? "edit" : "edit_square"}
                      </i>
                      <input
                        type="text"
                        className="h-[60px] rounded-lg text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-50 dark:bg-[#15203c] ltr:pl-[45px] rtl:pr-[45px] pr-[17px] rtl:pl-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-base font-medium"
                        placeholder="مثلاً: رنگ، سایز، جنس..."
                        value={newFeatureTitle}
                        onChange={(e) => setNewFeatureTitle(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-[12px] pt-4 border-t border-gray-100 dark:border-[#172036]">
                    <button
                      className="bg-transparent hover:bg-gray-50 dark:hover:bg-[#15203c] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#172036] font-medium py-[12px] px-[25px] rounded-lg transition-all"
                      type="button"
                      onClick={handleCloseModal}
                    >
                      انصراف
                    </button>
                    <button
                      className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-[12px] px-[30px] rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0 flex items-center justify-center"
                      type="submit"
                    >
                      {editingId ? "ذخیره تغییرات" : "ثبت و ادامه"}
                      <i className="material-symbols-outlined !text-[20px] ltr:ml-2 rtl:mr-2">
                        {editingId ? "save" : "arrow_forward"}
                      </i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Feature;
