"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import faLocale from "@fullcalendar/core/locales/fa"; // اضافه کردن فارسی

// اگر بخواهید تاریخ‌های جلالی واقعی استفاده شود، باید moment-jalaali یا persian-calendar adapter اضافه کنید.

const MyFullCalendar: React.FC = () => {
  // نمونه تبدیل تاریخ میلادی به جلالی برای events
  const events = [
    { title: "سمینار توسعه وب", date: "2025-02-04" },
    { title: "سمینار توسعه وب", date: "2025-02-10" },
    { title: "سمینار توسعه وب", date: "2025-02-15" },
  ];

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-content relative">
        <div id="fullCalendar">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            locale={faLocale} // فارسی
            direction="rtl" // راست‌چین
          />
        </div>
      </div>
    </div>
  );
};

export default MyFullCalendar;
