// src/services/api.js

import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  // اگر از baseURL در فایل‌های .env استفاده می‌کنید، این خط را بر اساس آن تنظیم کنید
  // در غیر این صورت، می توانید از آدرس ثابت استفاده کنید یا آن را حذف کنید.
  // فرض بر این است که آدرس کامل در متغیرهای محیطی endpoint قرار دارد.
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.utab.site/", 
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  // با توجه به اینکه توکن را در کوکی سمت کلاینت ذخیره می‌کنیم، این خط لازم نیست
  // اما در صورت استفاده از کوکی HttpOnly در آینده، مفید است.
  withCredentials: true,
});

// اینترسپتور: اضافه کردن توکن Bearer به هدر تمام درخواست‌ها
api.interceptors.request.use(
  (config) => {
    // خواندن توکن از کوکی
    const token = Cookies.get("access_token");

    // اضافه کردن توکن به هدر Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;