"use client";

import ProductsGrid from "@/components/eCommerce/ProductsGrid";
import Cta from "@/components/FrontPage/Cta";
import Features from "@/components/FrontPage/Features";
import Footer from "@/components/FrontPage/Footer";
import LightDarkModeButton from "@/components/FrontPage/LightDarkModeButton";
import Navbar from "@/components/FrontPage/Navbar";
import OurTeam from "@/components/FrontPage/OurTeam";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="front-page-body overflow-hidden">
        <LightDarkModeButton />

        <Navbar />

        <div className="pt-[50px] md:pt-[145px] lg:pt-[185px] xl:pt-[80px] text-center lg:px-10">
          <div className="mb-[25px] md:flex items-center justify-between">
            <ol className="breadcrumb mt-[12px] md:mt-0">
              <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
                <Link
                  href="/"
                  className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
                >
                  <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                    home
                  </i>
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
                Shop
              </li>
            </ol>

            <h5 className="!mb-0">Products</h5>
          </div>
        </div>

        <ProductsGrid />

        <Footer />
      </div>
    </>
  );
}
