import EditUserForm from "@/components/Users/EditUserForm";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <ol className="breadcrumb mt-[12px] md:mt-0 flex flex-wrap">
          <li className="breadcrumb-item relative text-sm mx-[11px] flex items-center">
            <Link
              href="/admin/dashboard"
              className="relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500 flex items-center"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg top-1/2 -translate-y-1/2 text-primary-500">
                home
              </i>
              <span className="ltr:ml-2 rtl:mr-2">داشبورد</span>
            </Link>
            <span className="ltr:ml-2 rtl:mr-2 text-gray-400 select-none">›</span>
          </li>

          <li className="breadcrumb-item relative text-sm mx-[11px] flex items-center">
            کاربران
            <span className="ltr:ml-2 rtl:mr-2 text-gray-400 select-none">›</span>
          </li>

          <li className="breadcrumb-item relative text-sm mx-[11px] flex items-center">
            ویرایش کاربر
          </li>
        </ol>

        <h5 className="!mb-0">ویرایش کاربر</h5>
      </div>

      {/* ارسال شناسه به فرم */}
      <EditUserForm userId={id} />
    </>
  );
}
