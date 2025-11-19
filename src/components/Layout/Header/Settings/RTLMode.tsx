"use client";

import React, { useState, useEffect } from "react";

const RTLMode: React.FC = () => {
  // 🔹 حالت پیش‌فرض: rtl
  const [dirAttribute, setDirAttribute] = useState<string>("rtl");

  useEffect(() => {
    const storedDirAttribute = localStorage.getItem("dirAttribute");
    const initialDir = storedDirAttribute || "rtl"; // اگر چیزی ذخیره نشده بود، rtl باشد
    setDirAttribute(initialDir);
    document.documentElement.setAttribute("dir", initialDir);
  }, []);

  const handleButtonClick = () => {
    const newDirAttribute = dirAttribute === "ltr" ? "rtl" : "ltr";
    setDirAttribute(newDirAttribute);
    localStorage.setItem("dirAttribute", newDirAttribute);
    document.documentElement.setAttribute("dir", newDirAttribute);
  };

  return (
    <button
      type="button"
      onClick={handleButtonClick}
      className={`rtl-mode-toggle flex items-center text-black dark:text-white font-medium gap-2`}
    >
      <span>{dirAttribute === "rtl" ? "RTL Mode" : "LTR Mode"}</span>

      <span
        className={`relative rounded-full w-[40px] h-[22px] bg-gray-200 dark:bg-[#1c2233] transition-colors duration-300 ${
          dirAttribute === "rtl" ? "bg-blue-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1/2 -translate-y-1/2 h-[16px] w-[16px] rounded-full bg-white shadow-md transition-all duration-300 ${
            dirAttribute === "rtl" ? "right-[3px]" : "left-[3px]"
          }`}
        ></span>
      </span>
    </button>
  );
};

export default RTLMode;
