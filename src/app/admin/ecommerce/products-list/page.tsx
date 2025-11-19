import ProductsList from "@/components/eCommerce/ProductsList";
import Link from "next/link";

export default function Page() {
  return (
    <>
          <div className="mb-[25px] md:flex items-center justify-between">
        <ol className="breadcrumb mt-[12px] md:mt-0 flex flex-wrap">
          <li className="breadcrumb-item  relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0 flex items-center">
            <Link
              href="/dashboard/ecommerce/"
              className=" relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500 flex items-center"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg top-1/2 -translate-y-1/2 text-primary-500">
                home
              </i>
              <span className="ltr:ml-2 rtl:mr-2">داشبورد</span>
            </Link>
            <span className="ltr:ml-2 rtl:mr-2 text-gray-400 select-none">
              ›
            </span>
          </li>

          <li className="breadcrumb-item  relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0 flex items-center">
            مدیریت فروشگاه
            <span className="ltr:ml-2 rtl:mr-2 text-gray-400 select-none">
              ›
            </span>
          </li>

          <li className="breadcrumb-item  relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0 flex items-center">
            لیست محصولات  
          </li>
        </ol>

        <h5 className="!mb-0"> لیست محصولات </h5>
      </div>
      

      <ProductsList />
    </>
  );
}
