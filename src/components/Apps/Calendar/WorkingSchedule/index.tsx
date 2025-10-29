"use client";

import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Calendar from "react-calendar";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type Event = {
  id: number;
  title: string;
  date: Date; // نوع Date
  time: string;
};

// نمونه داده‌ها
const events: Event[] = [
  {
    id: 1,
    title: "سمینار پایتون",
    date: new Date(2024, 3, 15),
    time: "۱۲:۰۰ تا ۱۸:۰۰",
  },
  {
    id: 2,
    title: "کارگاه پیشرفته React",
    date: new Date(2024, 4, 20),
    time: "۱۰:۰۰ تا ۱۵:۰۰",
  },
  {
    id: 3,
    title: "TypeScript برای حرفه‌ای‌ها",
    date: new Date(2024, 5, 10),
    time: "۰۹:۰۰ تا ۱۷:۰۰",
  },
  {
    id: 4,
    title: "کنفرانس Next.js 2024",
    date: new Date(2024, 6, 25),
    time: "۱۱:۰۰ تا ۱۶:۰۰",
  },
];

const WorkingSchedule: React.FC = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">برنامه کاری</h5>
          </div>
        </div>

        <div className="trezo-card-content relative">
          <Calendar
            onChange={onChange}
            value={value}
            className="working-schedule-calendar"
            locale="fa-IR" // فارسی کردن تاریخ‌ها
          />

          <div className="mt-[19px] relative" id="upcomingEventsSlides">
            <span className="block mb-[14px] font-medium">رویدادهای آینده:</span>

            <Swiper
              slidesPerView={1}
              pagination={{ dynamicBullets: true }}
              modules={[Pagination]}
              className="mySwiper"
            >
              {events.map((event) => (
                <SwiperSlide key={event.id}>
                  <div className="relative ltr:pl-[14px] rtl:pr-[14px]">
                    <div className="absolute ltr:left-0 rtl:right-0 top-[4px] w-[7px] h-[7px] rounded-sm bg-primary-500"></div>
                    <h6 className="!text-sm !mb-[5px] !font-semibold">{event.title}</h6>
                    <span className="text-xs">
                      <span className="text-primary-500">
                        {event.date.toLocaleDateString("fa-IR")}
                      </span>{" "}
                      - {event.time}
                    </span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="rtl:text-left ltr:text-right">
            <button
              type="button"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white mt-[20px] md:mt-[25px]"
              onClick={() => setOpen(true)}
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                افزودن رویداد جدید
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8 sm:w-full sm:max-w-[550px]">
              <div className="trezo-card w-full bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
                <div className="trezo-card-header bg-gray-50 dark:bg-[#15203c] mb-[20px] md:mb-[25px] flex items-center justify-between -mx-[20px] md:-mx-[25px] -mt-[20px] md:-mt-[25px] p-[20px] md:p-[25px] rounded-t-md">
                  <div className="trezo-card-title">
                    <h5 className="!mb-0">افزودن رویداد</h5>
                  </div>
                  <div className="trezo-card-subtitle">
                    <button
                      type="button"
                      className="text-[23px] transition-all leading-none text-black dark:text-white hover:text-primary-500"
                      onClick={() => setOpen(false)}
                    >
                      <i className="ri-close-fill"></i>
                    </button>
                  </div>
                </div>

                <div className="trezo-card-content">
                  <form>
                    <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
                      <div className="sm:col-span-2 mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          عنوان رویداد
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="عنوان رویداد"
                        />
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          تاریخ شروع
                        </label>
                        <input
                          type="date"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                        />
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          تاریخ پایان
                        </label>
                        <input
                          type="date"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    <div className="mt-[20px] md:mt-[25px] rtl:text-left ltr:text-right">
                      <button
                        type="button"
                        className="rounded-md inline-block transition-all font-medium ltr:mr-[15px] rtl:ml-[15px] px-[26.5px] py-[12px] bg-danger-500 text-white hover:bg-danger-400"
                        onClick={() => setOpen(false)}
                      >
                        لغو
                      </button>

                      <button
                        type="button"
                        className="inline-block bg-primary-500 text-white py-[12px] px-[26.5px] transition-all rounded-md hover:bg-primary-400"
                      >
                        <span className="inline-block relative ltr:pl-[25px] rtl:pr-[25px]">
                          <i className="material-symbols-outlined !text-[20px] absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                            add
                          </i>
                          ایجاد
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default WorkingSchedule;
