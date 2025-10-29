import MyFullCalendar from "@/components/Apps/Calendar/MyFullCalendar";
import WorkingSchedule from "@/components/Apps/Calendar/WorkingSchedule";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <ol className="breadcrumb mt-[12px] md:mt-0 flex">
          <li className="breadcrumb-item flex items-center">
            <Link href="/dashboard/ecommerce/" className="flex items-center">
              <i className="material-symbols-outlined !text-lg text-primary-500">
                home
              </i>
              <span className="ltr:ml-2 rtl:mr-2">Dashboard</span>
            </Link>
            <span className="ltr:ml-2 rtl:mr-2 text-gray-400">›</span>{" "}
            {/* جداکننده */}
          </li>
          <li className="breadcrumb-item flex items-center">
            Apps
            <span className="ltr:ml-2 rtl:mr-2 text-gray-400">›</span>
          </li>
          <li className="breadcrumb-item flex items-center">Calendar</li>
        </ol>

        <h5 className="!mb-0">Calendar</h5>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-2">
          <MyFullCalendar />
        </div>

        <div className="lg:col-span-1">
          <WorkingSchedule />
        </div>
      </div>
    </>
  );
}
